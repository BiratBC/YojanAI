from ortools.sat.python import cp_model
from datetime import datetime, timedelta
import pandas as pd
import json

class WeeklyScheduler:
    def __init__(self, subjects):
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        
        # Define time slots (in 30-minute intervals from 6:00 to 22:00)
        self.start_hour = 6
        self.end_hour = 22
        self.time_slots = list(range(0, (self.end_hour - self.start_hour) * 2))  # 32 slots
        
        # Days of the week
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        # Subjects with their credit hours (determines study session allocation)
        self.subjects = {s['subject']: {'credits': s['credits'], 'color': s.get('color', '#ADD8E6')} for s in subjects}
        
        # Fixed class times (time_slot, day_index)
        # Time slot 0 = 6:00-6:30, 1 = 6:30-7:00, etc.
        self.fixed_classes = {
            # Monday
            ('Monday', 0, 1): 'ENG 111',    # 6:00-7:00
            ('Monday', 4, 5): 'MATH 208',   # 8:00-9:00
            ('Monday', 6, 13): 'Class Time', # 9:00-16:00 (fixed class time)
            ('Monday', 24, 25): 'COMP 202', # 18:00-19:00
            ('Monday', 26, 27): 'COMP 204', # 19:00-20:00
            
            # Tuesday
            ('Tuesday', 0, 1): 'MATH 207',   # 6:00-7:00
            ('Tuesday', 6, 13): 'Class Time', # 9:00-16:00 (fixed class time)
            ('Tuesday', 22, 23): 'COMP 202', # 17:00-18:00
            
            # Wednesday
            ('Wednesday', 0, 1): 'MATH 208', # 6:00-7:00
            ('Wednesday', 2, 3): 'ENG 111',  # 7:00-8:00
            ('Wednesday', 6, 13): 'Class Time', # 9:00-16:00 (fixed class time)
            ('Wednesday', 22, 23): 'MATH 207', # 17:00-18:00
            ('Wednesday', 24, 25): 'COMP 202', # 18:00-19:00
            ('Wednesday', 26, 27): 'COMP 204', # 19:00-20:00
            
            # Add more days as needed...
        }
        
        # Variables for scheduling study sessions
        self.schedule_vars = {}
        
    def time_slot_to_string(self, slot):
        """Convert time slot number to readable time string"""
        hour = self.start_hour + slot // 2
        minute = 30 if slot % 2 == 1 else 0
        return f"{hour:02d}:{minute:02d}"
    
    def create_variables(self):
        """Create decision variables for study sessions"""
        for day in self.days:
            for subject in self.subjects:
                for slot in self.time_slots:
                    var_name = f"{subject}_{day}_{slot}"
                    self.schedule_vars[(subject, day, slot)] = self.model.NewBoolVar(var_name)
    
    def add_constraints(self):
        """Add scheduling constraints"""
        
        # 1. Credit-based study session allocation
        for subject, info in self.subjects.items():
            # Each subject should have study sessions proportional to credits
            # Minimum 2 sessions per week per credit
            min_sessions = info['credits'] * 2
            total_sessions = []
            for day in self.days:
                for slot in self.time_slots:
                    if (subject, day, slot) in self.schedule_vars:
                        total_sessions.append(self.schedule_vars[(subject, day, slot)])
            
            if total_sessions:
                self.model.Add(sum(total_sessions) >= min_sessions)
                # Maximum sessions to prevent over-allocation
                self.model.Add(sum(total_sessions) <= min_sessions + 2)
        
        # 2. No overlapping sessions
        for day in self.days:
            for slot in self.time_slots:
                # Only one subject can be scheduled per time slot
                slot_vars = []
                for subject in self.subjects:
                    if (subject, day, slot) in self.schedule_vars:
                        slot_vars.append(self.schedule_vars[(subject, day, slot)])
                
                if slot_vars:
                    self.model.Add(sum(slot_vars) <= 1)
        
        # 3. Avoid scheduling during fixed class times
        for day in self.days:
            for slot in self.time_slots:
                # Check if this slot conflicts with fixed classes
                is_blocked = False
                for (fixed_day, start_slot, end_slot), class_name in self.fixed_classes.items():
                    if day == fixed_day and start_slot <= slot <= end_slot:
                        is_blocked = True
                        break
                
                if is_blocked:
                    for subject in self.subjects:
                        if (subject, day, slot) in self.schedule_vars:
                            self.model.Add(self.schedule_vars[(subject, day, slot)] == 0)
        
        # 4. Minimum gap between study sessions of same subject
        for subject in self.subjects:
            for day in self.days:
                for slot in range(len(self.time_slots) - 2):  # Ensure minimum 1-hour gap
                    if ((subject, day, slot) in self.schedule_vars and 
                        (subject, day, slot + 1) in self.schedule_vars):
                        self.model.Add(
                            self.schedule_vars[(subject, day, slot)] + 
                            self.schedule_vars[(subject, day, slot + 1)] <= 1
                        )
        
        # 5. Balanced daily distribution
        for day in self.days:
            daily_sessions = []
            for subject in self.subjects:
                for slot in self.time_slots:
                    if (subject, day, slot) in self.schedule_vars:
                        daily_sessions.append(self.schedule_vars[(subject, day, slot)])
            
            if daily_sessions:
                # Limit daily study sessions (max 6 sessions per day)
                self.model.Add(sum(daily_sessions) <= 6)
                # Ensure minimum sessions per day (at least 1)
                self.model.Add(sum(daily_sessions) >= 1)
    
    def solve_schedule(self):
        """Solve the scheduling problem"""
        self.create_variables()
        self.add_constraints()
        
        # Solve
        status = self.solver.Solve(self.model)
        
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            return self.extract_solution()
        else:
            return None
    
    def extract_solution(self):
        """Extract the solution into a readable format"""
        schedule = {}
        
        # Initialize schedule structure
        for day in self.days:
            schedule[day] = {}
            for slot in self.time_slots:
                time_str = self.time_slot_to_string(slot)
                schedule[day][time_str] = None
        
        # Add fixed classes
        for (day, start_slot, end_slot), class_name in self.fixed_classes.items():
            start_time = self.time_slot_to_string(start_slot)
            end_time = self.time_slot_to_string(end_slot + 1)
            schedule[day][f"{start_time}-{end_time}"] = {
                'subject': class_name,
                'type': 'fixed',
                'color': 'lightcoral' if class_name == 'Class Time' else self.subjects.get(class_name, {}).get('color', 'gray')
            }
        
        # Add scheduled study sessions
        for (subject, day, slot), var in self.schedule_vars.items():
            if self.solver.Value(var) == 1:
                time_str = self.time_slot_to_string(slot)
                end_time = self.time_slot_to_string(slot + 1)
                schedule[day][f"{time_str}-{end_time}"] = {
                    'subject': subject,
                    'type': 'study',
                    'color': self.subjects[subject]['color']
                }
        
        return schedule
    
    def schedule_to_json(self, schedule):
        """Convert the schedule dictionary to a JSON string"""
        return json.dumps(schedule, indent=4)   
        
    def print_schedule(self, schedule):
        """Print the schedule in a readable format"""
        if not schedule:
            print("No feasible schedule found!")
            return
        
        print("\n" + "="*80)
        print("WEEKLY STUDY SCHEDULE")
        print("="*80)
        
        for day in self.days:
            print(f"\n{day.upper()}:")
            print("-" * 40)
            
            # Sort time slots
            day_schedule = schedule[day]
            sorted_times = sorted([k for k in day_schedule.keys() if day_schedule[k] is not None])
            
            for time_slot in sorted_times:
                session = day_schedule[time_slot]
                session_type = session['type'].upper()
                print(f"  {time_slot}: {session['subject']} ({session_type})")
            
            if not sorted_times:
                print("  No sessions scheduled")
    
    def export_to_dataframe(self, schedule):
        """Export schedule to pandas DataFrame for further analysis"""
        data = []
        
        for day in self.days:
            for time_slot, session in schedule[day].items():
                if session:
                    data.append({
                        'Day': day,
                        'Time': time_slot,
                        'Subject': session['subject'],
                        'Type': session['type'],
                        'Color': session['color']
                    })
        
        return pd.DataFrame(data)
