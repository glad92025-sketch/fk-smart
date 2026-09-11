import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  AlertOctagon,
  Megaphone,
  CalendarCheck,
  Package,
  BookOpen,
  HelpCircle,
  Plus,
  Search,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Tv,
  ChevronRight,
  Type
} from 'lucide-react';
import { NavSection } from './Sidebar';

interface ResponsiveUtilityBarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onOpenNewTask: () => void;
  onOpenGlobalSearch: () => void;
  onOpenAiAssistant: () => void;
  fontSize: 'normal' | 'large' | 'xl';
  onChangeFontSize: (size: 'normal' | 'large' | 'xl') => void;
  onOpenGuide: () => void;
}

const SECTION_LABELS: Record<NavSection, { title: string; category: string }> = {
  dashboard: { title: 'ศูนย์บัญชาการ (Executive Dashboard)', category: 'ภาพรวมบริหาร' },
  tasks: { title: 'ภารกิจทั้งหมดใน อบต.', category: 'จัดการภารกิจ' },
  my_tasks: { title: 'ภารกิจที่ฉันรับผิดชอบ', category: 'งานส่วนบุคคล' },
  assigned_tasks: { title: 'งานที่ฉันมอบหมาย', category: 'งานส่วนบุคคล' },
  urgent_tasks: { title: 'ภารกิจด่วน & เร่งด่วนวิกฤต', category: 'จัดการภารกิจ' },
  kanban: { title: 'บอร์ดคัมบังสถานะงาน (Kanban)', category: 'ติดตามสถานะ' },
  calendar: { title: 'ปฏิทินปฏิบัติงาน & วันกำหนดส่ง', category: 'วางแผนงาน' },
  documents: { title: 'งานสารบรรณ & หนังสือราชการ', category: 'งานสารบรรณ' },
  complaints: { title: 'ศูนย์รับเรื่องราวร้องทุกข์ ปชช.', category: 'บริการประชาชน' },
  field_ops: { title: 'บันทึกการลงพื้นที่ & สำรวจภาคสนาม', category: 'งานภาคสนาม' },
  projects: { title: 'โครงการตามแผนพัฒนาท้องถิ่น', category: 'แผนและงบประมาณ' },
  budget: { title: 'งบประมาณรายจ่าย & สถานะเบิกจ่าย', category: 'แผนและงบประมาณ' },
  procurement: { title: 'ระบบจัดซื้อจัดจ้างภาครัฐ (10 ขั้นตอน)', category: 'พัสดุและจัดซื้อ' },
  assets: { title: 'ทะเบียนครุภัณฑ์ & ยานพาหนะ อบต.', category: 'พัสดุและทรัพย์สิน' },
  staff: { title: 'บุคลากร & ภาระงานรายกอง', category: 'บริหารงานบุคคล' },
  meetings: { title: 'การประชุมสภา & แปลงมติเป็นงาน', category: 'กิจการสภา' },
  kpis: { title: 'ตัวชี้วัดประสิทธิภาพ (KPI & LPA)', category: 'ประเมินผลงาน' },
  reports: { title: 'ศูนย์ออกรายงานและพิมพ์หนังสือ', category: 'รายงานและพิมพ์' },
  doc_center: { title: 'คลังเอกสาร & แบบฟอร์มกลาง', category: 'คลังความรู้' },
  audit_logs: { title: 'บันทึกการใช้งานระบบ (Audit Logs)', category: 'ความปลอดภัย' },
  settings: { title: 'ตั้งค่าระบบ & สิทธิการใช้งาน', category: 'ดูแลระบบ' },
  php_source: { title: 'โครงสร้างระบบราชการ PHP/MySQL', category: 'คู่มือนักพัฒนา' }
};

