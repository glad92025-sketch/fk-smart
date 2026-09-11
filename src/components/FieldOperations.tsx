import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Truck,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calendar,
  Camera,
  FileText,
  X,
  Navigation
} from 'lucide-react';
import { FieldOperation, Department, User } from '../types';
import { formatThaiDate } from '../utils/thaiDate';

interface FieldOperationsProps {
  fieldOps: FieldOperation[];
  departments: Department[];
  currentUser: User;
  onAddFieldOp: (op: FieldOperation) => void;
  onUpdateFieldOp: (op: FieldOperation) => void;
  onCreateTaskFromOp?: (op: FieldOperation) => void;
}

export const FieldOperations: React.FC<FieldOperationsProps> = ({
  fieldOps,
  departments,
  currentUser,
  onAddFieldOp,
  onUpdateFieldOp,
  onCreateTaskFromOp
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [activeDetailOp, setActiveDetailOp] = useState<FieldOperation | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    village: 'หมู่ที่ 1',
    coordinates: '15.1850, 105.3250',
    departmentId: currentUser.departmentId || 'dept_tech',
    officers: currentUser.name,
    vehicleNo: 'บย-4512 อุบลราชธานี (รถตรวจการ)',
    objective: '',
    description: '',
    results: '',
    status: 'in_progress' as 'planned' | 'in_progress' | 'completed'
  });

  const villages = [
    'หมู่ที่ 1 บ้านฝางคำ',
    'หมู่ที่ 2 บ้านโนนทอง',
    'หมู่ที่ 3 บ้านโนนสว่าง',
    'หมู่ที่ 4 บ้านดงบัง',
    'หมู่ที่ 5 บ้านหนองไฮ',
    'หมู่ที่ 6 บ้านดอนกลาง',
    'หมู่ที่ 7 บ้านคำสมบูรณ์',
    'หมู่ที่ 8 บ้านโคกพัฒนา'
  ];

  // Filtered list
  const filteredOps = fieldOps.filter((op) => {
    const matchSearch =
      op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.opNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.officers.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchDept = selectedDept === 'all' || op.departmentId === selectedDept;
    const matchStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchVillage = selectedVillage === 'all' || op.village.includes(selectedVillage);

    return matchSearch && matchDept && matchStatus && matchVillage;
  });

  // Stats
  const totalOps = fieldOps.length;
  const completedOps = fieldOps.filter((o) => o.status === 'completed').length;
  const inProgressOps = fieldOps.filter((o) => o.status === 'in_progress').length;
  const plannedOps = fieldOps.filter((o) => o.status === 'planned').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim()) return;

    const newOp: FieldOperation = {
      id: `fld_${Date.now()}`,
      opNo: `สป-ลพ-69-${String(fieldOps.length + 1).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      title: formData.title,
      location: formData.location,
      village: formData.village,
      coordinates: formData.coordinates,
      officers: formData.officers.split(',').map((s) => s.trim()),
      vehicleNo: formData.vehicleNo,
      objective: formData.objective,
      description: formData.description,
      results: formData.results || 'อยู่ระหว่างการดำเนินงานภาคสนาม',
      status: formData.status,
      departmentId: formData.departmentId,
      fiscalYear: '2569'
    };

    onAddFieldOp(newOp);
    setShowAddModal(false);
    setFormData({
      title: '',
      location: '',
      village: 'หมู่ที่ 1',
      coordinates: '15.1850, 105.3250',
      departmentId: currentUser.departmentId || 'dept_tech',
      officers: currentUser.name,
      vehicleNo: 'บย-4512 อุบลราชธานี (รถตรวจการ)',
      objective: '',
      description: '',
      results: '',
      status: 'in_progress'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span>งานลงพื้นที่ & ตรวจการภาคสนาม</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            บันทึกการตรวจราชการ สำรวจพื้นที่ ซ่อมบำรุง และลงพื้นที่บริการประชาชน อบต.ฝางคำ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>บันทึกการลงพื้นที่ใหม่</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">ภารกิจลงพื้นที่ทั้งหมด</div>
            <div className="text-xl font-bold text-slate-800">{totalOps} <span className="text-xs font-normal text-slate-400">ครั้ง</span></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">ดำเนินการแล้วเสร็จ</div>
            <div className="text-xl font-bold text-emerald-600">{completedOps} <span className="text-xs font-normal text-slate-400">ครั้ง</span></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">กำลังปฏิบัติงานในพื้นที่</div>
            <div className="text-xl font-bold text-amber-600">{inProgressOps} <span className="text-xs font-normal text-slate-400">จุด</span></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">ยานพาหนะพร้อมใช้</div>
            <div className="text-xl font-bold text-indigo-600">4 <span className="text-xs font-normal text-slate-400">คัน</span></div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาเลขบันทึก, เรื่องที่ลงพื้นที่, สถานที่, หรือรายชื่อเจ้าหน้าที่..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2">
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

            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
            >
              <option value="all">📍 ทุกหมู่บ้าน (8 หมู่)</option>
              {villages.map((v, i) => (
                <option key={i} value={`หมู่ที่ ${i + 1}`}>
                  {v}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
            >
              <option value="all">📌 ทุกสถานะ</option>
              <option value="in_progress">กำลังปฏิบัติงาน</option>
              <option value="completed">เสร็จสิ้นแล้ว</option>
              <option value="planned">วางแผนงาน</option>
            </select>
          </div>
        </div>
      </div>

      {/* Field Operations Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOps.map((op) => {
          const dept = departments.find((d) => d.id === op.departmentId);

          return (
            <div
              key={op.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {op.opNo}
                    </span>
                    <span className="text-[11px] text-blue-700 font-medium px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                      {dept?.name || 'สำนักปลัด'}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                      op.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : op.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {op.status === 'completed' ? '✓ รายงานผลเสร็จสิ้น' : op.status === 'in_progress' ? '⚡ กำลังลงพื้นที่' : '📋 ตามแผนงาน'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {op.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>วันที่ลงพื้นที่: {formatThaiDate(op.date)}</span>
                    <span className="text-slate-300">•</span>
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-medium text-slate-700">{op.village} ({op.location})</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div>
                    <strong className="text-slate-700">วัตถุประสงค์:</strong> {op.objective}
                  </div>
                  <div>
                    <strong className="text-slate-700">ผลการปฏิบัติงาน:</strong> {op.results}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>เจ้าหน้าที่: {op.officers.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="truncate max-w-[200px]">{op.vehicleNo}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(op.coordinates)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium py-1.5 px-2 rounded-lg hover:bg-blue-50 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>ดูพิกัด GPS ({op.coordinates})</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveDetailOp(op)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                  >
                    รายละเอียดเต็ม
                  </button>

                  {op.status === 'in_progress' && (
                    <button
                      onClick={() =>
                        onUpdateFieldOp({
                          ...op,
                          status: 'completed',
                          results: op.results + ' (ยืนยันผลการตรวจสอบเสร็จสมบูรณ์)'
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      ยืนยันงานเสร็จ
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredOps.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs sm:text-sm bg-white rounded-2xl border border-slate-200">
            ไม่พบรายการลงพื้นที่ตามเงื่อนไขที่ค้นหา
          </div>
        )}
      </div>

      {/* Add Field Operation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>บันทึกการลงพื้นที่ & ปฏิบัติงานภาคสนาม</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">เรื่อง / ภารกิจการลงพื้นที่ *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="เช่น ตรวจสอบถนนทรุดตัว, ซ่อมบำรุงไฟฟ้าสาธารณะ, เยี่ยมผู้ป่วยติดเตียง..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">หมู่บ้านเป้าหมาย *</label>
                  <select
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {villages.map((v, i) => (
                      <option key={i} value={`หมู่ที่ ${i + 1}`}>
                        {v}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">สถานที่ระบุเฉพาะ *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="เช่น ซอย 4 หน้าวัดบ้านโนนสว่าง, หนองน้ำสาธารณะ..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">พิกัด GPS (ละติจูด, ลองจิจูด)</label>
                  <input
                    type="text"
                    value={formData.coordinates}
                    onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                    placeholder="15.1850, 105.3250"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">เจ้าหน้าที่ร่วมลงพื้นที่ (คั่นด้วยจุลภาค)</label>
                  <input
                    type="text"
                    value={formData.officers}
                    onChange={(e) => setFormData({ ...formData, officers: e.target.value })}
                    placeholder="นายสมชาย คำมั่น, นายธีรพงษ์..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ยานพาหนะราชการที่ใช้</label>
                  <input
                    type="text"
                    value={formData.vehicleNo}
                    onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                    placeholder="บย-4512 อุบลราชธานี (รถกระบะตรวจการ)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">วัตถุประสงค์การลงพื้นที่</label>
                <textarea
                  rows={2}
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="ระบุเป้าหมายในการลงพื้นที่ครั้งนี้..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">รายละเอียดและผลการปฏิบัติงาน</label>
                <textarea
                  rows={3}
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  placeholder="บันทึกสิ่งที่ตรวจพบ หรือผลการแก้ไขปัญหาเบื้องต้น..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-600 shrink-0" />
                <span>สามารถบันทึกภาพถ่ายสภาพพื้นที่จริงแนบในรายงานได้ภายหลัง</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md"
                >
                  บันทึกข้อมูลลงระบบ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeDetailOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
              <div>
                <span className="font-mono text-xs text-amber-400">{activeDetailOp.opNo}</span>
                <h3 className="font-bold text-sm sm:text-base text-white">{activeDetailOp.title}</h3>
              </div>
              <button
                onClick={() => setActiveDetailOp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 text-xs">วันที่ลงพื้นที่:</span>
                  <p className="font-bold text-slate-800">{formatThaiDate(activeDetailOp.date)}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">สถานที่/หมู่บ้าน:</span>
                  <p className="font-bold text-slate-800">{activeDetailOp.village} - {activeDetailOp.location}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">พิกัด GPS:</span>
                  <p className="font-mono font-semibold text-blue-600">{activeDetailOp.coordinates}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">ยานพาหนะ:</span>
                  <p className="font-semibold text-slate-800">{activeDetailOp.vehicleNo}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">คณะเจ้าหน้าที่ปฏิบัติงาน:</span>
                <p className="text-slate-800 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {activeDetailOp.officers.join(', ')}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">วัตถุประสงค์:</span>
                <p className="text-slate-800 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {activeDetailOp.objective}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">รายละเอียดและผลการปฏิบัติ:</span>
                <p className="text-slate-800 p-2.5 rounded-xl bg-slate-50 border border-slate-100 leading-relaxed">
                  {activeDetailOp.description || activeDetailOp.results}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeDetailOp.coordinates)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>เปิด Google Maps นำทาง</span>
                </a>

                <button
                  onClick={() => setActiveDetailOp(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
