import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  KeyRound, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Building2, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Phone, 
  Mail, 
  Briefcase, 
  UserCheck, 
  Lock,
  ChevronRight,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import { User, RoleType, DepartmentId } from '../types';
import { userService } from '../services/userService';
import { REAL_DEPARTMENTS } from '../data/departmentsData';

interface UserManagementViewProps {
  currentUser: User;
  onSwitchUser?: (user: User) => void;
  onRefreshData?: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  onSwitchUser,
  onRefreshData
}) => {
  const [users, setUsers] = useState<User[]>(() => userService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedEmpType, setSelectedEmpType] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPassUser, setResetPassUser] = useState<User | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('password123');
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState<Partial<User>>({
    employeeCode: '',
    username: '',
    name: '',
    phone: '',
    email: '',
    position: '',
    departmentId: 'dept_office',
    departmentName: 'สำนักปลัด อบต.',
    divisionName: 'สำนักปลัด อบต.',
    role: 'officer',
    roleTitle: 'เจ้าหน้าที่ผู้ปฏิบัติงาน',
    employmentType: 'ข้าราชการ',
    password: 'password123',
    status: 'active'
  });

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const refreshUsersList = () => {
    const list = userService.getUsers();
    setUsers(list);
    if (onRefreshData) onRefreshData();
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Dept filter
      if (selectedDept !== 'all' && u.departmentId !== selectedDept) {
        return false;
      }
      // Emp type filter
      if (selectedEmpType !== 'all' && u.employmentType !== selectedEmpType) {
        return false;
      }
      // Role filter
      if (selectedRole !== 'all' && u.role !== selectedRole) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = u.name.toLowerCase().includes(q);
        const matchCode = (u.employeeCode || '').toLowerCase().includes(q);
        const matchPhone = (u.phone || '').includes(q);
        const matchPos = (u.position || '').toLowerCase().includes(q);
        const matchUser = (u.username || '').toLowerCase().includes(q);
        return matchName || matchCode || matchPhone || matchPos || matchUser;
      }
      return true;
    });
  }, [users, selectedDept, selectedEmpType, selectedRole, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.status !== 'suspended').length,
      admins: users.filter(u => ['super_admin', 'admin'].includes(u.role)).length,
      executives: users.filter(u => u.departmentId === 'dept_exec').length,
      officers: users.filter(u => u.departmentId !== 'dept_exec').length
    };
  }, [users]);

  // Handlers
  const handleOpenAddModal = () => {
    setFormData({
      employeeCode: `FK${users.length + 1}`,
      username: `fk${users.length + 1}`,
      name: '',
      phone: '',
      email: `user${users.length + 1}@fangkham.go.th`,
      position: '',
      departmentId: 'dept_office',
      departmentName: 'สำนักปลัด อบต.',
      divisionName: 'สำนักปลัด อบต.',
      role: 'officer',
      roleTitle: 'เจ้าหน้าที่ผู้ปฏิบัติงาน',
      employmentType: 'ข้าราชการ',
      password: 'password123',
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({ ...u });
  };

  const handleSaveAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.position?.trim()) {
      showAlert('error', 'กรุณาระบุชื่อ-สกุล และตำแหน่งให้ครบถ้วน');
      return;
    }

    const dept = REAL_DEPARTMENTS.find(d => d.id === formData.departmentId);
    const result = userService.addUser({
      name: formData.name.trim(),
      employeeCode: formData.employeeCode?.trim() || `FK${users.length + 1}`,
      username: formData.username?.trim() || `fk${users.length + 1}`,
      password: formData.password || 'password123',
      phone: formData.phone || '-',
      email: formData.email || `${formData.username}@fangkham.go.th`,
      position: formData.position.trim(),
      departmentId: formData.departmentId || 'dept_office',
      departmentName: dept ? dept.name : (formData.departmentName || 'สำนักปลัด อบต.'),
      divisionName: formData.divisionName || (dept ? dept.name : 'สำนักปลัด อบต.'),
      role: formData.role || 'officer',
      roleTitle: formData.roleTitle || 'เจ้าหน้าที่ผู้ปฏิบัติงาน',
      employmentType: formData.employmentType || 'ข้าราชการ',
      status: formData.status || 'active'
    });

    if (result.success) {
      showAlert('success', result.message);
      setShowAddModal(false);
      refreshUsersList();
    } else {
      showAlert('error', result.message);
    }
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const dept = REAL_DEPARTMENTS.find(d => d.id === formData.departmentId);
    const result = userService.updateUser(editingUser.id, {
      name: formData.name?.trim(),
      employeeCode: formData.employeeCode?.trim(),
      phone: formData.phone,
      email: formData.email,
      position: formData.position?.trim(),
      departmentId: formData.departmentId,
      departmentName: dept ? dept.name : formData.departmentName,
      divisionName: formData.divisionName,
      role: formData.role,
      roleTitle: formData.roleTitle,
      employmentType: formData.employmentType,
      status: formData.status
    });

    if (result.success) {
      showAlert('success', result.message);
      setEditingUser(null);
      refreshUsersList();
    } else {
      showAlert('error', result.message);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassUser) return;
    if (!newPasswordValue.trim() || newPasswordValue.length < 6) {
      showAlert('error', 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    const result = userService.resetPassword(resetPassUser.id, newPasswordValue.trim());
    if (result.success) {
      showAlert('success', result.message);
      setResetPassUser(null);
      refreshUsersList();
    } else {
      showAlert('error', result.message);
    }
  };

  const handleToggleStatus = (u: User) => {
    if (u.id === 'usr_admin') {
      showAlert('error', 'ไม่สามารถระงับบัญชี Super Admin ได้');
      return;
    }
    const newStatus = u.status === 'suspended' ? 'active' : 'suspended';
    const result = userService.updateUser(u.id, { status: newStatus });
    if (result.success) {
      showAlert('success', `${u.status === 'suspended' ? 'เปิดใช้งาน' : 'ระงับการใช้งาน'} บัญชี ${u.name} แล้ว`);
      refreshUsersList();
    }
  };

  const handleDeleteUser = (u: User) => {
    if (u.id === 'usr_admin') {
      showAlert('error', 'ไม่สามารถลบบัญชี Super Admin ได้');
      return;
    }
    if (window.confirm(`ยืนยันการลบผู้ใช้งาน: ${u.name} (${u.position})? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      const result = userService.deleteUser(u.id);
      if (result.success) {
        showAlert('success', result.message);
        refreshUsersList();
      } else {
        showAlert('error', result.message);
      }
    }
  };

  const handleReSyncExcel = () => {
    if (window.confirm('คุณต้องการโหลดและซิงค์ข้อมูลใหม่ทั้งหมดจากไฟล์ Excel (D:\\อบต\\รายชื่อพนักงาน.xlsx) หรือไม่?')) {
      const res = userService.resetToOriginalExcel();
      showAlert('success', res.message);
      refreshUsersList();
    }
  };

  const handleExportCsv = () => {
    const headers = ['รหัสพนักงาน', 'ชื่อ-สกุล', 'กอง/สำนัก', 'ตำแหน่ง', 'ประเภทการจ้าง', 'เบอร์โทรศัพท์', 'อีเมล', 'สิทธิ์ในระบบ', 'สถานะ'];
    const rows = users.map(u => [
      u.employeeCode || '',
      `"${u.name}"`,
      `"${u.departmentName}"`,
      `"${u.position}"`,
      `"${u.employmentType || ''}"`,
      `"${u.phone}"`,
      `"${u.email}"`,
      `"${u.roleTitle}"`,
      u.status === 'suspended' ? 'ระงับการใช้งาน' : 'ปกติ'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `รายชื่อพนักงาน_อบต_ฝางคำ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert('success', 'ส่งออกข้อมูลพนักงานเป็นไฟล์ CSV เรียบร้อยแล้ว');
  };

  const roleBadgeColor: Record<RoleType, string> = {
    super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    mayor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    deputy_mayor: 'bg-orange-100 text-orange-800 border-orange-200',
    clerk: 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
    dept_head: 'bg-sky-100 text-sky-800 border-sky-200 font-semibold',
    officer: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ระบบบริหารจัดการผู้ใช้งานและสิทธิ์ (User & Access Control)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ทะเบียนบุคลากร อบต.ฝางคำ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            แยกตาม 7 กอง/ส่วนงาน และตำแหน่งจริง &bull; นำเข้าจากไฟล์ <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 text-xs">D:\อบต\รายชื่อพนักงาน.xlsx</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReSyncExcel}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
            title="รีเซ็ตและซิงค์ข้อมูลใหม่จากไฟล์ Excel"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>ซิงค์จาก Excel</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
            title="ส่งออกข้อมูลพนักงานทั้งหมดเป็น CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>เพิ่มผู้ใช้งาน</span>
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {alertMessage && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm animate-in fade-in ${
          alertMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {alertMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span>{alertMessage.text}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">บุคลากรทั้งหมด</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total} <span className="text-xs font-normal text-slate-400">คน</span></div>
          <div className="text-[11px] text-emerald-600 mt-0.5">สถานะปกติ {stats.active} คน</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">ข้าราชการ/พนักงานส่วนท้องถิ่น</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats.officers} <span className="text-xs font-normal text-slate-400">คน</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">ประจำ 6 กอง/ส่วนงาน</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">คณะผู้บริหาร & สภา อบต.</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.executives} <span className="text-xs font-normal text-slate-400">คน</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">นายก / สมาชิกสภา / กำนันผู้ใหญ่บ้าน</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">ผู้ดูแลระบบ (Admin)</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{stats.admins} <span className="text-xs font-normal text-slate-400">บัญชี</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">สิทธิ์จัดการระบบเต็มรูปแบบ</div>
        </div>
      </div>

      {/* Filter Tabs by Department */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedDept === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด ({users.length})
          </button>
          {REAL_DEPARTMENTS.map(dept => {
            const count = users.filter(u => u.departmentId === dept.id).length;
            const isSelected = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{dept.shortName}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sub-filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อ, รหัสพนักงาน (เช่น 705, 601), ตำแหน่ง, เบอร์โทร..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedEmpType}
              onChange={(e) => setSelectedEmpType(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">ทุกประเภทการจ้าง</option>
              <option value="ข้าราชการ">ข้าราชการ</option>
              <option value="พนักงานจ้างตามภารกิจ">พนักงานจ้างตามภารกิจ</option>
              <option value="จ้างเหมาบริการ">จ้างเหมาบริการ</option>
              <option value="ฝ่ายการเมือง / คณะบริหาร">ฝ่ายการเมือง / คณะบริหาร</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">ทุกระดับสิทธิ์</option>
              <option value="super_admin">Super Admin (ผู้ดูแลระบบ)</option>
              <option value="mayor">นายก อบต.</option>
              <option value="deputy_mayor">รองนายก / ผู้บริหาร</option>
              <option value="clerk">ปลัด / รองปลัด</option>
              <option value="dept_head">หัวหน้าส่วนราชการ</option>
              <option value="officer">เจ้าหน้าที่ผู้ปฏิบัติงาน</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs sm:text-sm font-bold text-slate-800">
            รายชื่อผู้ใช้งานในระบบ ({filteredUsers.length} คน)
          </div>
          <div className="text-xs text-slate-400">
            แสดงข้อมูลตามสิทธิ์จริงใน อบต.ฝางคำ
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-16 text-center">รหัส</th>
                <th className="py-3 px-4">ชื่อ - สกุล & บัญชี</th>
                <th className="py-3 px-4">กอง / สำนัก</th>
                <th className="py-3 px-4">ตำแหน่ง</th>
                <th className="py-3 px-3">ประเภท</th>
                <th className="py-3 px-3">สิทธิ์ในระบบ</th>
                <th className="py-3 px-3">เบอร์โทรศัพท์</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
                <th className="py-3 px-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    ไม่พบข้อมูลผู้ใช้งานตามเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  const isSuspended = u.status === 'suspended';
                  return (
                    <tr key={u.id} className={`hover:bg-slate-50/80 transition ${isSuspended ? 'bg-rose-50/30 opacity-75' : ''}`}>
                      {/* Code */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                        {u.employeeCode || '-'}
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                              {u.name.slice(0, 2)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-700 font-normal">
                                  คุณ
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Username: <strong className="text-slate-600">{u.username}</strong>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{u.departmentName}</div>
                        {u.divisionName && u.divisionName !== u.departmentName && (
                          <div className="text-[11px] text-slate-400 truncate">{u.divisionName}</div>
                        )}
                      </td>

                      {/* Position */}
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {u.position}
                      </td>

                      {/* Employment Type */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {u.employmentType || 'ข้าราชการ'}
                        </span>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${roleBadgeColor[u.role] || 'bg-slate-100 text-slate-700'}`}>
                          {u.roleTitle}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3 text-slate-600 font-mono whitespace-nowrap">
                        {u.phone || '-'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {isSuspended ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            ระงับการใช้งาน
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            ใช้งานปกติ
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Impersonate / Switch User */}
                          {onSwitchUser && (
                            <button
                              onClick={() => onSwitchUser(u)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                              title={`สลับใช้งานเป็น ${u.name} (${u.roleTitle})`}
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setResetPassUser(u);
                              setNewPasswordValue('password123');
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                            title="รีเซ็ตรหัสผ่าน"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Suspend */}
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              isSuspended 
                                ? 'text-emerald-600 hover:bg-emerald-50' 
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={isSuspended ? 'ปลดระงับการใช้งาน' : 'ระงับการใช้งานชั่วคราว'}
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User */}
                          {u.id !== 'usr_admin' && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="ลบผู้ใช้งาน"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">เพิ่มผู้ใช้งานใหม่</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">รหัสพนักงาน (Code)</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    placeholder="เช่น 619 หรือ FK070"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อผู้ใช้งาน (Username)</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                    placeholder="เช่น 619 หรือ somchai"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อ - นามสกุล (พร้อมคำนำหน้า)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น นายสมบูรณ์ มั่นคง"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">สังกัดกอง/สำนัก</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => {
                      const dept = REAL_DEPARTMENTS.find(d => d.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        departmentId: e.target.value,
                        departmentName: dept ? dept.name : ''
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {REAL_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ประเภทการจ้าง</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="ข้าราชการ">ข้าราชการ</option>
                    <option value="พนักงานจ้างตามภารกิจ">พนักงานจ้างตามภารกิจ</option>
                    <option value="จ้างเหมาบริการ">จ้างเหมาบริการ</option>
                    <option value="ฝ่ายการเมือง / คณะบริหาร">ฝ่ายการเมือง / คณะบริหาร</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ตำแหน่งตามโครงสร้าง</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="เช่น เจ้าพนักงานธุรการปฏิบัติงาน"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">สิทธิ์ในระบบ (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      const r = e.target.value as RoleType;
                      const roleTitles: Record<RoleType, string> = {
                        super_admin: 'ผู้ดูแลระบบสูงสุด',
                        admin: 'ผู้ดูแลระบบ',
                        mayor: 'นายก อบต.',
                        deputy_mayor: 'รองนายก / ผู้บริหาร',
                        clerk: 'ปลัด / รองปลัด',
                        dept_head: 'หัวหน้าส่วนราชการ',
                        officer: 'เจ้าหน้าที่ผู้ปฏิบัติงาน'
                      };
                      setFormData({ ...formData, role: r, roleTitle: roleTitles[r] || 'เจ้าหน้าที่' });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="officer">เจ้าหน้าที่ผู้ปฏิบัติงาน (Officer)</option>
                    <option value="dept_head">หัวหน้าส่วนราชการ (Dept Head)</option>
                    <option value="clerk">ปลัด / รองปลัด อบต. (Clerk)</option>
                    <option value="deputy_mayor">รองนายก / สภา (Deputy/Board)</option>
                    <option value="mayor">นายก อบต. (Mayor)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08X-XXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">รหัสผ่านเริ่มต้น</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="password123"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  บันทึกผู้ใช้งาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">แก้ไขข้อมูลผู้ใช้งาน: {editingUser.name}</h3>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">รหัสพนักงาน</label>
                  <input
                    type="text"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อผู้ใช้งาน (Username)</label>
                  <input
                    type="text"
                    disabled
                    value={formData.username}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อ - สกุล</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">สังกัดกอง</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => {
                      const dept = REAL_DEPARTMENTS.find(d => d.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        departmentId: e.target.value,
                        departmentName: dept ? dept.name : ''
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {REAL_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ประเภทการจ้าง</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="ข้าราชการ">ข้าราชการ</option>
                    <option value="พนักงานจ้างตามภารกิจ">พนักงานจ้างตามภารกิจ</option>
                    <option value="จ้างเหมาบริการ">จ้างเหมาบริการ</option>
                    <option value="ฝ่ายการเมือง / คณะบริหาร">ฝ่ายการเมือง / คณะบริหาร</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ตำแหน่ง</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">สิทธิ์ในระบบ (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      const r = e.target.value as RoleType;
                      const roleTitles: Record<RoleType, string> = {
                        super_admin: 'ผู้ดูแลระบบสูงสุด',
                        admin: 'ผู้ดูแลระบบ',
                        mayor: 'นายก อบต.',
                        deputy_mayor: 'รองนายก / ผู้บริหาร',
                        clerk: 'ปลัด / รองปลัด',
                        dept_head: 'หัวหน้าส่วนราชการ',
                        officer: 'เจ้าหน้าที่ผู้ปฏิบัติงาน'
                      };
                      setFormData({ ...formData, role: r, roleTitle: roleTitles[r] || 'เจ้าหน้าที่' });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="officer">เจ้าหน้าที่ผู้ปฏิบัติงาน (Officer)</option>
                    <option value="dept_head">หัวหน้าส่วนราชการ (Dept Head)</option>
                    <option value="clerk">ปลัด / รองปลัด อบต. (Clerk)</option>
                    <option value="deputy_mayor">รองนายก / สภา (Deputy/Board)</option>
                    <option value="mayor">นายก อบต. (Mayor)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">สถานะบัญชี</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="active">ใช้งานปกติ (Active)</option>
                    <option value="suspended">ระงับการใช้งาน (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">รีเซ็ตรหัสผ่าน</h3>
              </div>
              <button onClick={() => setResetPassUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              กำหนดรหัสผ่านใหม่สำหรับ: <strong className="text-slate-900">{resetPassUser.name}</strong> ({resetPassUser.position})
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">รหัสผ่านใหม่</label>
                <input
                  type="text"
                  required
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewPasswordValue('password123')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition"
                >
                  ใช้ค่าเริ่มต้น (password123)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const rnd = 'fk' + Math.floor(100000 + Math.random() * 900000);
                    setNewPasswordValue(rnd);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold transition"
                >
                  สุ่มรหัสผ่านอัตโนมัติ
                </button>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetPassUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  ยืนยันรีเซ็ตรหัสผ่าน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
