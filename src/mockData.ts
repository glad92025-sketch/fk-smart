/**
 * FANGKHAM SMART GOVERNMENT - Initial Seed Data
 * ข้อมูลตั้งต้นสำหรับ องค์การบริหารส่วนตำบลฝางคำ
 */

import {
  Department,
  User,
  Task,
  OfficialDocument,
  CitizenComplaint,
  FieldOperation,
  ProjectItem,
  ProcurementItem,
  AssetRecord,
  StaffMember,
  MeetingItem,
  DepartmentKpi,
  DocumentArchive,
  AuditLogEntry,
  SystemSettings,
  TaskCategory
} from './types';

export const INITIAL_SETTINGS: SystemSettings = {
  orgName: 'องค์การบริหารส่วนตำบลฝางคำ',
  orgTagline: 'ศูนย์บัญชาการและติดตามภารกิจ อบต. แบบครบวงจร (FANGKHAM SMART GOV)',
  address: 'เลขที่ 99 หมู่ที่ 4 ตำบลฝางคำ อำเภอสิรินธร จังหวัดอุบลราชธานี 34350',
  phone: '045-959-111, 045-959-112',
  email: 'contact@fangkham.go.th',
  website: 'www.fangkham.go.th',
  currentFiscalYear: '2569',
  availableFiscalYears: ['2568', '2569', '2570', '2571'],
  autoNotifyUrgent: true,
  themePrimaryColor: '#0f3057',
};

