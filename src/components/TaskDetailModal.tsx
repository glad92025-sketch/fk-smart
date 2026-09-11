import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  UserCheck,
  AlertCircle,
  FileText,
  Paperclip,
  Send,
  Plus,
  CheckSquare,
  Square,
  ShieldCheck,
  History,
  RotateCcw,
  Sparkles,
  Printer
} from 'lucide-react';
import { Task, User, TaskStatus, Subtask } from '../types';
import { 
  formatThaiDate, 
  formatThaiDateTime, 
  formatThaiCurrency, 
  getDeadlineStatus, 
  TASK_STATUS_CONFIG, 
  getUrgencyBadge 
} from '../utils/thaiDate';

interface TaskDetailModalProps {
  task: Task;
  currentUser: User;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  currentUser,
  onClose,
  onUpdateTask
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'timeline' | 'subtasks' | 'comments'>('info');

  // Interactive state for updating progress
  const [newProgress, setNewProgress] = useState(task.progress);
  const [obstacleNotes, setObstacleNotes] = useState(task.obstacleNotes || '');
  const [solutionNotes, setSolutionNotes] = useState(task.solutionNotes || '');
  const [actualOutcome, setActualOutcome] = useState(task.actualOutcome || '');
  
  // Interactive comment input
  const [newComment, setNewComment] = useState('');
  const [isOfficialNote, setIsOfficialNote] = useState(false);

  // New subtask title
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const deadline = getDeadlineStatus(task.dueDate, task.status === 'completed' || task.status === 'closed');
  const statusCfg = TASK_STATUS_CONFIG[task.status] || TASK_STATUS_CONFIG.in_progress;
  const urgencyCfg = getUrgencyBadge(task.urgency);

  // Permissions check
  const canApprove = ['mayor', 'clerk', 'super_admin'].includes(currentUser.role);
  const canReview = ['dept_head', 'clerk', 'mayor', 'super_admin'].includes(currentUser.role);
  const isAssignee = task.assigneeId === currentUser.id || currentUser.role === 'super_admin';

  // Handler: Update progress
  const handleSaveProgress = () => {
    const updated: Task = {
      ...task,
      progress: newProgress,
      obstacleNotes,
      solutionNotes,
      actualOutcome,
      status: newProgress === 100 && task.status === 'in_progress' ? 'pending_review' : task.status,
      timeline: [
        {
          id: `tm_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: `อัปเดตความคืบหน้าเป็น ${newProgress}%`,
          actorName: currentUser.name,
          actorRole: currentUser.roleTitle,
          details: actualOutcome ? `ผลงาน: ${actualOutcome}` : undefined
        },
        ...task.timeline
      ]
    };
    onUpdateTask(updated);
    alert('บันทึกความคืบหน้าเรียบร้อยแล้ว');
  };

  // Handler: Change Status
  const handleChangeStatus = (newStatus: TaskStatus, note?: string) => {
    const oldStatusLabel = TASK_STATUS_CONFIG[task.status].label;
    const newStatusLabel = TASK_STATUS_CONFIG[newStatus].label;
    
    const updated: Task = {
      ...task,
      status: newStatus,
      completedDate: newStatus === 'completed' || newStatus === 'closed' ? new Date().toISOString().slice(0, 10) : task.completedDate,
      timeline: [
        {
          id: `tm_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: `เปลี่ยนสถานะเป็น [${newStatusLabel}]`,
          actorName: currentUser.name,
          actorRole: currentUser.roleTitle,
          statusFrom: oldStatusLabel,
          statusTo: newStatusLabel,
          details: note || undefined
        },
        ...task.timeline
      ]
    };
    onUpdateTask(updated);
  };

