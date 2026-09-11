import React from 'react';
import {
  X,
  BookOpen,
  Smartphone,
  Monitor,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Printer,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
  Type
} from 'lucide-react';

interface EasyUseGuideModalProps {
  onClose: () => void;
}

export const EasyUseGuideModal: React.FC<EasyUseGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                คู่มือแนะนำการใช้งานระบบ อบต.ฝางคำ
              </h2>
              <p className="text-xs text-blue-200">
                ออกแบบให้ใช้งานง่าย รองรับสมาร์ตโฟน แท็บเล็ต และคอมพิวเตอร์ทุกรุ่น
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="ปิดคู่มือ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section 1: Responsive & Device Tips */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-3">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              การใช้งานบนหน้าจอประเภทต่างๆ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>บนมือถือ (Smartphone)</span>
                </div>
                <p className="text-slate-600">
                  มีแถบเมนูด้านล่าง 5 ปุ่มสำคัญ, ปุ่มลอยขวาล่าง <strong>(+)</strong> สำหรับสร้างงานด่วน, และสามารถแตะที่การ์ดงานเพื่อดูรายละเอียดหรืออัปเดตผลได้ทันที
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-indigo-600" />
                  <span>บนคอมพิวเตอร์และแท็บเล็ต</span>
                </div>
                <p className="text-slate-600">
                  มีเมนูด้านข้างครบทั้ง 22 กองงาน, ค้นหาได้ด้วย <strong>Ctrl+K</strong>, มีตารางข้อมูลละเอียด และสามารถกดพิมพ์เอกสารมาตรฐานได้ทันที
                </p>
              </div>
            </div>

            {/* Font Scaler tip */}
            <div className="flex items-start gap-2 pt-2 border-t border-blue-200/60 text-xs text-blue-800">
              <Type className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>ตัวช่วยอ่านง่าย:</strong> หากตัวหนังสือเล็กเกินไป สามารถกดปุ่ม <strong>ก- / ก / ก+</strong> ที่แถบด้านบนเพื่อขยายขนาดตัวอักษรให้อ่านสบายตายิ่งขึ้น
              </div>
            </div>
          </div>

          {/* Section 2: 4 Core Workflows */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              4 ขั้นตอนการทำงานราชการที่สำคัญ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="font-bold text-slate-800 text-xs">รับเรื่องและลงทะเบียนงาน</span>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  กดปุ่ม <strong>"สร้างภารกิจใหม่"</strong> ระบุกองที่รับผิดชอบ กำหนดส่ง และระดับความเร่งด่วน เพื่อเริ่มกระบวนการ
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="font-bold text-slate-800 text-xs">รายงานความก้าวหน้า & อุปสรรค</span>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  เปิดรายละเอียดภารกิจ ปรับสไลเดอร์เปอร์เซ็นต์ความคืบหน้า ติ๊กกิจกรรมย่อย และระบุปัญหาอุปสรรคเพื่อขอการสนับสนุน
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <span className="font-bold text-slate-800 text-xs">ตรวจสอบและเสนออนุมัติ</span>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  เมื่อเจ้าหน้าที่ปฏิบัติงานเสร็จ หัวหน้ากองกด "ตรวจสอบผ่าน" และเสนอให้ปลัด/นายก อบต. กด "อนุมัติผลงาน"
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <span className="font-bold text-slate-800 text-xs">พิมพ์บันทึกข้อความ & ออกรายงาน</span>
                </div>
                <p className="text-xs text-slate-600 pl-8">
                  กดไอคอนเครื่องพิมพ์ในงานหรือไปที่เมนู <strong>"ศูนย์รายงาน"</strong> เพื่อสั่งพิมพ์แบบฟอร์มราชการมาตรฐานไทย (A4)
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Smart Tools */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              ฟังก์ชันอัจฉริยะช่วยประหยัดเวลา
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
              <li>
                <strong>GovAI ผู้ช่วยอัจฉริยะ:</strong> ช่วยร่างบันทึกข้อความราชการ วิเคราะห์งานที่เสี่ยงล่าช้า และสรุปรายงานประจำเดือนให้อัตโนมัติ
              </li>
              <li>
                <strong>ระบบแปลงมติที่ประชุมเป็นงาน:</strong> เมื่อประชุมสภาเสร็จ สามารถกด <em>"แปลงมตินี้เป็นภารกิจราชการ"</em> มอบหมายกองงานได้ทันที
              </li>
              <li>
                <strong>สลับบทบาททดสอบ (Role Testing):</strong> สลับมุมมองระหว่าง นายก อบต., ปลัด, ผอ.กอง, และนิติกรได้ที่มุมขวาบน
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-slate-500" />
              <span>ต้องการความช่วยเหลือทางเทคนิค: ติดต่องานเทคโนโลยีสารสนเทศ อบต.ฝางคำ</span>
            </div>
            <span className="font-semibold text-slate-800">โทร. 043-XXX-XXX ต่อ 102</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer min-h-[40px]"
          >
            เข้าใจแล้ว เริ่มใช้งาน
          </button>
        </div>
      </div>
    </div>
  );
};
