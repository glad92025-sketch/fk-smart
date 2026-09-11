import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Phone,
  Mail,
  Building,
  Award,
  Plus
} from 'lucide-react';
import { StaffMember, Department, Task } from '../types';

interface StaffAndWorkloadProps {
  staff: StaffMember[];
  departments: Department[];
  tasks: Task[];
  onOpenNewTaskForStaff: (staffId: string) => void;
}

export const StaffAndWorkload: React.FC<StaffAndWorkloadProps> = ({
  staff,
  departments,
  tasks,
  onOpenNewTaskForStaff
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const filteredStaff = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'all' || s.departmentId === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            บุคลากร อบต. และการกระจายภาระงาน (Staff & Workload)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ตรวจสอบภาระงานรายบุคคล ป้องกันงานล้นมือ และติดตามประสิทธิภาพการปฏิบัติงาน
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อเจ้าหน้าที่, ตำแหน่ง..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full sm:w-56 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
        >
          <option value="all">🏢 ทุกกอง / ส่วนราชการ</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((person) => {
          // Calculate active tasks from real list
          const personTasks = tasks.filter(t => t.assigneeId === person.id);
          const activeTasksCount = personTasks.filter(t => !['completed', 'closed', 'cancelled'].includes(t.status)).length;
          const overdueTasksCount = personTasks.filter(t => t.status === 'overdue').length;

          // Workload level badge
          let workloadColor = 'bg-emerald-100 text-emerald-800';
          let workloadLabel = 'ภาระงานปกติ';
          if (activeTasksCount >= 4) {
            workloadColor = 'bg-rose-100 text-rose-800';
            workloadLabel = 'ภาระงานสูงมาก (ใกล้ล้น)';
          } else if (activeTasksCount >= 2) {
            workloadColor = 'bg-amber-100 text-amber-800';
            workloadLabel = 'ภาระงานปานกลาง';
          }

          return (
            <div
              key={person.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Profile row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                      {person.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-800 truncate">
                        {person.name}
                      </h3>
                      <p className="text-xs text-blue-700 font-medium truncate">
                        {person.position}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {person.departmentName}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${workloadColor}`}>
                    {workloadLabel}
                  </span>
                </div>

                {/* Rating & Contact */}
                {(() => {
                  const ratingVal = typeof person.rating === 'number'
                    ? person.rating
                    : Math.min(5, Math.max(3.8, 3.8 + ((person.completedTasks || 0) / Math.max(1, person.totalTasks || 10)) * 1.2));
                  return (
                    <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{ratingVal.toFixed(1)} / 5.0</span>
                        <span className="text-[11px] text-slate-400 font-normal">({person.completedTasks ?? 0} งานเสร็จ)</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {person.phone || '-'}
                      </span>
                    </div>
                  );
                })()}

                {/* Stats 3 columns */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">งานในมือ</span>
                    <strong className="text-blue-700 text-sm">{activeTasksCount}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">เสร็จสิ้น</span>
                    <strong className="text-emerald-700 text-sm">{person.completedTasks}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">เกินกำหนด</span>
                    <strong className="text-rose-700 text-sm">{overdueTasksCount}</strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenNewTaskForStaff(person.id)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>มอบหมายงานให้บุคคลนี้</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
