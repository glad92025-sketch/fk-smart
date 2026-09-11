import React, { useState } from 'react';
import { X, Plus, Calendar, Building, User, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { Task, Department, TaskCategory, StaffMember, UrgencyLevel, User as UserType } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTask: Task) => void;
  departments: Department[];
  categories: TaskCategory[];
  staff: StaffMember[];
  currentUser: UserType;
  defaultDepartmentId?: string;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  departments,
  categories,
  staff,
  currentUser,
  defaultDepartmentId
}) => {
  const [title, setTitle] = useState('');
  const [deptId, setDeptId] = useState(defaultDepartmentId || departments[0]?.id || 'dept_tech');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_routine');
  const [assigneeId, setAssigneeId] = useState(staff[0]?.id || 'stf_1');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [budget, setBudget] = useState<number>(0);
  const [budgetSource, setBudgetSource] = useState('งบประมาณรายจ่ายประจำปี 2569');
  const [applicant, setApplicant] = useState('ศูนย์ดำรงธรรม / ข้อสั่งการผู้บริหาร');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dept = departments.find(d => d.id === deptId) || departments[0];
    const cat = categories.find(c => c.id === categoryId) || categories[0];
    const stf = staff.find(s => s.id === assigneeId) || staff[0];

    const newTask: Task = {
      id: `tsk_${Date.now()}`,
      taskNo: `ทส-${dept.code}-2569-${String(Math.floor(Math.random() * 900) + 100)}`,
      title: title.trim(),
      description: description.trim() || 'ไม่มีรายละเอียดเพิ่มเติม',
      departmentId: dept.id,
      departmentName: dept.name,
      categoryId: cat.id,
      categoryName: cat.name,
      applicant: applicant.trim() || 'ประชาชน / ข้อสั่งการ',
      applicantType: 'order',
      assignerName: currentUser.name,
      assigneeId: stf.id,
      assigneeName: stf.name,
      urgency,
      status: 'pending_receive',
      receivedDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      dueDate,
      budget: Number(budget) || 0,
      budgetSource: Number(budget) > 0 ? budgetSource : undefined,
      fiscalYear: '2569',
      progress: 0,
      subtasks: [
        {
          id: `sub_${Date.now()}_1`,
          title: 'ลงรับเรื่องและตรวจสอบข้อเท็จจริง',
          assigneeName: stf.name,
          dueDate,
          completed: false,
          progress: 0
        },
        {
          id: `sub_${Date.now()}_2`,
          title: 'จัดทำแผนดำเนินการและเสนอผู้บริหาร',
          assigneeName: stf.name,
          dueDate,
          completed: false,
          progress: 0
        }
      ],
      attachments: [],
      comments: [
        {
          id: `cmt_${Date.now()}`,
          authorName: currentUser.name,
          authorRole: currentUser.roleTitle,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          message: 'ลงทะเบียนภารกิจเข้าระบบ อบต.ฝางคำ เรียบร้อยแล้ว',
          isOfficialNote: true
        }
      ],
      timeline: [
        {
          id: `time_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: 'สร้างภารกิจใหม่',
          actorName: currentUser.name,
          actorRole: currentUser.roleTitle,
          details: 'ลงทะเบียนงานในระบบ อบต.ฝางคำ'
        }
      ]
    };

    onAddTask(newTask);
    onClose();
    setTitle('');
    setDescription('');
    setBudget(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              ลงทะเบียนสร้างงานใหม่ (Add Government Task)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              ระบบติดตามภารกิจ อบต.ฝางคำ สอดคล้องระเบียบสารบรรณ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              ชื่องาน / ภารกิจราชการ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ซ่อมแซมระบบประปาชำรุด หมู่ 4, จัดทำร่างข้อบัญญัติงบประมาณรายจ่าย..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Department & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                กอง / ส่วนราชการที่รับผิดชอบ <span className="text-rose-500">*</span>
              </label>
              <select
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ประเภทหมวดหมู่งาน <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ผู้รับผิดชอบหลัก <span className="text-rose-500">*</span>
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500"
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.position})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ระดับความเร่งด่วน <span className="text-rose-500">*</span>
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">⚪ ปกติ (ดำเนินการตามแผนงาน)</option>
                <option value="urgent">🟡 ด่วน (เร่งรัดภายใน 3-5 วัน)</option>
                <option value="critical">🔴 ด่วนที่สุด / วิกฤต (กระทบประชาชนทันที)</option>
              </select>
            </div>
          </div>

          {/* Due Date & Applicant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                กำหนดส่ง (Deadline) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ที่มา / ผู้ร้องขอ / ข้อสั่งการ
              </label>
              <input
                type="text"
                value={applicant}
                onChange={(e) => setApplicant(e.target.value)}
                placeholder="เช่น นายก อบต., ศูนย์ดำรงธรรม, มติสภา..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                งบประมาณที่จัดสรร (บาท)
              </label>
              <input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                แหล่งงบประมาณ
              </label>
              <input
                type="text"
                value={budgetSource}
                onChange={(e) => setBudgetSource(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              รายละเอียดขอบเขตงาน และเป้าหมาย
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุวัตถุประสงค์ พื้นที่ดำเนินการ ขอบเขตงาน และสิ่งที่ต้องส่งมอบ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer min-h-[42px]"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer min-h-[42px]"
            >
              บันทึกและลงทะเบียนงาน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
