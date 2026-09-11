import React, { useState } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  Building,
  Plus,
  ArrowRight,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { ProcurementItem } from '../types';
import { formatThaiCurrency, formatThaiDate } from '../utils/thaiDate';

interface ProcurementModuleProps {
  procurements: ProcurementItem[];
}

const PROCUREMENT_STEPS = [
  '1. จัดทำความต้องการ',
  '2. กำหนดรายละเอียด',
  '3. จัดทำ TOR',
  '4. ขออนุมัติ',
  '5. จัดซื้อจัดจ้าง/ประกวดราคา',
  '6. ทำสัญญา',
  '7. ส่งมอบ',
  '8. ตรวจรับ',
  '9. เบิกจ่าย',
  '10. ปิดโครงการ'
];

export const ProcurementModule: React.FC<ProcurementModuleProps> = ({ procurements }) => {
  const [selectedItem, setSelectedItem] = useState<ProcurementItem | null>(procurements[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-emerald-600" />
            ระบบติดตามงานจัดซื้อจัดจ้าง 10 ขั้นตอน (e-GP Tracker)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ตามพระราชบัญญัติการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560
          </p>
        </div>

        <button
          onClick={() => alert('เปิดแบบฟอร์มบันทึกความต้องการจัดซื้อจัดจ้างใหม่')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ขออนุมัติจัดซื้อจัดจ้างใหม่</span>
        </button>
      </div>

      {/* Procurement Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: List */}
        <div className="lg:col-span-2 space-y-4">
          {procurements.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            const progressPct = Math.round((item.currentStepIndex / 10) * 100);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-5 rounded-2xl bg-white border shadow-sm hover:shadow-md transition cursor-pointer space-y-4 ${
                  isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.procNo}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.method}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 mt-1">
                      {item.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">งบประมาณ</span>
                    <strong className="text-emerald-700 font-mono text-sm">
                      {formatThaiCurrency(item.budgetAmount)}
                    </strong>
                  </div>
                </div>

                {/* 10 Step Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">
                      ขั้นตอนปัจจุบัน: <strong className="text-emerald-800">{PROCUREMENT_STEPS[item.currentStepIndex - 1]}</strong>
                    </span>
                    <span className="font-bold text-emerald-700">{progressPct}%</span>
                  </div>

                  <div className="grid grid-cols-10 gap-1">
                    {PROCUREMENT_STEPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition ${
                          idx < item.currentStepIndex
                            ? 'bg-emerald-600'
                            : 'bg-slate-200'
                        }`}
                        title={PROCUREMENT_STEPS[idx]}
                      />
                    ))}
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.departmentName}</span>
                  </div>
                  <span>ผู้รับผิดชอบ: {item.responsibleOfficer}</span>
                  {item.vendorName && (
                    <span className="text-emerald-800 font-medium">
                      คู่สัญญา: {item.vendorName}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Detailed Step Timeline */}
        {selectedItem && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 h-fit sticky top-20 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <span className="font-mono text-xs text-emerald-700 font-bold block mb-1">
                {selectedItem.procNo}
              </span>
              <h3 className="font-bold text-sm text-slate-800 leading-snug">
                {selectedItem.title}
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">วิธีจัดซื้อจัดจ้าง:</span>
                <span className="font-semibold text-slate-800">{selectedItem.method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">วงเงินงบประมาณ:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {formatThaiCurrency(selectedItem.budgetAmount)}
                </span>
              </div>
              {selectedItem.contractAmount && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">วงเงินตามสัญญา:</span>
                  <span className="font-mono font-bold text-blue-700">
                    {formatThaiCurrency(selectedItem.contractAmount)}
                  </span>
                </div>
              )}
              {selectedItem.vendorName && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">ผู้ชนะ / ผู้รับจ้าง:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.vendorName}</span>
                </div>
              )}
            </div>

            {/* 10 Step Vertical Visualizer */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider">
                ลำดับขั้นตอนตาม พ.ร.บ.จัดซื้อจัดจ้างฯ
              </h4>

              <div className="space-y-2 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {PROCUREMENT_STEPS.map((stepName, idx) => {
                  const stepNum = idx + 1;
                  const isDone = stepNum < selectedItem.currentStepIndex;
                  const isCurrent = stepNum === selectedItem.currentStepIndex;

                  return (
                    <div key={stepNum} className="flex items-center gap-3 relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-pulse'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : stepNum}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span
                          className={`block font-medium truncate ${
                            isCurrent
                              ? 'text-emerald-900 font-bold'
                              : isDone
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {stepName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
