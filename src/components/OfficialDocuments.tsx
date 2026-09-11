import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { OfficialDocument, Department } from '../types';

interface OfficialDocumentsProps {
  documents: OfficialDocument[];
  departments: Department[];
  onAddDocument: (doc: OfficialDocument) => void;
  onCreateTaskFromDoc: (doc: OfficialDocument) => void;
}

export const OfficialDocuments: React.FC<OfficialDocumentsProps> = ({
  documents,
  departments,
  onAddDocument,
  onCreateTaskFromDoc
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [docType, setDocType] = useState<'incoming' | 'outgoing'>('incoming');
  const [docNo, setDocNo] = useState('');
  const [regNo, setRegNo] = useState('');
  const [fromSource, setFromSource] = useState('');
  const [toTarget, setToTarget] = useState('นายกองค์การบริหารส่วนตำบลฝางคำ');
  const [subject, setSubject] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept_office');
  const [assigneeName, setAssigneeName] = useState('ว่าที่ ร.ต. อุดมทรัพย์ ภักดีชน');
  const [dueDate, setDueDate] = useState('');

  const filteredDocs = documents.filter(d => {
    const matchSearch =
      (d.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.docNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.regNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.fromSource || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchType = selectedType === 'all' || d.docType === selectedType;
    const matchDept = selectedDept === 'all' || d.departmentId === selectedDept;

    return matchSearch && matchType && matchDept;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNo.trim() || !subject.trim()) {
      alert('กรุณากรอกเลขที่หนังสือและชื่อเรื่อง');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const newDoc: OfficialDocument = {
      id: `doc_${Date.now()}`,
      docType,
      docNo: docNo.trim(),
      regNo: regNo.trim() || `${Math.floor(Math.random() * 500) + 100}/2569`,
      date: today,
      fromSource: fromSource.trim() || 'สำนักงานส่งเสริมการปกครองท้องถิ่น',
      toTarget: toTarget.trim(),
      subject: subject.trim(),
      departmentId,
      assigneeName,
      dueDate: dueDate || undefined,
      status: 'pending',
      fileName: 'หนังสือราชการ.pdf',
      fiscalYear: '2569'
    };

    onAddDocument(newDoc);
    setShowAddModal(false);
    setDocNo('');
    setRegNo('');
    setSubject('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            ระบบสารบรรณอิเล็กทรอนิกส์และทะเบียนหนังสือราชการ (e-Document Engine)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ลงทะเบียนหนังสือรับ - หนังสือส่ง ค้นหาได้รวดเร็ว และแปลงเป็นภารกิจงานราชการได้ทันที
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ลงทะเบียนหนังสือใหม่</span>
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
            placeholder="ค้นหาเลขที่หนังสือ, ทะเบียนรับ, เรื่อง, หน่วยงานต้นทาง..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Type selector */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg transition ${selectedType === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setSelectedType('incoming')}
            className={`px-3 py-1.5 rounded-lg transition ${selectedType === 'incoming' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
          >
            📥 หนังสือรับ
          </button>
          <button
            onClick={() => setSelectedType('outgoing')}
            className={`px-3 py-1.5 rounded-lg transition ${selectedType === 'outgoing' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
          >
            📤 หนังสือส่ง
          </button>
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
        >
          <option value="all">🏢 ทุกกอง / สำนัก</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Documents: Responsive Cards on Mobile & Full Table on Desktop */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Mobile View: Cards (< md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredDocs.map((doc) => {
            const dept = departments.find(d => d.id === doc.departmentId);

            return (
              <div key={doc.id} className="p-4 space-y-2.5 bg-white hover:bg-slate-50 transition">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {doc.docType === 'incoming' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                        <ArrowDownLeft className="w-3 h-3 text-blue-600" /> รับ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                        <ArrowUpRight className="w-3 h-3 text-emerald-600" /> ส่ง
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {doc.docNo}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {doc.date}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-800 leading-snug">
                  {doc.subject}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="truncate">
                    จาก: <strong className="text-slate-800">{doc.fromSource}</strong>
                  </div>
                  <div className="truncate text-slate-500">
                    ถึง: {doc.toTarget}
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-blue-700 font-medium">{dept?.name}</span>
                    <span>ผู้รับ: {doc.assigneeName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    ทะเบียน: {doc.regNo}
                  </span>
                  {doc.linkedTaskId ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      เป็นงานแล้ว
                    </span>
                  ) : (
                    <button
                      onClick={() => onCreateTaskFromDoc(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition cursor-pointer text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>แปลงเป็นงาน</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full Table (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">ประเภท</th>
                <th className="py-3 px-4">เลขที่หนังสือ / ทะเบียน</th>
                <th className="py-3 px-4">ลงวันที่</th>
                <th className="py-3 px-4">เรื่อง (Subject)</th>
                <th className="py-3 px-4">ต้นทาง / ปลายทาง</th>
                <th className="py-3 px-4">ผู้รับผิดชอบ</th>
                <th className="py-3 px-4 text-center">การแปลงเป็นภารกิจ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.map((doc) => {
                const dept = departments.find(d => d.id === doc.departmentId);

                return (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      {doc.docType === 'incoming' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                          <ArrowDownLeft className="w-3 h-3 text-blue-600" /> รับ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" /> ส่ง
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-800">{doc.docNo}</div>
                      <div className="text-[11px] text-slate-400">เลขทะเบียน: {doc.regNo}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {doc.date}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <span className="font-semibold text-slate-800 line-clamp-2">
                        {doc.subject}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px]">
                      <div className="text-slate-600 truncate max-w-[180px]">
                        จาก: <strong className="text-slate-700">{doc.fromSource}</strong>
                      </div>
                      <div className="text-slate-400 truncate max-w-[180px]">
                        ถึง: {doc.toTarget}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{doc.assigneeName}</div>
                      <div className="text-[11px] text-slate-400">{dept?.name || 'อบต.ฝางคำ'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {doc.linkedTaskId ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> แปลงแล้ว
                        </span>
                      ) : (
                        <button
                          onClick={() => onCreateTaskFromDoc(doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>สร้างงาน</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-800">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">ลงทะเบียนหนังสือราชการใหม่</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ประเภทหนังสือ *</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="incoming">📥 หนังสือรับ</option>
                    <option value="outgoing">📤 หนังสือส่ง</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">เลขทะเบียนรับ/ส่ง</label>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="เช่น 0418/2569"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">เลขที่หนังสือราชการ *</label>
                <input
                  type="text"
                  required
                  value={docNo}
                  onChange={(e) => setDocNo(e.target.value)}
                  placeholder="เช่น มค 0023.3/ว 1492"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">เรื่อง (Subject) *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="ระบุชื่อเรื่องหนังสือ..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">จาก (หน่วยงานต้นทาง) *</label>
                  <input
                    type="text"
                    value={fromSource}
                    onChange={(e) => setFromSource(e.target.value)}
                    placeholder="เช่น ที่ว่าการอำเภอฝาง"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ถึง (ผู้รับ) *</label>
                  <input
                    type="text"
                    value={toTarget}
                    onChange={(e) => setToTarget(e.target.value)}
                    placeholder="นายก อบต.ฝางคำ"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">กองที่รับผิดชอบ</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ผู้รับผิดชอบดำเนินการ</label>
                  <input
                    type="text"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    placeholder="ชื่อผู้รับผิดชอบ..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
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
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow"
                >
                  บันทึกลงทะเบียน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
