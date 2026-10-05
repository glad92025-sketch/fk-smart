import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  AlertOctagon,
  KanbanSquare,
  Calendar,
  FileText,
  Megaphone,
  MapPin,
  FolderKanban,
  Coins,
  ShoppingCart,
  Package,
  Users,
  CalendarCheck,
  Award,
  BarChart3,
  BookOpen,
  History,
  Settings,
  Code2,
  ChevronRight,
  X,
  HardDrive,
  UserCheck,
  KeyRound,
  LogOut
} from 'lucide-react';
import { User } from '../types';

export type NavSection = 
  | 'dashboard'
  | 'tasks'
  | 'my_tasks'
  | 'assigned_tasks'
  | 'urgent_tasks'
  | 'kanban'
  | 'calendar'
  | 'documents'
  | 'complaints'
  | 'field_ops'
  | 'projects'
  | 'budget'
  | 'procurement'
  | 'assets'
  | 'staff'
  | 'meetings'
  | 'kpis'
  | 'reports'
  | 'doc_center'
  | 'google_drive'
  | 'users_admin'
  | 'audit_logs'
  | 'settings'
  | 'php_source';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  currentUser: User;
  urgentCount: number;
  myTasksCount: number;
  overdueCount: number;
  complaintsCount: number;
  onOpenChangePassword?: () => void;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  currentUser,
  urgentCount,
  myTasksCount,
  overdueCount,
  complaintsCount,
  onOpenChangePassword,
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const isExecutive = ['super_admin', 'mayor', 'deputy_mayor', 'clerk'].includes(currentUser.role);

  const menuGroups = [
    {
      groupTitle: 'ศูนย์บัญชาการ & จัดการภารกิจ',
      items: [
        {
          id: 'dashboard' as NavSection,
          label: isExecutive ? 'Dashboard ผู้บริหาร' : 'หน้าหลัก Dashboard',
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'my_tasks' as NavSection,
          label: 'งานของฉัน (My Tasks)',
          icon: CheckSquare,
          badge: myTasksCount > 0 ? myTasksCount : null,
          badgeColor: 'bg-blue-500 text-white'
        },
        {
          id: 'tasks' as NavSection,
          label: 'งานทั้งหมด',
          icon: ClipboardList,
          badge: null
        },
        {
          id: 'kanban' as NavSection,
          label: 'กระดาน Kanban Board',
          icon: KanbanSquare,
          badge: null
        },
        {
          id: 'urgent_tasks' as NavSection,
          label: 'งานเร่งด่วน / วิกฤต',
          icon: AlertOctagon,
          badge: urgentCount > 0 ? urgentCount : null,
          badgeColor: 'bg-rose-500 text-white animate-pulse'
        },
        {
          id: 'calendar' as NavSection,
          label: 'ปฏิทินงานราชการ',
          icon: Calendar,
          badge: null
        }
      ]
    },
    {
      groupTitle: 'งานราชการ & บริการประชาชน',
      items: [
        {
          id: 'complaints' as NavSection,
          label: 'คำร้องประชาชน (7 สเต็ป)',
          icon: Megaphone,
          badge: complaintsCount > 0 ? complaintsCount : null,
          badgeColor: 'bg-amber-500 text-white'
        },
        {
          id: 'documents' as NavSection,
          label: 'หนังสือราชการ (รับ/ส่ง)',
          icon: FileText,
          badge: null
        },
        {
          id: 'field_ops' as NavSection,
          label: 'งานลงพื้นที่ & ตรวจการ',
          icon: MapPin,
          badge: null
        },
        {
          id: 'meetings' as NavSection,
          label: 'การประชุม & มติเป็นงาน',
          icon: CalendarCheck,
          badge: null
        },
        {
          id: 'doc_center' as NavSection,
          label: 'คลังเอกสารกลาง',
          icon: BookOpen,
          badge: null
        },
        {
          id: 'google_drive' as NavSection,
          label: 'Google Drive คลาวด์ (15TB)',
          icon: HardDrive,
          badge: '15TB',
          badgeColor: 'bg-blue-600 text-white'
        }
      ]
    },
    {
      groupTitle: 'โครงการ, งบประมาณ & พัสดุ',
      items: [
        {
          id: 'projects' as NavSection,
          label: 'โครงการ & แผนงาน',
          icon: FolderKanban,
          badge: null
        },
        {
          id: 'budget' as NavSection,
          label: 'การใช้จ่ายงบประมาณ',
          icon: Coins,
          badge: null
        },
        {
          id: 'procurement' as NavSection,
          label: 'จัดซื้อจัดจ้าง (10 ขั้นตอน)',
          icon: ShoppingCart,
          badge: null
        },
        {
          id: 'assets' as NavSection,
          label: 'ทะเบียนพัสดุ & ครุภัณฑ์',
          icon: Package,
          badge: null
        }
      ]
    },
    {
      groupTitle: 'บุคลากร, KPI & การประเมินผล',
      items: [
        {
          id: 'staff' as NavSection,
          label: 'บุคลากร & Workload',
          icon: Users,
          badge: null
        },
        {
          id: 'kpis' as NavSection,
          label: 'KPI & คะแนนประเมิน',
          icon: Award,
          badge: null
        },
        {
          id: 'reports' as NavSection,
          label: 'ศูนย์รายงาน & พิมพ์เอกสาร',
          icon: BarChart3,
          badge: null
        }
      ]
    },
    {
      groupTitle: 'ระบบและความปลอดภัย',
      items: [
        {
          id: 'users_admin' as NavSection,
          label: 'จัดการผู้ใช้งาน & สิทธิ์',
          icon: UserCheck,
          badge: '69 คน',
          badgeColor: 'bg-emerald-600 text-white'
        },
        {
          id: 'audit_logs' as NavSection,
          label: 'Audit Log ตรวจสอบย้อนหลัง',
          icon: History,
          badge: null
        },
        {
          id: 'settings' as NavSection,
          label: 'ตั้งค่าระบบ อบต.',
          icon: Settings,
          badge: null
        },
        {
          id: 'php_source' as NavSection,
          label: 'Source Code XAMPP (PHP/SQL)',
          icon: Code2,
          badge: 'PHP/SQL',
          badgeColor: 'bg-emerald-600 text-white'
        }
      ]
    }
  ];

  const handleItemClick = (sectionId: NavSection) => {
    onSelectSection(sectionId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderContent = (isDrawer = false) => (
    <>
      {/* Mobile Drawer Header with Close Button */}
      {isDrawer && (
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">เมนูระบบ อบต.ฝางคำ</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            aria-label="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Current User Quick Info in Sidebar */}
      <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            {currentUser.name.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-amber-400 font-medium truncate">
              {currentUser.roleTitle}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {currentUser.departmentName}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-3 space-y-5 overflow-y-auto">
        {menuGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {grp.groupTitle}
            </div>

            <div className="space-y-0.5">
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isSelected = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {item.badge !== null && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shadow-sm ${
                            item.badgeColor || (isSelected ? 'bg-white text-blue-700' : 'bg-slate-700 text-slate-200')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isSelected && (
                        <ChevronRight className="w-3.5 h-3.5 text-blue-200 ml-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer with User Session & Logout */}
      <div className="p-3 mx-3 mb-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
            {currentUser.name.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate" title={currentUser.name}>
              {currentUser.name}
            </div>
            <div className="text-[10px] text-amber-300 font-medium truncate">
              {currentUser.roleTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80 text-[11px]">
          {onOpenChangePassword && (
            <button
              onClick={onOpenChangePassword}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
              title="เปลี่ยนรหัสผ่าน"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>รหัสผ่าน</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex-1 py-1.5 px-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer border border-rose-900/40"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3 h-3 text-rose-400" />
              <span>ออกจากระบบ</span>
            </button>
          )}
        </div>

        <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-800/50">
          <div>อบต.ฝางคำ อ.สิรินธร จ.อุบลราชธานี</div>
          <div className="text-blue-400 font-mono text-[9px] mt-0.5">Google Drive 15TB Connected</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on small screens) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col shrink-0 border-r border-slate-800 select-none overflow-y-auto min-h-[calc(100vh-57px)]">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer (visible on small screens when open) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Sliding Drawer */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-50 animate-in slide-in-from-left duration-200 select-none">
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
