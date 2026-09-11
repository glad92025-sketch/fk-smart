import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle
} from 'lucide-react';
import { MeetingItem, MeetingAgenda, Task, User, Department } from '../types';
import { formatThaiDate } from '../utils/thaiDate';

interface MeetingManagementProps {
  meetings: MeetingItem[];
  departments: Department[];
  currentUser: User;
  onAddMeeting: (meeting: MeetingItem) => void;
  onConvertResolutionToTask: (meeting: MeetingItem, agenda: MeetingAgenda) => void;
}

export const MeetingManagement: React.FC<MeetingManagementProps> = ({
  meetings,
  departments,
  currentUser,
  onAddMeeting,
  onConvertResolutionToTask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(meetings[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    meetingNo: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:30 - 12:00 น.',
    location: 'ห้องประชุมสภา อบต.ฝางคำ ชั้น 3',
    chairman: 'ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)',
    attendeesText: 'นายก อบต., รองนายก อบต., ปลัด อบต., ผอ.ทุกกอง, เจ้าหน้าที่ที่เกี่ยวข้อง',
    status: 'scheduled' as 'scheduled' | 'finished',
    agendas: [
      {
        orderNo: 1,
        title: 'เรื่องที่ประธานแจ้งให้ที่ประชุมทราบ',
        description: 'แจ้งข้อราชการสำคัญและนโยบายเร่งด่วน',
        resolution: ''
      },
      {
        orderNo: 2,
        title: 'เรื่องเพื่อพิจารณา',
        description: 'พิจารณาข้อเสนอและแผนการดำเนินงาน',
        resolution: ''
      }
    ]
  });

  const filteredMeetings = meetings.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.meetingNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.agendas.some((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || (a.resolution && a.resolution.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchStatus = selectedStatus === 'all' || m.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const handleAddAgendaRow = () => {
    setFormData({
      ...formData,
      agendas: [
        ...formData.agendas,
        {
          orderNo: formData.agendas.length + 1,
          title: `ระเบียบวาระที่ ${formData.agendas.length + 1}`,
          description: '',
          resolution: ''
        }
      ]
    });
  };

  const handleAgendaChange = (index: number, field: string, val: string) => {
    const updated = [...formData.agendas];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, agendas: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.meetingNo.trim()) return;

    const newMeeting: MeetingItem = {
      id: `mtg_${Date.now()}`,
      title: formData.title,
      meetingNo: formData.meetingNo,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      chairman: formData.chairman,
      attendees: formData.attendeesText.split(',').map((s) => s.trim()),
      agendas: formData.agendas.map((a, i) => ({
        id: `agd_${Date.now()}_${i}`,
        orderNo: a.orderNo,
        title: a.title,
        description: a.description,
        resolution: a.resolution || undefined
      })),
      status: formData.status,
      fiscalYear: '2569'
    };

    onAddMeeting(newMeeting);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-indigo-600" />
            <span>การประชุม & มติที่ประชุมราชการ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            บันทึกวาระการประชุมสภาและผู้บริหาร อบต.ฝางคำ พร้อมระบบแปลงมติที่ประชุมเป็นภารกิจมอบหมายงานทันที
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างวาระการประชุมใหม่</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">การประชุมทั้งหมด</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{meetings.length} ครั้ง</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">ประชุมเสร็จสิ้นแล้ว</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {meetings.filter((m) => m.status === 'finished').length} ครั้ง
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">นัดหมายที่จะถึง</div>
          <div className="text-xl font-bold text-blue-600 mt-1">
            {meetings.filter((m) => m.status === 'scheduled').length} ครั้ง
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">มติที่แปลงเป็นงานแล้ว</div>
          <div className="text-xl font-bold text-indigo-600 mt-1">
            {meetings.reduce((acc, m) => acc + m.agendas.filter((a) => a.convertedToTaskId).length, 0)} งาน
          </div>
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
            placeholder="ค้นหาชื่อการประชุม, ครั้งที่, หรือเนื้อหาวาระ/มติ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
        >
          <option value="all">📌 ทุกสถานะการประชุม</option>
          <option value="finished">ประชุมเสร็จสิ้นแล้ว</option>
          <option value="scheduled">กำหนดการนัดหมาย</option>
        </select>
      </div>

      {/* Meetings Accordion List */}
      <div className="space-y-4">
        {filteredMeetings.map((mtg) => {
          const isExpanded = expandedMeetingId === mtg.id;

          return (
            <div
              key={mtg.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition"
            >
              {/* Meeting Header Item */}
              <div
                onClick={() => setExpandedMeetingId(isExpanded ? null : mtg.id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      ครั้งที่ {mtg.meetingNo}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        mtg.status === 'finished'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {mtg.status === 'finished' ? '✓ ประชุมเสร็จสิ้น' : '⏳ นัดหมายล่วงหน้า'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatThaiDate(mtg.date)} • {mtg.time}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                    {mtg.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{mtg.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>ประธาน: {mtg.chairman}</span>
                    </div>
                    <span className="text-indigo-600 font-semibold">
                      ({mtg.agendas.length} ระเบียบวาระ)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <span className="text-xs text-indigo-600 font-medium sm:hidden">
                    {isExpanded ? 'ย่อรายละเอียด' : 'ดูระเบียบวาระ'}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Meeting Body / Agendas */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50/50 space-y-4">
                  {/* Attendees */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                    <div className="font-bold text-slate-700 mb-1">รายชื่อผู้เข้าร่วมประชุม:</div>
                    <div className="text-slate-600 leading-relaxed">
                      {mtg.attendees.join(' • ')}
                    </div>
                  </div>

                  {/* Agendas list */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      ระเบียบวาระการประชุม และมติที่ประชุม
                    </div>

                    {mtg.agendas.map((agenda) => (
                      <div
                        key={agenda.id}
                        className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-xs sm:text-sm text-slate-800">
                            <span className="text-indigo-600 mr-1.5">วาระที่ {agenda.orderNo}:</span>
                            {agenda.title}
                          </div>

                          {agenda.convertedToTaskId ? (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              แปลงเป็นงานแล้ว
                            </span>
                          ) : agenda.resolution ? (
                            <button
                              onClick={() => onConvertResolutionToTask(mtg, agenda)}
                              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition cursor-pointer text-xs"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              <span>แปลงมติเป็นงาน</span>
                            </button>
                          ) : null}
                        </div>

                        {agenda.description && (
                          <p className="text-xs text-slate-600 pl-4 border-l-2 border-slate-200 leading-relaxed">
                            {agenda.description}
                          </p>
                        )}

                        {/* Resolution box */}
                        {agenda.resolution ? (
                          <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                            <div className="font-bold text-emerald-800 flex items-center gap-1">
                              <span>มติที่ประชุม:</span>
                            </div>
                            <p className="leading-relaxed">{agenda.resolution}</p>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">
                            วาระนี้ไม่มีมติมอบหมายงาน หรือเป็นเพียงวาระแจ้งเพื่อทราบ
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredMeetings.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs sm:text-sm bg-white rounded-2xl border border-slate-200">
            ไม่พบข้อมูลการประชุมตามเงื่อนไขที่ค้นหา
          </div>
        )}
      </div>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <CalendarCheck className="w-5 h-5 text-indigo-400" />
                <span>สร้างบันทึกการประชุมราชการใหม่</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">ชื่อการประชุม *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="เช่น การประชุมหัวหน้าส่วนราชการ ประจำเดือน..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ครั้งที่/ปี *</label>
                  <input
                    type="text"
                    required
                    value={formData.meetingNo}
                    onChange={(e) => setFormData({ ...formData, meetingNo: e.target.value })}
                    placeholder="เช่น 10/2569"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">วันที่ประชุม *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">เวลาประชุม</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="09:30 - 12:00 น."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">สถานะ</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="finished">ประชุมเสร็จสิ้นแล้ว</option>
                    <option value="scheduled">นัดหมายล่วงหน้า</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">สถานที่ประชุม</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="ห้องประชุมสภา อบต.ฝางคำ ชั้น 3"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ประธานการประชุม</label>
                  <input
                    type="text"
                    value={formData.chairman}
                    onChange={(e) => setFormData({ ...formData, chairman: e.target.value })}
                    placeholder="ดร.สมเกียรติ ธนะศักดิ์ศิริ (นายก อบต.)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Agenda Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">ระเบียบวาระการประชุม & มติ</span>
                  <button
                    type="button"
                    onClick={handleAddAgendaRow}
                    className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> เพิ่มวาระ
                  </button>
                </div>

                {formData.agendas.map((ag, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-600 text-xs shrink-0">วาระที่ {idx + 1}</span>
                      <input
                        type="text"
                        required
                        value={ag.title}
                        onChange={(e) => handleAgendaChange(idx, 'title', e.target.value)}
                        placeholder="ชื่อเรื่องวาระการประชุม"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={ag.description}
                      onChange={(e) => handleAgendaChange(idx, 'description', e.target.value)}
                      placeholder="สาระสำคัญของเรื่อง / ข้อเสนอแนะ..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    />
                    <textarea
                      rows={2}
                      value={ag.resolution}
                      onChange={(e) => handleAgendaChange(idx, 'resolution', e.target.value)}
                      placeholder="มติที่ประชุม (หากมี เพื่อใช้แปลงเป็นภารกิจมอบหมายงาน)"
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/50 text-xs text-emerald-950"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md"
                >
                  บันทึกการประชุม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
