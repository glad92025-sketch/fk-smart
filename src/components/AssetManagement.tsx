import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  QrCode,
  Truck,
  Laptop,
  HardHat,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  X,
  UserCheck,
  Building2
} from 'lucide-react';
import { AssetRecord, Department, User } from '../types';
import { formatThaiDate } from '../utils/thaiDate';

interface AssetManagementProps {
  assets: AssetRecord[];
  departments: Department[];
  currentUser: User;
  onAddAsset: (asset: AssetRecord) => void;
  onUpdateAsset: (asset: AssetRecord) => void;
}

export const AssetManagement: React.FC<AssetManagementProps> = ({
  assets,
  departments,
  currentUser,
  onAddAsset,
  onUpdateAsset
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [qrAsset, setQrAsset] = useState<AssetRecord | null>(null);
  const [borrowAsset, setBorrowAsset] = useState<AssetRecord | null>(null);
  const [borrowerInput, setBorrowerInput] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    assetCode: '',
    name: '',
    category: 'ครุภัณฑ์สำนักงาน' as AssetRecord['category'],
    departmentId: currentUser.departmentId || 'dept_office',
    storageLocation: 'สำนักงาน อบต.ฝางคำ ชั้น 1',
    custodianName: currentUser.name,
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: 25000,
    condition: 'ใช้งานได้ดี' as AssetRecord['condition'],
    currentStatus: 'พร้อมใช้งาน' as AssetRecord['currentStatus']
  });

  const categories = [
    'ครุภัณฑ์สำนักงาน',
    'ครุภัณฑ์คอมพิวเตอร์',
    'ครุภัณฑ์ก่อสร้าง',
    'ครุภัณฑ์ยานพาหนะ',
    'วัสดุสิ้นเปลือง'
  ];

  // Filtering
  const filteredAssets = assets.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.custodianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.storageLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.borrowerName && a.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || a.currentStatus === selectedStatus;
    const matchDept = selectedDept === 'all' || a.departmentId === selectedDept;

    return matchSearch && matchCat && matchStatus && matchDept;
  });

  // Stats
  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum, a) => sum + (a.purchasePrice || 0), 0);
  const availableCount = assets.filter((a) => a.currentStatus === 'พร้อมใช้งาน').length;
  const borrowedCount = assets.filter((a) => a.currentStatus === 'ถูกยืม/เบิก').length;
  const repairingCount = assets.filter((a) => a.currentStatus === 'ส่งซ่อม' || a.condition === 'ชำรุดรอซ่อม').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.assetCode.trim()) return;

    const newAsset: AssetRecord = {
      id: `ast_${Date.now()}`,
      assetCode: formData.assetCode,
      name: formData.name,
      category: formData.category,
      departmentId: formData.departmentId,
      storageLocation: formData.storageLocation,
      custodianName: formData.custodianName,
      purchaseDate: formData.purchaseDate,
      purchasePrice: Number(formData.purchasePrice),
      condition: formData.condition,
      currentStatus: formData.currentStatus
    };

    onAddAsset(newAsset);
    setShowAddModal(false);
    setFormData({
      assetCode: '',
      name: '',
      category: 'ครุภัณฑ์สำนักงาน',
      departmentId: currentUser.departmentId || 'dept_office',
      storageLocation: 'สำนักงาน อบต.ฝางคำ ชั้น 1',
      custodianName: currentUser.name,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: 25000,
      condition: 'ใช้งานได้ดี',
      currentStatus: 'พร้อมใช้งาน'
    });
  };

  const handleBorrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowAsset || !borrowerInput.trim()) return;

    onUpdateAsset({
      ...borrowAsset,
      currentStatus: 'ถูกยืม/เบิก',
      borrowerName: borrowerInput.trim()
    });

    setBorrowAsset(null);
    setBorrowerInput('');
  };

  const handleReturnAsset = (asset: AssetRecord) => {
    onUpdateAsset({
      ...asset,
      currentStatus: 'พร้อมใช้งาน',
      borrowerName: undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>ทะเบียนพัสดุและครุภัณฑ์ อบต.ฝางคำ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ระบบบริหารจัดการสินทรัพย์ บัญชีคุมครุภัณฑ์ พัสดุคงคลัง และระบบยืม-คืนตามระเบียบกระทรวงมหาดไทย
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>ขึ้นทะเบียนครุภัณฑ์ใหม่</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">ครุภัณฑ์ทั้งหมด</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{totalAssets} <span className="text-xs text-slate-400 font-normal">รายการ</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">มูลค่ารวม ฿{totalValue.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">พร้อมใช้งาน</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{availableCount} <span className="text-xs text-slate-400 font-normal">รายการ</span></div>
          <div className="text-[11px] text-emerald-600 mt-0.5">สถานะปกติพร้อมเบิก</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">กำลังถูกยืม / เบิกใช้งาน</div>
          <div className="text-xl font-bold text-blue-600 mt-1">{borrowedCount} <span className="text-xs text-slate-400 font-normal">รายการ</span></div>
          <div className="text-[11px] text-blue-600 mt-0.5">อยู่ระหว่างปฏิบัติหน้าที่</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">ชำรุด / ส่งซ่อม</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{repairingCount} <span className="text-xs text-slate-400 font-normal">รายการ</span></div>
          <div className="text-[11px] text-amber-600 mt-0.5">รอจำหน่ายหรือซ่อมบำรุง</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเลขครุภัณฑ์ (เช่น 416-65-0004), ชื่อรายการ, ผู้ดูแล, หรือสถานที่จัดเก็บ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          >
            <option value="all">📦 ทุกหมวดหมู่ครุภัณฑ์</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          >
            <option value="all">🏢 ทุกส่วนราชการ</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          >
            <option value="all">📌 ทุกสถานะ</option>
            <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
            <option value="ถูกยืม/เบิก">ถูกยืม/เบิก</option>
            <option value="ส่งซ่อม">ส่งซ่อม</option>
          </select>
        </div>
      </div>

      {/* Assets Responsive Cards / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredAssets.map((asset) => {
            const dept = departments.find((d) => d.id === asset.departmentId);

            return (
              <div key={asset.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {asset.assetCode}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      asset.currentStatus === 'พร้อมใช้งาน'
                        ? 'bg-emerald-100 text-emerald-800'
                        : asset.currentStatus === 'ถูกยืม/เบิก'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {asset.currentStatus}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 leading-snug">{asset.name}</h3>
                  <div className="text-xs text-slate-500 mt-1">
                    หมวด: <span className="font-medium text-slate-700">{asset.category}</span> • กอง: {dept?.shortName || dept?.name}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 text-xs space-y-1 text-slate-600">
                  <div>จัดเก็บ: {asset.storageLocation}</div>
                  <div>ผู้ดูแล: {asset.custodianName}</div>
                  {asset.borrowerName && (
                    <div className="text-blue-700 font-medium">ผู้ยืมปัจจุบัน: {asset.borrowerName}</div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>วันที่ได้มา: {formatThaiDate(asset.purchaseDate)}</span>
                    <span className="font-bold text-slate-700">฿{asset.purchasePrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => setQrAsset(asset)}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded-lg border border-slate-200"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>แท็ก/QR</span>
                  </button>

                  {asset.currentStatus === 'พร้อมใช้งาน' ? (
                    <button
                      onClick={() => setBorrowAsset(asset)}
                      className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg border border-blue-200"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>บันทึกการยืม</span>
                    </button>
                  ) : asset.currentStatus === 'ถูกยืม/เบิก' ? (
                    <button
                      onClick={() => handleReturnAsset(asset)}
                      className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-lg border border-emerald-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>รับคืนพัสดุ</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-3.5">เลขครุภัณฑ์</th>
                <th className="p-3.5">ชื่อรายการครุภัณฑ์</th>
                <th className="p-3.5">หมวดหมู่</th>
                <th className="p-3.5">หน่วยงาน/สถานที่จัดเก็บ</th>
                <th className="p-3.5">ผู้ดูแลรับผิดชอบ</th>
                <th className="p-3.5 text-right">ราคาจัดซื้อ</th>
                <th className="p-3.5 text-center">สถานะ</th>
                <th className="p-3.5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset) => {
                const dept = departments.find((d) => d.id === asset.departmentId);

                return (
                  <tr key={asset.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-700">{asset.assetCode}</td>
                    <td className="p-3.5 font-medium text-slate-800">
                      <div>{asset.name}</div>
                      {asset.borrowerName && (
                        <span className="text-[11px] text-blue-600">ยืมโดย: {asset.borrowerName}</span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-600">{asset.category}</td>
                    <td className="p-3.5 text-slate-600">
                      <div className="font-medium text-slate-800">{dept?.shortName || dept?.name}</div>
                      <div className="text-[11px] text-slate-400">{asset.storageLocation}</div>
                    </td>
                    <td className="p-3.5 text-slate-700">{asset.custodianName}</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-slate-800">
                      ฿{asset.purchasePrice.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                          asset.currentStatus === 'พร้อมใช้งาน'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asset.currentStatus === 'ถูกยืม/เบิก'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {asset.currentStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setQrAsset(asset)}
                          title="ดู QR Tag และพิมพ์ป้าย"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        {asset.currentStatus === 'พร้อมใช้งาน' ? (
                          <button
                            onClick={() => setBorrowAsset(asset)}
                            className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 cursor-pointer text-[11px]"
                          >
                            ยืม
                          </button>
                        ) : asset.currentStatus === 'ถูกยืม/เบิก' ? (
                          <button
                            onClick={() => handleReturnAsset(asset)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 cursor-pointer text-[11px]"
                          >
                            รับคืน
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAssets.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
            ไม่พบข้อมูลครุภัณฑ์ตามคำค้นหา
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>ขึ้นทะเบียนครุภัณฑ์ใหม่ อบต.ฝางคำ</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">หมายเลขครุภัณฑ์ *</label>
                  <input
                    type="text"
                    required
                    value={formData.assetCode}
                    onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })}
                    placeholder="เช่น 416-69-0025"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">หมวดหมู่ครุภัณฑ์ *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ชื่อรายการครุภัณฑ์ *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น เครื่องตัดหญ้าสะพายบ่า, คอมพิวเตอร์ All-in-One..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">หน่วยงานเจ้าของ *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">สถานที่จัดเก็บ</label>
                  <input
                    type="text"
                    value={formData.storageLocation}
                    onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                    placeholder="ห้องพัสดุ ชั้น 1"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ผู้ดูแลรับผิดชอบ</label>
                  <input
                    type="text"
                    value={formData.custodianName}
                    onChange={(e) => setFormData({ ...formData, custodianName: e.target.value })}
                    placeholder="ชื่อเจ้าหน้าที่ผู้ดูแล"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ราคาจัดซื้อ (บาท)</label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    placeholder="25000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md"
                >
                  บันทึกขึ้นทะเบียน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Borrow Modal */}
      {borrowAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-blue-900 text-white rounded-t-2xl">
              <div className="flex items-center gap-2 font-bold text-sm">
                <UserCheck className="w-5 h-5 text-blue-400" />
                <span>บันทึกการยืมครุภัณฑ์</span>
              </div>
              <button
                onClick={() => setBorrowAsset(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBorrowSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-mono text-xs text-slate-500">{borrowAsset.assetCode}</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{borrowAsset.name}</div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ชื่อผู้ยืมและวัตถุประสงค์ *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={borrowerInput}
                  onChange={(e) => setBorrowerInput(e.target.value)}
                  placeholder="เช่น นายสมชาย คำมั่น (ใช้ลงพื้นที่สำรวจถนน ม.3)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBorrowAsset(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  ยืนยันการยืม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code / Tag Modal */}
      {qrAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <span className="font-bold text-sm flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-400" /> ป้ายประจำตัวครุภัณฑ์ (Asset Tag)
              </span>
              <button
                onClick={() => setQrAsset(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 inline-block">
                {/* Simulated Visual QR/Barcode */}
                <div className="w-36 h-36 mx-auto bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center shadow-inner">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-1 opacity-80">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30
                            ? 'bg-slate-900'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-2 font-mono font-black text-sm text-slate-900 tracking-wider">
                  {qrAsset.assetCode}
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">
                  อบต.ฝางคำ จ.อุบลราชธานี
                </div>
              </div>

              <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">{qrAsset.name}</div>
                <div className="text-slate-500">หมวด: {qrAsset.category}</div>
                <div className="text-slate-500">ผู้ดูแล: {qrAsset.custodianName}</div>
                <div className="text-slate-500">ได้มาเมื่อ: {formatThaiDate(qrAsset.purchaseDate)}</div>
              </div>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์ป้ายติดครุภัณฑ์ (Print Label)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
