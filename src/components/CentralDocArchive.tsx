import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Plus,
  Download,
  FileText,
  Eye,
  Lock,
  Globe,
  Building2,
  Calendar,
  X,
  FileCode,
  CheckCircle2,
  Cloud,
  HardDrive
} from 'lucide-react';
import { DocumentArchive, Department, User } from '../types';
import { formatThaiDate } from '../utils/thaiDate';
import { googleDriveService } from '../services/googleDriveService';

interface CentralDocArchiveProps {
  archives: DocumentArchive[];
  departments: Department[];
  currentUser: User;
  onAddArchive: (archive: DocumentArchive) => void;
  onNavigateToGoogleDrive?: () => void;
}

export const CentralDocArchive: React.FC<CentralDocArchiveProps> = ({
  archives,
  departments,
  currentUser,
  onAddArchive,
  onNavigateToGoogleDrive
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    docNo: '',
    title: '',
    category: 'คำสั่ง' as DocumentArchive['category'],
    departmentId: currentUser.departmentId || 'dept_office',
    publishDate: new Date().toISOString().split('T')[0],
    fileSize: '1.5 MB',
    fileFormat: 'PDF' as DocumentArchive['fileFormat'],
    accessLevel: 'public' as DocumentArchive['accessLevel']
  });

  const categories = ['คำสั่ง', 'ประกาศ', 'ระเบียบ', 'โครงการ', 'รายงาน', 'แบบฟอร์ม'];

  const filteredArchives = archives.filter((doc) => {
    const matchSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchDept = selectedDept === 'all' || doc.departmentId === selectedDept;
    const matchAccess = selectedAccess === 'all' || doc.accessLevel === selectedAccess;

    return matchSearch && matchCat && matchDept && matchAccess;
  });

  const handleDownload = (doc: DocumentArchive) => {
    // Generate a simple text blob simulating official download
    const content = `เอกสารราชการ องค์การบริหารส่วนตำบลฝางคำ\n\nเลขที่: ${doc.docNo}\nเรื่อง: ${doc.title}\nหมวดหมู่: ${doc.category}\nวันที่เผยแพร่: ${doc.publishDate}\nระดับการเข้าถึง: ${doc.accessLevel}\n\n(ดาวน์โหลดผ่านระบบ FANGKHAM SMART GOV เมื่อวันที่ ${new Date().toLocaleString('th-TH')})`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.docNo.replace(/[/\\?%*:|"<>]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`ดาวน์โหลดไฟล์ "${doc.title}" สำเร็จ`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.docNo.trim()) return;

    const newDoc: DocumentArchive = {
      id: `arc_${Date.now()}`,
      docNo: formData.docNo,
      title: formData.title,
      category: formData.category,
      departmentId: formData.departmentId,
      publishDate: formData.publishDate,
      fileSize: formData.fileSize,
      fileFormat: formData.fileFormat,
      accessLevel: formData.accessLevel
    };

    onAddArchive(newDoc);

    // Auto-mirror document to Google Drive 1 (5TB)
    googleDriveService.uploadFile({
      file: {
        name: `${formData.docNo.replace(/[/\\?%*:|"<>]/g, '_')}_${formData.title}.${formData.fileFormat.toLowerCase()}`,
        size: 1024 * 1024 * 2.5,
        type: 'application/pdf'
      },
      category: 'central_archive',
      categoryLabel: `คำสั่ง/ประกาศ (${formData.category})`,
      uploadedBy: `${currentUser.name} (${currentUser.roleTitle})`,
      folderPath: `/อบต.ฝางคำ/คลังเอกสารกลาง/${formData.category}`,
      relatedModuleId: newDoc.id
    });

    setShowAddModal(false);
    setFormData({
      docNo: '',
      title: '',
      category: 'คำสั่ง',
      departmentId: currentUser.departmentId || 'dept_office',
      publishDate: new Date().toISOString().split('T')[0],
      fileSize: '1.5 MB',
      fileFormat: 'PDF',
      accessLevel: 'public'
    });
    setDownloadToast(`บันทึกและซิงค์เอกสารขึ้น Google Drive 1 (5TB) สำเร็จ`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Cloud className="w-3.5 h-3.5" />
            <span>เชื่อมต่อคลาวด์ Google Drive 1 (ความจุ 5TB)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderArchive className="w-6 h-6 text-blue-600" />
            <span>คลังเอกสารกลาง & ระเบียบแบบฟอร์ม อบต.ฝางคำ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ศูนย์รวมคำสั่ง ประกาศ ข้อบัญญัติ แผนพัฒนาท้องถิ่น และแบบฟอร์มคำขอสำหรับเจ้าหน้าที่และประชาชน
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToGoogleDrive && (
            <button
              onClick={onNavigateToGoogleDrive}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer border border-slate-200"
            >
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span>เปิด Google Drive 15TB</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>นำเข้าเอกสารใหม่</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">เอกสารทั้งหมด</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{archives.length} ฉบับ</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">เปิดเผยสาธารณะ</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {archives.filter((a) => a.accessLevel === 'public').length} ฉบับ
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">ใช้เฉพาะภายใน อบต.</div>
          <div className="text-xl font-bold text-blue-600 mt-1">
            {archives.filter((a) => a.accessLevel === 'internal').length} ฉบับ
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">เอกสารโครงการ/ระเบียบ</div>
          <div className="text-xl font-bold text-indigo-600 mt-1">
            {archives.filter((a) => a.category === 'ระเบียบ' || a.category === 'โครงการ').length} ฉบับ
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อเรื่องเอกสาร, เลขที่คำสั่ง, ประกาศ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          >
            <option value="all">📁 ทุกหมวดหมู่เอกสาร</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

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
            value={selectedAccess}
            onChange={(e) => setSelectedAccess(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          >
            <option value="all">🔒 ทุกระดับสิทธิ์</option>
            <option value="public">สาธารณะ (Public)</option>
            <option value="internal">เฉพาะภายใน (Internal)</option>
            <option value="confidential">เอกสารลับ (Confidential)</option>
          </select>
        </div>
      </div>

      {/* Documents List Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredArchives.map((doc) => {
            const dept = departments.find((d) => d.id === doc.departmentId);

            return (
              <div key={doc.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {doc.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    {doc.accessLevel === 'public' ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Globe className="w-3 h-3" /> สาธารณะ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <Lock className="w-3 h-3" /> ภายใน
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs text-slate-500">{doc.docNo}</div>
                  <h3 className="font-bold text-sm text-slate-800 leading-snug mt-0.5">
                    {doc.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{dept?.shortName || dept?.name}</span>
                  <span>{doc.fileFormat} • {doc.fileSize}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    {formatThaiDate(doc.publishDate)}
                  </span>

                  <button
                    onClick={() => handleDownload(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 text-xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลดไฟล์</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-3.5">หมวดหมู่</th>
                <th className="p-3.5">เลขที่เอกสาร</th>
                <th className="p-3.5">ชื่อเรื่องเอกสาร</th>
                <th className="p-3.5">ส่วนราชการเจ้าของเรื่อง</th>
                <th className="p-3.5">วันที่เผยแพร่</th>
                <th className="p-3.5">รูปแบบ / ขนาด</th>
                <th className="p-3.5 text-center">สิทธิ์การเข้าถึง</th>
                <th className="p-3.5 text-center">ดาวน์โหลด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArchives.map((doc) => {
                const dept = departments.find((d) => d.id === doc.departmentId);

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 font-medium">{doc.docNo}</td>
                    <td className="p-3.5 font-bold text-slate-800 max-w-xs">{doc.title}</td>
                    <td className="p-3.5 text-slate-600">{dept?.name}</td>
                    <td className="p-3.5 text-slate-500">{formatThaiDate(doc.publishDate)}</td>
                    <td className="p-3.5 font-mono text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[10px]">
                        {doc.fileFormat}
                      </span>{' '}
                      {doc.fileSize}
                    </td>
                    <td className="p-3.5 text-center">
                      {doc.accessLevel === 'public' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                          <Globe className="w-3 h-3" /> สาธารณะ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                          <Lock className="w-3 h-3" /> เฉพาะภายใน
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition cursor-pointer text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>โหลด</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredArchives.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
            ไม่พบเอกสารตามเงื่อนไขที่ค้นหา
          </div>
        )}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <FolderArchive className="w-5 h-5 text-blue-400" />
                <span>นำเข้าเอกสารกลาง อบต.ฝางคำ</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">เลขที่เอกสาร *</label>
                  <input
                    type="text"
                    required
                    value={formData.docNo}
                    onChange={(e) => setFormData({ ...formData, docNo: e.target.value })}
                    placeholder="เช่น คำสั่ง ที่ 195/2569"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">หมวดหมู่เอกสาร *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ชื่อเรื่องเอกสาร *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="เช่น ข้อบัญญัติงบประมาณรายจ่าย, ประกาศราคากลาง..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ส่วนราชการเจ้าของเรื่อง *</label>
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
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">สิทธิ์การเข้าถึง *</label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="public">สาธารณะ (เปิดเผยประชาชน)</option>
                    <option value="internal">เฉพาะภายใน อบต.</option>
                    <option value="confidential">เอกสารลับ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">รูปแบบไฟล์</label>
                  <select
                    value={formData.fileFormat}
                    onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX (Word)</option>
                    <option value="XLSX">XLSX (Excel)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ขนาดไฟล์โดยประมาณ</label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="2.4 MB"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  บันทึกเข้าสู่คลังเอกสาร
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
