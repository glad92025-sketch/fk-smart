import React, { useState } from 'react';
import {
  KanbanSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  MoreVertical,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Task, Department, TaskStatus } from '../types';
import { getDeadlineStatus, getUrgencyBadge, TASK_STATUS_CONFIG } from '../utils/thaiDate';

interface KanbanBoardProps {
  tasks: Task[];
  departments: Department[];
  onOpenTaskDetail: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  statuses: TaskStatus[];
  color: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  departments,
  onOpenTaskDetail,
  onUpdateTaskStatus
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const columns: KanbanColumn[] = [
    {
      id: 'col_received',
      title: 'รอรับเรื่อง / รอมอบหมาย',
      statuses: ['pending_receive', 'received', 'pending_assign'],
      color: 'border-t-sky-500 bg-sky-50/30'
    },
    {
      id: 'col_progress',
      title: 'กำลังดำเนินการ',
      statuses: ['assigned', 'in_progress', 'waiting_info'],
      color: 'border-t-blue-600 bg-blue-50/30'
    },
    {
      id: 'col_review',
      title: 'รอตรวจสอบ (หน.กอง)',
      statuses: ['pending_review', 'revision'],
      color: 'border-t-amber-500 bg-amber-50/30'
    },
    {
      id: 'col_approve',
      title: 'รออนุมัติ (ปลัด/นายก)',
      statuses: ['pending_approve'],
      color: 'border-t-indigo-600 bg-indigo-50/30'
    },
    {
      id: 'col_done',
      title: 'เสร็จแล้ว / ปิดงาน',
      statuses: ['approved', 'completed', 'closed'],
      color: 'border-t-emerald-600 bg-emerald-50/30'
    }
  ];

  const filteredTasks = tasks.filter(t => {
    if (selectedDept === 'all') return true;
    return t.departmentId === selectedDept;
  });

  const [activeMobileCol, setActiveMobileCol] = useState<string>('all');

  const displayedColumns = activeMobileCol === 'all' 
    ? columns 
    : columns.filter(c => c.id === activeMobileCol);

  return (
    <div className="space-y-4">
      {/* Kanban Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <KanbanSquare className="w-6 h-6 text-blue-600" />
            กระดานคัมบังติดตามงาน อบต. (Kanban Board)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            มองเห็นภาพรวมของงานทุกกอง เลื่อนสถานะตามขั้นตอนราชการได้อย่างรวดเร็ว
          </p>
        </div>

        {/* Filter by Dept */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">🏢 แสดงทุกกอง / ส่วน</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Column Quick Switcher */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs">
        <button
          onClick={() => setActiveMobileCol('all')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
            activeMobileCol === 'all'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          ทั้งหมด ({filteredTasks.length})
        </button>
        {columns.map(col => {
          const count = filteredTasks.filter(t => col.statuses.includes(t.status)).length;
          const isActive = activeMobileCol === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileCol(col.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{col.title.split(' ')[0]}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Board Columns Grid / Mobile Snap Carousel */}
      <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start snap-x snap-mandatory">
        {displayedColumns.map((col) => {
          const colTasks = filteredTasks.filter(t => col.statuses.includes(t.status));

          return (
            <div
              key={col.id}
              className={`w-[85vw] sm:w-[60vw] md:w-auto shrink-0 md:shrink snap-center rounded-2xl border border-slate-200 shadow-sm flex flex-col max-h-[75vh] md:max-h-[80vh] border-t-4 ${col.color}`}
            >
              {/* Column Header */}
              <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 truncate">
                  {col.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {colTasks.length}
                </span>
              </div>

              {/* Column Card List */}
              <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1">
                {colTasks.length > 0 ? (
                  colTasks.map((task) => {
                    const deadline = getDeadlineStatus(task.dueDate, task.status === 'completed' || task.status === 'closed');
                    const urgencyCfg = getUrgencyBadge(task.urgency);

                    return (
                      <div
                        key={task.id}
                        onClick={() => onOpenTaskDetail(task.id)}
                        className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer space-y-2 group"
                      >
                        {/* Top: Task No & Urgency */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-mono font-bold text-slate-500">
                            {task.taskNo}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${urgencyCfg.badgeClass}`}>
                            {urgencyCfg.emoji} {urgencyCfg.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition">
                          {task.title}
                        </h4>

                        {/* Department & Assignee */}
                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <div className="truncate font-medium text-blue-700">
                            🏢 {task.departmentName}
                          </div>
                          <div className="truncate text-slate-600">
                            👤 {task.assigneeName}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                            <span>ความคืบหน้า</span>
                            <span className="font-mono font-bold">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                task.progress >= 80 ? 'bg-emerald-500' : task.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Bottom: Countdown Badge & Quick Transition */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${deadline.badgeClass}`}>
                            {deadline.label}
                          </span>

                          {/* Quick Workflow Shifter */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {col.id === 'col_received' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'in_progress')}
                                className="p-1 rounded hover:bg-slate-100 text-blue-600 text-[10px] font-bold"
                                title="เริ่มดำเนินการ"
                              >
                                เริ่มงาน →
                              </button>
                            )}
                            {col.id === 'col_progress' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'pending_review')}
                                className="p-1 rounded hover:bg-slate-100 text-amber-600 text-[10px] font-bold"
                                title="ส่งตรวจสอบ"
                              >
                                ส่งตรวจ →
                              </button>
                            )}
                            {col.id === 'col_review' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'pending_approve')}
                                className="p-1 rounded hover:bg-slate-100 text-indigo-600 text-[10px] font-bold"
                                title="เสนออนุมัติ"
                              >
                                เสนออนุมัติ →
                              </button>
                            )}
                            {col.id === 'col_approve' && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                                className="p-1 rounded hover:bg-slate-100 text-emerald-600 text-[10px] font-bold"
                                title="อนุมัติ/ปิดงาน"
                              >
                                อนุมัติ ✓
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    ไม่มีภารกิจในขั้นตอนนี้
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