export const INITIAL_CATEGORIES: TaskCategory[] = [
  { id: 'cat_routine', name: 'งานประจำ', icon: 'clipboard' },
  { id: 'cat_policy', name: 'งานตามนโยบาย', icon: 'landmark' },
  { id: 'cat_urgent', name: 'งานเร่งด่วน', icon: 'zap' },
  { id: 'cat_complaint', name: 'งานร้องเรียน/ร้องทุกข์', icon: 'message-square-warning' },
  { id: 'cat_public_service', name: 'งานบริการประชาชน', icon: 'users' },
  { id: 'cat_project', name: 'งานโครงการ', icon: 'folder-kanban' },
  { id: 'cat_procurement', name: 'งานจัดซื้อจัดจ้าง', icon: 'shopping-bag' },
  { id: 'cat_construction', name: 'งานก่อสร้าง/สาธารณูปโภค', icon: 'hard-hat' },
  { id: 'cat_meeting', name: 'งานมติที่ประชุม', icon: 'calendar-check' },
  { id: 'cat_official_letter', name: 'งานหนังสือราชการ', icon: 'file-text' },
  { id: 'cat_council', name: 'งานสภา อบต.', icon: 'award' },
  { id: 'cat_activity', name: 'งานกิจกรรม/ประเพณี', icon: 'sparkles' },
  { id: 'cat_disaster', name: 'งานป้องกันและบรรเทาสาธารณภัย', icon: 'shield-alert' },
  { id: 'cat_other', name: 'งานอื่น ๆ', icon: 'layers' },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept_office',
    code: 'สป',
    name: 'สำนักปลัด อบต.',
    shortName: 'สำนักปลัด',
    headName: 'นายประสิทธิ์ มงคลสุข',
    headPosition: 'หัวหน้าสำนักปลัด (นักบริหารงานทั่วไป ระดับกลาง)',
    memberCount: 14,
    iconName: 'landmark',
    color: '#0284c7', // sky
    divisions: [
      'งานธุรการและสารบรรณ',
      'งานการเจ้าหน้าที่',
      'งานนิติการ',
      'งานป้องกันและบรรเทาสาธารณภัย',
      'งานประชาสัมพันธ์',
      'งานกิจการสภา',
      'งานส่งเสริมการท่องเที่ยว',
      'งานสังคมสงเคราะห์และสวัสดิการ',
      'งานร้องเรียน/ร้องทุกข์'
    ]
  },
  {
    id: 'dept_finance',
    code: 'กค',
    name: 'กองคลัง',
    shortName: 'กองคลัง',
    headName: 'นางสาวจินตนา เพชรสุวรรณ',
    headPosition: 'ผู้อำนวยการกองคลัง (นักบริหารงานการคลัง ระดับกลาง)',
    memberCount: 10,
    iconName: 'wallet',
    color: '#10b981', // emerald
    divisions: [
      'งานการเงินและบัญชี',
      'งานพัสดุและจัดซื้อจัดจ้าง',
      'งานพัฒนารายได้และจัดเก็บภาษี',
      'งานแผนที่ภาษีและทะเบียนทรัพย์สิน',
      'งานงบประมาณ',
      'งานเร่งรัดลูกหนี้'
    ]
  },
  {
    id: 'dept_tech',
    code: 'กช',
    name: 'กองช่าง',
    shortName: 'กองช่าง',
    headName: 'นายสุรชัย วงศ์สว่าง',
    headPosition: 'ผู้อำนวยการกองช่าง (นักบริหารงานช่าง ระดับกลาง)',
    memberCount: 16,
    iconName: 'hard-hat',
    color: '#f59e0b', // amber
    divisions: [
      'งานก่อสร้างและผังเมือง',
      'งานออกแบบและประมาณราคา',
      'งานควบคุมอาคาร',
      'งานไฟฟ้าและสาธารณูปโภค',
      'งานประปา',
      'งานถนนและสะพาน',
      'งานสำรวจ'
    ]
  },
  {
    id: 'dept_edu',
    code: 'กศ',
    name: 'กองการศึกษา ศาสนาและวัฒนธรรม',
    shortName: 'กองการศึกษา',
    headName: 'นางมาลี รัตนโชติ',
    headPosition: 'ผู้อำนวยการกองการศึกษา (นักบริหารงานการศึกษา ระดับกลาง)',
    memberCount: 12,
    iconName: 'graduation-cap',
    color: '#8b5cf6', // purple
    divisions: [
      'งานการศึกษาและโรงเรียนอนุบาล',
      'งานศูนย์พัฒนาเด็กเล็ก (ศพด.)',
      'งานกีฬาและนันทนาการ',
      'งานศาสนา วัฒนธรรม และประเพณีท้องถิ่น',
      'งานส่งเสริมการเรียนรู้และภูมิปัญญาท้องถิ่น'
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_super',
    name: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
    email: 'admin@fangkham.go.th',
    phone: '081-111-2233',
    role: 'super_admin',
    roleTitle: 'Super Administrator',
    departmentId: 'dept_office',
    departmentName: 'สำนักปลัด อบต.',
    position: 'นักวิชาการคอมพิวเตอร์ชำนาญการ',
  },
  {
    id: 'usr_mayor',
    name: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ',
    email: 'mayor@fangkham.go.th',
    phone: '089-999-8877',
    role: 'mayor',
    roleTitle: 'นายก อบต.',
    departmentId: 'dept_office',
    departmentName: 'ผู้บริหาร อบต.ฝางคำ',
    position: 'นายกองค์การบริหารส่วนตำบลฝางคำ',
  },
  {
    id: 'usr_deputy',
    name: 'นายชูชาติ บุญเรือง',
    email: 'deputy1@fangkham.go.th',
    phone: '086-555-4433',
    role: 'deputy_mayor',
    roleTitle: 'รองนายก อบต.',
    departmentId: 'dept_office',
    departmentName: 'ผู้บริหาร อบต.ฝางคำ',
    position: 'รองนายก อบต. ลำดับที่ 1',
  },
  {
    id: 'usr_clerk',
    name: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน',
    email: 'clerk@fangkham.go.th',
    phone: '087-444-1234',
    role: 'clerk',
    roleTitle: 'ปลัด อบต.',
    departmentId: 'dept_office',
    departmentName: 'สำนักปลัด อบต.',
    position: 'ปลัดองค์การบริหารส่วนตำบลฝางคำ',
  },
  {
    id: 'usr_head_tech',
    name: 'นายสุรชัย วงศ์สว่าง',
    email: 'tech.head@fangkham.go.th',
    phone: '081-234-5678',
    role: 'dept_head',
    roleTitle: 'หัวหน้าส่วนราชการ (กองช่าง)',
    departmentId: 'dept_tech',
    departmentName: 'กองช่าง',
    position: 'ผู้อำนวยการกองช่าง',
  },
  {
    id: 'usr_head_finance',
    name: 'นางสาวจินตนา เพชรสุวรรณ',
    email: 'finance.head@fangkham.go.th',
    phone: '082-345-6789',
    role: 'dept_head',
    roleTitle: 'หัวหน้าส่วนราชการ (กองคลัง)',
    departmentId: 'dept_finance',
    departmentName: 'กองคลัง',
    position: 'ผู้อำนวยการกองคลัง',
  },
  {
    id: 'usr_officer_tech',
    name: 'นายสมชาย คำมั่น',
    email: 'somchai.k@fangkham.go.th',
    phone: '083-987-6543',
    role: 'officer',
    roleTitle: 'เจ้าหน้าที่ผู้ปฏิบัติงาน (กองช่าง)',
    departmentId: 'dept_tech',
    departmentName: 'กองช่าง',
    divisionName: 'งานถนนและสะพาน',
    position: 'นายช่างโยธาปฏิบัติงาน',
  },
  {
    id: 'usr_officer_office',
    name: 'นางกานดา สุขเจริญ',
    email: 'kanda.s@fangkham.go.th',
    phone: '084-321-7654',
    role: 'officer',
    roleTitle: 'เจ้าหน้าที่ผู้ปฏิบัติงาน (สำนักปลัด)',
    departmentId: 'dept_office',
    departmentName: 'สำนักปลัด อบต.',
    divisionName: 'งานธุรการและสารบรรณ',
    position: 'เจ้าพนักงานธุรการชำนาญงาน',
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf_1',
    name: 'นายสมชาย คำมั่น',
    position: 'นายช่างโยธาปฏิบัติงาน',
    departmentId: 'dept_tech',
    departmentName: 'กองช่าง',
    divisionName: 'งานถนนและสะพาน',
    phone: '083-987-6543',
    email: 'somchai.k@fangkham.go.th',
    status: 'ลงพื้นที่',
    totalTasks: 25,
    completedTasks: 18,
    inProgressTasks: 5,
    overdueTasks: 2,
    urgentTasks: 3,
    avgCompletionDays: 4.2
  },
  {
    id: 'stf_2',
    name: 'นายธีรพงษ์ ศรีวิชัย',
    position: 'วิศวกรโยธาชำนาญการ',
    departmentId: 'dept_tech',
    departmentName: 'กองช่าง',
    divisionName: 'งานออกแบบและประมาณราคา',
    phone: '085-112-9988',
    email: 'teerapong@fangkham.go.th',
    status: 'ปฏิบัติงาน',
    totalTasks: 19,
    completedTasks: 15,
    inProgressTasks: 3,
    overdueTasks: 1,
    urgentTasks: 2,
    avgCompletionDays: 3.8
  },
  {
    id: 'stf_3',
    name: 'นางกานดา สุขเจริญ',
    position: 'เจ้าพนักงานธุรการชำนาญงาน',
    departmentId: 'dept_office',
    departmentName: 'สำนักปลัด อบต.',
    divisionName: 'งานธุรการและสารบรรณ',
    phone: '084-321-7654',
    email: 'kanda.s@fangkham.go.th',
    status: 'ปฏิบัติงาน',
    totalTasks: 32,
    completedTasks: 28,
    inProgressTasks: 4,
    overdueTasks: 0,
    urgentTasks: 1,
    avgCompletionDays: 1.5
  },
  {
    id: 'stf_4',
    name: 'นิติกร วรวิทย์ แสนสุข',
    position: 'นิติกรปฏิบัติการ',
    departmentId: 'dept_office',
    departmentName: 'สำนักปลัด อบต.',
    divisionName: 'งานนิติการและร้องเรียน',
    phone: '081-778-2231',
    email: 'worawit@fangkham.go.th',
    status: 'ปฏิบัติงาน',
    totalTasks: 14,
    completedTasks: 10,
    inProgressTasks: 3,
    overdueTasks: 1,
    urgentTasks: 2,
    avgCompletionDays: 5.1
  },
  {
    id: 'stf_5',
    name: 'นางสาวพัชรี นวลจันทร์',
    position: 'นักวิชาการพัสดุปฏิบัติการ',
    departmentId: 'dept_finance',
    departmentName: 'กองคลัง',
    divisionName: 'งานพัสดุและจัดซื้อจัดจ้าง',
    phone: '089-663-1122',
    email: 'patcharee@fangkham.go.th',
    status: 'ปฏิบัติงาน',
    totalTasks: 22,
    completedTasks: 17,
    inProgressTasks: 4,
    overdueTasks: 1,
    urgentTasks: 2,
    avgCompletionDays: 3.5
  },
  {
    id: 'stf_6',
    name: 'นางวราภรณ์ มิตรสมาน',
    position: 'นักวิชาการเงินและบัญชีปฏิบัติการ',
    departmentId: 'dept_finance',
    departmentName: 'กองคลัง',
    divisionName: 'งานการเงินและบัญชี',
    phone: '082-998-3344',
    email: 'waraporn@fangkham.go.th',
    status: 'ปฏิบัติงาน',
    totalTasks: 20,
    completedTasks: 19,
    inProgressTasks: 1,
    overdueTasks: 0,
    urgentTasks: 0,
    avgCompletionDays: 2.1
  },
  {
    id: 'stf_7',
    name: 'นายบุญเลิศ เจริญผล',
    position: 'นักวิชาการศึกษาชำนาญการ',
    departmentId: 'dept_edu',
    departmentName: 'กองการศึกษาฯ',
    divisionName: 'งานการศึกษาและ ศพด.',
    phone: '087-332-1199',
    email: 'boonlert@fangkham.go.th',
    status: 'ปฏิบัติงาน',
    totalTasks: 16,
    completedTasks: 12,
    inProgressTasks: 4,
    overdueTasks: 0,
    urgentTasks: 1,
    avgCompletionDays: 3.0
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk_001',
    taskNo: 'กช-2569/0042',
    title: 'ซ่อมแซมถนนคอนกรีตเสริมเหล็กชำรุดทรุดตัว หมู่ 3 บ้านโนนสว่าง',
    categoryId: 'cat_construction',
    categoryName: 'งานก่อสร้าง/สาธารณูปโภค',
    departmentId: 'dept_tech',
    departmentName: 'กองช่าง',
    divisionName: 'งานถนนและสะพาน',
    applicant: 'ประชาชนร้องเรียนผ่านศูนย์ดำรงธรรม อบต. (คำร้อง 69-0018)',
    applicantType: 'citizen',
    assignerName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน (ปลัด อบต.)',
    assigneeId: 'stf_1',
    assigneeName: 'นายสมชาย คำมั่น (นายช่างโยธา)',
    reviewerName: 'นายสุรชัย วงศ์สว่าง (ผอ.กองช่าง)',
    approverName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
    receivedDate: '2026-09-02',
    startDate: '2026-09-03',
    dueDate: '2026-09-10', // 2 days left
    urgency: 'critical',
    status: 'in_progress',
    progress: 65,
    budget: 85000,
    budgetSource: 'งบประมาณรายจ่ายประจำปี 2569 (งบกลาง สำรองจ่ายกรณีฉุกเฉิน)',
    description: 'เนื่องจากมีฝนตกหนักต่อเนื่อง ส่งผลให้ผิวทางคอนกรีตทรุดตัวลึก 30 ซม. ความยาว 15 เมตร กีดขวางการสัญจรของรถรับส่งนักเรียนและรถพยาบาล ต้องเร่งรื้อถอนและเทคอนกรีตเสริมเหล็กบดอัดใหม่โดยด่วน',
    expectedOutcome: 'ถนนกลับมาใช้งานได้ตามปกติ มีความปลอดภัยต่อชีวิตและทรัพย์สินของประชาชน',
    actualOutcome: 'ดำเนินการทุบรื้อผิวทางเดิมและลงหินคลุกบดอัดแน่นแล้วเสร็จ 100% อยู่ระหว่างผูกเหล็กตะแกรงและสั่งคอนกรีตผสมเสร็จ',
    obstacleNotes: 'สภาพอากาศมีฝนตกประปรายช่วงบ่าย ต้องกางเต็นท์คลุมเพื่อรักษาคุณภาพการบดอัด',
    solutionNotes: 'ประสานงานขอรถบรรทุกและเต็นท์จากงานป้องกันฯ เข้ามาช่วยเสริมหน้างาน',
    remarks: 'นายก อบต. สั่งการให้แล้วเสร็จและเปิดทางภายใน 10 ก.ย. 2569',
    fiscalYear: '2569',
    subtasks: [
      { id: 'sub_1', title: 'ลงพื้นที่สำรวจและวัดระยะความเสียหายร่วมกับผู้นำชุมชน', assigneeName: 'นายสมชาย คำมั่น', dueDate: '2026-09-03', completed: true, progress: 100 },
      { id: 'sub_2', title: 'จัดทำแบบประมาณราคา ปร.4 / ปร.5 เสนอขออนุมัติ', assigneeName: 'นายธีรพงษ์ ศรีวิชัย', dueDate: '2026-09-04', completed: true, progress: 100 },
      { id: 'sub_3', title: 'รื้อถอนคอนกรีตแตกหักและบดอัดดินฐานราก', assigneeName: 'นายสมชาย คำมั่น', dueDate: '2026-09-06', completed: true, progress: 100 },
      { id: 'sub_4', title: 'วางเหล็กตะแกรงและเทคอนกรีตเสริมเหล็ก หนา 15 ซม.', assigneeName: 'นายสมชาย คำมั่น', dueDate: '2026-09-08', completed: false, progress: 40 },
      { id: 'sub_5', title: 'ตรวจรับงานและส่งรายงานปิดภารกิจ', assigneeName: 'นายสุรชัย วงศ์สว่าง', dueDate: '2026-09-10', completed: false, progress: 0 },
    ],
    timeline: [
      { id: 'tm_1', timestamp: '2026-09-02 09:15', action: 'รับเรื่องร้องเรียนจากศูนย์ดำรงธรรม', actorName: 'นางกานดา สุขเจริญ', actorRole: 'เจ้าพนักงานธุรการ', details: 'ลงบันทึกรับคำร้องเลขที่ 69-0018' },
      { id: 'tm_2', timestamp: '2026-09-02 10:30', action: 'ปลัดมอบหมายภารกิจเร่งด่วน', actorName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน', actorRole: 'ปลัด อบต.', details: 'ส่งต่อให้กองช่างเข้าตรวจสอบทันทีภายใน 24 ชม.' },
      { id: 'tm_3', timestamp: '2026-09-02 11:15', action: 'หัวหน้ากองช่างมอบหมายงาน', actorName: 'นายสุรชัย วงศ์สว่าง', actorRole: 'ผอ.กองช่าง', details: 'มอบหมายนายช่างสมชาย คำมั่น เป็นผู้รับผิดชอบหลัก' },
      { id: 'tm_4', timestamp: '2026-09-03 14:00', action: 'ลงพื้นที่ตรวจวัดและประเมินงบประมาณ', actorName: 'นายสมชาย คำมั่น', actorRole: 'นายช่างโยธา', details: 'ถ่ายภาพก่อนดำเนินการและสรุปงบ 85,000 บาท' },
      { id: 'tm_5', timestamp: '2026-09-06 16:30', action: 'อัปเดตความคืบหน้างาน 65%', actorName: 'นายสมชาย คำมั่น', actorRole: 'นายช่างโยธา', details: 'บดอัดหินคลุกฐานรากเสร็จสิ้น ผูกเหล็กตะแกรงรอเทปูน' },
    ],
    comments: [
      { id: 'cmt_1', authorName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ', authorRole: 'นายก อบต.', timestamp: '2026-09-03 08:30', message: 'กำชับเรื่องป้ายเตือนไฟกะพริบเวลากลางคืนด้วยนะครับ ความปลอดภัยของพี่น้องประชาชนสำคัญที่สุด', isOfficialNote: true },
      { id: 'cmt_2', authorName: 'นายสมชาย คำมั่น', authorRole: 'นายช่างโยธา', timestamp: '2026-09-03 11:00', message: 'ติดตั้งแผงกั้นพร้อมไฟกะพริบโซล่าเซลล์เตือนล่วงหน้า 50 เมตรเรียบร้อยครับผม' }
    ],
    attachments: [
      { id: 'att_1', name: 'รูปถ่ายถนนทรุดก่อนดำเนินการ_ม3.jpg', size: '2.4 MB', uploadedAt: '2026-09-03', uploaderName: 'นายสมชาย คำมั่น', type: 'image' },
      { id: 'att_2', name: 'ใบประมาณราคา_ปร4_ถนนชำรุด.pdf', size: '1.1 MB', uploadedAt: '2026-09-04', uploaderName: 'นายธีรพงษ์ ศรีวิชัย', type: 'pdf' }
    ],
    linkedComplaintId: 'cmp_001'
  },
  {
    id: 'tsk_002',
    taskNo: 'สป-2569/0105',
    title: 'เตรียมการจัดประชุมสภา อบต. สมัยสามัญ สมัยที่ 3 ประจำปี 2569',
    categoryId: 'cat_council',
    categoryName: 'งานสภา อบต.',
    departmentId: 'dept_office',
    departmentName: 'สำนักปลัด อบต.',
    divisionName: 'งานกิจการสภา',
    applicant: 'ประธานสภา อบต.ฝางคำ',
    applicantType: 'order',
    assignerName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน (ปลัด อบต.)',
    assigneeId: 'stf_3',
    assigneeName: 'นางกานดา สุขเจริญ (เจ้าพนักงานธุรการ)',
    reviewerName: 'นายประสิทธิ์ มงคลสุข (หัวหน้าสำนักปลัด)',
    approverName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
    receivedDate: '2026-08-28',
    startDate: '2026-09-01',
    dueDate: '2026-09-09', // tomorrow / today
    urgency: 'urgent',
    status: 'pending_review',
    progress: 90,
    budget: 25000,
    budgetSource: 'งบดำเนินงาน สำนักปลัด',
    description: 'จัดทำหนังสือเชิญประชุมสภาฯ นัดประชุมญัตติร่างข้อบัญญัติงบประมาณรายจ่ายประจำปี 2570 วาระที่ 1 และจัดเตรียมระเบียบวาระ อาหาร เครื่องดื่ม บันทึกการประชุม',
    expectedOutcome: 'การประชุมสภาดำเนินการถูกต้องตามระเบียบกระทรวงมหาดไทยว่าด้วยข้อบังคับการประชุมสภาท้องถิ่น',
    actualOutcome: 'จัดส่งหนังสือเชิญประชุมให้ ส.อบต. ครบทั้ง 14 ท่านแล้ว จัดพิมพ์ระเบียบวาระการประชุมเรียบร้อย รอหัวหน้าสำนักปลัดตรวจสอบความถูกต้องรอบสุดท้าย',
    fiscalYear: '2569',
    subtasks: [
      { id: 'sub_201', title: 'ร่างหนังสือเชิญประชุมและระเบียบวาระ', assigneeName: 'นางกานดา สุขเจริญ', dueDate: '2026-09-02', completed: true, progress: 100 },
      { id: 'sub_202', title: 'จัดส่งหนังสือเชิญประชุมพร้อมเอกสารประกอบ', assigneeName: 'นางกานดา สุขเจริญ', dueDate: '2026-09-04', completed: true, progress: 100 },
      { id: 'sub_203', title: 'จัดเตรียมห้องประชุม อุปกรณ์ถ่ายทอดสด และบันทึกเสียง', assigneeName: 'นายประสิทธิ์ มงคลสุข', dueDate: '2026-09-08', completed: true, progress: 100 },
      { id: 'sub_204', title: 'สรุปรายชื่อผู้เข้าร่วมและจัดทำเอกสารลงทะเบียน', assigneeName: 'นางกานดา สุขเจริญ', dueDate: '2026-09-09', completed: false, progress: 80 }
    ],
    timeline: [
      { id: 'tm_201', timestamp: '2026-08-28 10:00', action: 'รับหนังสือสั่งการจากประธานสภาฯ', actorName: 'นางกานดา สุขเจริญ', actorRole: 'เจ้าหน้าที่' },
      { id: 'tm_202', timestamp: '2026-09-01 11:30', action: 'ร่างระเบียบวาระการประชุม', actorName: 'นางกานดา สุขเจริญ', actorRole: 'เจ้าหน้าที่' },
      { id: 'tm_203', timestamp: '2026-09-07 15:00', action: 'ส่งตรวจทานเอกสารประกอบระเบียบวาระ', actorName: 'นางกานดา สุขเจริญ', actorRole: 'เจ้าหน้าที่', details: 'ส่งเรื่องให้นายประสิทธิ์ มงคลสุข ตรวจสอบ' }
    ],
    comments: [
      { id: 'cmt_201', authorName: 'นายประสิทธิ์ มงคลสุข', authorRole: 'หัวหน้าสำนักปลัด', timestamp: '2026-09-07 16:30', message: 'ตรวจสอบระเบียบวาระที่ 3 เรื่องร่างงบประมาณ 2570 ตรวจสอบตัวเลขกับกองคลังให้ตรงกันแล้ว ถูกต้องครับ' }
    ],
    attachments: [
      { id: 'att_201', name: 'ระเบียบวาระการประชุมสภา_สมัย3_2569.pdf', size: '850 KB', uploadedAt: '2026-09-07', uploaderName: 'นางกานดา สุขเจริญ', type: 'pdf' }
    ]
  },
  {
    id: 'tsk_003',
    taskNo: 'กค-2569/0088',
    title: 'จัดซื้อจัดจ้างโครงการติดตั้งโคมไฟส่องสว่างพลังงานแสงอาทิตย์ (Solar Cell) หมู่ 1-8',
    categoryId: 'cat_procurement',
    categoryName: 'งานจัดซื้อจัดจ้าง',
    departmentId: 'dept_finance',
    departmentName: 'กองคลัง',
    divisionName: 'งานพัสดุและจัดซื้อจัดจ้าง',
    applicant: 'ข้อบัญญัติงบประมาณรายจ่ายประจำปี 2569 (กองคลัง ร่วมกับ กองช่าง)',
    applicantType: 'internal',
    assignerName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน (ปลัด อบต.)',
    assigneeId: 'stf_5',
    assigneeName: 'นางสาวพัชรี นวลจันทร์ (นักวิชาการพัสดุ)',
    reviewerName: 'นางสาวจินตนา เพชรสุวรรณ (ผอ.กองคลัง)',
    approverName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
    receivedDate: '2026-08-15',
    startDate: '2026-08-20',
    dueDate: '2026-09-25',
    urgency: 'normal',
    status: 'in_progress',
    progress: 50,
    budget: 498000,
    budgetSource: 'เงินอุดหนุนเฉพาะกิจเพื่อการพัฒนาโครงสร้างพื้นฐาน',
    description: 'ดำเนินการประกวดราคาอิเล็กทรอนิกส์ (e-Bidding) ติดตั้งเสาไฟโซล่าเซลล์ความสูง 6 เมตร กำลังไฟ 300 วัตต์ จำนวน 80 จุด ครอบคลุมถนนสายหลักและจุดเสี่ยงอันตราย 8 หมู่บ้าน',
    expectedOutcome: 'เพิ่มความปลอดภัย ลดอุบัติเหตุและป้องกันอาชญากรรมในเวลากลางคืน',
    actualOutcome: 'ประกาศเผยแพร่ร่าง TOR และประกาศเชิญชวนบนระบบ e-GP ของกรมบัญชีกลางเรียบร้อย อยู่ระหว่างเปิดรับข้อเสนอราคา',
    fiscalYear: '2569',
    subtasks: [
      { id: 'sub_301', title: 'แต่งตั้งคณะกรรมการกำหนดร่าง TOR และราคากลาง', assigneeName: 'นางสาวพัชรี นวลจันทร์', dueDate: '2026-08-20', completed: true, progress: 100 },
      { id: 'sub_302', title: 'ประกาศร่าง TOR รับฟังคำวิจารณ์ 3 วันทำการ', assigneeName: 'นางสาวพัชรี นวลจันทร์', dueDate: '2026-08-28', completed: true, progress: 100 },
      { id: 'sub_303', title: 'ออกประกาศเชิญชวน e-Bidding บนระบบ e-GP', assigneeName: 'นางสาวพัชรี นวลจันทร์', dueDate: '2026-09-04', completed: true, progress: 100 },
      { id: 'sub_304', title: 'เปิดซองและพิจารณาผลการเสนอราคา', assigneeName: 'คณะกรรมการพิจารณาผล', dueDate: '2026-09-18', completed: false, progress: 0 },
      { id: 'sub_305', title: 'จัดทำสัญญาและแจ้งให้ผู้รับจ้างเข้าดำเนินการ', assigneeName: 'นางสาวพัชรี นวลจันทร์', dueDate: '2026-09-25', completed: false, progress: 0 }
    ],
    timeline: [
      { id: 'tm_301', timestamp: '2026-08-15 09:00', action: 'บันทึกขออนุมัติดำเนินการจัดซื้อจัดจ้าง', actorName: 'นางสาวพัชรี นวลจันทร์', actorRole: 'เจ้าหน้าที่พัสดุ' },
      { id: 'tm_302', timestamp: '2026-08-18 14:00', action: 'นายก อบต. อนุมัติแต่งตั้งคณะกรรมการ', actorName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ', actorRole: 'นายก อบต.' },
      { id: 'tm_303', timestamp: '2026-09-04 10:00', action: 'ประกาศประกวดราคา e-Bidding เลขที่ e-GP 69090014', actorName: 'นางสาวพัชรี นวลจันทร์', actorRole: 'เจ้าหน้าที่พัสดุ' }
    ],
    comments: [],
    attachments: [
      { id: 'att_301', name: 'TOR_เสาไฟโซล่าเซลล์_อบตฝางคำ.pdf', size: '3.2 MB', uploadedAt: '2026-08-28', uploaderName: 'นางสาวพัชรี นวลจันทร์', type: 'pdf' }
    ],
    linkedProjectId: 'prj_002'
  },
  {
    id: 'tsk_004',
    taskNo: 'กศ-2569/0034',
    title: 'โครงการส่งเสริมการเรียนรู้เด็กปฐมวัยและพัฒนาโภชนาการ ศพด. อบต.ฝางคำ',
    categoryId: 'cat_policy',
    categoryName: 'งานตามนโยบาย',
    departmentId: 'dept_edu',
    departmentName: 'กองการศึกษา ศาสนาและวัฒนธรรม',
    divisionName: 'งานศูนย์พัฒนาเด็กเล็ก (ศพด.)',
    applicant: 'นโยบายยกระดับคุณภาพชีวิตเด็กและสตรี นายก อบต.',
    applicantType: 'order',
    assignerName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
    assigneeId: 'stf_7',
    assigneeName: 'นายบุญเลิศ เจริญผล (นักวิชาการศึกษา)',
    reviewerName: 'นางมาลี รัตนโชติ (ผอ.กองการศึกษา)',
    approverName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน (ปลัด อบต.)',
    receivedDate: '2026-08-10',
    startDate: '2026-08-15',
    dueDate: '2026-09-05', // overdue by 3 days!
    urgency: 'critical',
    status: 'overdue',
    progress: 75,
    budget: 120000,
    budgetSource: 'เงินอุดหนุนสำหรับการจัดการศึกษาปฐมวัย',
    description: 'จัดอบรมพัฒนาศักยภาพครูผู้ดูแลเด็ก การจัดซื้อสื่อส่งเสริมทักษะ EF (Executive Functions) และการตรวจประเมินภาวะโภชนาการเด็กปฐมวัย 120 คน',
    expectedOutcome: 'เด็กปฐมวัยมีพัฒนาการสมวัยทั้ง 4 ด้าน และได้รับอาหารตามหลักโภชนาการ 100%',
    actualOutcome: 'จัดอบรมและตรวจสุขภาพเด็กแล้วเสร็จ อยู่ระหว่างรวบรวมใบเสร็จและสรุปรายงานประเมินผลโครงการล่าช้าเนื่องจากรอผลตรวจจาก รพ.สต.',
    obstacleNotes: 'โรงพยาบาลส่งเสริมสุขภาพตำบลติดภารกิจรณรงค์วัคซีนไข้หวัดใหญ่ ทำให้ส่งมอบผลรายงานตรวจสุขภาพล่าช้ากว่ากำหนด 3 วัน',
    solutionNotes: 'ประสานงานเร่งรัดและส่งเจ้าหน้าที่ไปรับเอกสารผลตรวจที่ รพ.สต. ในช่วงเช้าวันนี้',
    fiscalYear: '2569',
    subtasks: [
      { id: 'sub_401', title: 'จัดทำโครงการและขออนุมัติงบประมาณ', assigneeName: 'นายบุญเลิศ เจริญผล', dueDate: '2026-08-12', completed: true, progress: 100 },
      { id: 'sub_402', title: 'จัดซื้อสื่อการเรียนการสอนส่งเสริม EF 4 ชุด', assigneeName: 'นายบุญเลิศ เจริญผล', dueDate: '2026-08-20', completed: true, progress: 100 },
      { id: 'sub_403', title: 'จัดกิจกรรมตรวจพัฒนาการและภาวะโภชนาการ', assigneeName: 'ครู ศพด. ร่วมกับ รพ.สต.', dueDate: '2026-08-30', completed: true, progress: 100 },
      { id: 'sub_404', title: 'รวบรวมรายงานและเบิกจ่ายงบประมาณ', assigneeName: 'นายบุญเลิศ เจริญผล', dueDate: '2026-09-05', completed: false, progress: 40 }
    ],
    timeline: [
      { id: 'tm_401', timestamp: '2026-08-10 13:00', action: 'อนุมัติโครงการ', actorName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ', actorRole: 'นายก อบต.' },
      { id: 'tm_402', timestamp: '2026-08-25 09:30', action: 'จัดกิจกรรมตรวจสุขภาพเด็ก 120 คน', actorName: 'นายบุญเลิศ เจริญผล', actorRole: 'นักวิชาการศึกษา' },
      { id: 'tm_403', timestamp: '2026-09-06 08:30', action: 'ระบบตรวจพบงานเกินกำหนด 1 วัน', actorName: 'ระบบแจ้งเตือนอัตโนมัติ', actorRole: 'System' }
    ],
    comments: [
      { id: 'cmt_401', authorName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน', authorRole: 'ปลัด อบต.', timestamp: '2026-09-06 09:00', message: 'คุณบุญเลิศช่วยเร่งรวบรวมเอกสารเบิกจ่ายให้เสร็จภายในสัปดาห์นี้นะครับ ใกล้ปิดงวดงบประมาณแล้ว', isOfficialNote: true }
    ],
    attachments: [
      { id: 'att_401', name: 'รายงานกิจกรรมตรวจโภชนาการเด็กปฐมวัย_2569.pdf', size: '4.5 MB', uploadedAt: '2026-09-01', uploaderName: 'นายบุญเลิศ เจริญผล', type: 'pdf' }
    ]
  },
  {
    id: 'tsk_005',
    taskNo: 'สป-2569/0112',
    title: 'โครงการฝึกซ้อมแผนป้องกันและบรรเทาสาธารณภัย (อัคคีภัยและวาตภัย) ประจำปี 2569',
    categoryId: 'cat_disaster',
    categoryName: 'งานป้องกันและบรรเทาสาธารณภัย',
    departmentId: 'dept_office',
    departmentName: 'สำนักปลัด อบต.',
    divisionName: 'งานป้องกันและบรรเทาสาธารณภัย',
    applicant: 'แผนงานรักษาความสงบภายใน อบต.ฝางคำ',
    applicantType: 'internal',
    assignerName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน (ปลัด อบต.)',
    assigneeId: 'stf_3',
    assigneeName: 'นางกานดา สุขเจริญ (ประสานงาน)',
    reviewerName: 'นายประสิทธิ์ มงคลสุข (หัวหน้าสำนักปลัด)',
    approverName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
    receivedDate: '2026-08-01',
    startDate: '2026-08-05',
    dueDate: '2026-08-30',
    completedDate: '2026-08-29',
    urgency: 'normal',
    status: 'closed',
    progress: 100,
    budget: 45000,
    budgetSource: 'งบประมาณรายจ่ายประจำปี 2569 (งานป้องกันฯ)',
    description: 'จัดฝึกอบรมเชิงปฏิบัติการการใช้อุปกรณ์ดับเพลิง การอพยพหนีไฟในชุมชน และการกู้ชีพขั้นพื้นฐานให้แก่ อปพร. ผู้นำชุมชน และเยาวชนในพื้นที่ 50 คน',
    expectedOutcome: 'บุคลากร อปพร. และประชาชนมีความรู้ความพร้อมในการเผชิญเหตุสาธารณภัยอย่างทันท่วงที',
    actualOutcome: 'ดำเนินการฝึกซ้อมสำเร็จเรียบร้อย มีผู้เข้าร่วม 58 คน ผ่านเกณฑ์ทดสอบ 100% เบิกจ่ายงบประมาณครบถ้วน',
    fiscalYear: '2569',
    subtasks: [
      { id: 'sub_501', title: 'จัดทำแผนและกำหนดการฝึกซ้อม', assigneeName: 'งานป้องกันฯ', dueDate: '2026-08-05', completed: true, progress: 100 },
      { id: 'sub_502', title: 'ประสานวิทยากรจากสำนักงาน ปภ. จังหวัด', assigneeName: 'นางกานดา สุขเจริญ', dueDate: '2026-08-10', completed: true, progress: 100 },
      { id: 'sub_503', title: 'ดำเนินการฝึกซ้อมภาคทฤษฎีและภาคปฏิบัติเสมือนจริง', assigneeName: 'ทีมวิทยากรและงานป้องกันฯ', dueDate: '2026-08-25', completed: true, progress: 100 },
      { id: 'sub_504', title: 'สรุปผลและส่งรายงานปิดโครงการต่อนายก อบต.', assigneeName: 'นายประสิทธิ์ มงคลสุข', dueDate: '2026-08-29', completed: true, progress: 100 }
    ],
    timeline: [
      { id: 'tm_501', timestamp: '2026-08-01 09:00', action: 'อนุมัติแผนโครงการ', actorName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ', actorRole: 'นายก อบต.' },
      { id: 'tm_502', timestamp: '2026-08-25 16:00', action: 'เสร็จสิ้นการฝึกซ้อมภาคปฏิบัติ', actorName: 'ทีมงานป้องกันฯ', actorRole: 'เจ้าหน้าที่' },
      { id: 'tm_503', timestamp: '2026-08-29 14:00', action: 'ปิดงานภารกิจสมบูรณ์', actorName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ', actorRole: 'นายก อบต.' }
    ],
    comments: [],
    attachments: [
      { id: 'att_501', name: 'รายงานสรุปผลการฝึกซ้อมแผนดับเพลิง_อบตฝางคำ.pdf', size: '6.8 MB', uploadedAt: '2026-08-29', uploaderName: 'นายประสิทธิ์ มงคลสุข', type: 'pdf' }
    ]
  },
  {
    id: 'tsk_006',
    taskNo: 'กช-2569/0055',
    title: 'ขยายเขตท่อประปาส่วนต่อขยายและติดตั้งมาตรวัดน้ำ หมู่ 5 บ้านดอนชี',
    categoryId: 'cat_construction',
    categoryName: 'งานก่อสร้าง/สาธารณูปโภค',
    departmentId: 'dept_tech',
    departmentName: 'กองช่าง',
    divisionName: 'งานประปา',
    applicant: 'ผู้ใหญ่บ้าน หมู่ที่ 5 และประชาชนผู้ใช้น้ำ',
    applicantType: 'citizen',
    assignerName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน (ปลัด อบต.)',
    assigneeId: 'stf_1',
    assigneeName: 'นายสมชาย คำมั่น (นายช่างโยธา)',
    reviewerName: 'นายสุรชัย วงศ์สว่าง (ผอ.กองช่าง)',
    approverName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
    receivedDate: '2026-09-04',
    startDate: '2026-09-06',
    dueDate: '2026-09-18', // 10 days left
    urgency: 'normal',
    status: 'assigned',
    progress: 20,
    budget: 68000,
    budgetSource: 'เงินรายได้ อบต.ฝางคำ (กองทุนกิจการประปา)',
    description: 'วางท่อ PVC ขนาด 2 นิ้ว ชั้น 8.5 ระยะทาง 650 เมตร เพื่อจ่ายน้ำประปาสะอาดให้แก่ครัวเรือนที่ขยายใหม่ 18 ครัวเรือน',
    expectedOutcome: 'ประชาชนมีน้ำประปาสะอาดได้มาตรฐานอุปโภคบริโภคครบทุกครัวเรือน',
    fiscalYear: '2569',
    subtasks: [
      { id: 'sub_601', title: 'สำรวจแนวท่อและกำหนดจุดวางมาตรน้ำ', assigneeName: 'นายสมชาย คำมั่น', dueDate: '2026-09-07', completed: true, progress: 100 },
      { id: 'sub_602', title: 'จัดซื้อท่อ PVC และอุปกรณ์ข้อต่อ', assigneeName: 'งานพัสดุกองช่าง', dueDate: '2026-09-11', completed: false, progress: 0 },
      { id: 'sub_603', title: 'ขุดร่องวางท่อและประสานรอยต่อ', assigneeName: 'ทีมงานประปา', dueDate: '2026-09-15', completed: false, progress: 0 },
      { id: 'sub_604', title: 'ทดสอบแรงดันน้ำและกลบดินคืนสภาพ', assigneeName: 'นายสมชาย คำมั่น', dueDate: '2026-09-18', completed: false, progress: 0 }
    ],
    timeline: [
      { id: 'tm_601', timestamp: '2026-09-04 14:20', action: 'ลงทะเบียนรับเรื่อง', actorName: 'งานธุรการกองช่าง', actorRole: 'เจ้าหน้าที่' },
      { id: 'tm_602', timestamp: '2026-09-05 10:00', action: 'ผอ.กองช่างมอบหมายงาน', actorName: 'นายสุรชัย วงศ์สว่าง', actorRole: 'ผอ.กองช่าง' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk_007',
    taskNo: 'กค-2569/0095',
    title: 'โครงการเร่งรัดจัดเก็บภาษีที่ดินและสิ่งปลูกสร้าง ประจำปีภาษี 2569',
    categoryId: 'cat_routine',
    categoryName: 'งานประจำ',
    departmentId: 'dept_finance',
    departmentName: 'กองคลัง',
    divisionName: 'งานพัฒนารายได้และจัดเก็บภาษี',
    applicant: 'แผนปฏิบัติการจัดเก็บรายได้ กองคลัง',
    applicantType: 'internal',
    assignerName: 'นางสาวจินตนา เพชรสุวรรณ (ผอ.กองคลัง)',
    assigneeId: 'stf_6',
    assigneeName: 'นางวราภรณ์ มิตรสมาน (นักวิชาการเงิน)',
    reviewerName: 'นางสาวจินตนา เพชรสุวรรณ (ผอ.กองคลัง)',
    approverName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน (ปลัด อบต.)',
    receivedDate: '2026-07-01',
    startDate: '2026-07-15',
    dueDate: '2026-09-15', // 7 days left
    urgency: 'urgent',
    status: 'in_progress',
    progress: 85,
    budget: 15000,
    budgetSource: 'งบดำเนินงาน กองคลัง',
    description: 'ออกหนังสือแจ้งเตือนผู้ค้างชำระภาษีที่ดินและสิ่งปลูกสร้าง พร้อมลงพื้นที่อำนวยความสะดวกรับชำระภาษีนอกสถานที่ใน 8 หมู่บ้าน',
    expectedOutcome: 'จัดเก็บรายได้เข้า อบต. ไม่น้อยกว่า 92% ของยอดประเมิน',
    fiscalYear: '2569',
    subtasks: [
      { id: 'sub_701', title: 'จัดทำบัญชีรายชื่อผู้ค้างชำระภาษี ภ.ด.ส.6', assigneeName: 'นางวราภรณ์ มิตรสมาน', dueDate: '2026-07-25', completed: true, progress: 100 },
      { id: 'sub_702', title: 'ออกหนังสือแจ้งเตือนชำระภาษีทางไปรษณีย์', assigneeName: 'นางวราภรณ์ มิตรสมาน', dueDate: '2026-08-10', completed: true, progress: 100 },
      { id: 'sub_703', title: 'ลงพื้นที่รับชำระภาษีเคลื่อนที่ 8 หมู่บ้าน', assigneeName: 'ทีมพัฒนารายได้', dueDate: '2026-09-10', completed: true, progress: 100 },
      { id: 'sub_704', title: 'สรุปยอดรายรับและรายงานนายก อบต.', assigneeName: 'นางสาวจินตนา เพชรสุวรรณ', dueDate: '2026-09-15', completed: false, progress: 40 }
    ],
    timeline: [
      { id: 'tm_701', timestamp: '2026-07-15 09:00', action: 'เริ่มต้นแผนงานเร่งรัดจัดเก็บภาษี', actorName: 'นางสาวจินตนา เพชรสุวรรณ', actorRole: 'ผอ.กองคลัง' },
      { id: 'tm_702', timestamp: '2026-09-02 16:00', action: 'ยอดจัดเก็บทะลุ 85% ของเป้าหมาย', actorName: 'นางวราภรณ์ มิตรสมาน', actorRole: 'เจ้าหน้าที่' }
    ],
    comments: [],
    attachments: []
  }
];

export const INITIAL_DOCUMENTS: OfficialDocument[] = [
  {
    id: 'doc_in_01',
    docType: 'incoming',
    docNo: 'อบ 0023.3/ว 2841',
    regNo: '0412/2569',
    date: '2026-09-03',
    fromSource: 'สำนักงานส่งเสริมการปกครองท้องถิ่นจังหวัดอุบลราชธานี',
    toTarget: 'นายกองค์การบริหารส่วนตำบลฝางคำ',
    subject: 'การจัดสรรงบประมาณเงินอุดหนุนสำหรับการจัดการศึกษาขั้นพื้นฐาน ประจำไตรมาสที่ 4',
    departmentId: 'dept_edu',
    assigneeName: 'นางมาลี รัตนโชติ (ผอ.กองการศึกษา)',
    dueDate: '2026-09-15',
    status: 'processing',
    fileName: 'หนังสือจัดสรรงบการศึกษา_ไตรมาส4.pdf',
    linkedTaskId: 'tsk_004',
    fiscalYear: '2569'
  },
  {
    id: 'doc_in_02',
    docType: 'incoming',
    docNo: 'อบ 0518/1429',
    regNo: '0415/2569',
    date: '2026-09-05',
    fromSource: 'ที่ว่าการอำเภอสิรินธร',
    toTarget: 'นายกองค์การบริหารส่วนตำบลฝางคำ',
    subject: 'แจ้งเตือนสถานการณ์น้ำในอ่างเก็บน้ำและเฝ้าระวังพื้นที่เสี่ยงอุทกภัยริมแม่น้ำมูล',
    departmentId: 'dept_office',
    assigneeName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน (ปลัด อบต.)',
    dueDate: '2026-09-08',
    status: 'processing',
    fileName: 'แจ้งเตือนเฝ้าระวังน้ำหลาก_สิรินธร.pdf',
    linkedTaskId: 'tsk_005',
    fiscalYear: '2569'
  },
  {
    id: 'doc_out_01',
    docType: 'outgoing',
    docNo: 'อบ 73501/298',
    regNo: '0289/2569',
    date: '2026-09-06',
    fromSource: 'องค์การบริหารส่วนตำบลฝางคำ',
    toTarget: 'สำนักงานพัฒนาชุมชนอำเภอสิรินธร',
    subject: 'ส่งรายงานสรุปผลการจัดโครงการฝึกอบรมกลุ่มอาชีพสตรีทอผ้าพื้นเมือง ประจำปี 2569',
    departmentId: 'dept_office',
    assigneeName: 'นางกานดา สุขเจริญ',
    status: 'completed',
    fileName: 'รายงานกลุ่มอาชีพทอผ้า_ส่งอำเภอ.pdf',
    fiscalYear: '2569'
  }
];

export const INITIAL_COMPLAINTS: CitizenComplaint[] = [
  {
    id: 'cmp_001',
    ticketNo: 'ร้องเรียน-69-0018',
    date: '2026-09-02 08:45',
    citizenName: 'นายประเสริฐ สว่างทวีป',
    citizenPhone: '089-123-4567',
    category: 'road',
    categoryLabel: 'ถนนชำรุด',
    location: 'ทางแยกเข้าหมู่บ้านโนนสว่าง หน้าศาลาประชาคม',
    villageNo: '3',
    coordinates: '15.1845, 105.3211',
    description: 'ถนนคอนกรีตทรุดตัวแตกร้าวเป็นหลุมลึก รถจักรยานยนต์เกือบล้มหลายคัน ขอให้ช่วยส่งช่างมาซ่อมแซมเร่งด่วน',
    departmentId: 'dept_tech',
    assignedOfficer: 'นายสมชาย คำมั่น (นายช่างโยธา)',
    step: 4, // 1:รับเรื่อง 2:มอบหมาย 3:ลงพื้นที่ 4:ดำเนินการ 5:แนบรูป 6:รายงานผล 7:ปิดเรื่อง
    status: 'in_progress',
    photoBefore: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    photoAfter: '',
    solutionSummary: 'กองช่างส่งเครื่องจักรและกำลังคนเข้าขุดบดอัดหินคลุกแล้ว รอเทคอนกรีต',
    linkedTaskId: 'tsk_001',
    fiscalYear: '2569'
  },
  {
    id: 'cmp_002',
    ticketNo: 'ร้องเรียน-69-0019',
    date: '2026-09-04 11:20',
    citizenName: 'นางบัวลอย ศรีโสภา',
    citizenPhone: '081-456-7890',
    category: 'electricity',
    categoryLabel: 'ไฟฟ้าสาธารณะดับ',
    location: 'ริมถนนสายฝางคำ-ดอนชี ตรงข้ามโรงสีข้าวชุมชน',
    villageNo: '5',
    coordinates: '15.1912, 105.3340',
    description: 'โคมไฟส่องสว่างดับมา 3 คืน มืดมาก เสี่ยงต่อการเกิดอุบัติเหตุ',
    departmentId: 'dept_tech',
    assignedOfficer: 'นายสมชาย คำมั่น',
    step: 3, // ลงพื้นที่
    status: 'assigned',
    solutionSummary: 'จัดเตรียมชุดหลอดไฟ LED และหม้อแปลงสำรองเข้าตรวจสอบในช่วงบ่าย',
    fiscalYear: '2569'
  },
  {
    id: 'cmp_003',
    ticketNo: 'ร้องเรียน-69-0015',
    date: '2026-08-28 14:10',
    citizenName: 'นายคำดี ภูศรี',
    citizenPhone: '086-778-8990',
    category: 'water',
    categoryLabel: 'น้ำประปาไหลอ่อน/ไม่ไหล',
    location: 'ซอยร่วมใจพัฒนา หมู่ 2',
    villageNo: '2',
    coordinates: '15.1790, 105.3120',
    description: 'น้ำประปาไม่ไหลช่วง 17.00 - 21.00 น. ขอให้ตรวจสอบเครื่องสูบน้ำ',
    departmentId: 'dept_tech',
    assignedOfficer: 'ทีมงานประปา อบต.',
    step: 7, // ปิดเรื่อง
    status: 'closed',
    solutionSummary: 'ตรวจพบวาล์วดักลมหน้าปั๊มอุดตัน ได้ล้างทำความสะอาดและปรับแรงดันส่งน้ำปกติแล้ว',
    fiscalYear: '2569'
  }
];

export const INITIAL_FIELD_OPS: FieldOperation[] = [
  {
    id: 'fld_01',
    opNo: 'กช-ลพ-69-0024',
    date: '2026-09-03',
    title: 'สำรวจและตรวจวัดระดับถนนคอนกรีตทรุดตัว หมู่ 3 บ้านโนนสว่าง',
    location: 'ทางหลวงท้องถิ่น สายบ้านโนนสว่าง',
    village: 'หมู่ที่ 3',
    coordinates: '15.1845, 105.3211',
    officers: ['นายสมชาย คำมั่น', 'นายธีรพงษ์ ศรีวิชัย', 'นายวิชัย คนขับรถ'],
    vehicleNo: 'บย-4512 อุบลราชธานี (รถกระบะตรวจการกองช่าง)',
    objective: 'ตรวจสอบความเสียหายของผิวทางคอนกรีต ประเมินปริมาณงานเพื่อจัดทำแบบประมาณราคา',
    description: 'ลงพื้นที่ร่วมกับนายสมควร ใจตรง ผู้ใหญ่บ้านหมู่ที่ 3 พบว่าใต้ผิวคอนกรีตมีน้ำใต้ดินกัดเซาะเป็นโพรง จำเป็นต้องรื้อถอนบดอัดหินคลุกหนา 20 ซม. แล้วเทคอนกรีตหนา 15 ซม.',
    results: 'ได้ข้อมูลระยะทาง ขนาดความกว้าง-ยาว และจัดทำแบบรูปรายการ ปร.4 เสนอ ผอ.กองช่าง เรียบร้อย',
    status: 'completed',
    departmentId: 'dept_tech',
    fiscalYear: '2569'
  },
  {
    id: 'fld_02',
    opNo: 'สป-ลพ-69-0031',
    date: '2026-09-07',
    title: 'ลงพื้นที่เยี่ยมบ้านผู้สูงอายุภาวะพึ่งพิงและมอบสิ่งของยังชีพ หมู่ 4',
    location: 'บ้านดงบัง หมู่ที่ 4',
    village: 'หมู่ที่ 4',
    coordinates: '15.1950, 105.3410',
    officers: ['นายประสิทธิ์ มงคลสุข', 'นางกานดา สุขเจริญ', 'อสม. ประจำหมู่บ้าน'],
    vehicleNo: 'นข-1234 อุบลราชธานี (รถตู้บริการสาธารณะ อบต.)',
    objective: 'ตรวจเยี่ยมติดตามคุณภาพชีวิตผู้ป่วยติดเตียงและผู้พิการตามโครงการกองทุน สปสช. อบต.ฝางคำ',
    description: 'มอบถุงยังชีพ แพมเพิส และตรวจวัดความดันโลหิตเบื้องต้นจำนวน 6 ราย',
    results: 'ส่งต่อข้อมูลให้ รพ.สต. เพื่อดูแลต่อเนื่องด้านกายภาพบำบัด',
    status: 'completed',
    departmentId: 'dept_office',
    fiscalYear: '2569'
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'prj_001',
    code: 'PRJ-69-01',
    name: 'โครงการก่อสร้างระบบประปาผิวดินขนาดใหญ่ กำลังการผลิต 10 ลบ.ม./ชม. หมู่ 7',
    fiscalYear: '2569',
    departmentId: 'dept_tech',
    departmentName: 'กองช่าง',
    responsiblePerson: 'นายสุรชัย วงศ์สว่าง',
    totalBudget: 2450000,
    spentBudget: 1890000,
    remainingBudget: 560000,
    startDate: '2026-02-01',
    endDate: '2026-10-31',
    targetObjective: 'แก้ปัญหาการขาดแคลนน้ำอุปโภคบริโภคแก่ราษฎร 180 หลังคาเรือน',
    kpiIndicator: 'ราษฎรมีน้ำประปาสะอาดใช้ตลอดทั้งปี 100%',
    progress: 78,
    status: 'in_progress'
  },
  {
    id: 'prj_002',
    code: 'PRJ-69-02',
    name: 'โครงการติดตั้งโคมไฟส่องสว่างพลังงานแสงอาทิตย์ (Solar Cell) 80 จุด ครอบคลุม 8 หมู่บ้าน',
    fiscalYear: '2569',
    departmentId: 'dept_finance',
    departmentName: 'กองคลัง (ร่วมกองช่าง)',
    responsiblePerson: 'นางสาวพัชรี นวลจันทร์',
    totalBudget: 498000,
    spentBudget: 0,
    remainingBudget: 498000,
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    targetObjective: 'เพิ่มแสงสว่างและความปลอดภัยบนถนนสายรองและทางแยกชุมชน',
    kpiIndicator: 'ลดอัตราการเกิดอุบัติเหตุในเวลากลางคืนลง 80%',
    progress: 50,
    status: 'in_progress'
  },
  {
    id: 'prj_003',
    code: 'PRJ-69-03',
    name: 'โครงการปรับปรุงและต่อเติมอาคารศูนย์พัฒนาเด็กเล็กบ้านฝางคำ',
    fiscalYear: '2569',
    departmentId: 'dept_edu',
    departmentName: 'กองการศึกษาฯ',
    responsiblePerson: 'นายบุญเลิศ เจริญผล',
    totalBudget: 650000,
    spentBudget: 650000,
    remainingBudget: 0,
    startDate: '2026-01-10',
    endDate: '2026-06-30',
    targetObjective: 'ขยายห้องกิจกรรมและห้องพยาบาลรองรับเด็กปฐมวัย',
    kpiIndicator: 'ได้มาตรฐานศูนย์พัฒนาเด็กเล็กระดับ 5 ดาว',
    progress: 100,
    status: 'completed'
  },
  {
    id: 'prj_004',
    code: 'PRJ-69-04',
    name: 'โครงการขุดลอกหนองน้ำสาธารณะหนองบัวฮี เพื่อกักเก็บน้ำเพื่อการเกษตร',
    fiscalYear: '2569',
    departmentId: 'dept_tech',
    departmentName: 'กองช่าง',
    responsiblePerson: 'นายธีรพงษ์ ศรีวิชัย',
    totalBudget: 1200000,
    spentBudget: 420000,
    remainingBudget: 780000,
    startDate: '2026-05-01',
    endDate: '2026-12-15',
    targetObjective: 'เพิ่มพื้นที่กักเก็บน้ำไว้ใช้ช่วงฤดูแล้ง 150,000 ลูกบาศก์เมตร',
    kpiIndicator: 'พื้นที่เกษตรกรรม 450 ไร่ ได้รับประโยชน์',
    progress: 35,
    status: 'in_progress'
  }
];

export const INITIAL_PROCUREMENTS: ProcurementItem[] = [
  {
    id: 'proc_01',
    procNo: 'E-GP-69-0014',
    title: 'ประกวดราคาจ้างก่อสร้างติดตั้งโคมไฟส่องสว่างพลังงานแสงอาทิตย์ 80 จุด',
    departmentId: 'dept_finance',
    departmentName: 'กองคลัง',
    method: 'e-Bidding',
    budgetAmount: 498000,
    contractAmount: 485000,
    vendorName: 'ห้างหุ้นส่วนจำกัด อีสานโซล่าร์ ซัพพลาย',
    currentStep: 'bidding',
    currentStepIndex: 5, // 1 to 10
    startDate: '2026-08-20',
    contractEndDate: '2026-11-20',
    responsibleOfficer: 'นางสาวพัชรี นวลจันทร์',
    fiscalYear: '2569'
  },
  {
    id: 'proc_02',
    procNo: 'CN-69-0028',
    title: 'จ้างปรับปรุงถนนลูกรังสายบ้านหนองไฮ-ดอนชี โดยวิธีเฉพาะเจาะจง',
    departmentId: 'dept_finance',
    departmentName: 'กองคลัง',
    method: 'เฉพาะเจาะจง',
    budgetAmount: 185000,
    contractAmount: 180000,
    vendorName: 'หจก. ศิริโชคโยธาก่อสร้าง',
    currentStep: 'inspection',
    currentStepIndex: 8,
    startDate: '2026-08-01',
    contractEndDate: '2026-09-12',
    responsibleOfficer: 'นางสาวพัชรี นวลจันทร์',
    fiscalYear: '2569'
  }
];

export const INITIAL_ASSETS: AssetRecord[] = [
  {
    id: 'ast_01',
    assetCode: '416-65-0004',
    name: 'รถบรรทุกดีเซล ขนาด 1 ตัน ขับเคลื่อน 2 ล้อ แบบมีแค็ป (บย-4512 อุบลฯ)',
    category: 'ครุภัณฑ์ยานพาหนะ',
    departmentId: 'dept_tech',
    storageLocation: 'โรงจอดรถ อบต.ฝางคำ',
    custodianName: 'นายสมชาย คำมั่น (กองช่าง)',
    purchaseDate: '2022-04-12',
    purchasePrice: 620000,
    condition: 'ใช้งานได้ดี',
    currentStatus: 'พร้อมใช้งาน'
  },
  {
    id: 'ast_02',
    assetCode: '416-67-0019',
    name: 'กล้องสำรวจแบบอิเล็กทรอนิกส์ (Total Station) พร้อมขาตั้งกล้อง',
    category: 'ครุภัณฑ์ก่อสร้าง',
    departmentId: 'dept_tech',
    storageLocation: 'ห้องปฏิบัติการกองช่าง ชั้น 2',
    custodianName: 'นายธีรพงษ์ ศรีวิชัย',
    purchaseDate: '2024-03-15',
    purchasePrice: 185000,
    condition: 'ใช้งานได้ดี',
    currentStatus: 'ถูกยืม/เบิก',
    borrowerName: 'นายสมชาย คำมั่น (ลงพื้นที่สำรวจ ม.3)'
  },
  {
    id: 'ast_03',
    assetCode: '416-68-0008',
    name: 'เครื่องคอมพิวเตอร์ประมวลผล All-in-One สำนักงาน พร้อมเครื่องสำรองไฟ',
    category: 'ครุภัณฑ์คอมพิวเตอร์',
    departmentId: 'dept_office',
    storageLocation: 'งานสารบรรณ สำนักปลัด',
    custodianName: 'นางกานดา สุขเจริญ',
    purchaseDate: '2025-01-20',
    purchasePrice: 32000,
    condition: 'ใช้งานได้ดี',
    currentStatus: 'พร้อมใช้งาน'
  }
];

export const INITIAL_MEETINGS: MeetingItem[] = [
  {
    id: 'mtg_01',
    title: 'การประชุมหัวหน้าส่วนราชการ อบต.ฝางคำ ประจำเดือนกันยายน 2569',
    meetingNo: '09/2569',
    date: '2026-09-02',
    time: '09:30 - 12:00 น.',
    location: 'ห้องประชุมสภา อบต.ฝางคำ ชั้น 3',
    chairman: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
    attendees: [
      'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
      'นายชูชาติ บุญเรือง (รองนายก อบต.)',
      'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน (ปลัด อบต.)',
      'นายสุรชัย วงศ์สว่าง (ผอ.กองช่าง)',
      'นางสาวจินตนา เพชรสุวรรณ (ผอ.กองคลัง)',
      'นายประสิทธิ์ มงคลสุข (หน.สำนักปลัด)',
      'นางมาลี รัตนโชติ (ผอ.กองการศึกษา)'
    ],
    status: 'finished',
    fiscalYear: '2569',
    agendas: [
      {
        id: 'agd_01',
        orderNo: 1,
        title: 'เรื่องที่ประธานแจ้งให้ที่ประชุมทราบ: การเตรียมต้อนรับคณะกรรมการตรวจประเมินประสิทธิภาพ อปท. (LPA)',
        description: 'ให้ทุกกองรวบรวมเอกสารผลงานตามตัวชี้วัด 5 ด้านให้แล้วเสร็จภายในวันที่ 15 ก.ย. 2569'
      },
      {
        id: 'agd_02',
        orderNo: 2,
        title: 'เรื่องรับรองรายงานการประชุมครั้งที่ผ่านมา (08/2569)',
        description: 'ที่ประชุมมีมติรับรองรายงานการประชุมครั้งที่ 8/2569 โดยไม่มีการแก้ไข'
      },
      {
        id: 'agd_03',
        orderNo: 3,
        title: 'เรื่องเพื่อพิจารณา: การจัดทำแผนรองรับสถานการณ์อุทกภัยริมแม่น้ำมูลและจุดเสี่ยงน้ำท่วมขัง',
        description: 'มอบหมายกองช่างร่วมกับงานป้องกันฯ สำนักปลัด จัดทำแผนฉุกเฉินและซ่อมแซมจุดระบายน้ำอุดตัน',
        resolution: 'ที่ประชุมเห็นชอบให้กองช่างและสำนักปลัดจัดทำแผนปฏิบัติการและลงพื้นที่ขุดลอกสิ่งกีดขวางทางน้ำทันที',
        convertedToTaskId: 'tsk_001'
      }
    ]
  },
  {
    id: 'mtg_02',
    title: 'การประชุมคณะกรรมการพัฒนา อบต.ฝางคำ พิจารณาร่างแผนพัฒนาท้องถิ่น',
    meetingNo: '04/2569',
    date: '2026-09-12',
    time: '13:30 - 16:30 น.',
    location: 'ห้องประชุมอเนกประสงค์ อบต.ฝางคำ',
    chairman: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
    attendees: ['คณะกรรมการพัฒนา อบต.', 'ผู้ทรงคุณวุฒิ', 'ตัวแทนประชาคม 8 หมู่บ้าน'],
    status: 'scheduled',
    fiscalYear: '2569',
    agendas: [
      {
        id: 'agd_21',
        orderNo: 1,
        title: 'พิจารณาข้อเสนอโครงการบรรจุในแผนพัฒนาท้องถิ่น (พ.ศ. 2566 - 2570) เพิ่มเติม ครั้งที่ 2',
        description: 'โครงการระบบไฟฟ้าสาธารณะ และโครงการส่งเสริมเกษตรอินทรีย์'
      }
    ]
  }
];

export const INITIAL_KPIS: DepartmentKpi[] = [
  {
    id: 'kpi_01',
    departmentId: 'dept_office',
    departmentName: 'สำนักปลัด อบต.',
    title: 'ร้อยละของเรื่องร้องเรียน/ร้องทุกข์ที่ได้รับการแก้ไขแล้วเสร็จตามกำหนด',
    target: 95,
    actual: 96.5,
    unit: '%',
    fiscalYear: '2569',
    scoreStar: 5,
    completionRate: 96.5,
    onTimeRate: 98.2
  },
  {
    id: 'kpi_02',
    departmentId: 'dept_tech',
    departmentName: 'กองช่าง',
    title: 'ร้อยละของโครงการก่อสร้างและซ่อมแซมสาธารณูปโภคที่เสร็จตามสัญญา',
    target: 90,
    actual: 88.4,
    unit: '%',
    fiscalYear: '2569',
    scoreStar: 4,
    completionRate: 88.4,
    onTimeRate: 85.0
  },
  {
    id: 'kpi_03',
    departmentId: 'dept_finance',
    departmentName: 'กองคลัง',
    title: 'ร้อยละของการเบิกจ่ายงบประมาณรายจ่ายลงทุนเทียบกับเป้าหมายรัฐบาล',
    target: 85,
    actual: 91.2,
    unit: '%',
    fiscalYear: '2569',
    scoreStar: 5,
    completionRate: 91.2,
    onTimeRate: 94.0
  },
  {
    id: 'kpi_04',
    departmentId: 'dept_edu',
    departmentName: 'กองการศึกษา ศาสนาและวัฒนธรรม',
    title: 'ร้อยละของเด็กปฐมวัยใน ศพด. ที่มีพัฒนาการสมวัยตามมาตรฐาน DSI',
    target: 90,
    actual: 93.0,
    unit: '%',
    fiscalYear: '2569',
    scoreStar: 5,
    completionRate: 93.0,
    onTimeRate: 96.5
  }
];

export const INITIAL_DOC_ARCHIVE: DocumentArchive[] = [
  {
    id: 'arc_01',
    docNo: 'คำสั่ง อบต.ฝางคำ ที่ 184/2569',
    title: 'คำสั่งแต่งตั้งคณะกรรมการตรวจรับพัสดุในงานจ้างก่อสร้างถนนคอนกรีต',
    category: 'คำสั่ง',
    departmentId: 'dept_office',
    publishDate: '2026-08-20',
    fileSize: '1.2 MB',
    fileFormat: 'PDF',
    accessLevel: 'internal'
  },
  {
    id: 'arc_02',
    docNo: 'ประกาศ อบต.ฝางคำ เรื่อง ประกาศราคากลางและการคำนวณราคากลาง',
    title: 'ประกาศราคากลางโครงการติดตั้งเสาไฟพลังงานแสงอาทิตย์ Solar Cell',
    category: 'ประกาศ',
    departmentId: 'dept_finance',
    publishDate: '2026-08-25',
    fileSize: '2.8 MB',
    fileFormat: 'PDF',
    accessLevel: 'public'
  },
  {
    id: 'arc_03',
    docNo: 'ข้อบัญญัติ อบต.ฝางคำ ประจำปีงบประมาณ พ.ศ. 2569',
    title: 'ข้อบัญญัติงบประมาณรายจ่ายประจำปีงบประมาณ พ.ศ. 2569 เล่มสมบูรณ์',
    category: 'ระเบียบ',
    departmentId: 'dept_finance',
    publishDate: '2025-10-01',
    fileSize: '14.5 MB',
    fileFormat: 'PDF',
    accessLevel: 'public'
  },
  {
    id: 'arc_04',
    docNo: 'แผนพัฒนาท้องถิ่น (พ.ศ. 2566 - 2570)',
    title: 'แผนพัฒนาท้องถิ่น อบต.ฝางคำ ฉบับทบทวน พ.ศ. 2569',
    category: 'โครงการ',
    departmentId: 'dept_office',
    publishDate: '2026-03-10',
    fileSize: '9.1 MB',
    fileFormat: 'PDF',
    accessLevel: 'public'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '2026-09-08 17:45:10',
    userName: 'นายสมชาย คำมั่น',
    userRole: 'officer',
    action: 'อัปเดตความคืบหน้างาน',
    targetType: 'Task',
    targetId: 'กช-2569/0042',
    details: 'ปรับปรุงเปอร์เซ็นต์ความคืบหน้าจาก 50% เป็น 65% (งานบดอัดหินคลุกเสร็จแล้ว)',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log_02',
    timestamp: '2026-09-08 14:20:03',
    userName: 'นางกานดา สุขเจริญ',
    userRole: 'officer',
    action: 'เปลี่ยนสถานะงาน',
    targetType: 'Task',
    targetId: 'สป-2569/0105',
    details: 'เปลี่ยนสถานะจาก [กำลังดำเนินการ] เป็น [รอตรวจสอบ]',
    ipAddress: '192.168.1.22'
  },
  {
    id: 'log_03',
    timestamp: '2026-09-08 10:15:30',
    userName: 'ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน',
    userRole: 'clerk',
    action: 'มอบหมายงานราชการ',
    targetType: 'Task',
    targetId: 'กช-2569/0055',
    details: 'มอบหมายงานขยายท่อประปาให้กองช่าง (นายสมชาย คำมั่น รับผิดชอบ)',
    ipAddress: '192.168.1.10'
  },
  {
    id: 'log_04',
    timestamp: '2026-09-07 16:30:12',
    userName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ',
    userRole: 'mayor',
    action: 'อนุมัติงานโครงการ',
    targetType: 'Procurement',
    targetId: 'E-GP-69-0014',
    details: 'อนุมัติประกาศเชิญชวน e-Bidding โครงการโคมไฟ Solar Cell',
    ipAddress: '192.168.1.2'
  },
  {
    id: 'log_05',
    timestamp: '2026-09-07 11:00:00',
    userName: 'ผู้ดูแลระบบสูงสุด',
    userRole: 'super_admin',
    action: 'สำรองข้อมูลฐานข้อมูล',
    targetType: 'Database',
    targetId: 'BACKUP-25690907',
    details: 'สร้าง Database Backup อัตโนมัติ fangkham_gov_backup_25690907.sql.gz',
    ipAddress: '127.0.0.1'
  }
];
