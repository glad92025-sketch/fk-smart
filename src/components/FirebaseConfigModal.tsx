import React, { useState } from 'react';
import { 
  Database, 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  KeyRound, 
  Sparkles, 
  ExternalLink, 
  RefreshCw,
  HardDrive,
  RotateCcw
} from 'lucide-react';
import { firebaseService, FirebaseConfig, DEFAULT_FIREBASE_CONFIG } from '../services/firebaseService';

interface FirebaseConfigModalProps {
  onClose: () => void;
  onDataReset?: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({ onClose, onDataReset }) => {
  const [config, setConfig] = useState<FirebaseConfig>(() => firebaseService.getConfig());
  const [isCloudConnected, setIsCloudConnected] = useState(() => firebaseService.isCloudConnected());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);

    const success = firebaseService.saveConfig(config);
    setTimeout(() => {
      setTesting(false);
      setIsCloudConnected(firebaseService.isCloudConnected());
      if (config.apiKey) {
        setStatusMessage({
          type: 'success',
          text: 'บันทึกการตั้งค่า Firebase สำเร็จ! ระบบจะซิงค์ข้อมูลลง Cloud Firestore เรียลไทม์'
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'บันทึกเรียบร้อย! ระบบกำลังทำงานในโหมด Persistent Local Database (ลบ/เพิ่มข้อมูลถาวร ไม่หายเมื่อรีเฟรช)'
        });
      }
    }, 600);
  };

  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลภารกิจ งานสารบรรณ และเรื่องร้องเรียน กลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      firebaseService.resetToDefault();
      if (onDataReset) onDataReset();
      setStatusMessage({ type: 'success', text: 'รีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้นเรียบร้อยแล้ว' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">เชื่อมต่อฐานข้อมูล Firebase & Cloud Database</h3>
              <p className="text-xs text-amber-100">ระบบจัดเก็บข้อมูลถาวร Real-time Database สำหรับ อบต.ฝางคำ</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {/* Status Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="font-bold text-slate-800 text-xs sm:text-sm block">
                  {isCloudConnected ? 'เชื่อมต่อ Firebase Cloud Firestore สำเร็จ' : 'โหมดฐานข้อมูลแบบถาวร (Persistent Storage Active)'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isCloudConnected 
                    ? `Project: ${config.projectId} • ซิงค์เรียลไทม์ทุกอุปกรณ์` 
                    : 'ข้อมูลทุกอย่างที่กดลบหรือเพิ่ม จะถูกบันทึกถาวรทันที ไม่ย้อนกลับมาเมื่อรีเฟรช'}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              พร้อมใช้งาน
            </span>
          </div>

          {statusMessage && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Guide Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-xs sm:text-sm text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>วิธีเปิดใช้งาน Firebase สำหรับ Project: <strong>{config.projectId}</strong></span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-xs text-amber-900/90 leading-relaxed">
              <li>
                เปิดไปที่ <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-semibold inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-3 h-3 inline" /></a>
              </li>
              <li>กดปุ่ม <strong>"Add project"</strong> แล้วเลือกโปรเจกต์ <strong>`mineral-rune-386615`</strong> ที่คุณมีอยู่แล้ว</li>
              <li>กดที่ไอคอนเว็บ <strong>`&lt;/&gt;` (Web App)</strong> แล้วคัดลอกค่า <strong>`apiKey`</strong> มาวางในช่องด้านล่างนี้</li>
            </ol>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Firebase API Key (Web SDK)</label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="เช่น AIzaSyD..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                * หากยังไม่ได้ใส่ API Key ระบบจะบันทึกข้อมูลทุกการลบ/แก้ไขลงใน Local Database ของเครื่องให้อัตโนมัติทันที
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project ID</label>
                <input
                  type="text"
                  required
                  value={config.projectId}
                  onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono bg-slate-50 text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={config.authDomain}
                  onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetData}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                title="ดึงข้อมูลตัวอย่างตั้งต้นกลับมา"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตข้อมูลตัวอย่าง</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  ปิด
                </button>
                <button
                  type="submit"
                  disabled={testing}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span>บันทึกการตั้งค่า</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
