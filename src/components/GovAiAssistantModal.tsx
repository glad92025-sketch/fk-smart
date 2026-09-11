import React, { useState } from 'react';
import {
  Sparkles,
  X,
  FileText,
  AlertTriangle,
  Send,
  Copy,
  Check,
  Building,
  CheckCircle2
} from 'lucide-react';
import { Task, Department } from '../types';

interface GovAiAssistantModalProps {
  onClose: () => void;
  tasks: Task[];
  departments: Department[];
}

export const GovAiAssistantModal: React.FC<GovAiAssistantModalProps> = ({
  onClose,
  tasks,
  departments
}) => {
  const [activeMode, setActiveMode] = useState<'summary' | 'memo' | 'bottlenecks'>('summary');
  const [memoTopic, setMemoTopic] = useState('ขออนุมัติซ่อมแซมถนนเพื่อความปลอดภัยประชาชน');
  const [memoResult, setMemoResult] = useState('');
  const [copied, setCopied] = useState(false);

  // Compute live bottlenecks
  const overdueTasks = tasks.filter(t => t.status === 'overdue' || (t.dueDate < '2026-09-08' && t.status !== 'completed' && t.status !== 'closed'));
  const criticalTasks = tasks.filter(t => t.urgency === 'critical');

  const handleGenerateMemo = () => {
    const draft = `บันทึกข้อความ
ส่วนราชการ: กองช่าง องค์การบริหารส่วนตำบลฝางคำ โทร. ๐๔๓-๑๒๓๔๕๖
ที่: มค ๗๘๒๐๓/                     วันที่: ๘ กันยายน ๒๕๖๙
เรื่อง: ${memoTopic}

เรียน  นายกองค์การบริหารส่วนตำบลฝางคำ (ผ่านปลัด อบต.ฝางคำ)

๑. ต้นเรื่อง
   ด้วยกองช่าง ได้รับแจ้งจากราษฎรและศูนย์ดำรงธรรม เกี่ยวกับข้อเท็จจริงในพื้นที่ ซึ่งมีความจำเป็นต้องเร่งดำเนินการแก้ไขปัญหาความเดือดร้อนของประชาชนโดยเร็ว

๒. ข้อเท็จจริงและข้อกฎหมาย
   เจ้าหน้าที่กองช่างได้ลงพื้นที่ตรวจสอบข้อเท็จจริง พบว่ามีความชำรุดเสียหายและส่งผลกระทบต่อสวัสดิภาพในการสัญจร จึงเห็นควรดำเนินการตามระเบียบกระทรวงมหาดไทยว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐

๓. ข้อพิจารณาและข้อเสนอ
   จึงเรียนมาเพื่อโปรดพิจารณา
   ๑. อนุมัติในหลักการให้ดำเนินการตามแผนงาน
   ๒. มอบหมายเจ้าหน้าที่ผู้รับผิดชอบดำเนินการจัดทำรายงานขอซื้อขอจ้างต่อไป


( นายชาญณรงค์ โยธาดี )
ผู้อำนวยการกองช่าง`;

    setMemoResult(draft);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-300/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">GovAI ผู้ช่วยวิเคราะห์งานและร่างหนังสือราชการ</h3>
              <p className="text-xs text-slate-300">ปัญญาประดิษฐ์อัจฉริยะสำหรับงานบริหาร อบต.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4">
          <button
            onClick={() => setActiveMode('summary')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeMode === 'summary' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            📊 สรุปภาพรวมและข้อเสนอแนะ
          </button>
          <button
            onClick={() => setActiveMode('bottlenecks')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeMode === 'bottlenecks' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            🚨 วิเคราะห์จุดคอขวด ({overdueTasks.length})
          </button>
          <button
            onClick={() => setActiveMode('memo')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeMode === 'memo' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            📝 ร่างบันทึกข้อความราชการ
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {activeMode === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                <h4 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  บทสรุปสังเคราะห์สำหรับนายก อบต. และปลัด อบต.
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  ปัจจุบัน อบต.ฝางคำ มีภารกิจในระบบทั้งสิ้น <strong>{tasks.length} งาน</strong> ดำเนินการเสร็จสมบูรณ์แล้ว <strong>{tasks.filter(t => t.status === 'completed' || t.status === 'closed').length} งาน</strong> คิดเป็นอัตราความสำเร็จภาพรวมร้อยละ {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed' || t.status === 'closed').length / tasks.length) * 100) : 0}%
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-800">3 ประเด็นเร่งด่วนที่แนะนำให้ผู้บริหารติดตามในวันนี้:</h5>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">๑. เร่งรัดโครงการซ่อมแซมถนนลูกรัง ม.3 (กองช่าง)</span>
                  <p className="text-slate-600">เป็นงานระดับวิกฤต (Critical) และเป็นข้อร้องทุกข์จากราษฎร ควรให้ ผอ.กองช่าง เร่งส่งมอบงานก่อนฝนตกชุก</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">๒. ติดตามผลรายงานโภชนาการเด็ก ศพด. (กองการศึกษา)</span>
                  <p className="text-slate-600">เกินกำหนดมาแล้ว 3 วัน เนื่องจากรอข้อมูลจาก รพ.สต. แนะนำให้ทำหนังสือประสานอย่างเป็นทางการ</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">๓. เร่งตรวจรับพัสดุก่อสร้างลานกีฬา (กองคลัง & กองช่าง)</span>
                  <p className="text-slate-600">อยู่ในขั้นตอนที่ 9 ของการจัดซื้อจัดจ้าง ควรรีบตรวจรับเพื่อเบิกจ่ายให้ทันสิ้นปีงบประมาณ 2569</p>
                </div>
              </div>
            </div>
          )}

          {activeMode === 'bottlenecks' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold">
                พบงานที่เกินกำหนดและเสี่ยงล่าช้าจำนวน {overdueTasks.length} รายการ
              </div>

              <div className="space-y-2">
                {overdueTasks.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-white border border-rose-200 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-rose-700">{t.taskNo}</span>
                      <h5 className="font-bold text-slate-800">{t.title}</h5>
                      <span className="text-[11px] text-slate-500">ผู้รับผิดชอบ: {t.assigneeName} ({t.departmentName})</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold text-xs">
                      เกินกำหนด
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMode === 'memo' && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  หัวข้อเรื่องที่ต้องการร่างหนังสือราชการ:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={memoTopic}
                    onChange={(e) => setMemoTopic(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                  <button
                    onClick={handleGenerateMemo}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow"
                  >
                    ร่างข้อความ
                  </button>
                </div>
              </div>

              {memoResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">ร่างบันทึกข้อความตามแบบมาตรฐานกระทรวงมหาดไทย:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(memoResult);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="flex items-center gap-1 text-blue-600 font-semibold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-serif leading-relaxed whitespace-pre-wrap text-slate-800">
                    {memoResult}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
