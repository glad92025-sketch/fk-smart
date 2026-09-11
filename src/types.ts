/**
 * FANGKHAM SMART GOVERNMENT - Types & Interfaces
 * ระบบบริหารงานราชการ อบต. แบบครบวงจร
 */

export type RoleType = 
  | 'super_admin'       // Super Admin (ควบคุมระบบทั้งหมด)
  | 'mayor'             // นายก อบต. (ดูงานทั้งหมด, มอบหมาย, อนุมัติ, ดู KPI)
  | 'deputy_mayor'      // รองนายก อบต. (ดูงานที่ได้รับมอบหมาย, ติดตาม, เสนอแนะ)
  | 'clerk'             // ปลัด อบต. (ศูนย์กลางควบคุมงาน, มอบหมายทุกกอง, ติดตามงานค้าง)
  | 'dept_head'         // หัวหน้าส่วนราชการ (รับงาน, มอบหมายลูกทีม, ตรวจสอบ, ปิดงาน)
  | 'officer'           // เจ้าหน้าที่ผู้ปฏิบัติงาน (รับงาน, อัปเดตสถานะ, แนบผลงาน, รายงานผล)
  | 'admin';            // ผู้ดูแลระบบ (จัดการข้อมูลและผู้ใช้งาน)

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  roleTitle: string;
  departmentId: string;
  departmentName: string;
  divisionName?: string;
  position: string;
  avatarUrl?: string;
}

export type DepartmentId = 
  | 'dept_office'       // สำนักปลัด อบต.
  | 'dept_finance'      // กองคลัง
  | 'dept_tech'         // กองช่าง
  | 'dept_edu'          // กองการศึกษา ศาสนาและวัฒนธรรม
  | 'dept_public_health'// กองสาธารณสุขและสิ่งแวดล้อม (ตัวอย่างกองที่เพิ่มได้)

export interface Department {
  id: DepartmentId | string;
  code: string;
  name: string;
  shortName: string;
  headName: string;
  headPosition: string;
  memberCount: number;
  iconName: string;
  color: string;
  divisions: string[];
}

export type UrgencyLevel = 'normal' | 'urgent' | 'critical'; // ปกติ, เร่งด่วน, วิกฤต

export type TaskStatus = 
  | 'pending_receive'   // 1. รอรับเรื่อง
  | 'received'          // 2. รับเรื่องแล้ว
  | 'pending_assign'    // 3. รอมอบหมาย
  | 'assigned'          // 4. มอบหมายแล้ว
  | 'in_progress'       // 5. กำลังดำเนินการ
  | 'waiting_info'      // 6. รอข้อมูล
  | 'pending_review'    // 7. รอตรวจสอบ
  | 'revision'          // 8. ส่งกลับแก้ไข
  | 'pending_approve'   // 9. รออนุมัติ
  | 'approved'          // 10. อนุมัติแล้ว
  | 'completed'         // 11. เสร็จสิ้น
  | 'closed'            // 12. ปิดงาน
  | 'cancelled'         // 13. ยกเลิก
  | 'overdue';          // 14. เกินกำหนด

export interface TaskCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Subtask {
  id: string;
  title: string;
  assigneeName: string;
  dueDate: string;
  completed: boolean;
  progress: number;
}

export interface TaskTimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  actorName: string;
  actorRole: string;
  details?: string;
  statusFrom?: string;
  statusTo?: string;
  attachmentName?: string;
}

export interface TaskComment {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  message: string;
  isOfficialNote?: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  uploaderName: string;
  type: 'pdf' | 'image' | 'word' | 'excel' | 'other';
  url?: string;
}

export interface Task {
  id: string;
  taskNo: string;              // e.g. กช-2569/0042
  title: string;
  categoryId: string;
  categoryName: string;
  departmentId: DepartmentId | string;
  departmentName: string;
  divisionName?: string;
  applicant: string;           // ผู้แจ้ง / แหล่งที่มา
  applicantType: 'citizen' | 'internal' | 'order' | 'meeting';
  assignerName: string;        // ผู้มอบหมาย (เช่น ปลัด / นายก)
  assigneeId: string;          // ผู้รับผิดชอบหลัก
  assigneeName: string;
  reviewerName?: string;       // ผู้ตรวจสอบ (หัวหน้ากอง)
  approverName?: string;       // ผู้อนุมัติ (ปลัด/นายก)
  
