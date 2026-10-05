import zipfile, xml.etree.ElementTree as ET, json, re

excel_path = r'D:\อบต\รายชื่อพนักงาน.xlsx'

with zipfile.ZipFile(excel_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            text = ''.join(t.text for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
            shared_strings.append(text)

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

    # Sheet 4 code mapping
    code_map = {}
    for r_num, cells in sheet4_rows:
        code = cells.get('A', '').strip()
        name = cells.get('B', '').strip()
        pos = cells.get('C', '').strip()
        if code and code != 'รหัสประจำตัว':
            clean_name = re.sub(r'\s+', ' ', name).strip()
            code_map[clean_name] = code

    users = []

    # 1. System Administrator
    users.append({
        'id': 'usr_admin',
        'employeeCode': 'ADM001',
        'username': 'admin',
        'password': 'password123',
        'name': 'ผู้ดูแลระบบกลาง (System Admin)',
        'email': 'admin@fangkham.go.th',
        'phone': '045-959111',
        'role': 'super_admin',
        'roleTitle': 'ผู้ดูแลระบบสูงสุด',
        'departmentId': 'dept_office',
        'departmentName': 'สำนักปลัด อบต.',
        'divisionName': 'งานพัฒนาระบบและสารสนเทศ',
        'position': 'นักวิชาการคอมพิวเตอร์ / ผู้ดูแลระบบ',
        'employmentType': 'ข้าราชการ',
        'status': 'active',
        'avatarUrl': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'createdAt': '2026-01-01'
    })

    # 2. Board & Executives from Sheet 2
    for r_num, cells in sheet2_rows:
        no = cells.get('A', '').strip()
        name = cells.get('B', '').strip()
        pos = cells.get('C', '').strip()
        phone = cells.get('D', '').strip()

        if not no.isdigit() or not name:
            continue

        clean_name = re.sub(r'\s+', ' ', name).strip()
        code = f"EXEC{int(no):03d}"
        role = 'deputy_mayor'
        roleTitle = 'ผู้บริหาร'
        div_name = 'ฝ่ายบริหาร'
        dept_id = 'dept_exec'
        dept_name = 'คณะผู้บริหารและสภา อบต.'

        if 'นายก' in pos and 'รอง' not in pos:
            role = 'mayor'
            roleTitle = 'นายก อบต.'
            code = 'EXEC001'
            avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        elif 'รองนายก' in pos:
            role = 'deputy_mayor'
            roleTitle = 'รองนายก อบต.'
            avatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
        elif 'ประธานสภา' in pos:
            role = 'deputy_mayor'
            roleTitle = 'ประธานสภา อบต.'
            div_name = 'สภา อบต.'
            code = f"COUNCIL{int(no):02d}"
            avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        elif 'สมาชิกสภา' in pos:
            role = 'deputy_mayor'
            roleTitle = 'สมาชิกสภา อบต.'
            div_name = 'สภา อบต.'
            code = f"COUNCIL{int(no):02d}"
            avatar = ''
        elif 'เลขานุการนายก' in pos:
            role = 'deputy_mayor'
            roleTitle = 'เลขานุการนายก อบต.'
            div_name = 'ฝ่ายบริหาร'
            avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
        elif 'กำนัน' in pos or 'ผู้ใหญ่บ้าน' in pos:
            role = 'deputy_mayor'
            roleTitle = 'ฝ่ายปกครองท้องที่'
            div_name = 'ฝ่ายปกครองท้องที่'
            code = f"VILLAGE{int(no):02d}"
            avatar = ''
        else:
            avatar = ''

        username = code.lower()
        users.append({
            'id': f"usr_{username}",
            'employeeCode': code,
            'username': username,
            'password': 'password123',
            'name': clean_name,
            'email': f"{username}@fangkham.go.th",
            'phone': phone or '-',
            'role': role,
            'roleTitle': roleTitle,
            'departmentId': dept_id,
            'departmentName': dept_name,
            'divisionName': div_name,
            'position': pos,
            'employmentType': 'ฝ่ายการเมือง / คณะบริหาร',
            'status': 'active',
            'avatarUrl': avatar,
            'createdAt': '2026-01-01'
        })

    # 3. Employees from Sheet 1
    curr_dept_name = 'สำนักปลัด อบต.'
    curr_dept_id = 'dept_office'
    curr_emp_type = 'ข้าราชการ'

    for r_num, cells in sheet1_rows:
        val_d = cells.get('D', '').strip()
        val_b = cells.get('B', '').strip()
        val_c = cells.get('C', '').strip()
        val_e = cells.get('E', '').strip()

        # Check section header in column D
        if 'สำนักงานปลัด' in val_d or 'นักบริหารท้องถิ่น' in val_d:
            curr_dept_name = 'สำนักปลัด อบต.'
            curr_dept_id = 'dept_office'
        elif 'กองคลัง' in val_d:
            curr_dept_name = 'กองคลัง'
            curr_dept_id = 'dept_finance'
        elif 'กองช่าง' in val_d:
            curr_dept_name = 'กองช่าง'
            curr_dept_id = 'dept_tech'
        elif 'กองสวัสดิการสังคม' in val_d:
            curr_dept_name = 'กองสวัสดิการสังคม'
            curr_dept_id = 'dept_welfare'
        elif 'กองการศึกษา' in val_d:
            curr_dept_name = 'กองการศึกษา ศาสนาและวัฒนธรรม'
            curr_dept_id = 'dept_edu'
        elif 'ตรวจสอบภายใน' in val_d:
            curr_dept_name = 'หน่วยตรวจสอบภายใน'
            curr_dept_id = 'dept_audit'

        if val_b in ['ข้าราชการ', 'พนักงานจ้างตามภารกิจ', 'จ้างเหมาบริการ', 'พนักงานจ้างทั่วไป']:
            curr_emp_type = val_b

        if val_b.isdigit() and val_c and val_c != '-':
            clean_name = re.sub(r'\s+', ' ', val_c).strip()
            
            # Find code
            emp_code = code_map.get(clean_name)
            if not emp_code:
                for k, v in code_map.items():
                    if clean_name in k or k in clean_name:
                        emp_code = v
                        break
            if not emp_code:
                emp_code = f"FK{len(users):03d}"

            pos = val_d or 'เจ้าหน้าที่'
            
            # Determine role & roleTitle
            role = 'officer'
            roleTitle = 'เจ้าหน้าที่ผู้ปฏิบัติงาน'
            avatar = ''

            if 'ปลัด' in pos and 'รอง' not in pos and 'หัวหน้า' not in pos:
                role = 'clerk'
                roleTitle = 'ปลัด อบต.'
                avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
            elif 'รองปลัด' in pos:
                role = 'clerk'
                roleTitle = 'รองปลัด อบต.'
                avatar = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
            elif 'ผู้อำนวยการ' in pos or 'หัวหน้า' in pos:
                role = 'dept_head'
                roleTitle = f"หัวหน้าส่วน ({pos})"
                avatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
            else:
                role = 'officer'
                roleTitle = f"เจ้าหน้าที่ ({curr_dept_name})"

            username = emp_code.lower()
            users.append({
                'id': f"usr_{username}",
                'employeeCode': emp_code,
                'username': username,
                'password': 'password123',
                'name': clean_name,
                'email': f"{username}@fangkham.go.th",
                'phone': val_e or '-',
                'role': role,
                'roleTitle': roleTitle,
                'departmentId': curr_dept_id,
                'departmentName': curr_dept_name,
                'divisionName': curr_dept_name,
                'position': pos,
                'employmentType': curr_emp_type,
                'status': 'active',
                'avatarUrl': avatar,
                'createdAt': '2026-01-01'
            })

    # Output as TypeScript file
    ts_code = "import { User } from '../types';\n\n"
    ts_code += "export const INITIAL_STAFF_USERS: User[] = " + json.dumps(users, ensure_ascii=False, indent=2) + ";\n"

    with open('src/data/initialUsers.ts', 'w', encoding='utf-8') as f:
        f.write(ts_code)

    print(f"Generated src/data/initialUsers.ts with {len(users)} users successfully!")

    # Generate departments data
    departments = [
        {
            'id': 'dept_office',
            'code': 'สป',
            'name': 'สำนักปลัด อบต.',
            'shortName': 'สำนักปลัด',
            'headName': 'นางอรุณรัตน์ บุญกอ',
            'headPosition': 'หัวหน้าสำนักปลัด',
            'memberCount': len([u for u in users if u['departmentId'] == 'dept_office']),
            'iconName': 'landmark',
            'color': '#0284c7',
            'divisions': [
                'งานธุรการและสารบรรณ',
                'งานการเจ้าหน้าที่',
                'งานนิติการ',
                'งานป้องกันและบรรเทาสาธารณภัย',
                'งานประชาสัมพันธ์',
                'งานนโยบายและแผน',
                'งานส่งเสริมสุขภาพและสิ่งแวดล้อม'
            ]
        },
        {
            'id': 'dept_finance',
            'code': 'กค',
            'name': 'กองคลัง',
            'shortName': 'กองคลัง',
            'headName': 'นางวาสนา สินทรัพย์',
            'headPosition': 'ผู้อำนวยการกองคลัง',
            'memberCount': len([u for u in users if u['departmentId'] == 'dept_finance']),
            'iconName': 'wallet',
            'color': '#10b981',
            'divisions': [
                'งานการเงินและบัญชี',
                'งานพัสดุและจัดซื้อจัดจ้าง',
                'งานพัฒนารายได้และจัดเก็บภาษี',
                'งานแผนที่ภาษีและสารสนเทศ'
            ]
        },
        {
            'id': 'dept_tech',
            'code': 'กช',
            'name': 'กองช่าง',
            'shortName': 'กองช่าง',
            'headName': 'นายวุฒิศักดิ์ บุตรสิงห์',
            'headPosition': 'ผู้อำนวยการกองช่าง',
            'memberCount': len([u for u in users if u['departmentId'] == 'dept_tech']),
            'iconName': 'hard-hat',
            'color': '#f59e0b',
            'divisions': [
                'งานก่อสร้างและผังเมือง',
                'งานออกแบบและประมาณราคา',
                'งานไฟฟ้าและสาธารณูปโภค',
                'งานประปา',
                'งานรักษาความสะอาดและขยะ'
            ]
        },
        {
            'id': 'dept_welfare',
            'code': 'กส',
            'name': 'กองสวัสดิการสังคม',
            'shortName': 'กองสวัสดิการ',
            'headName': 'นายวีระวัฒน์ จันทรคล',
            'headPosition': 'นักพัฒนาชุมชนชำนาญการ (หัวหน้ากองสวัสดิการสังคม)',
            'memberCount': len([u for u in users if u['departmentId'] == 'dept_welfare']),
            'iconName': 'heart-handshake',
            'color': '#ec4899',
            'divisions': [
                'งานพัฒนาชุมชน',
                'งานสังคมสงเคราะห์และเบี้ยยังชีพ',
                'งานส่งเสริมอาชีพและพัฒนาสตรี'
            ]
        },
        {
            'id': 'dept_edu',
            'code': 'กศ',
            'name': 'กองการศึกษา ศาสนาและวัฒนธรรม',
            'shortName': 'กองการศึกษา',
            'headName': 'นายทศพล โลมรัตน์',
            'headPosition': 'นักวิชาการศึกษาปฏิบัติการ (รักษาการ ผอ.กองการศึกษา)',
            'memberCount': len([u for u in users if u['departmentId'] == 'dept_edu']),
            'iconName': 'graduation-cap',
            'color': '#8b5cf6',
            'divisions': [
                'งานการศึกษาและโรงเรียนอนุบาล',
                'งานศูนย์พัฒนาเด็กเล็ก (ศพด.บ้านฝางเทิง)',
                'งานศาสนา วัฒนธรรม และประเพณีท้องถิ่น'
            ]
        },
        {
            'id': 'dept_audit',
            'code': 'ตส',
            'name': 'หน่วยตรวจสอบภายใน',
            'shortName': 'ตรวจสอบภายใน',
            'headName': 'นายศุภมงคล ธรรมพิทักษ์',
            'headPosition': 'นักวิชาการตรวจสอบภายในปฏิบัติการ',
            'memberCount': len([u for u in users if u['departmentId'] == 'dept_audit']),
            'iconName': 'shield-check',
            'color': '#64748b',
            'divisions': [
                'งานตรวจสอบการเงินและบัญชี',
                'งานตรวจสอบการดำเนินงานและพัสดุ'
            ]
        },
        {
            'id': 'dept_exec',
            'code': 'บห',
            'name': 'คณะผู้บริหารและสภา อบต.',
            'shortName': 'ฝ่ายบริหารและสภา',
            'headName': 'นายจรูญ ธรรมพิทักษ์',
            'headPosition': 'นายกองค์การบริหารส่วนตำบลฝางคำ',
            'memberCount': len([u for u in users if u['departmentId'] == 'dept_exec']),
            'iconName': 'users',
            'color': '#e11d48',
            'divisions': [
                'คณะผู้บริหาร อบต.',
                'สภาองค์การบริหารส่วนตำบลฝางคำ',
                'ฝ่ายปกครองท้องที่ (กำนัน/ผู้ใหญ่บ้าน)'
            ]
        }
    ]

    dept_ts = "import { Department } from '../types';\n\n"
    dept_ts += "export const REAL_DEPARTMENTS: Department[] = " + json.dumps(departments, ensure_ascii=False, indent=2) + ";\n"

    with open('src/data/departmentsData.ts', 'w', encoding='utf-8') as f:
        f.write(dept_ts)

    print("Generated src/data/departmentsData.ts successfully!")
