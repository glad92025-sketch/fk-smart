import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Clock,
  Laptop,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const actionTypes = [
    'อัปเดตความคืบหน้างาน',
    'เปลี่ยนสถานะงาน',
    'มอบหมายงานราชการ',
    'อนุมัติงานโครงการ',
    'สำรองข้อมูลฐานข้อมูล'
  ];

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchAction = selectedAction === 'all' || log.action === selectedAction;
    return matchSearch && matchAction;
  });

  const handleExportCsv = () => {
    const headers = 'รหัส,วันเวลา,ผู้ใช้งาน,บทบาท,การกระทำ,เป้าหมาย,รหัสอ้างอิง,รายละเอียด,IP Address\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.targetType}","${l.targetId}","${l.details.replace(/"/g, '""')}","${l.ipAddress}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fangkham_audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage('ส่งออกไฟล์ Audit Log (.CSV) สำเร็จ');
    setTimeout(() => setToastMessage(null), 3000);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>Audit Log บันทึกการตรวจสอบย้อนหลัง</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ประวัติการปฏิบัติงาน การเปลี่ยนแปลงข้อมูล และความปลอดภัยตามมาตรฐานธรรมาภิบาลภาครัฐ
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>ส่งออกรายงาน CSV</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">บันทึกเหตุการณ์ทั้งหมด</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{logs.length} ครั้ง</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">การมอบหมาย/อนุมัติ</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {logs.filter((l) => l.action.includes('มอบหมาย') || l.action.includes('อนุมัติ')).length} ครั้ง
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">ปรับปรุงสถานะงาน</div>
          <div className="text-xl font-bold text-blue-600 mt-1">
            {logs.filter((l) => l.action.includes('สถานะ') || l.action.includes('ความคืบหน้า')).length} ครั้ง
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">ความปลอดภัยระบบ</div>
          <div className="text-xl font-bold text-indigo-600 mt-1">100% ปกติ</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อผู้ปฏิบัติงาน, รหัสอ้างอิง, รายละเอียด, หรือ IP Address..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
        >
          <option value="all">🔍 ทุกประเภทการกระทำ</option>
          {actionTypes.map((act) => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Logs Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-slate-800">{log.userName}</span>
                <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                  {log.action}
                </span>
                <span className="font-mono text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  {log.targetId}
                </span>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {log.details}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>บทบาท: {log.userRole}</span>
                <span className="font-mono">IP: {log.ipAddress}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-3.5">วัน - เวลา</th>
                <th className="p-3.5">ผู้ใช้งาน / บทบาท</th>
                <th className="p-3.5">ประเภทการกระทำ</th>
                <th className="p-3.5">เป้าหมาย & รหัส</th>
                <th className="p-3.5">รายละเอียดการกระทำ</th>
                <th className="p-3.5 font-mono">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3.5 font-medium text-slate-800">
                    <div>{log.userName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">({log.userRole})</span>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 text-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-blue-700">
                    <div>{log.targetId}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{log.targetType}</span>
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-md">{log.details}</td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
            ไม่พบบันทึกการใช้งานตามคำค้นหา
          </div>
        )}
      </div>
    </div>
  );
};