  // Handler: Add Comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updated: Task = {
      ...task,
      comments: [
        ...task.comments,
        {
          id: `cmt_${Date.now()}`,
          authorName: currentUser.name,
          authorRole: currentUser.roleTitle,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          message: newComment.trim(),
          isOfficialNote
        }
      ]
    };
    onUpdateTask(updated);
    setNewComment('');
  };

  // Handler: Toggle Subtask
  const handleToggleSubtask = (subId: string) => {
    const updatedSubtasks = task.subtasks.map(s => {
      if (s.id === subId) {
        const nextCompleted = !s.completed;
        return {
          ...s,
          completed: nextCompleted,
          progress: nextCompleted ? 100 : 0
        };
      }
      return s;
    });

    // Auto-calculate parent progress
    const totalCount = updatedSubtasks.length;
    const completedCount = updatedSubtasks.filter(s => s.completed).length;
    const calculatedProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : task.progress;

    const updated: Task = {
      ...task,
      subtasks: updatedSubtasks,
      progress: calculatedProgress
    };
    setNewProgress(calculatedProgress);
    onUpdateTask(updated);
  };

  // Handler: Add Subtask
  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: `sub_${Date.now()}`,
      title: newSubtaskTitle.trim(),
      assigneeName: task.assigneeName,
      dueDate: task.dueDate,
      completed: false,
      progress: 0
    };
    const updatedSubtasks = [...task.subtasks, newSub];
    const totalCount = updatedSubtasks.length;
    const completedCount = updatedSubtasks.filter(s => s.completed).length;
    const calculatedProgress = Math.round((completedCount / totalCount) * 100);

    const updated: Task = {
      ...task,
      subtasks: updatedSubtasks,
      progress: calculatedProgress
    };
    setNewProgress(calculatedProgress);
    onUpdateTask(updated);
    setNewSubtaskTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-start justify-between gap-3 shrink-0">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                {task.taskNo}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${deadline.badgeClass}`}>
                {deadline.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${urgencyCfg.badgeClass}`}>
                {urgencyCfg.emoji} {urgencyCfg.label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {task.departmentName}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {task.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="พิมพ์บันทึกข้อความราชการ"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workflow / Approval Action Bar */}
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">สถานะปัจจุบัน:</span>
            <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${statusCfg.badgeClass}`}>
              {statusCfg.label}
            </span>
          </div>

          {/* Quick Action Buttons for Supervisor & Assignee */}
          <div className="flex items-center gap-2 flex-wrap">
            {canReview && task.status === 'pending_review' && (
              <>
                <button
                  onClick={() => handleChangeStatus('pending_approve', 'หัวหน้าตรวจสอบผ่าน เสนอปลัด/นายก อนุมัติ')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  ✓ ผ่านการตรวจสอบ (เสนออนุมัติ)
                </button>
                <button
                  onClick={() => handleChangeStatus('revision', 'ส่งกลับให้เจ้าหน้าที่แก้ไขเพิ่มเติม')}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  ↩ ส่งกลับแก้ไข
                </button>
              </>
            )}

            {canApprove && task.status === 'pending_approve' && (
              <>
                <button
                  onClick={() => handleChangeStatus('approved', 'นายก/ปลัด อนุมัติผลงานเรียบร้อย')}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  ★ อนุมัติงาน (Approved)
                </button>
                <button
                  onClick={() => handleChangeStatus('revision', 'ผู้บริหารให้ทบทวนแก้ไขใหม่')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  ↩ ส่งกลับทบทวน
                </button>
              </>
            )}

            {task.status === 'approved' && (
              <button
                onClick={() => handleChangeStatus('closed', 'ปิดงานและบันทึกเอกสารเข้าสู่คลังจัดเก็บ')}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition"
              >
                ✓ ปิดงานสมบูรณ์ (Close Task)
              </button>
            )}

            {task.status === 'in_progress' && (
              <button
                onClick={() => handleChangeStatus('pending_review', 'เจ้าหน้าที่ปฏิบัติงานเสร็จสิ้น ส่งเรื่องให้หัวหน้าตรวจสอบ')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
              >
                ส่งตรวจผลงาน (Submit for Review)
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-4 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ข้อมูลภารกิจ & ความคืบหน้า
          </button>
          <button
            onClick={() => setActiveTab('subtasks')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'subtasks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>งานย่อย / Checklist</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600 font-bold">
              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Timeline ประวัติงาน</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-[10px] text-blue-700 font-bold">
              {task.timeline.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>บันทึก & ความเห็น</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600 font-bold">
              {task.comments.length}
            </span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Core Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">ผู้รับผิดชอบหลัก:</span>
                  <strong className="text-slate-800 text-sm">{task.assigneeName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">ผู้มอบหมายงาน:</span>
                  <strong className="text-slate-800">{task.assignerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">ผู้แจ้ง / แหล่งที่มา:</span>
                  <span className="text-slate-700">{task.applicant}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">วันที่รับเรื่อง:</span>
                  <span className="text-slate-700">{formatThaiDate(task.receivedDate)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">กำหนดส่ง (Deadline):</span>
                  <strong className="text-slate-800">{formatThaiDate(task.dueDate)}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">งบประมาณโครงการ:</span>
                  <strong className="text-emerald-700 text-sm font-mono">
                    {task.budget > 0 ? formatThaiCurrency(task.budget) : 'ไม่มีงบประมาณ'}
                  </strong>
                </div>
                {task.budgetSource && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">แหล่งงบประมาณ:</span>
                    <span className="text-slate-700">{task.budgetSource}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  รายละเอียดภารกิจ
                </h4>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </div>
              </div>

              {/* Progress Slider & Update Section (Section 12 of prompt) */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    อัปเดตความคืบหน้าการปฏิบัติงาน ({newProgress}%)
                  </h4>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-600 text-white">
                    {newProgress}%
                  </span>
                </div>

                {/* Slider */}
                <div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newProgress}
                    onChange={(e) => setNewProgress(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>0% (เริ่ม)</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100% (เสร็จ)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      ผลการดำเนินงานล่าสุด:
                    </label>
                    <textarea
                      rows={2}
                      value={actualOutcome}
                      onChange={(e) => setActualOutcome(e.target.value)}
                      placeholder="ระบุสิ่งที่ได้ดำเนินการไปแล้ว..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      ปัญหา / อุปสรรค & แนวทางแก้ไข:
                    </label>
                    <textarea
                      rows={2}
                      value={obstacleNotes}
                      onChange={(e) => setObstacleNotes(e.target.value)}
                      placeholder="ระบุปัญหาหน้างานหรือข้อติดขัด (ถ้ามี)..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProgress}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition cursor-pointer"
                  >
                    บันทึกความคืบหน้าภารกิจ
                  </button>
                </div>
              </div>

              {/* Attachments Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    เอกสารและรูปภาพแนบ ({task.attachments.length})
                  </h4>
                  <button
                    onClick={() => alert('จำลองการอัปโหลดเอกสารแนบเข้าระบบ')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> แนบไฟล์เพิ่ม
                  </button>
                </div>

                {task.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {task.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-slate-800 truncate block">
                              {att.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {att.size} • อัปโหลดโดย {att.uploaderName}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => alert(`จำลองการดาวน์โหลดไฟล์: ${att.name}`)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold shrink-0 ml-2"
                        >
                          ดาวน์โหลด
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                    ยังไม่มีไฟล์แนบ
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtasks Tab (Section 14 of prompt) */}
          {activeTab === 'subtasks' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                ระบบงานย่อยคำนวณ Progress ของงานหลักอัตโนมัติตามสัดส่วนงานที่เสร็จสิ้น
              </div>

              {/* Add Subtask */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  placeholder="เพิ่มงานย่อยใหม่ เช่น สำรวจพื้นที่, จัดทำ TOR, ตรวจรับ..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shrink-0 cursor-pointer"
                >
                  + เพิ่มงานย่อย
                </button>
              </div>

              {/* Subtask list */}
              <div className="space-y-2">
                {task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => handleToggleSubtask(sub.id)}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                      sub.completed
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-500'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {sub.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className={`text-xs font-semibold block ${sub.completed ? 'line-through text-slate-400' : ''}`}>
                          {sub.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ผู้รับผิดชอบ: {sub.assigneeName} • กำหนด: {formatThaiDate(sub.dueDate)}
                        </span>
                      </div>
                    </div>

                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      sub.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {sub.completed ? '100%' : '0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Tab (Section 11 of prompt) */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                ไทม์ไลน์และประวัติการดำเนินงานราชการ (Audit Timeline)
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {task.timeline.map((evt, idx) => (
                  <div key={evt.id || idx} className="relative group">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 group-hover:border-blue-300 transition">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">{evt.action}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{evt.timestamp}</span>
                      </div>
                      <div className="text-xs text-blue-700 font-medium">
                        โดย: {evt.actorName} ({evt.actorRole})
                      </div>
                      {evt.details && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-white p-2 rounded border border-slate-100">
                          {evt.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments & Official Notes Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {task.comments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      cmt.isOfficialNote
                        ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <div className="flex items-center gap-1.5">
                        {cmt.isOfficialNote && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                            ข้อสั่งการทางการ
                          </span>
                        )}
                        <span className="text-slate-900">{cmt.authorName}</span>
                        <span className="text-slate-500 font-normal">({cmt.authorRole})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{cmt.timestamp}</span>
                    </div>
                    <p className="text-slate-700 mt-1">{cmt.message}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <textarea
                  rows={2}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="เขียนข้อสั่งการ คำแนะนำ หรือข้อคิดเห็นเพิ่มเติม..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOfficialNote}
                      onChange={(e) => setIsOfficialNote(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>กำหนดเป็นข้อสั่งการทางการ (Official Directive)</span>
                  </label>

                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> ส่งข้อความ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>เลขที่ภารกิจ: {task.taskNo} • ปีงบประมาณ {task.fiscalYear}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
