import React, { useState } from 'react';
import {
  FolderKanban,
  Coins,
  Plus,
  Search,
  Calendar,
  Building,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ProjectItem, Department } from '../types';
import { formatThaiCurrency, formatThaiDate } from '../utils/thaiDate';

interface ProjectsAndBudgetProps {
  projects: ProjectItem[];
  departments: Department[];
  onAddProject: (newProj: ProjectItem) => void;
}

export const ProjectsAndBudget: React.FC<ProjectsAndBudgetProps> = ({
  projects,
  departments,
  onAddProject
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Totals
  const totalBudget = projects.reduce((acc, p) => acc + p.totalBudget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spentBudget, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const filteredProjects = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.projectCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'all' || p.departmentId === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-600" />
            โครงการตามแผนพัฒนาท้องถิ่นและงบประมาณ อบต.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ติดตามโครงการก่อสร้าง, จัดซื้อจัดจ้าง และการเบิกจ่ายงบประมาณตาม พ.ร.บ.
          </p>
        </div>

        <button
          onClick={() => alert('เปิดแบบฟอร์มเพิ่มโครงการในแผนพัฒนาท้องถิ่น')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มโครงการใหม่</span>
        </button>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">งบประมาณโครงการรวม</span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
            {formatThaiCurrency(totalBudget)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">แผนพัฒนา ปี 2569</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
          <span className="text-xs font-semibold text-emerald-800 block mb-1">เบิกจ่ายจริงแล้ว</span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-800">
            {formatThaiCurrency(totalSpent)}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">อัตราเบิกจ่าย {overallRate}%</span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 shadow-sm">
          <span className="text-xs font-semibold text-sky-800 block mb-1">งบประมาณคงเหลือ</span>
          <div className="text-xl sm:text-2xl font-extrabold text-sky-800">
            {formatThaiCurrency(totalRemaining)}
          </div>
          <span className="text-[11px] text-sky-600 mt-1 block">รอทำสัญญา / เบิกจ่ายงวด</span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-sm">
          <span className="text-xs font-semibold text-indigo-800 block mb-1">จำนวนโครงการทั้งหมด</span>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-800">
            {projects.length} โครงการ
          </div>
          <span className="text-[11px] text-indigo-600 mt-1 block">
            เสร็จแล้ว {projects.filter(p => p.status === 'completed').length} โครงการ
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-800">
            รายการโครงการพัฒนาท้องถิ่น ({filteredProjects.length})
          </h2>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อโครงการ, รหัส..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50 focus:bg-white"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
            >
              <option value="all">ทุกกอง</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => {
            const spentRate = p.totalBudget > 0 ? Math.round((p.spentBudget / p.totalBudget) * 100) : 0;

            return (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {p.projectCode}
                    </span>
                    <h3 className="font-bold text-sm text-slate-800 mt-1">
                      {p.name}
                    </h3>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                    p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {p.status === 'completed' ? '✓ สำเร็จ' : 'กำลังทำ'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">งบประมาณตั้งไว้:</span>
                    <strong className="text-slate-800 font-mono">{formatThaiCurrency(p.totalBudget)}</strong>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">เบิกจ่ายแล้ว ({spentRate}%):</span>
                    <strong className="text-emerald-700 font-mono">{formatThaiCurrency(p.spentBudget)}</strong>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>ความคืบหน้าทางกายภาพ</span>
                    <span className="font-bold">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>🏢 {p.departmentName}</span>
                  <span>กำหนด: {formatThaiDate(p.endDate)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
