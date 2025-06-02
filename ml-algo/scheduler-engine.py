# Scheduling Algorithm
from ortools.sat.python import cp_model
import matplotlib.pyplot as plt
import collections

# ---------------------------
# Configuration
# ---------------------------
subjects_data = {
    'Math': 4,      # total hours
    'Physics': 3,
    'History': 2,
    'Biology': 3
}

days = ['Mon', 'Tue', 'Wed']
sessions_per_day = 4   # e.g., 4 study sessions per day
session_length = 1     # 1 hour per session

# Derived parameters
all_subjects = list(subjects_data.keys())
num_subjects = len(all_subjects)
num_days = len(days)
total_slots = num_days * sessions_per_day

# ---------------------------
# Model
# ---------------------------
model = cp_model.CpModel()

# subject_in_slot[(subject, slot)] = BoolVar
subject_in_slot = {}
for subject in all_subjects:
    for slot in range(total_slots):
        subject_in_slot[(subject, slot)] = model.NewBoolVar(f'{subject}_in_slot_{slot}')

# Each slot has at most one subject
for slot in range(total_slots):
    model.Add(sum(subject_in_slot[(subject, slot)] for subject in all_subjects) <= 1)

# Each subject gets exactly the allocated number of hours (sessions)
for subject in all_subjects:
    model.Add(sum(subject_in_slot[(subject, slot)] for slot in range(total_slots)) == subjects_data[subject])

# No consecutive sessions of the same subject
for subject in all_subjects:
    for slot in range(total_slots - 1):
        model.AddBoolOr([
            subject_in_slot[(subject, slot)].Not(),
            subject_in_slot[(subject, slot + 1)].Not()
        ])

# ---------------------------
# Solve
# ---------------------------
solver = cp_model.CpSolver()
status = solver.Solve(model)

# ---------------------------
# Plotting
# ---------------------------
if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
    print('Study schedule found!\n')
    slot_to_subject = {}
    for slot in range(total_slots):
        for subject in all_subjects:
            if solver.Value(subject_in_slot[(subject, slot)]):
                slot_to_subject[slot] = subject
                break

    # Prepare Gantt chart
    fig, ax = plt.subplots(figsize=(12, 3))
    subject_colors = {s: f'C{i}' for i, s in enumerate(all_subjects)}

    for slot, subject in slot_to_subject.items():
        day_idx = slot // sessions_per_day
        session_idx = slot % sessions_per_day
        ax.broken_barh([(session_idx, 1)], (day_idx * 10, 9),
                       facecolors=subject_colors[subject])
        ax.text(session_idx + 0.5, day_idx * 10 + 4.5, subject,
                ha='center', va='center', color='white')

    ax.set_yticks([i * 10 + 5 for i in range(num_days)])
    ax.set_yticklabels(days)
    ax.set_xticks(range(sessions_per_day + 1))
    ax.set_xticklabels([f'Session {i+1}' for i in range(sessions_per_day)])
    ax.set_xlim(0, sessions_per_day)
    ax.set_xlabel('Sessions')
    ax.set_title('Study Routine Schedule')
    ax.grid(True)
    plt.tight_layout()
    plt.show()

else:
    print("No solution found.")
