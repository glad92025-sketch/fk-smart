import json
import sys

# Configure stdout for utf-8 if supported
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

with open('extracted_personnel.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print(f"=== TOTAL EMPLOYEES: {len(d['emps_sample'])} ===")
depts = {}
for e in d['emps_sample']:
    depts.setdefault(e['dept'], []).append(e)

for dept, emps in depts.items():
    print(f"\n--- {dept} ({len(emps)} คน) ---")
    for emp in emps:
        print(f"  [{emp['no']}] {emp['name']} | {emp['pos']} | {emp['emp_type']} | {emp['phone']}")

print(f"\n=== TOTAL BOARD MEMBERS: {len(d['board_sample'])} ===")
for b in d['board_sample']:
    print(f"  [{b['no']}] {b['name']} | {b['pos']} | {b['phone']} | {b['section']}")
