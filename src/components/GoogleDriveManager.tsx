import React, { useState, useMemo } from 'react';
import { 
  HardDrive, 
  Cloud, 
  UploadCloud, 
  Download, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Image as ImageIcon, 
  Database, 
  FolderKanban, 
  Archive, 
  Settings, 
  KeyRound, 
  ShieldCheck, 
  Search, 
  X, 
  Sparkles,
  Layers,
  ArrowRight,
  Server
} from 'lucide-react';
import { GoogleDriveAccountConfig, GoogleDrivePoolStatus, DriveFileItem, StorageRoutingCategory, User } from '../types';
import { googleDriveService } from '../services/googleDriveService';
import { formatThaiDate } from '../utils/thaiDate';

interface GoogleDriveManagerProps {
  currentUser: User;
  systemData?: any;
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({ currentUser, systemData }) => {
  const [accounts, setAccounts] = useState<GoogleDriveAccountConfig[]>(() => googleDriveService.getAccounts());
  const [files, setFiles] = useState<DriveFileItem[]>(() => googleDriveService.getFiles());
  const [selectedDriveFilter, setSelectedDriveFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedAccountForConfig, setSelectedAccountForConfig] = useState<GoogleDriveAccountConfig | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [testingDriveId, setTestingDriveId] = useState<string | null>(null);
  const [alertNotice, setAlertNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload Form
  const [uploadFileObj, setUploadFileObj] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<StorageRoutingCategory>('central_archive');
  const [uploadCustomName, setUploadCustomName] = useState('');

  // Config Form
  const [configForm, setConfigForm] = useState<Partial<GoogleDriveAccountConfig>>({});

  const poolStatus: GoogleDrivePoolStatus = useMemo(() => {
    return googleDriveService.getPoolStatus();
  }, [accounts]);

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertNotice({ type, text });
    setTimeout(() => setAlertNotice(null), 5000);
  };

  const refreshData = () => {
    setAccounts(googleDriveService.getAccounts());
    setFiles(googleDriveService.getFiles());
  };

  // Filtered files
  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      if (selectedDriveFilter !== 'all' && f.driveAccountId !== selectedDriveFilter) {
        return false;
      }
      if (selectedCategoryFilter !== 'all' && f.category !== selectedCategoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return f.name.toLowerCase().includes(q) || 
               f.categoryLabel.toLowerCase().includes(q) || 
               f.uploadedBy.toLowerCase().includes(q);
      }
      return true;
    });
  }, [files, selectedDriveFilter, selectedCategoryFilter, searchQuery]);

  // Test Connection
  const handleTestConnection = async (driveId: string) => {
    setTestingDriveId(driveId);
    try {
      const res = await googleDriveService.testConnection(driveId);
      refreshData();
      if (res.success) {
        showAlert('success', res.message);
      } else {
        showAlert('error', res.message);
      }
    } catch (e: any) {
      showAlert('error', `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${e.message}`);
    } finally {
      setTestingDriveId(null);
    }
  };

  // Open config modal
  const handleOpenConfig = (account: GoogleDriveAccountConfig) => {
    setSelectedAccountForConfig(account);
    setConfigForm({
      ...account
    });
    setShowConfigModal(true);
  };

  // Save config
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountForConfig) return;

    googleDriveService.updateAccount(selectedAccountForConfig.id, configForm);
    refreshData();
    setShowConfigModal(false);
    showAlert('success', `บันทึกการตั้งค่าสำหรับ ${selectedAccountForConfig.name} เรียบร้อยแล้ว`);
  };

  // Upload file
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileObj) {
      showAlert('error', 'กรุณาเลือกไฟล์ที่ต้องการอัปโหลด');
      return;
    }

    try {
      const newFile = await googleDriveService.uploadFile({
        file: {
          name: uploadCustomName.trim() || uploadFileObj.name,
          size: uploadFileObj.size,
          type: uploadFileObj.type
        },
        category: uploadCategory,
        uploadedBy: `${currentUser.name} (${currentUser.roleTitle})`
      });

      refreshData();
      setShowUploadModal(false);
      setUploadFileObj(null);
      setUploadCustomName('');
      showAlert('success', `อัปโหลดไฟล์ "${newFile.name}" ขึ้น ${newFile.driveAccountName} สำเร็จ`);
    } catch (e: any) {
      showAlert('error', `การอัปโหลดล้มเหลว: ${e.message}`);
    }
  };

  // Delete file
  const handleDeleteFile = async (f: DriveFileItem) => {
    if (window.confirm(`ยืนยันการลบไฟล์ "${f.name}" ออกจาก Google Drive (${f.driveAccountName})?`)) {
      await googleDriveService.deleteFile(f.id);
      refreshData();
      showAlert('success', `ลบไฟล์ "${f.name}" เรียบร้อยแล้ว`);
    }
  };

  // Full System Cloud Backup
  const handleTriggerFullBackup = async () => {
    setIsBackingUp(true);
    try {
      const backupFile = await googleDriveService.createSystemCloudBackup(
        systemData || { note: 'Full System Snapshot' },
        `${currentUser.name} (${currentUser.roleTitle})`
      );
      refreshData();
      showAlert('success', `สำรองข้อมูลทั้งระบบขึ้น Google Drive บัญชีที่ 3 เรียบร้อยแล้ว (ไฟล์: ${backupFile.name})`);
    } catch (e: any) {
      showAlert('error', `เกิดข้อผิดพลาดในการสำรองข้อมูล: ${e.message}`);
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs tracking-wider uppercase mb-2">
              <Cloud className="w-4 h-4" />
              <span>Multi-Account Virtual Cloud Storage Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Google Drive Cloud Pool (15.0 TB)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                3 บัญชีเชื่อมต่อพร้อมกัน
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              สถาปัตยกรรมจัดเก็บข้อมูลแบบกระจายศูนย์ เชื่อมต่อ Google Drive บัญชีละ 5.0 TB รวม 3 รหัส (15TB)
              แยกจัดเก็บตามประเภทข้อมูลอย่างเป็นสัดส่วน พร้อมระบบสำรองข้อมูลฉุกเฉินอัตโนมัติ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleTriggerFullBackup}
              disabled={isBackingUp}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isBackingUp ? (
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <Database className="w-4 h-4 text-slate-950" />
              )}
              <span>สำรองข้อมูลระบบขึ้นไดรฟ์ 3</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>อัปโหลดไฟล์ขึ้นคลาวด์</span>
            </button>
          </div>
        </div>

        {/* Global 15TB Storage Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4">
            <div className="text-xs text-slate-300 font-medium">ความจุคลาวด์รวมทั้งหมด (Storage Pool)</div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {poolStatus.totalPoolUsedTB} <span className="text-lg font-semibold text-slate-400">/ {poolStatus.totalPoolCapacityTB} TB</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              พื้นที่ว่างคงเหลือ: {(poolStatus.totalPoolCapacityTB - poolStatus.totalPoolUsedTB).toFixed(2)} TB (ใช้งานไป {(poolStatus.totalPoolUsedTB / poolStatus.totalPoolCapacityTB * 100).toFixed(1)}%)
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
              <span>การกระจายพื้นที่จัดเก็บของ 3 บัญชี</span>
              <span>15,360 GB ทั้งหมด</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex border border-white/10 shadow-inner">
              {accounts.map((acc, idx) => {
                const percent = (acc.usedCapacityGB / (poolStatus.totalPoolCapacityTB * 1024)) * 100;
                const colors = ['bg-sky-400', 'bg-emerald-400', 'bg-amber-400'];
                return (
                  <div
                    key={acc.id}
                    style={{ width: `${Math.max(percent, 2)}%` }}
                    className={`${colors[idx]} transition-all duration-500`}
                    title={`${acc.name}: ใช้ไป ${acc.usedCapacityGB} GB`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                Drive 1 (สารบรรณ): {accounts[0]?.usedCapacityGB} GB
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                Drive 2 (ร้องเรียน): {accounts[1]?.usedCapacityGB} GB
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Drive 3 (Backup/พัสดุ): {accounts[2]?.usedCapacityGB} GB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Notice */}
      {alertNotice && (
        <div className={`p-4 rounded-2xl text-sm font-medium flex items-center justify-between shadow-sm animate-in fade-in ${
          alertNotice.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {alertNotice.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span>{alertNotice.text}</span>
          </div>
          <button onClick={() => setAlertNotice(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* The 3 Google Drive Account Cards (5TB each) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {accounts.map((acc, index) => {
          const usedPercent = (acc.usedCapacityGB / acc.totalCapacityGB) * 100;
          const freeGB = acc.totalCapacityGB - acc.usedCapacityGB;
          const isTesting = testingDriveId === acc.id;

          const cardColors = [
            { border: 'hover:border-sky-300', tag: 'bg-sky-50 text-sky-700 border-sky-200', bar: 'bg-sky-500' },
            { border: 'hover:border-emerald-300', tag: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' },
            { border: 'hover:border-amber-300', tag: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500' }
          ][index] || { border: 'hover:border-blue-300', tag: 'bg-blue-50 text-blue-700 border-blue-200', bar: 'bg-blue-500' };

          return (
            <div 
              key={acc.id} 
              className={`bg-white rounded-3xl p-5 border border-slate-200 shadow-sm transition duration-200 flex flex-col justify-between ${cardColors.border}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-1.5 ${cardColors.tag}`}>
                      ความจุ {acc.totalCapacityGB / 1024}.0 TB ({acc.totalCapacityGB.toLocaleString()} GB)
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {acc.name}
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    เชื่อมต่อแล้ว
                  </span>
                </div>

                {/* Email & Folder ID */}
                <div className="space-y-1 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="truncate">
                    อีเมล: <strong className="text-slate-700">{acc.email}</strong>
                  </div>
                  <div className="truncate font-mono text-[11px]">
                    Root Folder: <span className="text-blue-600">{acc.rootFolderId}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    จำนวนไฟล์ในไดรฟ์: {acc.fileCount} ไฟล์
                  </div>
                </div>

                {/* Storage Meter */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">ใช้ไปแล้ว: {acc.usedCapacityGB} GB</span>
                    <span className="text-slate-900 font-bold">{usedPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.max(usedPercent, 2)}%` }} 
                      className={`h-full ${cardColors.bar} rounded-full transition-all duration-500`}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ว่างคงเหลือ: {freeGB.toFixed(1)} GB
                  </div>
                </div>

                {/* Assigned Categories */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    หมวดหมู่เอกสารที่กำหนดให้เก็บในไดรฟ์นี้:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {acc.assignedCategories.map(cat => {
                      const labels: Record<string, string> = {
                        official_docs: 'หนังสือราชการ (รับ/ส่ง)',
                        central_archive: 'คำสั่ง/ประกาศ/คลังกลาง',
                        complaints: 'หลักฐานเรื่องร้องเรียน',
                        field_ops: 'งานภาคสนาม & ตรวจการ',
                        backups: 'สำรองฐานข้อมูลระบบ',
                        projects: 'โครงการ & แผนงาน',
                        assets: 'พัสดุ & ครุภัณฑ์',
                        general: 'ทั่วไป'
                      };
                      return (
                        <span key={cat} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                          {labels[cat] || cat}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTestConnection(acc.id)}
                  disabled={isTesting}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isTesting ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  )}
                  <span>ทดสอบเชื่อมต่อ</span>
                </button>

                <button
                  onClick={() => handleOpenConfig(acc)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition flex items-center gap-1.5 cursor-pointer border border-blue-200"
                >
                  <Settings className="w-3 h-3" />
                  <span>ตั้งค่าบัญชี/คีย์</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cloud File Explorer & Filter Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-600" />
              <span>คลังไฟล์บน Google Drive (Cloud File Explorer)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ไฟล์ทั้งหมดที่ถูกจัดเก็บลงใน 3 บัญชี Google Drive โดยอัตโนมัติตามประเภท
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>อัปโหลดเอกสารใหม่</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อไฟล์, หมวดหมู่, ผู้อัปโหลด..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDriveFilter}
              onChange={(e) => setSelectedDriveFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">ทุกลูกไดรฟ์ (ไดรฟ์ 1-3)</option>
              <option value="drive_1">Google Drive 1 (5TB) - สารบรรณ & เอกสารกลาง</option>
              <option value="drive_2">Google Drive 2 (5TB) - เรื่องร้องเรียน & ภาคสนาม</option>
              <option value="drive_3">Google Drive 3 (5TB) - สำรองระบบ & พัสดุ</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">ทุกหมวดหมู่เอกสาร</option>
              <option value="central_archive">คลังคำสั่ง/ประกาศ อบต.</option>
              <option value="official_docs">หนังสือราชการ (รับ/ส่ง)</option>
              <option value="complaints">ภาพถ่ายเรื่องร้องเรียน</option>
              <option value="field_ops">ภาพถ่ายงานภาคสนาม</option>
              <option value="backups">สำรองฐานข้อมูลระบบ</option>
              <option value="assets">ทะเบียนพัสดุและครุภัณฑ์</option>
            </select>
          </div>
        </div>

        {/* Files Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ชื่อไฟล์ใน Google Drive</th>
                <th className="py-3 px-3">บัญชีไดรฟ์ที่จัดเก็บ</th>
                <th className="py-3 px-3">หมวดหมู่</th>
                <th className="py-3 px-3">ขนาด</th>
                <th className="py-3 px-3">ผู้อัปโหลด</th>
                <th className="py-3 px-3">วันที่บันทึก</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <Cloud className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    ไม่พบไฟล์ตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => {
                  const isPdf = file.mimeType.includes('pdf');
                  const isImage = file.mimeType.includes('image');
                  const isZip = file.mimeType.includes('zip') || file.mimeType.includes('gzip') || file.name.endsWith('.json');

                  return (
                    <tr key={file.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isPdf ? 'bg-rose-100 text-rose-600' :
                            isImage ? 'bg-emerald-100 text-emerald-600' :
                            isZip ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {isPdf ? <FileText className="w-4 h-4" /> :
                             isImage ? <ImageIcon className="w-4 h-4" /> :
                             isZip ? <Database className="w-4 h-4" /> :
                             <Archive className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <div className="font-bold text-slate-900 truncate" title={file.name}>
                              {file.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              Path: {file.folderPath}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          file.driveAccountId === 'drive_1' ? 'bg-sky-100 text-sky-800' :
                          file.driveAccountId === 'drive_2' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {file.driveAccountId === 'drive_1' ? 'Drive 1 (5TB)' :
                           file.driveAccountId === 'drive_2' ? 'Drive 2 (5TB)' :
                           'Drive 3 (5TB)'}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                          {file.categoryLabel}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">
                        {file.sizeFormatted}
                      </td>

                      <td className="py-3 px-3 text-slate-600 truncate max-w-[150px]" title={file.uploadedBy}>
                        {file.uploadedBy.split(' ')[0]} {file.uploadedBy.split(' ')[1] || ''}
                      </td>

                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                        {formatThaiDate(file.uploadedAt)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="เปิดดูไฟล์บน Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={file.webContentLink}
                            download={file.originalName}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                            title="ดาวน์โหลดไฟล์"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDeleteFile(file)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="ลบไฟล์"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">อัปโหลดไฟล์ขึ้น Google Drive</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">เลือกหมวดหมู่เอกสาร</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as StorageRoutingCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="central_archive">คำสั่ง / ประกาศ อบต. (จัดเก็บลง Drive 1 - 5TB)</option>
                  <option value="official_docs">หนังสือราชการ รับ/ส่ง (จัดเก็บลง Drive 1 - 5TB)</option>
                  <option value="complaints">ภาพถ่ายและหลักฐานเรื่องร้องเรียน (จัดเก็บลง Drive 2 - 5TB)</option>
                  <option value="field_ops">ภาพถ่ายงานภาคสนามและการตรวจการ (จัดเก็บลง Drive 2 - 5TB)</option>
                  <option value="backups">สำรองฐานข้อมูลระบบ (จัดเก็บลง Drive 3 - 5TB)</option>
                  <option value="assets">ทะเบียนพัสดุและครุภัณฑ์ (จัดเก็บลง Drive 3 - 5TB)</option>
                  <option value="projects">โครงการและงบประมาณ (จัดเก็บลง Drive 3 - 5TB)</option>
                  <option value="general">ไฟล์งานทั่วไป (จัดเก็บลง Drive 3 - 5TB)</option>
                </select>
                <p className="text-[11px] text-blue-600 mt-1">
                  * ระบบจะส่งไฟล์เข้า Google Drive ที่ตรงกับประเภทโดยอัตโนมัติ เพื่อกระจายความจุ 15TB
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">เลือกไฟล์จากเครื่องคอมพิวเตอร์</label>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFileObj(e.target.files[0]);
                      if (!uploadCustomName) {
                        setUploadCustomName(e.target.files[0].name);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อไฟล์ที่ต้องการแสดงในระบบ (ตั้งชื่อใหม่อัตโนมัติ)</label>
                <input
                  type="text"
                  value={uploadCustomName}
                  onChange={(e) => setUploadCustomName(e.target.value)}
                  placeholder="เช่น คำสั่งที่ 15-2569 แต่งตั้งคณะกรรมการ.pdf"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>เริ่มอัปโหลดขึ้น Google Drive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Config Modal */}
      {showConfigModal && selectedAccountForConfig && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  ตั้งค่า Google Drive: {selectedAccountForConfig.name}
                </h3>
              </div>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อบัญชีที่แสดง</label>
                <input
                  type="text"
                  value={configForm.name || ''}
                  onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">อีเมลบัญชี Google Drive (ความจุ 5TB)</label>
                <input
                  type="email"
                  required
                  value={configForm.email || ''}
                  onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ความจุสูงสุด (GB)</label>
                  <input
                    type="number"
                    value={configForm.totalCapacityGB || 5120}
                    onChange={(e) => setConfigForm({ ...configForm, totalCapacityGB: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">5,120 GB = 5.0 TB</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">โหมดการยืนยันตัวตน</label>
                  <select
                    value={configForm.authType || 'service_account'}
                    onChange={(e) => setConfigForm({ ...configForm, authType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="service_account">Google Service Account (JSON Key)</option>
                    <option value="oauth2">Google OAuth 2.0 (Client ID + Refresh Token)</option>
                    <option value="api_key_picker">API Key & Webhook</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Google Drive Target Folder ID</label>
                <input
                  type="text"
                  required
                  value={configForm.rootFolderId || ''}
                  onChange={(e) => setConfigForm({ ...configForm, rootFolderId: e.target.value })}
                  placeholder="เช่น 1aBcD99_FangkhamDocs_Archive_5TB"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Folder ID คัดลอกได้จาก URL ของโฟลเดอร์บน Google Drive (เช่น drive.google.com/drive/folders/<strong>ID_ที่นี่</strong>)
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Account Email / Client ID</label>
                <input
                  type="text"
                  value={configForm.serviceAccountEmail || ''}
                  onChange={(e) => setConfigForm({ ...configForm, serviceAccountEmail: e.target.value })}
                  placeholder="service-account@project.iam.gserviceaccount.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Private Key JSON หรือ Refresh Token</label>
                <textarea
                  rows={3}
                  value={configForm.serviceAccountKey || ''}
                  onChange={(e) => setConfigForm({ ...configForm, serviceAccountKey: e.target.value })}
                  placeholder='วางข้อมูล Private Key JSON จาก Google Cloud Console หรือ OAuth Refresh Token ที่นี่'
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  บันทึกการตั้งค่า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
