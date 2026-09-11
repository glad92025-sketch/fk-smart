import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  AlertOctagon,
  Megaphone,
  Menu
} from 'lucide-react';
import { NavSection } from './Sidebar';

interface MobileBottomNavProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onToggleMenu: () => void;
  urgentCount: number;
  complaintsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onSelectSection,
  onToggleMenu,
  urgentCount,
  complaintsCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavSection,
      label: 'หน้าหลัก',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'tasks' as NavSection,
      label: 'ภารกิจ',
      icon: ClipboardList,
      badge: null
    },
    {
      id: 'urgent_tasks' as NavSection,
      label: 'งานด่วน',
      icon: AlertOctagon,
      badge: urgentCount > 0 ? urgentCount : null,
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'complaints' as NavSection,
      label: 'คำร้อง',
      icon: Megaphone,
      badge: complaintsCount > 0 ? complaintsCount : null,
      badgeColor: 'bg-amber-500'
    }
  ];

  return (
    <nav
      aria-label="เมนูหลักสำหรับมือถือ"
      className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-white lg:hidden px-2 py-1.5 shadow-2xl safe-area-bottom"
    >
      <div className="grid grid-cols-5 items-center justify-around text-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[44px] rounded-xl transition relative cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full text-[10px] font-extrabold text-white shadow ${
                      item.badgeColor || 'bg-blue-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Menu Drawer Toggle */}
        <button
          onClick={onToggleMenu}
          className="flex flex-col items-center justify-center py-1.5 px-1 min-h-[44px] rounded-xl transition relative cursor-pointer text-slate-400 hover:text-amber-400"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">เมนูทั้งหมด</span>
        </button>
      </div>
    </nav>
  );
};
