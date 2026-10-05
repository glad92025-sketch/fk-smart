import json

with open('extracted_personnel.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("=== EMPLOYEE SAMPLE ===")
for e in d['emps_sample'][:20]:
    print(f"{e['no']} | {e['name']} | {e['dept']} | {e['pos']} | {e['emp_type']} | {e['phone']}")

print("\n=== BOARD SAMPLE ===")
for b in d['board_sample'][:10]:
    print(f"{b['no']} | {b['name']} | {b['pos']} | {b['phone']} | {b['section']}")

print("\n=== CODE SAMPLE ===")
for c in d['codes_sample'][:20]:
    print(f"{c['code']} | {c['name']} | {c['pos']}")
