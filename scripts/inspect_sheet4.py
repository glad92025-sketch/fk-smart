import zipfile, xml.etree.ElementTree as ET, re

with zipfile.ZipFile(r'D:\อบต\รายชื่อพนักงาน.xlsx', 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            text = ''.join(t.text for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
            shared_strings.append(text)
            
    sheet4_tree = ET.fromstring(z.read('xl/worksheets/sheet4.xml'))
    for row in sheet4_tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
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
        if cells.get('A'):
            print(f"{cells.get('A')}: {cells.get('B')} | {cells.get('C')} | {cells.get('D')}")
