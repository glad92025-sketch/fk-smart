import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  Building2,
  Menu
} from 'lucide-react';
import { User, SystemSettings, Task } from '../types';
import { formatThaiDate } from '../utils/thaiDate';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  settings: SystemSettings;
  tasks: Task[];
  onOpenTaskDetail: (taskId: string) => void;
  onOpenGlobalSearch: () => void;
  onOpenAiAssistant: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  allUsers,
  settings,
  tasks,
  onOpenTaskDetail,
  onOpenGlobalSearch,
  onOpenAiAssistant,
  onToggleMobileMenu
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Compute urgent and overdue tasks for notifications
  const overdueTasks = tasks.filter(t => t.status === 'overdue' || (t.dueDate < '2026-09-08' && t.status !== 'closed' && t.status !== 'completed'));
  const criticalTasks = tasks.filter(t => t.urgency === 'critical' && t.status !== 'closed' && t.status !== 'completed');
  const pendingApprovalTasks = tasks.filter(t => t.status === 'pending_approve' || t.status === 'pending_review');

  const totalNotifications = overdueTasks.length + criticalTasks.length + pendingApprovalTasks.length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Mobile Hamburger & System Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Menu Toggle */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 min-w-[40px] min-h-[40px] flex items-center justify-center transition cursor-pointer"
              aria-label="เปิดเมนูนำทาง"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md border border-amber-300/40 shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-xs sm:text-sm md:text-base tracking-wide text-white drop-shadow-sm truncate">
                FANGKHAM SMART GOV
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 text-[11px] font-semibold rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 whitespace-nowrap">
                ปี {settings.currentFiscalYear}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 truncate max-w-[170px] sm:max-w-xs md:max-w-md">
              {settings.orgName}
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4">
          <button 
            onClick={onOpenGlobalSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs sm:text-sm text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">ค้นหาทั้งระบบ (เลขงาน, หนังสือ, คำร้อง)...</span>
            </div>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs text-slate-400 bg-slate-700 rounded border border-slate-600 shrink-0">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Mobile Search Button, Smart AI, Notifications & User Switcher */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile Search Icon Button */}
          <button
            onClick={onOpenGlobalSearch}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer"
            title="ค้นหา"
            aria-label="ค้นหาข้อมูล"
          >
            <Search className="w-4 h-4 text-slate-300" />
          </button>

          {/* Smart GovAI Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-sm border border-cyan-400/30 transition cursor-pointer min-h-[36px]"
            title="ผู้ช่วยอัจฉริยะวิเคราะห์งานและสรุปรายงานราชการ"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse shrink-0" />
            <span className="hidden sm:inline">GovAI ผู้ช่วย</span>
          </button>

          {/* Notification Center Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowRoleMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
              title="การแจ้งเตือนและภารกิจด่วน"
              aria-label="การแจ้งเตือน"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalNotifications > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow animate-pulse">
                  {totalNotifications}
                </span>
              )}
            </button>

            {showNotificationMenu && (
              <div className="fixed sm:absolute inset-x-2 sm:inset-x-auto right-0 sm:right-0 top-14 sm:top-auto sm:mt-2 w-auto sm:w-96 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>ศูนย์แจ้งเตือนภารกิจ ({totalNotifications})</span>
                  </div>
                  <span className="text-[11px] text-slate-300">
                    {formatThaiDate(new Date().toISOString())}
                  </span>
                </div>

                <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {overdueTasks.length > 0 && (
                    <div className="p-3 bg-rose-50/70">
                      <div className="flex items-center gap-1.5 font-bold text-rose-700 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>งานที่เกินกำหนดแล้ว ({overdueTasks.length})</span>
                      </div>
                      {overdueTasks.map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => {
                            onOpenTaskDetail(t.id);
                            setShowNotificationMenu(false);
                          }}
                          className="p-2 mb-1 rounded bg-white border border-rose-200 hover:bg-rose-100/50 cursor-pointer transition"
                        >
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>{t.taskNo}</span>
                            <span className="text-rose-600 font-bold">เกินกำหนด</span>
                          </div>
                          <p className="text-slate-600 line-clamp-1">{t.title}</p>
                          <span className="text-[11px] text-slate-400">ผู้รับผิดชอบ: {t.assigneeName}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {criticalTasks.length > 0 && (
                    <div className="p-3 bg-amber-50/70">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>งานวิกฤต/เร่งด่วน ({criticalTasks.length})</span>
                      </div>
                      {criticalTasks.map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => {
                            onOpenTaskDetail(t.id);
                            setShowNotificationMenu(false);
                          }}
                          className="p-2 mb-1 rounded bg-white border border-amber-200 hover:bg-amber-100/50 cursor-pointer transition"
                        >
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>{t.taskNo}</span>
                            <span className="text-amber-700">🔴 วิกฤต</span>
                          </div>
                          <p className="text-slate-600 line-clamp-1">{t.title}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {pendingApprovalTasks.length > 0 && (
                    <div className="p-3 bg-blue-50/70">
                      <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>งานรอตรวจสอบ/รออนุมัติ ({pendingApprovalTasks.length})</span>
                      </div>
                      {pendingApprovalTasks.map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => {
                            onOpenTaskDetail(t.id);
                            setShowNotificationMenu(false);
                          }}
                          className="p-2 mb-1 rounded bg-white border border-blue-200 hover:bg-blue-100/50 cursor-pointer transition"
                        >
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>{t.taskNo}</span>
                            <span className="text-blue-700">รออนุมัติ</span>
                          </div>
                          <p className="text-slate-600 line-clamp-1">{t.title}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {totalNotifications === 0 && (
                    <div className="p-6 text-center text-slate-400">
                      ไม่มีภารกิจค้างหรือเตือนด่วนในขณะนี้
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 text-center border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium">
                    ระบบแจ้งเตือนภารกิจ อบต.ฝางคำ แบบ Realtime
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotificationMenu(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 pl-2 pr-1.5 sm:pr-2 py-1 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition cursor-pointer min-h-[36px]"
              aria-label="สลับบทบาทผู้ใช้"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[11px] sm:text-xs shadow-sm shrink-0">
                {currentUser.name.slice(0, 2)}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-semibold text-white flex items-center gap-1">
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-500/20 text-sky-300 font-normal">
                    {currentUser.roleTitle}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                  {currentUser.position}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleMenu && (
              <div className="fixed sm:absolute inset-x-2 sm:inset-x-auto right-0 sm:right-0 top-14 sm:top-auto sm:mt-2 w-auto sm:w-72 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    สลับบทบาทผู้ใช้งาน (Role Testing)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    จำลองสิทธิ์การเข้าถึงข้อมูลตามตำแหน่งจริง
                  </div>
                </div>

                <div className="p-1.5 max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {allUsers.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-2.5 transition cursor-pointer min-h-[44px] ${
                          isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {u.name.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {u.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-blue-700 font-medium">
                            {u.roleTitle}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {u.departmentName}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 text-center">
                  กำลังใช้งาน: <strong className="text-slate-700">{currentUser.name}</strong> ({currentUser.roleTitle})
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
