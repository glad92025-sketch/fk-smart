import React from 'react';
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  Building,
  Coins,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  UserCheck,
  Calendar,
  Layers,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Task, Department, ProjectItem, User } from '../types';
import { getDeadlineStatus, formatThaiCurrency, formatThaiDate } from '../utils/thaiDate';

interface ExecutiveDashboardProps {
  tasks: Task[];
  departments: Department[];
  projects: ProjectItem[];
  currentUser: User;
  onOpenTaskDetail: (taskId: string) => void;
  onNavigateToTasks: (filter?: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  tasks,
  departments,
  projects,
  currentUser,
  onOpenTaskDetail,
  onNavigateToTasks
}) => {
  // Statistics calculations
  const totalTasks = tasks.length;
  const newTasks = tasks.filter(t => ['pending_receive', 'received', 'pending_assign'].includes(t.status)).length;
  const inProgressTasks = tasks.filter(t => ['in_progress', 'assigned', 'waiting_info'].includes(t.status)).length;
  const pendingReviewTasks = tasks.filter(t => t.status === 'pending_review' || t.status === 'revision').length;
  const pendingApproveTasks = tasks.filter(t => t.status === 'pending_approve').length;
  
  // Overdue and upcoming
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const overdueTasksList = tasks.filter(t => {
    if (['completed', 'closed', 'cancelled'].includes(t.status)) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < now || t.status === 'overdue';
  });

  const dueSoonTasksList = tasks.filter(t => {
    if (['completed', 'closed', 'cancelled'].includes(t.status)) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 3;
  });

  const completedTasks = tasks.filter(t => ['completed', 'closed'].includes(t.status)).length;
  const cancelledTasks = tasks.filter(t => t.status === 'cancelled').length;

  // Urgent breakdown
  const criticalUrgentTasks = tasks.filter(t => t.urgency === 'critical' && !['completed', 'closed'].includes(t.status));
  const highUrgentTasks = tasks.filter(t => t.urgency === 'urgent' && !['completed', 'closed'].includes(t.status));
  const normalUrgentTasks = tasks.filter(t => t.urgency === 'normal' && !['completed', 'closed'].includes(t.status));

  // Department counts
  const deptTaskCounts = departments.map(d => {
    const dTasks = tasks.filter(t => t.departmentId === d.id);
    const completed = dTasks.filter(t => ['completed', 'closed'].includes(t.status)).length;
    const inProgress = dTasks.filter(t => !['completed', 'closed', 'cancelled'].includes(t.status)).length;
    return {
      department: d,
      total: dTasks.length,
      completed,
      inProgress,
      rate: dTasks.length > 0 ? Math.round((completed / dTasks.length) * 100) : 0
    };
  });

  // Budget summaries from projects
  const totalBudget = projects.reduce((acc, p) => acc + p.totalBudget, 0);
  const spentBudget = projects.reduce((acc, p) => acc + p.spentBudget, 0);
  const remainingBudget = totalBudget - spentBudget;
  const disbursementRate = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-blue-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-950">
                EXECUTIVE DASHBOARD
              </span>
              <span className="text-xs text-blue-200">
                ระบบบริหารงาน อบต. แบบครบวงจร (BANG-TAO MODEL)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              ศูนย์บัญชาการภารกิจ องค์การบริหารส่วนตำบลฝางคำ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              ยินดีต้อนรับ: <strong className="text-amber-300">{currentUser.name}</strong> ({currentUser.position})
              • วันนี้: {formatThaiDate(new Date().toISOString(), true)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-center">
              <span className="text-[11px] text-slate-300 block">งานเสร็จสิ้น</span>
              <span className="text-xl font-extrabold text-emerald-400">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-center">
              <span className="text-[11px] text-slate-300 block">เบิกจ่ายงบ</span>
              <span className="text-xl font-extrabold text-amber-300">
                {disbursementRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 9 Status Summary Cards with Different Colors as required */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            ภาพรวมสถานะภารกิจทั้งหมด (9 มิติงาน)
          </h2>
          <span className="text-xs text-slate-500">
            อัปเดตแบบเรียลไทม์
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: All */}
          <div 
            onClick={() => onNavigateToTasks()}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">งานทั้งหมด</span>
              <ClipboardList className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              {totalTasks}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">ภารกิจในระบบ</span>
          </div>

          {/* Card 2: New */}
          <div 
            onClick={() => onNavigateToTasks('new')}
            className="p-4 rounded-xl bg-sky-50 border border-sky-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-sky-700 mb-2">
              <span className="text-xs font-semibold">งานใหม่/รอรับเรื่อง</span>
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-800">
              {newTasks}
            </div>
            <span className="text-[11px] text-sky-600 mt-1 block">รอมอบหมาย/ลงรับ</span>
          </div>

          {/* Card 3: In Progress */}
          <div 
            onClick={() => onNavigateToTasks('in_progress')}
            className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-blue-700 mb-2">
              <span className="text-xs font-semibold">กำลังดำเนินการ</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-800">
              {inProgressTasks}
            </div>
            <span className="text-[11px] text-blue-600 mt-1 block">เจ้าหน้าที่กำลังทำ</span>
          </div>

          {/* Card 4: Pending Review */}
          <div 
            onClick={() => onNavigateToTasks('review')}
            className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-amber-800 mb-2">
              <span className="text-xs font-semibold">รอตรวจสอบ</span>
              <UserCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-900">
              {pendingReviewTasks}
            </div>
            <span className="text-[11px] text-amber-700 mt-1 block">หัวหน้ากองตรวจ</span>
          </div>

          {/* Card 5: Pending Approve */}
          <div 
            onClick={() => onNavigateToTasks('approve')}
            className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-indigo-700 mb-2">
              <span className="text-xs font-semibold">รออนุมัติ</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-800">
              {pendingApproveTasks}
            </div>
            <span className="text-[11px] text-indigo-600 mt-1 block">ปลัด/นายก พิจารณา</span>
          </div>

          {/* Card 6: Due Soon */}
          <div 
            onClick={() => onNavigateToTasks('due_soon')}
            className="p-4 rounded-xl bg-orange-50 border border-orange-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-orange-800 mb-2">
              <span className="text-xs font-semibold">ใกล้ครบกำหนด</span>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-900">
              {dueSoonTasksList.length}
            </div>
            <span className="text-[11px] text-orange-700 mt-1 block">เหลือ ≤ 3 วัน</span>
          </div>

          {/* Card 7: Overdue */}
          <div 
            onClick={() => onNavigateToTasks('overdue')}
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-rose-800 mb-2">
              <span className="text-xs font-semibold">เกินกำหนด</span>
              <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-800">
              {overdueTasksList.length}
            </div>
            <span className="text-[11px] text-rose-600 mt-1 block font-semibold">ต้องเร่งรัดด่วน</span>
          </div>

          {/* Card 8: Completed */}
          <div 
            onClick={() => onNavigateToTasks('completed')}
            className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-semibold">เสร็จสิ้นแล้ว</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
              {completedTasks}
            </div>
            <span className="text-[11px] text-emerald-600 mt-1 block">ปิดภารกิจสมบูรณ์</span>
          </div>

          {/* Card 9: Cancelled */}
          <div 
            onClick={() => onNavigateToTasks('cancelled')}
            className="p-4 rounded-xl bg-slate-100 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-600 mb-2">
              <span className="text-xs font-semibold">ยกเลิก</span>
              <span className="text-xs text-slate-400">ยุติ</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-700">
              {cancelledTasks}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">ยกเลิกคำขอ</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Department Workload & Urgent Tasks Action List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: งานที่ต้องเร่งดำเนินการวันนี้ / วิกฤต (Urgent Alert Box) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  ภารกิจเร่งด่วนและงานที่ต้องติดตามวันนี้
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  งานระดับวิกฤต (🔴) และงานที่ใกล้ถึงกำหนดส่ง (Countdown)
                </p>
              </div>
              <button
                onClick={() => onNavigateToTasks('urgent')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Critical/Overdue Tasks */}
              {overdueTasksList.concat(criticalUrgentTasks).slice(0, 4).map((task, idx) => {
                const deadline = getDeadlineStatus(task.dueDate, task.status === 'completed' || task.status === 'closed');
                return (
                  <div
                    key={`${task.id}-${idx}`}
                    onClick={() => onOpenTaskDetail(task.id)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {task.taskNo}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${deadline.badgeClass}`}>
                          {deadline.label}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                          {task.departmentName}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>ผู้รับผิดชอบ: <strong className="text-slate-700">{task.assigneeName}</strong></span>
                        <span>ความคืบหน้า: {task.progress}%</span>
                      </div>
                    </div>

                    {/* Progress Bar & Action */}
                    <div className="sm:w-36 flex flex-col items-end gap-1.5 shrink-0">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${task.progress >= 80 ? 'bg-emerald-500' : task.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-blue-600 font-medium">
                        คลิกเพื่อดูรายละเอียด →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Workload by Department (งานตามกอง) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  สถิติภารกิจแยกตามกอง / ส่วนราชการ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  แสดงปริมาณงานทั้งหมด อัตราความสำเร็จ และงานที่อยู่ระหว่างดำเนินการ
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {deptTaskCounts.map(({ department, total, completed, inProgress, rate }) => (
                <div key={department.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: department.color }}
                      />
                      <span className="text-sm font-bold text-slate-800">
                        {department.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        (หน.: {department.headName.split(' ')[0]})
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700">
                      เสร็จ {completed}/{total} งาน ({rate}%)
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${rate}%`,
                        backgroundColor: department.color 
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>กำลังดำเนินการ: <strong className="text-blue-700">{inProgress} งาน</strong></span>
                    <span>บุคลากรประจำกอง: {department.memberCount} ท่าน</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Urgent Breakdown, Budget & Quick Executive Insights */}
        <div className="space-y-6">
          {/* Urgency Breakdown Cards */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              การจัดระดับความเร่งด่วน
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🔴</span>
                  <div>
                    <h5 className="text-xs font-bold text-rose-900">วิกฤต (Critical)</h5>
                    <p className="text-[11px] text-rose-700">ส่งผลกระทบสาธารณะทันที</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-rose-800">
                  {criticalUrgentTasks.length}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🟠</span>
                  <div>
                    <h5 className="text-xs font-bold text-amber-900">เร่งด่วน (Urgent)</h5>
                    <p className="text-[11px] text-amber-700">ต้องดำเนินการภายใน 3 วัน</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-amber-800">
                  {highUrgentTasks.length}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🟡</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">ปกติ (Normal)</h5>
                    <p className="text-[11px] text-slate-500">ตามกรอบเวลามาตรฐาน</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-slate-700">
                  {normalUrgentTasks.length}
                </span>
              </div>
            </div>
          </div>

          {/* Budget Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                งบประมาณโครงการ อบต.
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                ปี 2569
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">งบประมาณโครงการรวม</span>
                <span className="text-lg font-bold text-slate-800">
                  {formatThaiCurrency(totalBudget)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] text-emerald-700 block">เบิกจ่ายแล้ว</span>
                  <span className="text-sm font-bold text-emerald-900">
                    {formatThaiCurrency(spentBudget)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
                  <span className="text-[11px] text-sky-700 block">คงเหลือ</span>
                  <span className="text-sm font-bold text-sky-900">
                    {formatThaiCurrency(remainingBudget)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>อัตราการเบิกจ่ายจริง</span>
                  <span className="font-bold text-emerald-700">{disbursementRate}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${disbursementRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Advisor Note */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-sm border border-indigo-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                GovAI สรุปข้อเสนอแนะผู้บริหาร
              </h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              • กองช่างมีงานค้างและงานวิกฤต (ถนนชำรุด ม.3) ควรเร่งรัดให้เสร็จก่อนฝนตกชุก<br/>
              • กองการศึกษามีงานตรวจโภชนาการเด็กเกินกำหนด 3 วัน ควรรีบติดตามผลจาก รพ.สต.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
