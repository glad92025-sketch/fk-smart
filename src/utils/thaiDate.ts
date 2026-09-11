/**
 * Thai Date & Government Workflow Utilities
 */
import { TaskStatus, UrgencyLevel } from '../types';

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

/**
 * Format date to Thai format, e.g. "9 ก.ย. 2569" or "9 กันยายน 2569"
 */
export function formatThaiDate(dateStr: string, fullMonth = false): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const day = d.getDate();
  const month = fullMonth ? THAI_MONTHS_FULL[d.getMonth()] : THAI_MONTHS_SHORT[d.getMonth()];
  const thaiYear = d.getFullYear() + 543;
  
  return `${day} ${month} ${thaiYear}`;
}

/**
 * Format datetime to Thai format, e.g. "09/09/2569 10:30 น."
 */
export function formatThaiDateTime(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const thaiYear = d.getFullYear() + 543;
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${thaiYear} ${hours}:${mins} น.`;
}

/**
 * Format Thai currency: 1500000 -> 1,500,000 บาท
 */
export function formatThaiCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' บาท';
}

/**
 * Calculate deadline countdown:
 * - Green: > 7 days
 * - Yellow: 3-7 days
 * - Orange: 1-2 days
 * - Red: Overdue
 */
export interface DeadlineStatus {
  label: string;
  daysRemaining: number;
  isOverdue: boolean;
  colorClass: string; // Tailwind background & text classes
  badgeClass: string;
  dotColor: string;
}

export function getDeadlineStatus(dueDateStr: string, isCompleted = false): DeadlineStatus {
  if (isCompleted) {
    return {
      label: 'เสร็จสมบูรณ์',
      daysRemaining: 0,
      isOverdue: false,
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      dotColor: '#10b981'
    };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: `เกินกำหนด ${overdueDays} วัน`,
      daysRemaining: diffDays,
      isOverdue: true,
      colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
      badgeClass: 'bg-rose-100 text-rose-800 font-semibold',
      dotColor: '#ef4444'
    };
  } else if (diffDays === 0) {
    return {
      label: 'ครบกำหนดวันนี้',
      daysRemaining: 0,
      isOverdue: false,
      colorClass: 'text-orange-700 bg-orange-50 border-orange-300 font-medium',
      badgeClass: 'bg-orange-100 text-orange-900',
      dotColor: '#f97316'
    };
  } else if (diffDays <= 2) {
    return {
      label: `เหลือ ${diffDays} วัน`,
      daysRemaining: diffDays,
      isOverdue: false,
      colorClass: 'text-amber-800 bg-amber-50 border-amber-300',
      badgeClass: 'bg-amber-100 text-amber-900 font-medium',
      dotColor: '#f59e0b'
    };
  } else if (diffDays <= 7) {
    return {
      label: `เหลือ ${diffDays} วัน`,
      daysRemaining: diffDays,
      isOverdue: false,
      colorClass: 'text-yellow-800 bg-yellow-50 border-yellow-200',
      badgeClass: 'bg-yellow-100 text-yellow-800',
      dotColor: '#eab308'
    };
  } else {
    return {
      label: `เหลือ ${diffDays} วัน`,
      daysRemaining: diffDays,
      isOverdue: false,
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      dotColor: '#10b981'
    };
  }
}

/**
 * Task Status definition mapping (14 standard states for Thai Local Government)
 */
export const TASK_STATUS_CONFIG: Record<TaskStatus, {
  label: string;
  badgeClass: string;
  stepNumber: number;
  stage: 'inbox' | 'todo' | 'progress' | 'review' | 'approve' | 'done';
}> = {
  pending_receive: { label: 'รอรับเรื่อง', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300', stepNumber: 1, stage: 'inbox' },
  received:        { label: 'รับเรื่องแล้ว', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200', stepNumber: 2, stage: 'inbox' },
  pending_assign:  { label: 'รอมอบหมาย', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200', stepNumber: 3, stage: 'todo' },
  assigned:        { label: 'มอบหมายแล้ว', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300', stepNumber: 4, stage: 'todo' },
  in_progress:     { label: 'กำลังดำเนินการ', badgeClass: 'bg-blue-600 text-white shadow-sm', stepNumber: 5, stage: 'progress' },
  waiting_info:    { label: 'รอข้อมูล', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200', stepNumber: 6, stage: 'progress' },
  pending_review:  { label: 'รอตรวจสอบ', badgeClass: 'bg-amber-100 text-amber-900 border-amber-300', stepNumber: 7, stage: 'review' },
  revision:        { label: 'ส่งกลับแก้ไข', badgeClass: 'bg-rose-100 text-rose-800 border-rose-300', stepNumber: 8, stage: 'review' },
  pending_approve: { label: 'รออนุมัติ', badgeClass: 'bg-orange-100 text-orange-900 border-orange-300 font-medium', stepNumber: 9, stage: 'approve' },
  approved:        { label: 'อนุมัติแล้ว', badgeClass: 'bg-teal-100 text-teal-900 border-teal-300', stepNumber: 10, stage: 'approve' },
  completed:       { label: 'เสร็จสิ้น', badgeClass: 'bg-emerald-600 text-white font-medium shadow-sm', stepNumber: 11, stage: 'done' },
  closed:          { label: 'ปิดงาน', badgeClass: 'bg-emerald-800 text-white font-medium', stepNumber: 12, stage: 'done' },
  cancelled:       { label: 'ยกเลิก', badgeClass: 'bg-gray-200 text-gray-700 border-gray-300', stepNumber: 13, stage: 'done' },
  overdue:         { label: 'เกินกำหนด', badgeClass: 'bg-red-600 text-white font-medium animate-pulse', stepNumber: 14, stage: 'progress' },
};

/**
 * Urgency badge helper
 */
export function getUrgencyBadge(urgency: UrgencyLevel): {
  label: string;
  badgeClass: string;
  iconColor: string;
  emoji: string;
} {
  switch (urgency) {
    case 'critical':
      return {
        label: 'วิกฤต',
        badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300 font-semibold',
        iconColor: '#dc2626',
        emoji: '🔴'
      };
    case 'urgent':
      return {
        label: 'เร่งด่วน',
        badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300 font-medium',
        iconColor: '#f59e0b',
        emoji: '🟠'
      };
    case 'normal':
    default:
      return {
        label: 'ปกติ',
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
        iconColor: '#64748b',
        emoji: '🟡'
      };
  }
}
