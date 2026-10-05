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
  HardDrive,
  ExternalLink,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Info
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
  const [showDriveGuideModal, setShowDriveGuideModal] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [autoSyncDrive, setAutoSyncDrive] = useState(true);

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

  const getDriveLinkForDoc = (doc: DocumentArchive) => {
    const gFiles = googleDriveService.getFiles({ category: 'central_archive' });
    const matched = gFiles.find(
      (f) =>
        f.relatedModuleId === doc.id ||
        f.name.toLowerCase().includes(doc.docNo.toLowerCase()) ||
        doc.title.toLowerCase().includes(f.name.toLowerCase())
    );
    if (matched) {
      return matched.webViewLink;
    }
    return `https://drive.google.com/drive/folders/1aBcD99_FangkhamDocs_Archive_5TB`;
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
      fileSize: selectedFileObj ? `${(selectedFileObj.size / (1024 * 1024)).toFixed(2)} MB` : formData.fileSize,
      fileFormat: formData.fileFormat,
      accessLevel: formData.accessLevel
    };

    onAddArchive(newDoc);

    // Auto-mirror document to Google Drive 1 (5TB)
    if (autoSyncDrive) {
      const fileName = selectedFileObj
        ? selectedFileObj.name
        : `${formData.docNo.replace(/[/\\?%*:|"<>]/g, '_')}_${formData.title}.${formData.fileFormat.toLowerCase()}`;

      googleDriveService.uploadFile({
        file: {
          name: fileName,
          size: selectedFileObj ? selectedFileObj.size : 1024 * 1024 * 2.5,
          type: selectedFileObj ? selectedFileObj.type : 'application/pdf'
        },
        category: 'central_archive',
        categoryLabel: `คำสั่ง/ประกาศ (${formData.category})`,
        uploadedBy: `${currentUser.name} (${currentUser.roleTitle})`,
        folderPath: `/อบต.ฝางคำ/คลังเอกสารกลาง/${formData.category}`,
        relatedModuleId: newDoc.id
      });
    }

    setShowAddModal(false);
    setSelectedFileObj(null);
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
    setDownloadToast(autoSyncDrive ? `บันทึกและซิงค์เอกสารขึ้น Google Drive 1 (5TB) สำเร็จ` : `บันทึกเอกสารเรียบร้อยแล้ว`);
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowDriveGuideModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold transition cursor-pointer border border-amber-300 shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>วิธีเชื่อมต่อ Google Drive</span>
          </button>

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

      {/* Google Drive Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">การจัดเก็บอัตโนมัติ: เชื่อมต่อ Google Drive บัญชีที่ 1 (ความจุ 5TB)</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                เชื่อมต่อพร้อมใช้งาน
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              บัญชีปลายทาง: <span className="font-mono text-blue-700 font-semibold bg-blue-100/70 px-1 py-0.5 rounded">fk.archive.drive01@gmail.com</span> • โฟลเดอร์: <span className="font-mono text-slate-700">/อบต.ฝางคำ/คลังเอกสารกลาง</span> • เอกสารทุกฉบับซิงค์ลงไดรฟ์ทันที
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowDriveGuideModal(true)}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs"
          >
            <span>ดูขั้นตอนเชื่อมต่อไดรฟ์ของคุณ</span>
            <ArrowRight className="w-3.5 h-3.5" />
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

                  <div className="flex items-center gap-1.5">
                    <a
                      href={getDriveLinkForDoc(doc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-200 text-xs transition cursor-pointer"
                      title="เปิดไฟล์นี้บน Google Drive 1 (5TB)"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Drive</span>
                    </a>

                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 text-xs transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลด</span>
                    </button>
                  </div>
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
                <th className="p-3.5 text-center">Google Drive (5TB)</th>
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
                      <a
                        href={getDriveLinkForDoc(doc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-200 transition cursor-pointer text-xs"
                        title="เปิดดูไฟล์ต้นฉบับบน Google Drive 1 (5TB)"
                      >
                        <Cloud className="w-3.5 h-3.5 text-blue-500" />
                        <span>เปิดใน Drive</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
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

              {/* File Attachment & Auto-detect */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">แนบไฟล์เอกสารต้นฉบับ (PDF / Word / Excel)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setSelectedFileObj(file);
                      // Auto populate title and format if empty
                      if (!formData.title) {
                        formData.title = file.name.replace(/\.[^/.]+$/, "");
                      }
                      const ext = file.name.split('.').pop()?.toUpperCase();
                      if (ext === 'PDF' || ext === 'DOCX' || ext === 'XLSX') {
                        formData.fileFormat = ext as any;
                      }
                      formData.fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
                      setFormData({ ...formData });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  * แนบไฟล์เอกสารตัวจริงเพื่ออัปโหลดจัดเก็บลงใน Google Drive 1 (5TB) โดยตรง
                </p>
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

              {/* Cloud Sync Checkbox */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="autoSyncDriveCheck"
                  checked={autoSyncDrive}
                  onChange={(e) => setAutoSyncDrive(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoSyncDriveCheck" className="text-xs text-slate-700 cursor-pointer">
                  <strong className="text-blue-900 block font-bold">ซิงค์ขึ้น Google Drive 1 (ความจุ 5TB) โดยอัตโนมัติ</strong>
                  เอกสารจะถูกส่งเข้าโฟลเดอร์ <code className="font-mono text-blue-700">/อบต.ฝางคำ/คลังเอกสารกลาง/{formData.category}</code> ทันทีที่บันทึก
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Cloud className="w-4 h-4" />
                  <span>บันทึกและซิงค์คลาวด์</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guide Modal: How to connect Google Drive */}
      {showDriveGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">วิธีเชื่อมต่อคลังเอกสารเข้ากับ Google Drive (15TB)</h3>
                  <p className="text-xs text-blue-200">คู่มือการตั้งค่าสิทธิ์และการจัดเก็บข้อมูลบนคลาวด์สำหรับ อบต.ฝางคำ</p>
                </div>
              </div>
              <button
                onClick={() => setShowDriveGuideModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
              {/* Architecture Intro */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950">
                <div className="font-bold flex items-center gap-2 text-sky-900 mb-1">
                  <Info className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>สถาปัตยกรรมการจัดเก็บข้อมูล 3 บัญชี (15.0 TB Virtual Pool)</span>
                </div>
                <p className="text-xs text-sky-800 leading-relaxed">
                  ระบบ <strong>FANGKHAM SMART GOVERNANCE</strong> เชื่อมต่อ Google Drive บัญชีละ 5TB รวม 3 บัญชี โดยคลังเอกสารกลางนี้จะถูกเชื่อมโยงและจัดเก็บลงใน <strong>Google Drive บัญชีที่ 1 (สารบรรณ & คลังเอกสารกลาง)</strong> โดยตรง
                </p>
              </div>

              {/* 3 Steps Guide */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>3 ขั้นตอนในการนำ Google Drive 5TB ของคุณมาเชื่อมต่อกับระบบ</span>
                </h4>

                {/* Step 1 */}
                <div className="flex gap-3.5 p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">เตรียมโฟลเดอร์บน Google Drive ของ อบต.</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      เข้าสู่ระบบ Google Drive ด้วยบัญชีความจุ 5TB บัญชีที่ 1 (เช่น <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">fk.archive.drive01@gmail.com</code>) จากนั้นสร้างโฟลเดอร์หลัก เช่น <code>อบต.ฝางคำ - คลังเอกสารกลาง</code>
                    </p>
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                      💡 <strong>วิธีดู Folder ID:</strong> เปิดโฟลเดอร์ในเว็บเบราว์เซอร์ แล้วคัดลอกรหัสท้าย URL ตัวอย่าง: <br />
                      <code>https://drive.google.com/drive/folders/<strong>1aBcD99_FangkhamDocs_Archive_5TB</strong></code>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3.5 p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">สร้างสิทธิ์เข้าถึง (Google Cloud Service Account หรือแชร์โฟลเดอร์)</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      เข้าไปที่ <strong>Google Cloud Console</strong> → เปิดใช้งาน <strong>Google Drive API</strong> → สร้าง <strong>Service Account</strong> และสร้างคีย์แบบ JSON Key (หรือแชร์โฟลเดอร์ให้สิทธิ์แก้ไขแก่ Service Account Email)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      * หากยังไม่มี Service Account ระบบสามารถรันด้วย Local Cloud Proxy ที่จำลองการซิงค์โควตา 5TB ได้ทันที
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3.5 p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">บันทึกข้อมูลเข้าสู่ระบบ Fangkham Smart Gov</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      ไปที่เมนู <strong>"Google Drive (15TB)"</strong> → ที่การ์ด <strong>"Google Drive 1 (5TB) - สารบรรณ & เอกสารกลาง"</strong> → คลิกปุ่ม <strong>"ตั้งค่าบัญชี/คีย์"</strong> → วาง <strong>Folder ID</strong> และ <strong>Private Key JSON</strong> จากนั้นกด <strong>"ทดสอบเชื่อมต่อ"</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-xs">การทำงานอัตโนมัติในปัจจุบัน</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    ONLINE (ACTIVE)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  เมื่อคุณกด <strong>"นำเข้าเอกสารใหม่"</strong> ในหน้านี้ เอกสารจะถูกส่งไปจัดเก็บลงใน Google Drive 1 ความจุ 5TB พร้อมสร้างลิงก์ดาวน์โหลดและดูไฟล์บน Google Drive ให้เจ้าหน้าที่และประชาชนคลิกเปิดได้ทันที
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowDriveGuideModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-white transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>

              {onNavigateToGoogleDrive && (
                <button
                  onClick={() => {
                    setShowDriveGuideModal(false);
                    onNavigateToGoogleDrive();
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>ไปที่หน้าตั้งค่า Google Drive (15TB)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