export const ResponsiveUtilityBar: React.FC<ResponsiveUtilityBarProps> = ({
  activeSection,
  onSelectSection,
  onOpenNewTask,
  onOpenGlobalSearch,
  onOpenAiAssistant,
  fontSize,
  onChangeFontSize,
  onOpenGuide
}) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop' | 'ultrawide'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else if (width < 1536) {
        setDeviceType('desktop');
      } else {
        setDeviceType('ultrawide');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentInfo = SECTION_LABELS[activeSection] || { title: 'ระบบงาน', category: 'อบต.ฝางคำ' };

  // Quick jump shortcuts for highest frequency screens
  const quickPills: { id: NavSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'ภาพรวม', icon: LayoutDashboard },
    { id: 'tasks', label: 'ภารกิจ', icon: ClipboardList },
    { id: 'urgent_tasks', label: 'งานด่วน', icon: AlertOctagon },
    { id: 'complaints', label: 'คำร้อง ปชช.', icon: Megaphone },
    { id: 'meetings', label: 'มติประชุม', icon: CalendarCheck },
    { id: 'assets', label: 'ครุภัณฑ์', icon: Package },
    { id: 'doc_center', label: 'คลังเอกสาร', icon: BookOpen }
  ];

  return (
    <div className="mb-4 sm:mb-6 space-y-2.5">
      {/* Top Breadcrumb, Screen Indicator & Accessibility Font Control */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
          <span className="font-semibold text-slate-700 truncate">อบต.ฝางคำ</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="hidden sm:inline text-slate-400 truncate">{currentInfo.category}</span>
          <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 truncate max-w-[200px] sm:max-w-xs">
            {currentInfo.title}
          </span>
        </div>

        {/* Right: Screen Mode & Font Scaler Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Responsive Device Indicator Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium" title="โหมดการแสดงผลที่ปรับให้พอดีกับจอของคุณ">
            {deviceType === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-blue-600" />}
            {deviceType === 'tablet' && <Tablet className="w-3.5 h-3.5 text-emerald-600" />}
            {deviceType === 'desktop' && <Monitor className="w-3.5 h-3.5 text-indigo-600" />}
            {deviceType === 'ultrawide' && <Tv className="w-3.5 h-3.5 text-purple-600" />}
            <span>
              {deviceType === 'mobile' && 'จอสมาร์ตโฟน'}
              {deviceType === 'tablet' && 'จอแท็บเล็ต/iPad'}
              {deviceType === 'desktop' && 'จอคอมพิวเตอร์'}
              {deviceType === 'ultrawide' && 'จอกว้างพิเศษ (Ultrawide)'}
            </span>
          </div>

          {/* Accessible Font Scaler (A- / A / A+) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200" title="ปรับขนาดตัวอักษรเพื่อความสบายตา">
            <span className="text-[10px] font-bold text-slate-500 px-1 hidden sm:inline flex items-center gap-0.5">
              <Type className="w-3 h-3 text-slate-400" />
              ฟอนต์:
            </span>
            <button
              onClick={() => onChangeFontSize('normal')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ขนาดมาตรฐาน (100%)"
            >
              ก
            </button>
            <button
              onClick={() => onChangeFontSize('large')}
              className={`px-1.5 py-0.5 rounded text-xs font-bold transition cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ขนาดสบายตา (110%)"
            >
              ก+
            </button>
            <button
              onClick={() => onChangeFontSize('xl')}
              className={`px-1.5 py-0.5 rounded text-sm font-extrabold transition cursor-pointer ${
                fontSize === 'xl'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ขนาดใหญ่พิเศษ (122%)"
            >
              ก++
            </button>
          </div>

          {/* Quick Guide / Help */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            title="วิธีใช้งานง่ายสำหรับทุกคน"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">วิธีใช้งานง่าย</span>
          </button>
        </div>
      </div>

      {/* Quick Jump Pills & Fast Action Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* Horizontal Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 hidden lg:inline mr-1">
            ลัดไปที่:
          </span>
          {quickPills.map((pill) => {
            const Icon = pill.icon;
            const isSelected = activeSection === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => onSelectSection(pill.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap min-h-[38px] ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Action Shortcuts (Desktop/Tablet) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 ml-auto">
          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer min-h-[38px]"
            title="ลงทะเบียนภารกิจใหม่ทันที"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>สร้างงานใหม่</span>
          </button>

          <button
            onClick={onOpenGlobalSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium shadow-xs transition cursor-pointer min-h-[38px]"
            title="ค้นหาทั้งระบบ (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-300" />
            <span>ค้นหาด่วน</span>
          </button>

          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-medium shadow-xs transition cursor-pointer min-h-[38px]"
            title="สอบถามผู้ช่วย AI ประจำ อบต."
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ถาม AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
