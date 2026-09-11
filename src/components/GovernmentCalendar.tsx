import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building,
  AlertTriangle
} from 'lucide-react';
import { Task, Department } from '../types';
import { formatThaiDate, getDeadlineStatus, getUrgencyBadge } from '../utils/thaiDate';

interface GovernmentCalendarProps {
  tasks: Task[];
  departments: Department[];
  onOpenTaskDetail: (taskId: string) => void;
}

export const GovernmentCalendar: React.FC<GovernmentCalendarProps> = ({
  tasks,
  departments,
  onOpenTaskDetail
}) => {
  const [currentMonth, setCurrentMonth] = useState(8); // September (0-indexed = 8)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'agenda'>('grid');

  const daysInMonth = 30; // September 2026
  const startDayOfWeek = 2; // Tuesday

  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const filteredTasks = tasks.filter(t => {
    if (selectedDept === 'all') return true;
    return t.departmentId === selectedDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            ปฏิทินงานราชการและกำหนดส่งภารกิจ (Government Calendar)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            มองเห็นกำหนดส่งงาน (Deadlines) รายเดือน เพื่อวางแผนและติดตามงานไม่ให้ตกหล่น
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
          >
            <option value="all">🏢 ทุกกอง / ส่วน</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Month Navigation & View Switcher */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            {thaiMonths[currentMonth]} {currentYear + 543}
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
            ปีงบประมาณ 2569
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* View Mode Toggle (Grid vs Agenda) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              แบบตาราง
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-white text-blue-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              แบบรายการ
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              aria-label="เดือนก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              aria-label="เดือนถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'agenda' ? (
        /* Mobile-Friendly Agenda List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
          <div className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>กำหนดส่งภารกิจประจำเดือน {thaiMonths[currentMonth]} {currentYear + 543}</span>
          </div>

          <div className="space-y-3">
            {days.filter(day => {
              const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
              return filteredTasks.some(t => t.dueDate === dateStr);
            }).map(day => {
              const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
              const dayTasks = filteredTasks.filter(t => t.dueDate === dateStr);
              const isToday = day === 8;

              return (
                <div key={day} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isToday ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {day} {thaiMonths[currentMonth]} {isToday ? '(วันนี้)' : ''}
                    </span>
                    <span className="text-xs text-slate-400">({dayTasks.length} ภารกิจ)</span>
                  </div>

                  <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                    {dayTasks.map(t => {
                      const urgencyCfg = getUrgencyBadge(t.urgency);
                      const deadline = getDeadlineStatus(t.dueDate, t.status === 'completed' || t.status === 'closed');

                      return (
                        <div
                          key={t.id}
                          onClick={() => onOpenTaskDetail(t.id)}
                          className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl transition cursor-pointer space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-slate-700">
                              {t.taskNo}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${urgencyCfg.badgeClass}`}>
                              {urgencyCfg.emoji} {urgencyCfg.label}
                            </span>
                          </div>

                          <div className="font-semibold text-xs sm:text-sm text-slate-800">
                            {t.title}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span className="text-blue-700 font-medium">{t.departmentName}</span>
                            <span>ผู้รับผิดชอบ: {t.assigneeName}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                ไม่มีกำหนดส่งภารกิจในเดือนนี้
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Calendar Grid */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-3 sm:p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 pb-2 border-b border-slate-100">
            <div className="text-rose-600">อา.</div>
            <div>จ.</div>
            <div>อ.</div>
            <div>พ.</div>
            <div>พฤ.</div>
            <div>ศ.</div>
            <div className="text-blue-600">ส.</div>
          </div>

          {/* Days cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 pt-2">
            {/* Empty prefix days */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[100px] p-1 sm:p-1.5 rounded-xl bg-slate-50/50" />
            ))}

            {days.map((day) => {
              const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
              const dayTasks = filteredTasks.filter(t => t.dueDate === dateStr);
              const isToday = day === 8; // Sep 8

              return (
                <div
                  key={day}
                  className={`min-h-[70px] sm:min-h-[105px] p-1 sm:p-1.5 rounded-xl border flex flex-col justify-between transition ${
                    isToday 
                      ? 'bg-blue-50/60 border-blue-400 ring-2 ring-blue-500/30' 
                      : 'bg-white border-slate-200 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <span className={`text-[11px] sm:text-xs font-bold ${isToday ? 'text-blue-700 font-extrabold' : 'text-slate-700'}`}>
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                        {dayTasks.length} <span className="hidden sm:inline">งาน</span>
                      </span>
                    )}
                  </div>

                  {/* Task list in day cell */}
                  <div className="space-y-0.5 sm:space-y-1 overflow-y-auto max-h-[50px] sm:max-h-[80px]">
                    {dayTasks.map((t) => {
                      return (
                        <div
                          key={t.id}
                          onClick={() => onOpenTaskDetail(t.id)}
                          className={`p-0.5 sm:p-1 rounded text-[9px] sm:text-[10px] truncate cursor-pointer transition ${
                            t.urgency === 'critical'
                              ? 'bg-rose-100 text-rose-800 font-bold'
                              : t.urgency === 'urgent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-50 text-blue-800'
                          }`}
                          title={`${t.taskNo} - ${t.title}`}
                        >
                          {t.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
