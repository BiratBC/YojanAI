from ortools.sat.python import cp_model
from datetime import datetime, timedelta
import pandas as pd

class WeeklyScheduler:
    def __init__(self):
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        
        # Time slots (in 30-minute intervals from 6:00 to 20:30)
        self.time_slots = []
        start_time = 6 * 60  # 6:00 AM in minutes
        end_time = 20 * 60 + 30  # 8:30 PM in minutes
        for t in range(start_time, end_time, 30):
            hours = t // 60
            minutes = t % 60
            self.time_slots.append(f"{hours:02d}:{minutes:02d}")
        
        # Days of the week
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        # Subjects with their credits (determines study session allocation)
        self.subjects = {
            'MATH_208': {'credits': 3, 'color': '#FFB366'},  # Orange
            'ENG_111': {'credits': 2, 'color': '#87CEEB'},   # Light Blue
            'MATH_207': {'credits': 3, 'color': '#90EE90'},  # Light Green
            'COMP_202': {'credits': 4, 'color': '#F0E68C'},  # Khaki
            'COMP_204': {'credits': 3, 'color': '#DDA0DD'}   # Plum
        }
        
        # Fixed class times (day_index, start_slot, duration_slots, subject)
        self.fixed_classes = [
            # Monday
            (0, self.time_to_slot("9:00"), self.duration_to_slots(7, 0), "CLASS_TIME"),  # 9:00-16:00
            (0, self.time_to_slot("18:00"), self.duration_to_slots(1, 0), "COMP_202"),   # 18:00-19:00
            (0, self.time_to_slot("19:30"), self.duration_to_slots(1, 0), "COMP_204"),   # 19:30-20:30
            
            # Tuesday  
            (1, self.time_to_slot("9:00"), self.duration_to_slots(7, 0), "CLASS_TIME"),  # 9:00-16:00
            (1, self.time_to_slot("17:00"), self.duration_to_slots(1, 0), "COMP_202"),   # 17:00-18:00
            
            # Wednesday
            (2, self.time_to_slot("9:00"), self.duration_to_slots(7, 0), "CLASS_TIME"),  # 9:00-16:00
            
            # Thursday
            (3, self.time_to_slot("9:00"), self.duration_to_slots(7, 0), "CLASS_TIME"),  # 9:00-16:00
            (3, self.time_to_slot("18:00"), self.duration_to_slots(1, 0), "COMP_202"),   # 18:00-19:00
            (3, self.time_to_slot("19:30"), self.duration_to_slots(1, 0), "COMP_204"),   # 19:30-20:30
            
            # Friday
            (4, self.time_to_slot("9:00"), self.duration_to_slots(7, 0), "CLASS_TIME"),  # 9:00-16:00
            
            # Saturday
            # (5, self.time_to_slot("9:00"), self.duration_to_slots(4, 0), "CLASS_TIME"),  # 9:00-13:00
            
            # Sunday
            (6, self.time_to_slot("9:00"), self.duration_to_slots(4, 0), "CLASS_TIME"),  # 9:00-13:00
        ]
        
        # Decision variables for study sessions
        self.study_sessions = {}
        self.initialize_variables()
        
    def time_to_slot(self, time_str):
        """Convert time string to slot index"""
        hours, minutes = map(int, time_str.split(':'))
        time_minutes = hours * 60 + minutes
        start_minutes = 6 * 60  # 6:00 AM
        return (time_minutes - start_minutes) // 30
    
    def duration_to_slots(self, hours, minutes=0):
        """Convert duration to number of slots"""
        return (hours * 60 + minutes) // 30
    
    def slot_to_time(self, slot):
        """Convert slot index back to time string"""
        return self.time_slots[slot]
    
    def initialize_variables(self):
        """Initialize decision variables for study sessions"""
        for subject in self.subjects:
            self.study_sessions[subject] = {}
            for day_idx, day in enumerate(self.days):
                self.study_sessions[subject][day_idx] = {}
                for slot in range(len(self.time_slots)):
                    # Binary variable: 1 if subject has study session at this day/time
                    var_name = f"{subject}_{day}_{slot}"
                    self.study_sessions[subject][day_idx][slot] = self.model.NewBoolVar(var_name)
    
    def add_constraints(self):
        """Add scheduling constraints"""
        
        # 1. No overlapping sessions at any time slot
        for day_idx in range(len(self.days)):
            for slot in range(len(self.time_slots)):
                subjects_at_slot = []
                
                # Add study sessions
                for subject in self.subjects:
                    subjects_at_slot.append(self.study_sessions[subject][day_idx][slot])
                
                # Only one session per time slot
                self.model.Add(sum(subjects_at_slot) <= 1)
        
        # 2. Block fixed class times
        for day_idx, start_slot, duration, class_type in self.fixed_classes:
            for slot_offset in range(duration):
                current_slot = start_slot + slot_offset
                if current_slot < len(self.time_slots):
                    # No study sessions during fixed class times
                    for subject in self.subjects:
                        self.model.Add(self.study_sessions[subject][day_idx][current_slot] == 0)
        
        # 3. Credit-based study session allocation
        total_weekly_slots = len(self.days) * len(self.time_slots)
        
        for subject, info in self.subjects.items():
            # Calculate minimum sessions based on credits
            min_sessions = info['credits'] * 2  # 2 sessions per credit per week
            max_sessions = info['credits'] * 4  # Maximum sessions per week
            
            total_subject_sessions = []
            for day_idx in range(len(self.days)):
                for slot in range(len(self.time_slots)):
                    total_subject_sessions.append(self.study_sessions[subject][day_idx][slot])
            
            self.model.Add(sum(total_subject_sessions) >= min_sessions)
            self.model.Add(sum(total_subject_sessions) <= max_sessions)
        
        # 4. Session continuity (prefer 1-2 hour blocks)
        for subject in self.subjects:
            for day_idx in range(len(self.days)):
                for slot in range(len(self.time_slots) - 1):
                    # If session starts, encourage it to continue for at least 1 hour
                    current_session = self.study_sessions[subject][day_idx][slot]
                    next_session = self.study_sessions[subject][day_idx][slot + 1]
                    
                    # Soft constraint: if we start a session, prefer to continue it
                    continuation_var = self.model.NewBoolVar(f"continue_{subject}_{day_idx}_{slot}")
                    self.model.Add(next_session >= current_session - continuation_var)
        
        # 5. Daily limits per subject (max 3 hours per day per subject)
        for subject in self.subjects:
            for day_idx in range(len(self.days)):
                daily_sessions = []
                for slot in range(len(self.time_slots)):
                    daily_sessions.append(self.study_sessions[subject][day_idx][slot])
                self.model.Add(sum(daily_sessions) <= 6)  # 6 slots = 3 hours
        
        # 6. Early morning and late evening preferences
        for subject in self.subjects:
            for day_idx in range(len(self.days)):
                # Discourage very early (6:00-7:00) and very late (after 20:00) sessions
                early_slots = range(0, 2)  # 6:00-7:00
                late_slots = range(28, len(self.time_slots))  # after 20:00
                
                early_sessions = []
                late_sessions = []
                
                for slot in early_slots:
                    if slot < len(self.time_slots):
                        early_sessions.append(self.study_sessions[subject][day_idx][slot])
                
                for slot in late_slots:
                    if slot < len(self.time_slots):
                        late_sessions.append(self.study_sessions[subject][day_idx][slot])
                
                # Limit early and late sessions
                if early_sessions:
                    self.model.Add(sum(early_sessions) <= 1)
                if late_sessions:
                    self.model.Add(sum(late_sessions) <= 1)
    
    def set_objective(self):
        """Set optimization objective"""
        objective_terms = []
        
        # Maximize study sessions during preferred hours (8:00-18:00)
        preferred_start = self.time_to_slot("8:00")
        preferred_end = self.time_to_slot("18:00")
        
        for subject in self.subjects:
            for day_idx in range(len(self.days)):
                for slot in range(preferred_start, min(preferred_end, len(self.time_slots))):
                    objective_terms.append(self.study_sessions[subject][day_idx][slot] * 10)
        
        # Bonus for session continuity
        for subject in self.subjects:
            for day_idx in range(len(self.days)):
                for slot in range(len(self.time_slots) - 1):
                    current = self.study_sessions[subject][day_idx][slot]
                    next_slot = self.study_sessions[subject][day_idx][slot + 1]
                    
                    # Bonus when sessions are consecutive
                    continuation_bonus = self.model.NewBoolVar(f"bonus_{subject}_{day_idx}_{slot}")
                    self.model.Add(continuation_bonus <= current)
                    self.model.Add(continuation_bonus <= next_slot)
                    self.model.Add(continuation_bonus >= current + next_slot - 1)
                    
                    objective_terms.append(continuation_bonus * 5)
        
        self.model.Maximize(sum(objective_terms))
    
    def solve(self):
        """Solve the scheduling problem"""
        self.add_constraints()
        self.set_objective()
        
        # Set solver parameters
        self.solver.parameters.max_time_in_seconds = 30.0
        
        status = self.solver.Solve(self.model)
        
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            return self.extract_schedule()
        else:
            return None
    
    def extract_schedule(self):
        """Extract the solution into a readable format"""
        schedule = {}
        
        for day_idx, day in enumerate(self.days):
            schedule[day] = {}
            
            # Add fixed classes first
            for fix_day_idx, start_slot, duration, class_type in self.fixed_classes:
                if fix_day_idx == day_idx:
                    for slot_offset in range(duration):
                        current_slot = start_slot + slot_offset
                        if current_slot < len(self.time_slots):
                            time_str = self.slot_to_time(current_slot)
                            if class_type == "CLASS_TIME":
                                schedule[day][time_str] = {
                                    'subject': 'Class Time',
                                    'type': 'fixed',
                                    'color': '#FFB6C1'  # Light pink
                                }
                            else:
                                schedule[day][time_str] = {
                                    'subject': class_type,
                                    'type': 'fixed',
                                    'color': self.subjects[class_type]['color']
                                }
            
            # Add study sessions
            for subject in self.subjects:
                for slot in range(len(self.time_slots)):
                    if self.solver.Value(self.study_sessions[subject][day_idx][slot]):
                        time_str = self.slot_to_time(slot)
                        schedule[day][time_str] = {
                            'subject': subject,
                            'type': 'study',
                            'color': self.subjects[subject]['color']
                        }
        
        return schedule
    
    def print_schedule(self, schedule):
        """Print the schedule in a readable format"""
        if not schedule:
            print("No feasible schedule found!")
            return
        
        print("\n" + "="*80)
        print("WEEKLY CLASS SCHEDULE")
        print("="*80)
        
        for day in self.days:
            print(f"\n{day.upper()}")
            print("-" * 40)
            
            day_schedule = schedule.get(day, {})
            if not day_schedule:
                print("  No scheduled activities")
                continue
            
            # Sort by time
            sorted_times = sorted(day_schedule.keys(), key=lambda x: self.time_to_slot(x))
            
            current_block = None
            block_start = None
            
            for time_str in sorted_times:
                session = day_schedule[time_str]
                
                if current_block != session['subject']:
                    # Print previous block if exists
                    if current_block:
                        print(f"  {block_start} - {prev_time}: {current_block} ({prev_type})")
                    
                    # Start new block
                    current_block = session['subject']
                    block_start = time_str
                    prev_type = session['type']
                
                prev_time = time_str
            
            # Print last block
            if current_block:
                # Calculate end time (add 30 minutes)
                end_slot = self.time_to_slot(prev_time) + 1
                if end_slot < len(self.time_slots):
                    end_time = self.slot_to_time(end_slot)
                else:
                    end_time = "20:30"
                print(f"  {block_start} - {end_time}: {current_block} ({prev_type})")
        
        # Print statistics
        self.print_statistics(schedule)
    
    def print_statistics(self, schedule):
        """Print scheduling statistics"""
        print("\n" + "="*50)
        print("SCHEDULE STATISTICS")
        print("="*50)
        
        subject_hours = {subject: 0 for subject in self.subjects}
        
        for day in schedule:
            for time_str, session in schedule[day].items():
                if session['type'] == 'study' and session['subject'] in subject_hours:
                    subject_hours[session['subject']] += 0.5  # Each slot is 30 minutes
        
        print("\nWeekly Study Hours by Subject:")
        for subject, hours in subject_hours.items():
            credits = self.subjects[subject]['credits']
            print(f"  {subject}: {hours:.1f} hours (Credits: {credits})")
        
        total_study_hours = sum(subject_hours.values())
        print(f"\nTotal Weekly Study Hours: {total_study_hours:.1f}")

# Example usage
def main():
    print("Creating Weekly Class Schedule...")
    scheduler = WeeklyScheduler()
    
    print("Solving optimization problem...")
    schedule = scheduler.solve()
    
    if schedule:
        scheduler.print_schedule(schedule)
        
        # Also return the schedule for potential GUI display
        return schedule
    else:
        print("Could not find a feasible schedule. Try adjusting constraints.")
        return None

if __name__ == "__main__":
    schedule = main()