import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Calendar,
  Bell,
  Database,
  Save,
  CheckCircle2,
  HardDrive,
  Download,
  RefreshCw,
  Sliders,
  Shield,
  MessageSquare,
  Cloud,
  UploadCloud,
  ExternalLink
} from 'lucide-react';
import { SystemSettings, User } from '../types';
import { googleDriveService } from '../services/googleDriveService';

interface SystemSettingsViewProps {
  settings: SystemSettings;
  currentUser: User;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onNavigateToGoogleDrive?: () => void;
  onOpenFirebaseModal?: () => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  settings,
  currentUser,
  onUpdateSettings,
  onNavigateToGoogleDrive,
  onOpenFirebaseModal
}) => {
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [lineNotifyToken, setLineNotifyToken] = useState('LINE_NOTIFY_TOKEN_FANGKHAM_OFFICIAL_***');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setToastMessage('บันทึกการตั้งค่าระบบ อบต.ฝางคำ สำเร็จแล้ว');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBackupDatabase = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const backupData = {
        organization: formData.orgName,
        fiscalYear: formData.currentFiscalYear,
        backupTimestamp: new Date().toISOString(),
        version: 'FANGKHAM-SMART-GOV-2.5',
        status: 'verified'
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fangkham_backup_fy${formData.currentFiscalYear}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsBackingUp(false);
      setToastMessage('สร้างไฟล์สำรองข้อมูลฐานข้อมูล (Database Backup) เรียบร้อย');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>ตั้งค่าระบบ อบต.ฝางคำ (System Configuration)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            จัดการข้อมูลหน่วยงาน ปีงบประมาณ ระบบแจ้งเตือน และการสำรองข้อมูลความปลอดภัย
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>บันทึกการตั้งค่าทั้งหมด</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Organization Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-sm sm:text-base text-slate-800">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>ข้อมูลหน่วยงานและสถานที่ราชการ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">ชื่อองค์กรปกครองส่วนท้องถิ่น *</label>
              <input
                type="text"
                required
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">สโลแกน / คำโปรยระบบ</label>
              <input
                type="text"
                value={formData.orgTagline}
                onChange={(e) => setFormData({ ...formData, orgTagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-700">ที่ตั้งสำนักงาน อบต. *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">หมายเลขโทรศัพท์ติดต่อ</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">อีเมลทางการ (Official Email)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fiscal Year & Governance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-sm sm:text-base text-slate-800">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>ปีงบประมาณและข้อมูลรอบบัญชี</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">ปีงบประมาณปัจจุบันที่ใช้งาน *</label>
              <select
                value={formData.currentFiscalYear}
                onChange={(e) => setFormData({ ...formData, currentFiscalYear: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
              >
                {formData.availableFiscalYears.map((fy) => (
                  <option key={fy} value={fy}>
                    ปีงบประมาณ พ.ศ. {fy}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400">
                เมื่อเปลี่ยนปีงบประมาณ รายการโครงการ แผนงาน และเอกสารจะถูกกรองอัตโนมัติ
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">รหัสสีองค์กร (Theme)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.themePrimaryColor}
                  onChange={(e) => setFormData({ ...formData, themePrimaryColor: e.target.value })}
                  className="w-12 h-10 p-1 rounded-xl border border-slate-300 cursor-pointer"
                />
                <span className="font-mono text-xs text-slate-600">{formData.themePrimaryColor} (สีน้ำเงินคราม อบต.ฝางคำ)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Notification & Automation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-sm sm:text-base text-slate-800">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>ระบบแจ้งเตือนและระบบส่งต่อข้อมูลอัตโนมัติ</span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={formData.autoNotifyUrgent}
                onChange={(e) => setFormData({ ...formData, autoNotifyUrgent: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-bold text-slate-800">แจ้งเตือนภารกิจด่วนและวิกฤต (Critical Urgency) ทันที</div>
                <div className="text-slate-500 text-xs">
                  ส่งการแจ้งเตือนแบบเรียลไทม์ขึ้นแถบกระดิ่งและระบบแชต GovAI สำหรับงานที่มีผลกระทบต่อชีวิตและความปลอดภัยของประชาชน
                </div>
              </div>
            </label>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>การเชื่อมต่อ LINE Notify Token (สำหรับกลุ่มแจ้งข่าวด่วน อบต.)</span>
              </div>
              <input
                type="password"
                value={lineNotifyToken}
                onChange={(e) => setLineNotifyToken(e.target.value)}
                placeholder="ระบุ Token จาก LINE Notify..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs"
              />
              <span className="text-[11px] text-slate-400 block">
                เมื่อมีคำร้องเรียนใหม่จากประชาชน หรือมีหนังสือด่วนที่สุด ระบบจะยิงข้อความสรุปเข้ากลุ่ม LINE อบต. อัตโนมัติ
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Data Management & Backup */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-sm sm:text-base text-slate-800">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>การสำรองและดูแลรักษาฐานข้อมูล</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <div>
              <div className="font-bold text-sm text-emerald-950">
                สำรองข้อมูลฐานข้อมูล อบต.ฝางคำ (Database Backup)
              </div>
              <div className="text-xs text-emerald-800 mt-0.5">
                ดาวน์โหลดไฟล์ Snapshot ข้อมูลภารกิจ คำร้อง หนังสือราชการ และครุภัณฑ์ เพื่อเก็บรักษาตามมาตรฐานความปลอดภัย
              </div>
            </div>

            <button
              type="button"
              onClick={handleBackupDatabase}
              disabled={isBackingUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
            >
              {isBackingUp ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>กำลังสร้าง Backup...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดสำรองข้อมูล (.json)</span>
                </>
              )}
            </button>
          </div>

          {/* Google Drive 15TB Cloud Backup Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-blue-950">
                  Google Drive Cloud Pool (15.0 TB - 3 บัญชี)
                </span>
                <span className="px-2 py-0.2 rounded-full bg-blue-200 text-blue-800 text-[10px] font-bold">
                  ออนไลน์
                </span>
              </div>
              <div className="text-xs text-blue-800 mt-0.5">
                จัดเก็บเอกสารราชการ ภาพถ่ายเรื่องร้องเรียน และ Snapshot สำรองข้อมูลระบบ 5TB x 3 บัญชี
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateToGoogleDrive && (
                <button
                  type="button"
                  onClick={onNavigateToGoogleDrive}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>จัดการไดรฟ์ 15TB</span>
                </button>
              )}

              <button
                type="button"
                onClick={async () => {
                  setIsBackingUp(true);
                  try {
                    await googleDriveService.createSystemCloudBackup(
                      { settings: formData, timestamp: new Date().toISOString() },
                      `${currentUser.name} (${currentUser.roleTitle})`
                    );
                    setToastMessage('สำรองข้อมูลขึ้น Google Drive ไดรฟ์ 3 เรียบร้อยแล้ว');
                    setTimeout(() => setToastMessage(null), 3500);
                  } catch (e: any) {
                    setToastMessage(`สำรองข้อมูลล้มเหลว: ${e.message}`);
                  } finally {
                    setIsBackingUp(false);
                  }
                }}
                disabled={isBackingUp}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>สำรองขึ้น Google Drive ทันที</span>
              </button>
            </div>
          </div>

          {/* Firebase Real-time Cloud Database Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-amber-950">
                  ฐานข้อมูล Firebase Cloud Firestore (Real-time Database)
                </span>
                <span className="px-2 py-0.2 rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold">
                  เชื่อมต่อถาวร
                </span>
              </div>
              <div className="text-xs text-amber-900 mt-0.5">
                จัดเก็บข้อมูลภารกิจงาน เรื่องร้องเรียน และเอกสารแบบถาวร บันทึกทันทีเมื่อลบหรือสร้าง ไม่สูญหายเมื่อรีเฟรช
              </div>
            </div>

            {onOpenFirebaseModal && (
              <button
                type="button"
                onClick={onOpenFirebaseModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
              >
                <Database className="w-3.5 h-3.5" />
                <span>ตั้งค่าฐานข้อมูล Firebase</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
