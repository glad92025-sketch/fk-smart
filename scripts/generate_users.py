import zipfile
import xml.etree.ElementTree as ET
import json
import re

excel_path = r'D:\อบต\รายชื่อพนักงาน.xlsx'

with zipfile.ZipFile(excel_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            text = ''.join(t.text for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
            shared_strings.append(text)
            
    wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
    sheets = [s.attrib['name'] for s in wb_tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheets/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet')]

    def get_sheet_cells(sheet_index):
        sheet_tree = ET.fromstring(z.read(f'xl/worksheets/sheet{sheet_index}.xml'))
        rows_data = []
        for row in sheet_tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            r_idx = row.attrib.get('r')
            cells = {}
            for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                r_ref = c.attrib.get('r')
                col = re.match(r'([A-Z]+)', r_ref).group(1)
                t = c.attrib.get('t')
                v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                val = v.text if v is not None else ''
                if t == 's' and val != '':
                    val = shared_strings[int(val)]
                cells[col] = val
            rows_data.append((int(r_idx), cells))
        return rows_data

    sheet1_rows = get_sheet_cells(1) # พนักงาน
    sheet2_rows = get_sheet_cells(2) # คณะบริหารและอบต
    sheet4_rows = get_sheet_cells(4) # รหัสพนักงาน

    # Map Sheet 4 codes
    code_by_name = {}
    code_list = []
    for r_num, cells in sheet4_rows:
        code = cells.get('A', '').strip()
        name = cells.get('B', '').strip()
        pos = cells.get('C', '').strip()
        note = cells.get('D', '').strip()
        if code and code != 'รหัสประจำตัว':
            clean_name = re.sub(r'\s+', ' ', name).strip()
            code_by_name[clean_name] = code
            code_list.append({'code': code, 'name': clean_name, 'pos': pos, 'note': note})

    # Department mapping to standard IDs
    # Existing IDs in app:
    # dept_office: สำนักปลัด
    # dept_finance: กองคลัง
    # dept_tech: กองช่าง
    # dept_edu: กองการศึกษาฯ
    # dept_audit: หน่วยตรวจสอบภายใน
    # dept_exec: ฝ่ายบริหาร / สภา อบต.
    
    users = []
    
    # 1. Super Admin
    users.append({
        'id': 'user_admin',
        'employeeCode': 'ADM001',
        'username': 'admin',
        'password': 'password123', # Initial password
        'name': 'ผู้ดูแลระบบกลาง (System Admin)',
        'email': 'admin@fangkham.go.th',
        'phone': '045-000000',
        'role': 'super_admin',
        'roleTitle': 'ผู้ดูแลระบบสูงสุด',
        'departmentId': 'dept_office',
        'departmentName': 'ศูนย์เทคโนโลยีสารสนเทศ / สำนักปลัด',
        'divisionName': 'งานพัฒนาระบบและสารสนเทศ',
        'position': 'นักวิชาการคอมพิวเตอร์ / ผู้ดูแลระบบ',
        'employmentType': 'ข้าราชการ',
        'status': 'active',
        'avatarUrl': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    })

    # 2. Add Board Members from Sheet 2
    for b in sheet2_rows:
        cells = b[1]
        no = cells.get('A', '').strip()
        name = cells.get('B', '').strip()
        pos = cells.get('C', '').strip()
        phone = cells.get('D', '').strip()
        
        if not no.isdigit() or not name:
            continue
            
        clean_name = re.sub(r'\s+', ' ', name).strip()
        
        # Determine role and code
        role = 'deputy_mayor'
        roleTitle = 'ผู้บริหาร'
        dep_id = 'dept_exec'
        dep_name = 'คณะผู้บริหารและสภา อบต.'
        div_name = 'ฝ่ายบริหาร'
        code = f"EXEC{int(no):03d}"
        
        if 'นายก' in pos and 'รอง' not in pos:
            role = 'mayor'
            roleTitle = 'นายก อบต.'
            code = 'EXEC001'
        elif 'รองนายก' in pos:
            role = 'deputy_mayor'
            roleTitle = 'รองนายก อบต.'
        elif 'ประธานสภา' in pos:
            role = 'deputy_mayor'
            roleTitle = 'ประธานสภา อบต.'
            div_name = 'สภา อบต.'
            code = f"COUNCIL{int(no):02d}"
        elif 'สมาชิกสภา' in pos:
            role = 'deputy_mayor'
            roleTitle = 'สมาชิกสภา อบต.'
            div_name = 'สภา อบต.'
            code = f"COUNCIL{int(no):02d}"
        elif 'เลขานุการ' in pos:
            role = 'deputy_mayor'
            roleTitle = 'เลขานุการนายก อบต.'
            div_name = 'ฝ่ายบริหาร'

        username = code.lower()
        users.append({
            'id': f"user_{code.lower()}",
            'employeeCode': code,
            'username': username,
            'password': 'password123',
            'name': clean_name,
            'email': f"{username}@fangkham.go.th",
            'phone': phone or '-',
            'role': role,
            'roleTitle': roleTitle,
            'departmentId': dep_id,
            'departmentName': dep_name,
            'divisionName': div_name,
            'position': pos,
            'employmentType': 'ฝ่ายการเมือง / คณะบริหาร',
            'status': 'active',
            'avatarUrl': ''
        })

    # 3. Add Employees from Sheet 1
    current_dept_name = 'สำนักปลัด'
    current_dept_id = 'dept_office'
    current_emp_type = 'ข้าราชการ'

    for row_idx, cells in sheet1_rows:
        val_d = cells.get('D', '').strip()
        val_b = cells.get('B', '').strip()
        val_c = cells.get('C', '').strip()
        val_e = cells.get('E', '').strip()
        
        # Check header
        if 'สำนัก' in val_d:
            current_dept_name = 'สำนักปลัด'
            current_dept_id = 'dept_office'
        elif 'กองคลัง' in val_d:
            current_dept_name = 'กองคลัง'
            current_dept_id = 'dept_finance'
        elif 'กองช่าง' in val_d:
            current_dept_name = 'กองช่าง'
            current_dept_id = 'dept_tech'
        elif 'กองการศึกษา' in val_d:
            current_dept_name = 'กองการศึกษา ศาสนาและวัฒนธรรม'
            current_dept_id = 'dept_edu'
        elif 'ตรวจสอบภายใน' in val_d:
            current_dept_name = 'หน่วยตรวจสอบภายใน'
            current_dept_id = 'dept_audit'
        elif 'นักบริหารท้องถิ่น' in val_d:
            current_dept_name = 'สำนักปลัด'
            current_dept_id = 'dept_office'
            
        if val_b in ['ข้าราชการ', 'พนักงานจ้างตามภารกิจ', 'จ้างเหมาบริการ', 'พนักงานจ้างทั่วไป']:
            current_emp_type = val_b
            
        if val_b.isdigit() and val_c and val_c != '-':
            clean_name = re.sub(r'\s+', ' ', val_c).strip()
            
            # Lookup code from sheet 4 or generate fallback
            emp_code = code_by_name.get(clean_name)
            if not emp_code:
                # Try fuzzy matching
                for cn, cval in code_by_name.items():
                    if clean_name in cn or cn in clean_name:
                        emp_code = cval
                        break
            if not emp_code:
                emp_code = f"FK{len(users):03d}"
                
            pos = val_d or 'เจ้าหน้าที่'
            
            # Determine role
            role = 'officer'
            roleTitle = 'เจ้าหน้าที่'
            
            if 'ปลัด' in pos and 'รอง' not in pos and 'หัวหน้า' not in pos:
                role = 'clerk'
                roleTitle = 'ปลัด อบต.'
            elif 'รองปลัด' in pos:
                role = 'clerk'
                roleTitle = 'รองปลัด อบต.'
            elif 'ผู้อำนวยการ' in pos or 'หัวหน้า' in pos:
                role = 'dept_head'
                roleTitle = f"หัวหน้าส่วน ({pos})"
            else:
                role = 'officer'
                roleTitle = 'เจ้าหน้าที่ปฏิบัติงาน'
                
            username = emp_code.lower()
            users.append({
                'id': f"user_{emp_code.lower()}",
                'employeeCode': emp_code,
                'username': username,
                'password': 'password123',
                'name': clean_name,
                'email': f"{username}@fangkham.go.th",
                'phone': val_e or '-',
                'role': role,
                'roleTitle': roleTitle,
                'departmentId': current_dept_id,
                'departmentName': current_dept_name,
                'divisionName': current_dept_name,
                'position': pos,
                'employmentType': current_emp_type,
                'status': 'active',
                'avatarUrl': ''
            })

    output_path = 'src/data/generated_users.json'
    import os
    os.makedirs('src/data', exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as out:
        json.dump(users, out, ensure_ascii=False, indent=2)

    print(f"Generated {len(users)} users successfully into {output_path}!")

    # Summary by department
    dept_summary = {}
    for u in users:
        dname = u['departmentName']
        dept_summary[dname] = dept_summary.get(dname, 0) + 1
    print("\nSummary by Department:")
    for dname, count in dept_summary.items():
        print(f"  {dname}: {count} คน")
