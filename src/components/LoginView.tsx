import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Users
} from 'lucide-react';
import { User as UserType } from '../types';
import { userService } from '../services/userService';

interface LoginViewProps {
  onLoginSuccess: (user: UserType) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showQuickLogin, setShowQuickLogin] = useState(true);

  // บัญชีตัวอย่างสำหรับการทดสอบระบบอย่างรวดเร็ว
  const demoAccounts = [
    { label: 'ผู้ดูแลระบบ (Admin)', id: 'admin', pass: 'password123', role: 'Super Admin', dept: 'ศูนย์เทคโนโลยี', badge: 'bg-purple-100 text-purple-700' },
    { label: 'นายก อบต. (นายจรูญ)', id: 'exec001', pass: 'password123', role: 'นายก อบต.', dept: 'ผู้บริหาร', badge: 'bg-amber-100 text-amber-700' },
    { label: 'ปลัด อบต. (นายชาญชัย)', id: '705', pass: 'password123', role: 'ปลัด อบต.', dept: 'สำนักปลัด', badge: 'bg-blue-100 text-blue-700' },
    { label: 'หน.สำนักปลัด (นางอรุณรัตน์)', id: '601', pass: 'password123', role: 'หัวหน้าส่วน', dept: 'สำนักปลัด', badge: 'bg-sky-100 text-sky-700' },
    { label: 'ผอ.กองคลัง (นางวาสนา)', id: '501', pass: 'password123', role: 'ผู้อำนวยการ', dept: 'กองคลัง', badge: 'bg-emerald-100 text-emerald-700' },
    { label: 'ผอ.กองช่าง (นายวุฒิศักดิ์)', id: '401', pass: 'password123', role: 'ผู้อำนวยการ', dept: 'กองช่าง', badge: 'bg-amber-100 text-amber-800' },
    { label: 'หน.กองสวัสดิการ (นายวีระวัฒน์)', id: '201', pass: 'password123', role: 'นักพัฒนาชุมชน', dept: 'กองสวัสดิการ', badge: 'bg-pink-100 text-pink-700' },
    { label: 'ผอ.กองการศึกษา (นายทศพล)', id: '301', pass: 'password123', role: 'นักวิชาการ', dept: 'กองการศึกษา', badge: 'bg-violet-100 text-violet-700' },
    { label: 'ตรวจสอบภายใน (นายศุภมงคล)', id: '101', pass: 'password123', role: 'ผู้ตรวจสอบ', dept: 'ตรวจสอบภายใน', badge: 'bg-slate-100 text-slate-700' },
    { label: 'จนท.ธุรการ (จ.ส.อ.เกียรติพล)', id: '604', pass: 'password123', role: 'ผู้ปฏิบัติงาน', dept: 'สำนักปลัด', badge: 'bg-teal-100 text-teal-700' }
  ];

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('กรุณากรอกชื่อผู้ใช้งาน หรือ รหัสพนักงาน');
      return;
    }
    if (!password) {
      setErrorMsg('กรุณากรอกรหัสผ่าน');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = userService.authenticate(identifier, password);
      setIsLoading(false);

      if (result.success && result.user) {
        userService.setCurrentSession(result.user, rememberMe);
        onLoginSuccess(result.user);
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const handleQuickSelect = (acc: typeof demoAccounts[0]) => {
    setIdentifier(acc.id);
    setPassword(acc.pass);
    setErrorMsg('');

    // เข้าสู่ระบบทันที
    setIsLoading(true);
    setTimeout(() => {
      const result = userService.authenticate(acc.id, acc.pass);
      setIsLoading(false);
      if (result.success && result.user) {
        userService.setCurrentSession(result.user, rememberMe);
        onLoginSuccess(result.user);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700/40 relative z-10">
        
        {/* Left Col: Brand & System Features (45%) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 flex flex-col justify-between text-white relative">
          <div>
            {/* Logo & Org Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg border border-amber-300/40">
                <Building2 className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight">
                  FANGKHAM SMART GOV
                </h1>
                <p className="text-xs text-amber-300 font-medium">
                  ระบบบริหารงานราชการ อบต.ฝางคำ
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                ศูนย์บัญชาการดิจิทัล<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                  อบต.ฝางคำ อ.สิรินธร
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                เข้าถึงระบบติดตามภารกิจ จัดซื้อจัดจ้าง งานสารบรรณ หนังสือราชการ 
                และคลังเอกสารความปลอดภัยสูง
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">แยกสิทธิ์ตาม 7 กอง & ตำแหน่งจริง</div>
                  <div className="text-slate-300 text-[11px]">อ้างอิงข้อมูลบุคลากร 69 ท่าน จาก อบต.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-sky-300 flex items-center justify-center shrink-0">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Google Drive Cloud 15TB (3 บัญชี)</div>
                  <div className="text-slate-300 text-[11px]">จัดเก็บเอกสาร ภาพร้องเรียน & Backup</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">GovAI ผู้ช่วยอัจฉริยะ</div>
                  <div className="text-slate-300 text-[11px]">สรุปวาระประชุมและร่างรายงานราชการ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note on left */}
          <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>เวอร์ชัน 2.0 พร้อมใช้งาน</span>
            <span className="text-amber-400 font-mono">ปีงบประมาณ 2569</span>
          </div>
        </div>

        {/* Right Col: Login Form & Quick Switch (55%) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between text-slate-800 bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  เข้าสู่ระบบ (Sign In)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  กรอกชื่อผู้ใช้หรือรหัสพนักงานตามบัญชีสังกัด
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowQuickLogin(!showQuickLogin)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1.5 cursor-pointer border border-blue-200"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{showQuickLogin ? 'ซ่อนบัญชีทดสอบ' : 'บัญชีทดสอบด่วน'}</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ชื่อผู้ใช้งาน หรือ รหัสพนักงาน (Username / Code)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="เช่น admin, 705, 601, 501, 401, exec001"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * สามารถใช้รหัสประจำตัวพนักงานตาม Excel เช่น 705 (ปลัด), 601 (หน.สป.) หรือ admin
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    รหัสผ่าน (Password)
                  </label>
                  <span className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => alert('รหัสผ่านเริ่มต้นสำหรับพนักงานทุกคนคือ: password123\nหากลืมรหัสผ่าน กรุณาแจ้งผู้ดูแลระบบ (Admin) เพื่อรีเซ็ตรหัสผ่าน')}>
                    ลืมรหัสผ่าน?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน (ค่าเริ่มต้น password123)"
                    className="w-full pl-10 pr-11 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600">จดจำการเข้าสู่ระบบ</span>
                </label>
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  รหัสผ่านเริ่มต้น: <code className="font-mono text-blue-700">password123</code>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>เข้าสู่ระบบทันที</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Selector */}
            {showQuickLogin && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    เข้าสู่ระบบด่วนสำหรับการทดสอบ (Quick Test Login):
                  </span>
                  <span className="text-[11px] text-slate-400">คลิกที่การ์ดเพื่อเข้าสู่ระบบ</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickSelect(acc)}
                      className="p-2 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/70 transition cursor-pointer text-xs group"
                    >
                      <div className="font-bold text-slate-800 group-hover:text-blue-700 truncate">
                        {acc.label}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-slate-500 truncate">{acc.dept}</span>
                        <span className="font-mono text-slate-400 font-semibold">{acc.id}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            องค์การบริหารส่วนตำบลฝางคำ อำเภอสิรินธร จังหวัดอุบลราชธานี 34350 &bull; โทร 045-959-111
          </div>
        </div>
      </div>
    </div>
  );
};
