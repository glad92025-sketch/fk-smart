import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Building2,
  Target,
  BarChart3,
  Calendar,
  X
} from 'lucide-react';
import { DepartmentKpi, Department, User } from '../types';

interface KpiPerformanceProps {
  kpis: DepartmentKpi[];
  departments: Department[];
  currentUser: User;
  onAddKpi: (kpi: DepartmentKpi) => void;
  onUpdateKpi: (kpi: DepartmentKpi) => void;
}

export const KpiPerformance: React.FC<KpiPerformanceProps> = ({
  kpis,
  departments,
  currentUser,
  onAddKpi,
  onUpdateKpi
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    departmentId: currentUser.departmentId || 'dept_office',
    target: 90,
    actual: 92,
    unit: '%',
    fiscalYear: '2569',
    scoreStar: 5,
    completionRate: 92,
    onTimeRate: 95
  });

  const filteredKpis = kpis.filter((k) => {
    const matchSearch =
      k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDept === 'all' || k.departmentId === selectedDept;
    return matchSearch && matchDept;
  });

  // Calculate overall performance
  const avgCompletion = kpis.length > 0 ? (kpis.reduce((sum, k) => sum + k.completionRate, 0) / kpis.length).toFixed(1) : '0';
  const avgOnTime = kpis.length > 0 ? (kpis.reduce((sum, k) => sum + k.onTimeRate, 0) / kpis.length).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const dept = departments.find((d) => d.id === formData.departmentId);

    const newKpi: DepartmentKpi = {
      id: `kpi_${Date.now()}`,
      title: formData.title,
      departmentId: formData.departmentId,
      departmentName: dept?.name || 'สำนักปลัด อบต.',
      target: Number(formData.target),
      actual: Number(formData.actual),
      unit: formData.unit,
      fiscalYear: formData.fiscalYear,
      scoreStar: Number(formData.scoreStar),
      completionRate: Number(formData.completionRate),
      onTimeRate: Number(formData.onTimeRate)
    };

    onAddKpi(newKpi);
    setShowAddModal(false);
    setFormData({
      title: '',
      departmentId: currentUser.departmentId || 'dept_office',
      target: 90,
      actual: 92,
      unit: '%',
      fiscalYear: '2569',
      scoreStar: 5,
      completionRate: 92,
      onTimeRate: 95
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>ตัวชี้วัดประสิทธิภาพราชการ & เกณฑ์ประเมิน LPA</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            การประเมินผลการปฏิบัติราชการตามคำรับรองการปฏิบัติราชการ ประจำปีงบประมาณ 2569 อบต.ฝางคำ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มตัวชี้วัดใหม่ (KPI)</span>
        </button>
      </div>

      {/* LPA Overall Score Summary */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>ผลการประเมินประสิทธิภาพ อปท. (LPA 2569)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            องค์การบริหารส่วนตำบลฝางคำ อยู่ในเกณฑ์ "ดีเลิศ"
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            ผ่านเกณฑ์ประเมินตัวชี้วัดทั้ง 5 ด้าน: ด้านการบริหารจัดการ, ด้านการบริหารงานบุคคลและกิจการสภา, ด้านการเงินและการคลัง, ด้านการบริการสาธารณะ, และด้านธรรมาภิบาล
          </p>
        </div>

        <div className="flex items-center gap-6 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
          <div className="text-center">
            <div className="text-xs text-slate-300">ความสำเร็จเฉลี่ย</div>
            <div className="text-3xl font-black text-amber-400 mt-0.5">{avgCompletion}%</div>
            <div className="text-[11px] text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> เกินเป้าหมาย
            </div>
          </div>

          <div className="h-10 w-px bg-white/20" />

          <div className="text-center">
            <div className="text-xs text-slate-300">เสร็จตรงกำหนด</div>
            <div className="text-3xl font-black text-blue-300 mt-0.5">{avgOnTime}%</div>
            <div className="text-[11px] text-slate-300 mt-0.5">ตรงเวลากฎหมาย</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาตัวชี้วัด, ส่วนราชการ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
        >
          <option value="all">🏢 ทุกส่วนราชการ</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredKpis.map((kpi) => {
          const isOverTarget = kpi.actual >= kpi.target;

          return (
            <div
              key={kpi.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-amber-300 transition"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    {kpi.departmentName}
                  </span>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < kpi.scoreStar ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                  {kpi.title}
                </h3>

                {/* Target vs Actual */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500">เป้าหมายตามเกณฑ์:</span>
                    <p className="font-bold text-slate-700 mt-0.5">
                      {kpi.target} {kpi.unit}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">ผลงานทำได้จริง:</span>
                    <p className={`font-bold mt-0.5 ${isOverTarget ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {kpi.actual} {kpi.unit} {isOverTarget ? '✓' : ''}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>ความสำเร็จตัวชี้วัด</span>
                    <span className="font-bold text-slate-800">{kpi.completionRate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        kpi.completionRate >= 90
                          ? 'bg-emerald-500'
                          : kpi.completionRate >= 80
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(kpi.completionRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span>อัตราส่งงานตรงเวลา: <strong className="text-slate-700">{kpi.onTimeRate}%</strong></span>
                <span className="font-mono text-slate-400">ปีงบฯ {kpi.fiscalYear}</span>
              </div>
            </div>
          );
        })}

        {filteredKpis.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs sm:text-sm bg-white rounded-2xl border border-slate-200">
            ไม่พบตัวชี้วัดตามเงื่อนไขที่เลือก
          </div>
        )}
      </div>

      {/* Add KPI Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <Target className="w-5 h-5 text-amber-400" />
                <span>กำหนดตัวชี้วัดการปฏิบัติราชการ (KPI)</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">ชื่อตัวชี้วัด *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="เช่น ร้อยละของเรื่องร้องเรียนที่แก้ไขแล้วเสร็จตามกำหนด..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ส่วนราชการผู้รับผิดชอบ *</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">เป้าหมาย</label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ผลงานจริง</label>
                  <input
                    type="number"
                    value={formData.actual}
                    onChange={(e) => setFormData({ ...formData, actual: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">หน่วยนับ</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">อัตราตรงเวลา (%)</label>
                  <input
                    type="number"
                    value={formData.onTimeRate}
                    onChange={(e) => setFormData({ ...formData, onTimeRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">คะแนนดาว (1-5)</label>
                  <select
                    value={formData.scoreStar}
                    onChange={(e) => setFormData({ ...formData, scoreStar: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value={5}>5 ดาว (ดีเยี่ยม)</option>
                    <option value={4}>4 ดาว (ดีมาก)</option>
                    <option value={3}>3 ดาว (ดี)</option>
                    <option value={2}>2 ดาว (พอใช้)</option>
                    <option value={1}>1 ดาว (ต้องปรับปรุง)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md"
                >
                  บันทึกตัวชี้วัด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
