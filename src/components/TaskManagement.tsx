import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ClipboardList,
  Eye,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  ArrowUpDown,
  Download,
  Calendar,
  Database
} from 'lucide-react';
import { 
  Task, 
  Department, 
  TaskCategory, 
  User as UserType, 
  StaffMember, 
  UrgencyLevel, 
  TaskStatus 
} from '../types';
import { 
  formatThaiDate, 
  formatThaiCurrency, 
  getDeadlineStatus, 
  TASK_STATUS_CONFIG, 
  getUrgencyBadge 
} from '../utils/thaiDate';

interface TaskManagementProps {
  tasks: Task[];
  departments: Department[];
  categories: TaskCategory[];
  staff: StaffMember[];
  currentUser: UserType;
  initialFilter?: string;
  onOpenTaskDetail: (taskId: string) => void;
  onAddTask: (newTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenFirebaseModal?: () => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  departments,
  categories,
  staff,
  currentUser,
  initialFilter,
  onOpenTaskDetail,
  onAddTask,
  onDeleteTask,
  onOpenFirebaseModal
}) => {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilter || 'all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // New Task Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDeptId, setNewDeptId] = useState(departments[0]?.id || 'dept_tech');
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id || 'cat_routine');
  const [newAssigneeId, setNewAssigneeId] = useState(staff[0]?.id || 'stf_1');
  const [newUrgency, setNewUrgency] = useState<UrgencyLevel>('normal');
  const [newDueDate, setNewDueDate] = useState('2026-09-20');
  const [newBudget, setNewBudget] = useState<number>(0);
  const [newBudgetSource, setNewBudgetSource] = useState('งบประมาณรายจ่ายประจำปี 2569');
  const [newApplicant, setNewApplicant] = useState('ศูนย์ดำรงธรรม / ข้อสั่งการผู้บริหาร');
  const [newDescription, setNewDescription] = useState('');

  // Filter logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search
      const matchSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assigneeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.applicant.toLowerCase().includes(searchTerm.toLowerCase());

      // Dept
      const matchDept = selectedDept === 'all' || task.departmentId === selectedDept;

      // Urgency
      const matchUrgency = selectedUrgency === 'all' || task.urgency === selectedUrgency;

      // Category
      const matchCategory = selectedCategory === 'all' || task.categoryId === selectedCategory;

      // Status
      let matchStatus = true;
      if (selectedStatus === 'new') {
        matchStatus = ['pending_receive', 'received', 'pending_assign'].includes(task.status);
      } else if (selectedStatus === 'in_progress') {
        matchStatus = ['in_progress', 'assigned', 'waiting_info'].includes(task.status);
      } else if (selectedStatus === 'review') {
        matchStatus = ['pending_review', 'revision'].includes(task.status);
      } else if (selectedStatus === 'approve') {
        matchStatus = task.status === 'pending_approve';
      } else if (selectedStatus === 'due_soon') {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);
        const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        matchStatus = diff >= 0 && diff <= 3 && !['completed', 'closed'].includes(task.status);
      } else if (selectedStatus === 'overdue') {
        matchStatus = task.status === 'overdue' || (new Date(task.dueDate) < new Date() && !['completed', 'closed'].includes(task.status));
      } else if (selectedStatus === 'completed') {
        matchStatus = ['completed', 'closed'].includes(task.status);
      } else if (selectedStatus === 'cancelled') {
        matchStatus = task.status === 'cancelled';
      } else if (selectedStatus === 'urgent') {
        matchStatus = (task.urgency === 'critical' || task.urgency === 'urgent') && !['completed', 'closed'].includes(task.status);
      } else if (selectedStatus !== 'all') {
        matchStatus = task.status === selectedStatus;
      }

      return matchSearch && matchDept && matchUrgency && matchCategory && matchStatus;
    });
  }, [tasks, searchTerm, selectedDept, selectedStatus, selectedUrgency, selectedCategory]);

  // Handler: Submit new task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('กรุณากรอกชื่องาน');
      return;
    }

    const targetDept = departments.find(d => d.id === newDeptId) || departments[0];
    const targetCat = categories.find(c => c.id === newCategoryId) || categories[0];
    const targetStaff = staff.find(s => s.id === newAssigneeId) || staff[0];

    const todayStr = new Date().toISOString().slice(0, 10);
    const randomSeq = String(Math.floor(Math.random() * 900) + 100);

    const newTask: Task = {
      id: `tsk_${Date.now()}`,
      taskNo: `${targetDept.code}-2569/${randomSeq}`,
      title: newTitle.trim(),
      categoryId: targetCat.id,
      categoryName: targetCat.name,
      departmentId: targetDept.id,
      departmentName: targetDept.name,
      applicant: newApplicant.trim() || 'ข้อสั่งการภายใน',
      applicantType: 'internal',
      assignerName: `${currentUser.name} (${currentUser.roleTitle})`,
      assigneeId: targetStaff.id,
      assigneeName: `${targetStaff.name} (${targetStaff.position})`,
      reviewerName: `${targetDept.headName} (${targetDept.headPosition})`,
      approverName: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
      receivedDate: todayStr,
      startDate: todayStr,
      dueDate: newDueDate,
      urgency: newUrgency,
      status: 'assigned',
      progress: 0,
      budget: Number(newBudget) || 0,
      budgetSource: newBudgetSource,
      description: newDescription.trim() || newTitle.trim(),
      fiscalYear: '2569',
      subtasks: [
        {
          id: `sub_${Date.now()}_1`,
          title: 'รับมอบหมายงานและเริ่มสำรวจข้อมูล',
          assigneeName: targetStaff.name,
          dueDate: newDueDate,
          completed: false,
          progress: 0
        }
      ],
      timeline: [
        {
          id: `tm_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: 'สร้างและลงทะเบียนงานใหม่',
          actorName: currentUser.name,
          actorRole: currentUser.roleTitle,
          details: `มอบหมายให้ ${targetStaff.name}`
        }
      ],
      comments: [],
      attachments: []
    };

    onAddTask(newTask);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewBudget(0);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            ระบบบริหารและติดตามภารกิจทั้งหมด (Task Management)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ศูนย์กลางติดตามงานทุกกอง: รับเรื่อง → มอบหมาย → ดำเนินงาน → ตรวจสอบ → อนุมัติ → ปิดงาน
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenFirebaseModal && (
            <button
              onClick={onOpenFirebaseModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
              title="ตั้งค่าฐานข้อมูล Firebase Realtime / Persistent Storage"
            >
              <Database className="w-4 h-4 text-amber-600" />
              <span>ฐานข้อมูล (Firebase)</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างภารกิจใหม่ (ลงทะเบียนงาน)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่องาน, เลขที่งาน, ผู้รับผิดชอบ..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">🏢 ทุกกอง / ส่วนราชการ</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">⚡ ทุกสถานะงาน</option>
              <option value="new">งานใหม่ / รอรับเรื่อง</option>
              <option value="in_progress">กำลังดำเนินการ</option>
              <option value="review">รอตรวจสอบ</option>
              <option value="approve">รออนุมัติ</option>
              <option value="due_soon">ใกล้ครบกำหนด (≤3 วัน)</option>
              <option value="overdue">เกินกำหนด (Overdue)</option>
              <option value="completed">เสร็จสิ้นแล้ว</option>
              <option value="urgent">เร่งด่วน / วิกฤต</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">🎯 ทุกระดับความเร่งด่วน</option>
              <option value="critical">🔴 วิกฤต (Critical)</option>
              <option value="urgent">🟠 เร่งด่วน (Urgent)</option>
              <option value="normal">🟡 ปกติ (Normal)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            พบภารกิจทั้งหมด: <strong className="text-slate-800">{filteredTasks.length}</strong> รายการ
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedDept('all');
                setSelectedStatus('all');
                setSelectedUrgency('all');
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>
      </div>

      {/* Task List: Responsive Cards on Mobile & Full Table on Desktop */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Mobile View: Cards (< md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const deadline = getDeadlineStatus(task.dueDate, task.status === 'completed' || task.status === 'closed');
              const statusCfg = TASK_STATUS_CONFIG[task.status] || TASK_STATUS_CONFIG.in_progress;
              const urgencyCfg = getUrgencyBadge(task.urgency);

              return (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskDetail(task.id)}
                  className="p-4 bg-white hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {task.taskNo}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${urgencyCfg.badgeClass}`}>
                        {urgencyCfg.emoji} {urgencyCfg.label}
                      </span>
                    </div>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${statusCfg.badgeClass}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">
                      {task.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {task.categoryName} • ผู้ขอ: {task.applicant}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 truncate">
                      <Building className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="font-medium text-slate-700 truncate">{task.departmentName}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[120px]">{task.assigneeName}</span>
                    </div>
                  </div>

                  {/* Progress & Deadline */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        กำหนดส่ง: <strong className="text-slate-700">{formatThaiDate(task.dueDate)}</strong>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${deadline.badgeClass}`}>
                        {deadline.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            task.progress >= 80 ? 'bg-emerald-500' : task.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-700 shrink-0">
                        {task.progress}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100/80">
                      <span className="text-[11px] text-slate-400">แตะเพื่อดูรายละเอียด</span>
                      {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'clerk' || currentUser.role === 'mayor') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`ต้องการลบภารกิจงาน "${task.title}" ใช่หรือไม่?`)) {
                              onDeleteTask(task.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="ลบภารกิจงาน"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              ไม่พบข้อมูลภารกิจตามเงื่อนไขที่ค้นหา
            </div>
          )}
        </div>

        {/* Desktop View: Full Table (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">เลขที่งาน</th>
                <th className="py-3 px-4">ชื่องาน / ภารกิจ</th>
                <th className="py-3 px-4">กองที่รับผิดชอบ</th>
                <th className="py-3 px-4">ผู้รับผิดชอบ</th>
                <th className="py-3 px-4">กำหนดส่ง (Deadline)</th>
                <th className="py-3 px-4">ความเร่งด่วน</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4">ความคืบหน้า</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const deadline = getDeadlineStatus(task.dueDate, task.status === 'completed' || task.status === 'closed');
                  const statusCfg = TASK_STATUS_CONFIG[task.status] || TASK_STATUS_CONFIG.in_progress;
                  const urgencyCfg = getUrgencyBadge(task.urgency);

                  return (
                    <tr 
                      key={task.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => onOpenTaskDetail(task.id)}
                    >
                      {/* Task No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {task.taskNo}
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                        <div className="font-semibold text-slate-800 line-clamp-1">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {task.categoryName} • {task.applicant}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          {task.departmentName}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                        {task.assigneeName}
                      </td>

                      {/* Deadline Countdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-700">
                          {formatThaiDate(task.dueDate)}
                        </div>
                        <span className={`inline-block text-[11px] px-2 py-0.2 rounded font-bold mt-0.5 ${deadline.badgeClass}`}>
                          {deadline.label}
                        </span>
                      </td>

                      {/* Urgency */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${urgencyCfg.badgeClass}`}>
                          {urgencyCfg.emoji} {urgencyCfg.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.badgeClass}`}>
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Progress Bar */}
                      <td className="py-3.5 px-4 whitespace-nowrap w-32">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                task.progress >= 80 ? 'bg-emerald-500' : task.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-700 text-xs">
                            {task.progress}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenTaskDetail(task.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="ดูรายละเอียดและไทม์ไลน์"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'clerk' || currentUser.role === 'mayor') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`ต้องการลบภารกิจงาน "${task.title}" ใช่หรือไม่?`)) {
                                  onDeleteTask(task.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="ลบภารกิจงาน"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    ไม่พบข้อมูลภารกิจตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base sm:text-lg">ลงทะเบียนสร้างงานใหม่ (Add Government Task)</h3>
                <p className="text-xs text-slate-300">เข้าสู่ระบบติดตามภารกิจ อบต.ฝางคำ</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ชื่องาน / ภารกิจราชการ *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น ซ่อมแซมระบบประปาชำรุด หมู่ 4, จัดทำร่างข้อบัญญัติงบประมาณ..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    กอง / ส่วนราชการที่รับผิดชอบ *
                  </label>
                  <select
                    value={newDeptId}
                    onChange={(e) => setNewDeptId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ประเภทหมวดหมู่งาน *
                  </label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ผู้รับผิดชอบหลัก (เจ้าหน้าที่) *
                  </label>
                  <select
                    value={newAssigneeId}
                    onChange={(e) => setNewAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.departmentName} - {s.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ระดับความเร่งด่วน *
                  </label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="normal">🟡 ปกติ (Normal)</option>
                    <option value="urgent">🟠 เร่งด่วน (Urgent - ภายใน 3 วัน)</option>
                    <option value="critical">🔴 วิกฤต (Critical - ภายใน 24 ชม.)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    กำหนดส่ง (Deadline) *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ผู้แจ้ง / ที่มาของงาน
                  </label>
                  <input
                    type="text"
                    value={newApplicant}
                    onChange={(e) => setNewApplicant(e.target.value)}
                    placeholder="เช่น คำร้องประชาชน, ประธานสภา, นโยบายนายก..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    งบประมาณ (บาท)
                  </label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    แหล่งงบประมาณ
                  </label>
                  <input
                    type="text"
                    value={newBudgetSource}
                    onChange={(e) => setNewBudgetSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  รายละเอียดภารกิจ & วัตถุประสงค์
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="ระบุข้อเท็จจริง สิ่งที่ต้องทำ และผลผลิตที่ต้องการ..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow cursor-pointer"
                >
                  บันทึกและมอบหมายงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
