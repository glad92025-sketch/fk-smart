import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  MapPin,
  Phone,
  User,
  ArrowRight
} from 'lucide-react';
import { CitizenComplaint, Department } from '../types';

interface CitizenComplaintsProps {
  complaints: CitizenComplaint[];
  departments: Department[];
  onUpdateComplaint: (updated: CitizenComplaint) => void;
  onAddComplaint: (newComplaint: CitizenComplaint) => void;
}

const COMPLAINT_STEPS = [
  { step: 1, label: 'รับเรื่อง' },
  { step: 2, label: 'มอบหมาย' },
  { step: 3, label: 'ลงพื้นที่' },
  { step: 4, label: 'ดำเนินการ' },
  { step: 5, label: 'แนบรูปภาพ' },
  { step: 6, label: 'รายงานผล' },
  { step: 7, label: 'ปิดเรื่อง' }
];

export const CitizenComplaints: React.FC<CitizenComplaintsProps> = ({
  complaints,
  departments,
  onUpdateComplaint,
  onAddComplaint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeComplaint, setActiveComplaint] = useState<CitizenComplaint | null>(null);

  // New Complaint Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [villageNo, setVillageNo] = useState('3');
  const [location, setLocation] = useState('');
  const [deptId, setDeptId] = useState(departments[0]?.id || 'dept_tech');
  const [category, setCategory] = useState<'road'|'electricity'|'water'|'trash'|'trees'|'disaster'|'social'|'general'>('road');
  const [categoryLabel, setCategoryLabel] = useState('ถนนชำรุด');
  const [description, setDescription] = useState('');

  // Filter
  const filteredComplaints = complaints.filter(c => {
    const matchSearch = 
      (c.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.ticketNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchVillage = selectedVillage === 'all' || c.villageNo === selectedVillage;
    const matchStatus = selectedStatus === 'all' || (selectedStatus === 'closed' ? c.status === 'closed' : c.status !== 'closed');

    return matchSearch && matchVillage && matchStatus;
  });

  // Handler: Advance Step
  const handleAdvanceStep = (complaint: CitizenComplaint) => {
    if (complaint.step >= 7) return;
    const nextStep = (complaint.step + 1) as 1|2|3|4|5|6|7;
    const isFinished = nextStep === 7;

    const updated: CitizenComplaint = {
      ...complaint,
      step: nextStep,
      status: isFinished ? 'closed' : 'in_progress',
      photoAfter: isFinished ? (complaint.photoAfter || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80') : complaint.photoAfter,
      solutionSummary: isFinished ? 'ดำเนินการแก้ไขเสร็จสิ้นและแจ้งราษฎรเรียบร้อยแล้ว' : complaint.solutionSummary
    };
    onUpdateComplaint(updated);
    setActiveComplaint(updated);
  };

  // Handler: Submit New Complaint
  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !citizenName.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const dept = departments.find(d => d.id === deptId) || departments[0];
    const today = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const seq = Math.floor(Math.random() * 900) + 100;

    const newComp: CitizenComplaint = {
      id: `cmp_${Date.now()}`,
      ticketNo: `ร้องเรียน-69-${seq}`,
      citizenName: citizenName.trim(),
      citizenPhone: citizenPhone.trim() || '08X-XXX-XXXX',
      villageNo,
      location: location.trim() || `หมู่ที่ ${villageNo}`,
      category,
      categoryLabel,
      departmentId: dept.id,
      assignedOfficer: dept.headName,
      description: description.trim(),
      step: 2, // assigned
      status: 'assigned',
      date: today,
      photoBefore: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
      solutionSummary: 'รับเรื่องลงทะเบียนและมอบหมายเจ้าหน้าที่เตรียมลงพื้นที่ตรวจสอบ',
      fiscalYear: '2569'
    };

    onAddComplaint(newComp);
    setShowAddModal(false);
    setDescription('');
    setCitizenName('');
    setCitizenPhone('');
    setLocation('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-500" />
            ระบบรับเรื่องร้องเรียนและคำร้องประชาชน 7 สเต็ป
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            กระบวนการจัดการเรื่องราวร้องทุกข์ อบต.ฝางคำ: 1.รับเรื่อง 2.มอบหมาย 3.ลงพื้นที่ 4.ดำเนินการ 5.แนบรูป 6.รายงานผล 7.ปิดเรื่อง
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>บันทึกคำร้องประชาชนใหม่</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาเลขรับ, รายละเอียดปัญหา, ชื่อผู้แจ้ง..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
        >
          <option value="all">🏡 ทุกหมู่บ้าน (ม.1 - ม.8)</option>
          <option value="1">หมู่ที่ 1 บ้านฝางคำ</option>
          <option value="2">หมู่ที่ 2 บ้านคำสมบูรณ์</option>
          <option value="3">หมู่ที่ 3 บ้านโนนสว่าง</option>
          <option value="4">หมู่ที่ 4 บ้านนาเจริญ</option>
          <option value="5">หมู่ที่ 5 บ้านหนองผือ</option>
          <option value="6">หมู่ที่ 6 บ้านห้วยไผ่</option>
          <option value="7">หมู่ที่ 7 บ้านดอนชี</option>
          <option value="8">หมู่ที่ 8 บ้านโนนสวรรค์</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
        >
          <option value="all">⚡ ทุกสถานะ</option>
          <option value="active">กำลังดำเนินการ</option>
          <option value="closed">ปิดเรื่องแล้ว</option>
        </select>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComplaints.map((c) => {
          const isClosed = c.step === 7 || c.status === 'closed';

          return (
            <div
              key={c.id}
              onClick={() => setActiveComplaint(c)}
              className={`p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 ${
                isClosed ? 'border-emerald-200' : 'border-slate-200 hover:border-amber-400'
              }`}
            >
              <div className="space-y-2">
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {c.ticketNo}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isClosed ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isClosed ? '✓ ปิดเรื่องแล้ว' : `สเต็ป ${c.step}/7: ${COMPLAINT_STEPS[c.step - 1]?.label}`}
                  </span>
                </div>

                <div className="font-bold text-sm text-slate-800 line-clamp-1">
                  [{c.categoryLabel}] หมู่ {c.villageNo}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {c.description}
                </p>

                {/* Complainant & Location */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.citizenName} ({c.citizenPhone})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{c.location} (ม.{c.villageNo})</span>
                  </div>
                </div>
              </div>

              {/* Step Progress Visualizer */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-1 flex justify-between">
                  <span>ขั้นตอน: {COMPLAINT_STEPS[c.step - 1]?.label}</span>
                  <span>{Math.round((c.step / 7) * 100)}%</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {COMPLAINT_STEPS.map((s) => (
                    <div
                      key={s.step}
                      className={`h-1.5 rounded-full ${
                        s.step <= c.step ? 'bg-amber-500' : 'bg-slate-200'
                      }`}
                      title={`${s.step}. ${s.label}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complaint Detail / 7 Steps Workflow Modal */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                  {activeComplaint.ticketNo}
                </span>
                <h3 className="text-base sm:text-lg font-bold mt-1 text-white">
                  คำร้อง: {activeComplaint.categoryLabel} (หมู่ที่ {activeComplaint.villageNo})
                </h3>
              </div>
              <button
                onClick={() => setActiveComplaint(null)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs">
              {/* 7-Step Visual Progression */}
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ความคืบหน้า 7 ขั้นตอน (The 7-Step Public Service Framework)
                </h4>
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {COMPLAINT_STEPS.map((s) => {
                    const isPassed = s.step <= activeComplaint.step;
                    const isCurrent = s.step === activeComplaint.step;

                    return (
                      <div key={s.step} className="space-y-1">
                        <div
                          className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                            isPassed
                              ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                              : 'bg-slate-200 text-slate-400'
                          } ${isCurrent ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
                        >
                          {isPassed && s.step < activeComplaint.step ? '✓' : s.step}
                        </div>
                        <span className={`text-[10px] block leading-tight font-medium ${isCurrent ? 'text-amber-800 font-bold' : 'text-slate-500'}`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complainant Profile Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block">ผู้ร้องเรียน:</span>
                  <strong className="text-slate-800 text-sm">{activeComplaint.citizenName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">เบอร์โทรศัพท์ติดต่อ:</span>
                  <span className="text-slate-800 font-mono font-medium">{activeComplaint.citizenPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">สถานที่ / หมู่บ้าน:</span>
                  <span className="text-slate-800">{activeComplaint.location} (หมู่ที่ {activeComplaint.villageNo})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">วันที่รับเรื่อง:</span>
                  <span>{activeComplaint.date}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h5 className="font-bold text-slate-700 mb-1">สภาพปัญหา / ความเดือดร้อน:</h5>
                <p className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {activeComplaint.description}
                </p>
              </div>

              {/* Solution Summary */}
              {activeComplaint.solutionSummary && (
                <div>
                  <h5 className="font-bold text-slate-700 mb-1">ผลการลงพื้นที่ / การดำเนินการแก้ไข:</h5>
                  <p className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-blue-900 leading-relaxed">
                    {activeComplaint.solutionSummary}
                  </p>
                </div>
              )}

              {/* Before & After Photo Demonstration */}
              <div>
                <h5 className="font-bold text-slate-700 mb-2">ภาพถ่ายก่อนและหลังการแก้ไข (Before & After):</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                    <img 
                      src={activeComplaint.photoBefore || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"} 
                      alt="Before" 
                      className="w-full h-36 object-cover" 
                    />
                    <div className="p-2 text-center text-[11px] font-bold text-slate-600 bg-slate-50 border-t border-slate-200">
                      ภาพก่อนดำเนินการ (Before)
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                    <img 
                      src={activeComplaint.photoAfter || "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80"} 
                      alt="After" 
                      className="w-full h-36 object-cover" 
                    />
                    <div className="p-2 text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 border-t border-emerald-200">
                      {activeComplaint.step >= 5 ? 'ภาพหลังแก้ไขเสร็จสิ้น (After)' : 'รอส่งภาพหลังแก้ไข (สเต็ป 5)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer & Advance Step Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setActiveComplaint(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>

              {activeComplaint.step < 7 ? (
                <button
                  onClick={() => handleAdvanceStep(activeComplaint)}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow flex items-center gap-2 cursor-pointer"
                >
                  <span>ขยับสู่สเต็ปถัดไป: [{COMPLAINT_STEPS[activeComplaint.step]?.label}]</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                  ✓ ยุติเรื่องและปิดคำร้องเรียบร้อยแล้ว
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Complaint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">บันทึกรับคำร้องประชาชนใหม่ (Citizen Intake)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateComplaint} className="p-4 sm:p-6 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">หมวดหมู่เรื่องร้องเรียน *</label>
                <select
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setCategory(val);
                    const map: Record<string, string> = {
                      road: 'ถนนชำรุด',
                      electricity: 'ไฟฟ้าสาธารณะดับ',
                      water: 'น้ำประปาไม่ไหล',
                      trash: 'ขยะมูลฝอยตกค้าง',
                      trees: 'กิ่งไม้บดบังสัญจร',
                      disaster: 'สาธารณภัย/น้ำท่วม',
                      social: 'สงเคราะห์ผู้ด้อยโอกาส',
                      general: 'เรื่องทั่วไป'
                    };
                    setCategoryLabel(map[val] || 'เรื่องทั่วไป');
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                >
                  <option value="road">ถนนชำรุด / เป็นหลุมเป็นบ่อ</option>
                  <option value="electricity">ไฟฟ้าส่องสว่างสาธารณะดับ</option>
                  <option value="water">น้ำประปาไม่ไหล / ขุ่นมัว</option>
                  <option value="trash">ขยะมูลฝอยตกค้าง</option>
                  <option value="trees">กิ่งไม้พาดสายไฟ / บดบังสัญจร</option>
                  <option value="disaster">สาธารณภัย / น้ำท่วมขัง</option>
                  <option value="social">สงเคราะห์ผู้ด้อยโอกาส / สวัสดิการ</option>
                  <option value="general">เรื่องทั่วไป</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ชื่อ-สกุล ผู้แจ้ง *</label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="นายประเสริฐ สว่างทวีป"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="089-123-4567"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">หมู่บ้าน *</label>
                  <select
                    value={villageNo}
                    onChange={(e) => setVillageNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="1">หมู่ที่ 1 บ้านฝางคำ</option>
                    <option value="2">หมู่ที่ 2 บ้านคำสมบูรณ์</option>
                    <option value="3">หมู่ที่ 3 บ้านโนนสว่าง</option>
                    <option value="4">หมู่ที่ 4 บ้านนาเจริญ</option>
                    <option value="5">หมู่ที่ 5 บ้านหนองผือ</option>
                    <option value="6">หมู่ที่ 6 บ้านห้วยไผ่</option>
                    <option value="7">หมู่ที่ 7 บ้านดอนชี</option>
                    <option value="8">หมู่ที่ 8 บ้านโนนสวรรค์</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">กองที่ส่งมอบหมาย *</label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">จุดที่เกิดเหตุ / ตำแหน่งสังเกต</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="บริเวณสามแยกหน้าวัด หรือหน้าบ้านผู้ใหญ่บ้าน"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">รายละเอียดปัญหา</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ระบุข้อเท็จจริง..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow"
                >
                  บันทึกรับเรื่อง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