  receivedDate: string;        // วันที่รับเรื่อง
  startDate: string;           // วันที่เริ่มงาน
  dueDate: string;             // กำหนดส่ง (Deadline)
  completedDate?: string;      // วันที่เสร็จ
  
  urgency: UrgencyLevel;
  status: TaskStatus;
  progress: number;            // 0 - 100
  
  budget: number;              // งบประมาณ (บาท)
  budgetSource?: string;       // แหล่งงบประมาณ เช่น งบประมาณรายจ่ายประจำปี
  
  description: string;         // รายละเอียดงาน
  expectedOutcome?: string;    // ผลที่คาดว่าจะได้รับ
  actualOutcome?: string;      // ผลการดำเนินงาน
  obstacleNotes?: string;      // ปัญหา / อุปสรรค
  solutionNotes?: string;      // แนวทางแก้ไข
  remarks?: string;            // หมายเหตุ
  
  fiscalYear: string;          // e.g. 2569
  
  subtasks: Subtask[];
  timeline: TaskTimelineEvent[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  
  linkedComplaintId?: string;
  linkedDocumentNo?: string;
  linkedProjectId?: string;
}

// 17. ระบบหนังสือราชการ
export interface OfficialDocument {
  id: string;
  docType: 'incoming' | 'outgoing'; // หนังสือรับ / หนังสือส่ง
  docNo: string;                    // เลขที่หนังสือ เช่น นศ 53201/ว 142
  regNo: string;                    // ทะเบียนรับเลขที่ เช่น 0245/2569
  date: string;                     // ลงวันที่
  fromSource: string;               // จาก (เช่น อำเภอฝาง / กรมส่งเสริมการปกครองท้องถิ่น)
  toTarget: string;                 // ถึง / เรียน (เช่น นายก อบต.ฝางคำ)
  subject: string;                  // เรื่อง
  departmentId: string;
  assigneeName: string;
  dueDate?: string;
  status: 'pending' | 'processing' | 'completed';
  fileName?: string;
  linkedTaskId?: string;
  fiscalYear: string;
}

// 18. คำร้องประชาชน
export interface CitizenComplaint {
  id: string;
  ticketNo: string;                 // เลขที่คำร้อง เช่น ร้องเรียน-69-0018
  date: string;
  citizenName: string;
  citizenPhone: string;
  category: 'road' | 'electricity' | 'water' | 'trash' | 'trees' | 'disaster' | 'social' | 'general';
  categoryLabel: string;
  location: string;
  villageNo: string;                // หมู่ที่
  coordinates?: string;             // GPS เช่น 19.9214, 99.2158
  description: string;
  departmentId: string;
  assignedOfficer?: string;
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;  // 1:รับเรื่อง 2:มอบหมาย 3:ลงพื้นที่ 4:ดำเนินการ 5:แนบรูป 6:รายงานผล 7:ปิดเรื่อง
  status: 'new' | 'assigned' | 'in_progress' | 'solved' | 'closed';
  photoBefore?: string;
  photoAfter?: string;
  solutionSummary?: string;
  linkedTaskId?: string;
  fiscalYear: string;
}

// 19. งานลงพื้นที่
export interface FieldOperation {
  id: string;
  opNo: string;                     // เลขที่บันทึก เช่น สป-ลพ-69-014
  date: string;
  title: string;
  location: string;
  village: string;
  coordinates: string;
  officers: string[];
  vehicleNo: string;                // รถราชการ เช่น บย-4512 ชม.
  objective: string;
  description: string;
  photoBeforeUrl?: string;
  photoDuringUrl?: string;
  photoAfterUrl?: string;
  results: string;
  status: 'planned' | 'in_progress' | 'completed';
  departmentId: string;
  fiscalYear: string;
}

// 20. ระบบโครงการ & 21. งบประมาณ
export interface ProjectItem {
  id: string;
  code: string;
  name: string;
  fiscalYear: string;
  departmentId: string;
  departmentName: string;
  responsiblePerson: string;
  totalBudget: number;
  spentBudget: number;
  remainingBudget: number;
  startDate: string;
  endDate: string;
  targetObjective: string;
  kpiIndicator: string;
  progress: number;
  status: 'planning' | 'approved' | 'in_progress' | 'delivered' | 'completed';
}

// 22. จัดซื้อจัดจ้าง
export type ProcurementStep = 
  | 'request'         // 1. จัดทำความต้องการ
  | 'specs'           // 2. กำหนดรายละเอียด
  | 'tor'             // 3. จัดทำ TOR
  | 'approval'        // 4. ขออนุมัติ
  | 'bidding'         // 5. จัดซื้อจัดจ้าง / ประกวดราคา
  | 'contract'        // 6. ทำสัญญา
  | 'delivery'        // 7. ส่งมอบ
  | 'inspection'      // 8. ตรวจรับ
  | 'disbursement'    // 9. เบิกจ่าย
  | 'closed';         // 10. ปิดโครงการ

export interface ProcurementItem {
  id: string;
  procNo: string;
  title: string;
  departmentId: string;
  departmentName: string;
  method: 'เฉพาะเจาะจง' | 'e-Bidding' | 'คัดเลือก' | 'สอบราคา';
  budgetAmount: number;
  contractAmount?: number;
  vendorName?: string;
  currentStep: ProcurementStep;
  currentStepIndex: number; // 1 to 10
  startDate: string;
  contractEndDate?: string;
  responsibleOfficer: string;
  fiscalYear: string;
}

// 23. พัสดุและครุภัณฑ์
export interface AssetRecord {
  id: string;
  assetCode: string;               // e.g. 416-65-0012
  name: string;
  category: 'ครุภัณฑ์สำนักงาน' | 'ครุภัณฑ์คอมพิวเตอร์' | 'ครุภัณฑ์ก่อสร้าง' | 'ครุภัณฑ์ยานพาหนะ' | 'วัสดุสิ้นเปลือง';
  departmentId: string;
  storageLocation: string;
  custodianName: string;
  purchaseDate: string;
  purchasePrice: number;
  condition: 'ใช้งานได้ดี' | 'ชำรุดรอซ่อม' | 'รอจำหน่าย' | 'จำหน่ายแล้ว';
  currentStatus: 'พร้อมใช้งาน' | 'ถูกยืม/เบิก' | 'ส่งซ่อม';
  borrowerName?: string;
}

// 24. & 25. บุคลากร & Workload
export interface StaffMember {
  id: string;
  name: string;
  position: string;
  departmentId: string;
  departmentName: string;
  divisionName: string;
  phone: string;
  email: string;
  status: 'ปฏิบัติงาน' | 'ลาพัก' | 'อบรม/สัมมนา' | 'ลงพื้นที่';
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  urgentTasks: number;
  avgCompletionDays: number;
  rating?: number;
}

// 26. ระบบประชุม
export interface MeetingAgenda {
  id: string;
  orderNo: number;
  title: string;
  description: string;
  resolution?: string;             // มติที่ประชุม
  convertedToTaskId?: string;      // แปลงมติเป็นงานแล้ว
}

export interface MeetingItem {
  id: string;
  title: string;
  meetingNo: string;               // e.g. 05/2569
  date: string;
  time: string;
  location: string;
  chairman: string;
  attendees: string[];
  agendas: MeetingAgenda[];
  documentUrl?: string;
  status: 'scheduled' | 'finished';
  fiscalYear: string;
}

// 31. & 32. KPI & ประสิทธิภาพ
export interface DepartmentKpi {
  id: string;
  departmentId: string;
  departmentName: string;
  title: string;
  target: number;
  actual: number;
  unit: string;
  fiscalYear: string;
  scoreStar: number;               // 1 - 5
  completionRate: number;          // %
  onTimeRate: number;              // %
}

// 34. ระบบจัดเก็บเอกสารกลาง
export interface DocumentArchive {
  id: string;
  docNo: string;
  title: string;
  category: 'คำสั่ง' | 'ประกาศ' | 'ระเบียบ' | 'โครงการ' | 'รายงาน' | 'แบบฟอร์ม';
  departmentId: string;
  publishDate: string;
  fileSize: string;
  fileFormat: 'PDF' | 'DOCX' | 'XLSX';
  accessLevel: 'public' | 'internal' | 'confidential';
}

// 35. Audit Log
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ipAddress: string;
}

// 43. ระบบตั้งค่า
export interface SystemSettings {
  orgName: string;
  orgTagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  currentFiscalYear: string;
  availableFiscalYears: string[];
  autoNotifyUrgent: boolean;
  themePrimaryColor: string;
}
