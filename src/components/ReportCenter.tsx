import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  Building,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award
} from 'lucide-react';
import { Task, Department, CitizenComplaint, ProjectItem } from '../types';
import { formatThaiDate, formatThaiCurrency } from '../utils/thaiDate';

interface ReportCenterProps {
  tasks: Task[];
  departments: Department[];
  complaints: CitizenComplaint[];
  projects: ProjectItem[];
}

export const ReportCenter: React.FC<ReportCenterProps> = ({
  tasks,
  departments,
  complaints,
  projects
}) => {
  const [reportType, setReportType] = useState<'monthly' | 'dept' | 'overdue' | 'complaints'>('monthly');

  // Excel / CSV exporter
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'เลขที่งาน,ชื่องาน,กองที่รับผิดชอบ,ผู้รับผิดชอบ,กำหนดส่ง,สถานะ,ความคืบหน้า(%),งบประมาณ(บาท)\n';

    tasks.forEach(t => {
      const row = [
        `"${t.taskNo}"`,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.departmentName}"`,
        `"${t.assigneeName}"`,
        `"${t.dueDate}"`,
        `"${t.status}"`,
        `"${t.progress}"`,
        `"${t.budget}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `รายงานภารกิจ_อบต_ฝางคำ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedCount = tasks.filter(t => t.status === 'completed' || t.status === 'closed').length;
  const overdueCount = tasks.filter(t => t.status === 'overdue' || (t.dueDate < '2026-09-08' && t.status !== 'completed' && t.status !== 'closed')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            ศูนย์รวมรายงานและสถิติราชการ (Report & Analytics Center)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ส่งออกข้อมูลเพื่อประกอบการประชุมสภา อบต. และรายงานผลต่อหน่วยงานกำกับดูแล
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ส่งออก Excel (CSV)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงานทางการ (Print)</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold max-w-xl">
        <button
          onClick={() => setReportType('monthly')}
          className={`flex-1 py-2 rounded-lg transition ${reportType === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          สรุปประจำเดือน
        </button>
        <button
          onClick={() => setReportType('dept')}
          className={`flex-1 py-2 rounded-lg transition ${reportType === 'dept' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          สรุปแยกตามกอง
        </button>
        <button
          onClick={() => setReportType('overdue')}
          className={`flex-1 py-2 rounded-lg transition ${reportType === 'overdue' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          งานค้างและเกินกำหนด
        </button>
        <button
          onClick={() => setReportType('complaints')}
          className={`flex-1 py-2 rounded-lg transition ${reportType === 'complaints' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
        >
          เรื่องร้องเรียนประชาชน
        </button>
      </div>

      {/* Printable Official Government Document View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-slate-800">
        {/* Official Header */}
        <div className="text-center space-y-2 border-b-2 border-slate-900 pb-5">
          <div className="w-14 h-14 mx-auto bg-slate-900 text-amber-400 font-bold rounded-2xl flex items-center justify-center text-xl shadow">
            อบต.
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            รายงานสรุปผลการปฏิบัติราชการและการดำเนินงานตามภารกิจ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            องค์การบริหารส่วนตำบลฝางคำ อำเภอกันทรวิชัย จังหวัดมหาสารคาม
          </p>
          <p className="text-xs text-slate-500">
            ประจำเดือน กันยายน พ.ศ. 2569 (ปีงบประมาณ 2569)
          </p>
        </div>

        {/* High-level Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">ภารกิจในระบบทั้งหมด</span>
            <strong className="text-xl font-bold text-slate-800">{tasks.length} งาน</strong>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-800 block">ดำเนินการเสร็จสิ้น</span>
            <strong className="text-xl font-bold text-emerald-800">{completedCount} งาน</strong>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-blue-800 block">อัตราความสำเร็จ (KPI)</span>
            <strong className="text-xl font-bold text-blue-800">
              {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-rose-800 block">งานเกินกำหนด (ต้องเร่งรัด)</span>
            <strong className="text-xl font-bold text-rose-800">{overdueCount} งาน</strong>
          </div>
        </div>

        {/* Section Table */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3">
            ผลการปฏิบัติงานจำแนกตามส่วนราชการ / กอง
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                  <th className="py-2.5 px-3">กอง / ส่วนราชการ</th>
                  <th className="py-2.5 px-3">หัวหน้าส่วนราชการ</th>
                  <th className="py-2.5 px-3 text-center">งานทั้งหมด</th>
                  <th className="py-2.5 px-3 text-center">เสร็จแล้ว</th>
                  <th className="py-2.5 px-3 text-center">ค้างอยู่</th>
                  <th className="py-2.5 px-3 text-center">ความสำเร็จ (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((d) => {
                  const dTasks = tasks.filter(t => t.departmentId === d.id);
                  const dDone = dTasks.filter(t => t.status === 'completed' || t.status === 'closed').length;
                  const dPending = dTasks.length - dDone;
                  const dRate = dTasks.length > 0 ? Math.round((dDone / dTasks.length) * 100) : 0;

                  return (
                    <tr key={d.id}>
                      <td className="py-3 px-3 font-semibold text-slate-800">{d.name}</td>
                      <td className="py-3 px-3 text-slate-600">{d.headName}</td>
                      <td className="py-3 px-3 text-center font-bold">{dTasks.length}</td>
                      <td className="py-3 px-3 text-center text-emerald-700 font-bold">{dDone}</td>
                      <td className="py-3 px-3 text-center text-blue-700">{dPending}</td>
                      <td className="py-3 px-3 text-center font-bold font-mono">{dRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures for Print */}
        <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
          <div className="space-y-12">
            <div>ลงชื่อ............................................................</div>
            <div>
              <p className="font-bold">( นายวัชรพงศ์ รัตนปัญญา )</p>
              <p className="text-slate-500">ปลัดองค์การบริหารส่วนตำบลฝางคำ</p>
            </div>
          </div>
          <div className="space-y-12">
            <div>ลงชื่อ............................................................</div>
            <div>
              <p className="font-bold">( ดร.สมเกียรติ ธนะศักดิ์ศิริ )</p>
              <p className="text-slate-500">นายกองค์การบริหารส่วนตำบลฝางคำ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
