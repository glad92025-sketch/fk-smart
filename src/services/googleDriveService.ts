/**
 * FANGKHAM SMART GOVERNMENT - Google Drive Multi-Account Cloud Service
 * บริการจัดเก็บข้อมูลบน Google Drive แบบ 3 บัญชี (ความจุ 5TB x 3 = รวม 15TB)
 * รองรับการแบ่งแยกประเภทเอกสาร, กรองและกระจายโหลดอัตโนมัติ (Storage Pool), สำรองข้อมูลทั้งระบบ
 */

import { 
  GoogleDriveAccountConfig, 
  GoogleDrivePoolStatus, 
  DriveFileItem, 
  StorageRoutingCategory 
} from '../types';

const STORAGE_KEY_CONFIGS = 'fk_smart_gdrive_accounts';
const STORAGE_KEY_FILES = 'fk_smart_gdrive_files';
const STORAGE_KEY_BACKUPS = 'fk_smart_gdrive_backups';

// ข้อมูลตั้งต้นของบัญชี Google Drive 3 บัญชี (บัญชีละ 5TB = 5,120 GB)
export const DEFAULT_GDRIVE_ACCOUNTS: GoogleDriveAccountConfig[] = [
  {
    id: 'drive_1',
    name: 'Google Drive 1 (5TB) - สารบรรณ & เอกสารกลาง',
    label: 'ไดรฟ์ที่ 1 (สารบรรณ/คำสั่ง/ประกาศ)',
    email: 'fk.archive.drive01@gmail.com',
    totalCapacityGB: 5120, // 5.0 TB
    usedCapacityGB: 148.6,
    status: 'connected',
    authType: 'service_account',
    rootFolderId: '16UbdpS3gIRR3EGgWi2VpnixACi3QyXwx',
    serviceAccountEmail: 'fk-smart-drive01@mineral-rune-386615.iam.gserviceaccount.com',
    serviceAccountKey: '{"type":"service_account","project_id":"mineral-rune-386615","client_email":"fk-smart-drive01@mineral-rune-386615.iam.gserviceaccount.com","client_id":"104160608783220551922"}',
    assignedCategories: ['official_docs', 'central_archive'],
    lastSyncTime: new Date().toISOString(),
    fileCount: 428
  },
  {
    id: 'drive_2',
    name: 'Google Drive 2 (5TB) - เรื่องร้องเรียน & งานภาคสนาม',
    label: 'ไดรฟ์ที่ 2 (ภาพถ่ายร้องเรียน/ตรวจงาน)',
    email: 'fk.complaints.drive02@gmail.com',
    totalCapacityGB: 5120, // 5.0 TB
    usedCapacityGB: 94.3,
    status: 'connected',
    authType: 'service_account',
    rootFolderId: '2eFgH88_FangkhamCitizen_Media_5TB',
    serviceAccountEmail: 'fangkham-complaint-sa@fk-smart-cloud.iam.gserviceaccount.com',
    serviceAccountKey: '{"type":"service_account","project_id":"fk-smart-gov","client_email":"fangkham-complaint-sa@fk-smart-cloud.iam.gserviceaccount.com"}',
    assignedCategories: ['complaints', 'field_ops'],
    lastSyncTime: new Date().toISOString(),
    fileCount: 312
  },
  {
    id: 'drive_3',
    name: 'Google Drive 3 (5TB) - สำรองระบบ โครงการ & พัสดุ',
    label: 'ไดรฟ์ที่ 3 (Backup/โครงการ/พัสดุ)',
    email: 'fk.backup.drive03@gmail.com',
    totalCapacityGB: 5120, // 5.0 TB
    usedCapacityGB: 315.2,
    status: 'connected',
    authType: 'service_account',
    rootFolderId: '3iJkL77_FangkhamBackups_Assets_5TB',
    serviceAccountEmail: 'fangkham-backup-sa@fk-smart-cloud.iam.gserviceaccount.com',
    serviceAccountKey: '{"type":"service_account","project_id":"fk-smart-gov","client_email":"fangkham-backup-sa@fk-smart-cloud.iam.gserviceaccount.com"}',
    assignedCategories: ['backups', 'projects', 'assets', 'general'],
    lastSyncTime: new Date().toISOString(),
    fileCount: 185
  }
];

export const INITIAL_GDRIVE_FILES: DriveFileItem[] = [
  {
    id: 'gfile_001',
    driveAccountId: 'drive_1',
    driveAccountName: 'Google Drive 1 (5TB) - สารบรรณ & เอกสารกลาง',
    name: 'คำสั่ง อบต.ฝางคำ ที่ 12-2569 แต่งตั้งคณะทำงานจัดซื้อจัดจ้าง.pdf',
    originalName: 'order_12_2569_procurement.pdf',
    sizeBytes: 2450000,
    sizeFormatted: '2.45 MB',
    mimeType: 'application/pdf',
    category: 'central_archive',
    categoryLabel: 'คำสั่ง/ประกาศ อบต.',
    googleDriveFileId: '1AbC9xYz_FangkhamOrder_01',
    webViewLink: 'https://drive.google.com/file/d/1AbC9xYz_FangkhamOrder_01/view',
    webContentLink: 'https://drive.google.com/uc?export=download&id=1AbC9xYz_FangkhamOrder_01',
    folderPath: '/อบต.ฝางคำ/คำสั่งประจำปี2569',
    uploadedBy: 'นางอรุณรัตน์ บุญกอ (หัวหน้าสำนักปลัด)',
    uploadedAt: '2026-09-02T09:30:00Z',
    relatedModuleId: 'doc_arch_01'
  },
  {
    id: 'gfile_002',
    driveAccountId: 'drive_1',
    driveAccountName: 'Google Drive 1 (5TB) - สารบรรณ & เอกสารกลาง',
    name: 'หนังสือส่ง ที่ อบ 74201/ว144 แจ้งประชุมสภา อบต. สมัยสามัญ.pdf',
    originalName: 'official_letter_w144.pdf',
    sizeBytes: 1840000,
    sizeFormatted: '1.84 MB',
    mimeType: 'application/pdf',
    category: 'official_docs',
    categoryLabel: 'หนังสือราชการภายนอก',
    googleDriveFileId: '1DeF8wVu_FangkhamLetter_02',
    webViewLink: 'https://drive.google.com/file/d/1DeF8wVu_FangkhamLetter_02/view',
    webContentLink: 'https://drive.google.com/uc?export=download&id=1DeF8wVu_FangkhamLetter_02',
    folderPath: '/อบต.ฝางคำ/หนังสือราชการส่ง/2569',
    uploadedBy: 'จ.ส.อ.เกียรติพล หาทรัพย์ (จพง.ธุรการ)',
    uploadedAt: '2026-09-03T11:15:00Z',
    relatedModuleId: 'doc_off_01'
  },
  {
    id: 'gfile_003',
    driveAccountId: 'drive_2',
    driveAccountName: 'Google Drive 2 (5TB) - เรื่องร้องเรียน & งานภาคสนาม',
    name: 'ภาพถ่ายความเสียหายถนนสายบ้านฝางเทิง-คำข่า_กม2.jpg',
    originalName: 'road_damage_site_photos.jpg',
    sizeBytes: 4620000,
    sizeFormatted: '4.62 MB',
    mimeType: 'image/jpeg',
    category: 'complaints',
    categoryLabel: 'หลักฐานเรื่องร้องเรียน',
    googleDriveFileId: '2GhI7tSr_FangkhamComplaint_03',
    webViewLink: 'https://drive.google.com/file/d/2GhI7tSr_FangkhamComplaint_03/view',
    webContentLink: 'https://drive.google.com/uc?export=download&id=2GhI7tSr_FangkhamComplaint_03',
    folderPath: '/เรื่องร้องเรียนประชาชน/2569/กค69-001',
    uploadedBy: 'นายสิงหา ชุมชัย (นายช่างโยธาชำนาญงาน)',
    uploadedAt: '2026-09-04T14:20:00Z',
    relatedModuleId: 'cmp_001'
  },
  {
    id: 'gfile_004',
    driveAccountId: 'drive_2',
    driveAccountName: 'Google Drive 2 (5TB) - เรื่องร้องเรียน & งานภาคสนาม',
    name: 'รายงานการตรวจซ่อมโคมไฟถนนพลังงานแสงอาทิตย์_หมู่4.pdf',
    originalName: 'solar_light_repair_report_m4.pdf',
    sizeBytes: 3100000,
    sizeFormatted: '3.10 MB',
    mimeType: 'application/pdf',
    category: 'field_ops',
    categoryLabel: 'ภาพถ่ายและรายงานภาคสนาม',
    googleDriveFileId: '2JkL6qPo_FangkhamField_04',
    webViewLink: 'https://drive.google.com/file/d/2JkL6qPo_FangkhamField_04/view',
    webContentLink: 'https://drive.google.com/uc?export=download&id=2JkL6qPo_FangkhamField_04',
    folderPath: '/งานภาคสนามกองช่าง/งานไฟฟ้า/2569',
    uploadedBy: 'นายวุฒิชาติ เชื้อโชติ (ผช.ช่างไฟฟ้า)',
    uploadedAt: '2026-09-05T16:00:00Z',
    relatedModuleId: 'field_001'
  },
  {
    id: 'gfile_005',
    driveAccountId: 'drive_3',
    driveAccountName: 'Google Drive 3 (5TB) - สำรองระบบ โครงการ & พัสดุ',
    name: 'สำรองฐานข้อมูลระบบ_FK_SMART_GOV_AUTO_BACKUP_2026-10-01.json.gz',
    originalName: 'backup_full_20261001.json.gz',
    sizeBytes: 15800000,
    sizeFormatted: '15.80 MB',
    mimeType: 'application/gzip',
    category: 'backups',
    categoryLabel: 'สำรองข้อมูลระบบ',
    googleDriveFileId: '3MnO5nNm_FangkhamBackup_05',
    webViewLink: 'https://drive.google.com/file/d/3MnO5nNm_FangkhamBackup_05/view',
    webContentLink: 'https://drive.google.com/uc?export=download&id=3MnO5nNm_FangkhamBackup_05',
    folderPath: '/SystemBackups/DailyAutomated',
    uploadedBy: 'ระบบอัตโนมัติ (System Backup Daemon)',
    uploadedAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'gfile_006',
    driveAccountId: 'drive_3',
    driveAccountName: 'Google Drive 3 (5TB) - สำรองระบบ โครงการ & พัสดุ',
    name: 'ทะเบียนครุภัณฑ์ยานพาหนะและเครื่องจักรกล_อบต_ฝางคำ_2569.xlsx',
    originalName: 'asset_vehicles_2569.xlsx',
    sizeBytes: 1250000,
    sizeFormatted: '1.25 MB',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    category: 'assets',
    categoryLabel: 'ทะเบียนพัสดุและครุภัณฑ์',
    googleDriveFileId: '3PqR4lKj_FangkhamAsset_06',
    webViewLink: 'https://drive.google.com/file/d/3PqR4lKj_FangkhamAsset_06/view',
    webContentLink: 'https://drive.google.com/uc?export=download&id=3PqR4lKj_FangkhamAsset_06',
    folderPath: '/งานพัสดุกองคลัง/ทะเบียนครุภัณฑ์',
    uploadedBy: 'จ่าเอกเกียรติศักดิ์ เพ็ญเนตร (เจ้าพนักงานพัสดุ)',
    uploadedAt: '2026-09-10T10:45:00Z',
    relatedModuleId: 'asset_001'
  }
];

class GoogleDriveManagerService {
  private accounts: GoogleDriveAccountConfig[] = [];
  private files: DriveFileItem[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedAccounts = localStorage.getItem(STORAGE_KEY_CONFIGS);
      if (savedAccounts) {
        this.accounts = JSON.parse(savedAccounts);
        const drive1 = this.accounts.find(a => a.id === 'drive_1');
        if (drive1 && (!drive1.rootFolderId || drive1.rootFolderId === '1aBcD99_FangkhamDocs_Archive_5TB')) {
          drive1.rootFolderId = '16UbdpS3gIRR3EGgWi2VpnixACi3QyXwx';
          drive1.serviceAccountEmail = 'fk-smart-drive01@mineral-rune-386615.iam.gserviceaccount.com';
          drive1.status = 'connected';
          this.saveAccounts();
        }
      } else {
        this.accounts = [...DEFAULT_GDRIVE_ACCOUNTS];
        this.saveAccounts();
      }

      const savedFiles = localStorage.getItem(STORAGE_KEY_FILES);
      if (savedFiles) {
        this.files = JSON.parse(savedFiles);
      } else {
        this.files = [...INITIAL_GDRIVE_FILES];
        this.saveFiles();
      }
    } catch (e) {
      console.warn('Error loading Google Drive state from localStorage:', e);
      this.accounts = [...DEFAULT_GDRIVE_ACCOUNTS];
      this.files = [...INITIAL_GDRIVE_FILES];
    }
  }

  public saveAccounts() {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIGS, JSON.stringify(this.accounts));
    } catch (e) {
      console.error('Failed to save accounts to localStorage', e);
    }
  }

  public saveFiles() {
    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(this.files));
    } catch (e) {
      console.error('Failed to save files to localStorage', e);
    }
  }

  // ดึงรายการบัญชี Google Drive ทั้ง 3 บัญชี
  public getAccounts(): GoogleDriveAccountConfig[] {
    return [...this.accounts];
  }

  // ดึงสรุปสถานะพื้นที่ความจุรวม (15.0 TB Pool)
  public getPoolStatus(): GoogleDrivePoolStatus {
    const totalCapGB = this.accounts.reduce((sum, acc) => sum + acc.totalCapacityGB, 0);
    const totalUsedGB = this.accounts.reduce((sum, acc) => sum + acc.usedCapacityGB, 0);

    return {
      totalPoolCapacityTB: parseFloat((totalCapGB / 1024).toFixed(2)), // 15.0 TB
      totalPoolUsedTB: parseFloat((totalUsedGB / 1024).toFixed(3)),
      routingPolicy: 'category_routing',
      accounts: [...this.accounts],
      lastHealthCheck: new Date().toISOString()
    };
  }

  // ดึงรายการไฟล์ทั้งหมด พร้อมฟิลเตอร์
  public getFiles(filter?: { category?: StorageRoutingCategory; driveId?: string; search?: string }): DriveFileItem[] {
    let result = [...this.files];
    if (filter) {
      if (filter.category) {
        result = result.filter(f => f.category === filter.category);
      }
      if (filter.driveId && filter.driveId !== 'all') {
        result = result.filter(f => f.driveAccountId === filter.driveId);
      }
      if (filter.search && filter.search.trim()) {
        const q = filter.search.toLowerCase().trim();
        result = result.filter(f => 
          f.name.toLowerCase().includes(q) || 
          f.categoryLabel.toLowerCase().includes(q) ||
          f.uploadedBy.toLowerCase().includes(q)
        );
      }
    }
    return result;
  }

  // คัดเลือกบัญชี Google Drive ที่เหมาะสมตามประเภทไฟล์ (Auto Routing)
  public resolveTargetAccount(category: StorageRoutingCategory): GoogleDriveAccountConfig {
    // 1. ค้นหาบัญชีที่ระบุไว้สำหรับหมวดหมู่นี้
    let target = this.accounts.find(acc => acc.assignedCategories.includes(category) && acc.status === 'connected');
    
    // 2. ถ้าไม่พบหรือพื้นที่เกิน 95% ให้เลือกบัญชีที่มีพื้นที่ว่างมากที่สุดในกลุ่ม (Load Balancing & Auto-Failover)
    if (!target || (target.usedCapacityGB / target.totalCapacityGB) > 0.95) {
      const sortedByFree = [...this.accounts]
        .filter(acc => acc.status === 'connected')
        .sort((a, b) => (b.totalCapacityGB - b.usedCapacityGB) - (a.totalCapacityGB - a.usedCapacityGB));
      target = sortedByFree[0] || this.accounts[0];
    }

    return target;
  }

  // อัปโหลดไฟล์ขึ้น Google Drive
  public async uploadFile(params: {
    file: { name: string; size: number; type: string };
    category: StorageRoutingCategory;
    categoryLabel?: string;
    uploadedBy: string;
    folderPath?: string;
    relatedModuleId?: string;
  }): Promise<DriveFileItem> {
    const targetAccount = this.resolveTargetAccount(params.category);
    
    // แปลงขนาดไฟล์
    const sizeBytes = params.file.size || 1024 * 500;
    const sizeMB = sizeBytes / (1024 * 1024);
    const sizeFormatted = sizeMB < 1 ? `${(sizeBytes / 1024).toFixed(1)} KB` : `${sizeMB.toFixed(2)} MB`;

    // จำลองการสร้าง File ID บน Google Drive
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    const driveFileId = `1gDrive_${targetAccount.id.toUpperCase()}_${randomHex}`;
    
    const catLabelMap: Record<StorageRoutingCategory, string> = {
      official_docs: 'หนังสือราชการ (รับ/ส่ง)',
      central_archive: 'คลังเอกสารกลาง คำสั่ง/ประกาศ',
      complaints: 'หลักฐานเรื่องร้องเรียน',
      field_ops: 'ภาพถ่ายงานภาคสนาม',
      backups: 'สำรองข้อมูลระบบ',
      projects: 'โครงการและแผนงาน',
      assets: 'ทะเบียนพัสดุและครุภัณฑ์',
      general: 'ไฟล์ทั่วไป'
    };

    const newFile: DriveFileItem = {
      id: `gfile_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      driveAccountId: targetAccount.id,
      driveAccountName: targetAccount.name,
      name: params.file.name,
      originalName: params.file.name,
      sizeBytes: sizeBytes,
      sizeFormatted: sizeFormatted,
      mimeType: params.file.type || 'application/octet-stream',
      category: params.category,
      categoryLabel: params.categoryLabel || catLabelMap[params.category] || 'ทั่วไป',
      googleDriveFileId: driveFileId,
      webViewLink: `https://drive.google.com/file/d/${driveFileId}/view`,
      webContentLink: `https://drive.google.com/uc?export=download&id=${driveFileId}`,
      folderPath: params.folderPath || `/อบต.ฝางคำ/${params.category}`,
      uploadedBy: params.uploadedBy,
      uploadedAt: new Date().toISOString(),
      relatedModuleId: params.relatedModuleId
    };

    // บันทึกไฟล์และอัปเดต Quota ในบัญชีที่เลือก
    this.files.unshift(newFile);
    this.saveFiles();

    // เพิ่มพื้นที่ที่ใช้ (แปลง byte เป็น GB)
    const usedIncreaseGB = sizeBytes / (1024 * 1024 * 1024);
    targetAccount.usedCapacityGB = parseFloat((targetAccount.usedCapacityGB + usedIncreaseGB).toFixed(4));
    targetAccount.fileCount += 1;
    targetAccount.lastSyncTime = new Date().toISOString();
    this.saveAccounts();

    return newFile;
  }

  // ลบไฟล์
  public async deleteFile(fileId: string): Promise<boolean> {
    const fileIndex = this.files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return false;

    const file = this.files[fileIndex];
    const account = this.accounts.find(a => a.id === file.driveAccountId);
    if (account) {
      const sizeGB = file.sizeBytes / (1024 * 1024 * 1024);
      account.usedCapacityGB = Math.max(0, parseFloat((account.usedCapacityGB - sizeGB).toFixed(4)));
      account.fileCount = Math.max(0, account.fileCount - 1);
      this.saveAccounts();
    }

    this.files.splice(fileIndex, 1);
    this.saveFiles();
    return true;
  }

  // ทดสอบการเชื่อมต่อ Google Drive API สำหรับแต่ละบัญชี
  public async testConnection(driveId: string): Promise<{ success: boolean; message: string; quota: { used: number; total: number } }> {
    const account = this.accounts.find(a => a.id === driveId);
    if (!account) {
      return { success: false, message: 'ไม่พบบัญชี Google Drive ที่ระบุ', quota: { used: 0, total: 0 } };
    }

    // จำลองการตรวจสอบ Google API Credentials และ Ping Server
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!account.rootFolderId) {
      account.status = 'warning';
      this.saveAccounts();
      return {
        success: false,
        message: `บัญชี ${account.name}: ยังไม่ได้กำหนด Google Drive Folder ID`,
        quota: { used: account.usedCapacityGB, total: account.totalCapacityGB }
      };
    }

    account.status = 'connected';
    account.lastSyncTime = new Date().toISOString();
    this.saveAccounts();

    return {
      success: true,
      message: `เชื่อมต่อสำเร็จ! บัญชี: ${account.email} ความจุ ${account.totalCapacityGB / 1024}TB พร้อมใช้งาน (พื้นที่ว่าง ${(account.totalCapacityGB - account.usedCapacityGB).toFixed(1)} GB)`,
      quota: { used: account.usedCapacityGB, total: account.totalCapacityGB }
    };
  }

  // อัปเดตข้อมูลการตั้งค่าบัญชี
  public updateAccount(driveId: string, updates: Partial<GoogleDriveAccountConfig>): boolean {
    const index = this.accounts.findIndex(a => a.id === driveId);
    if (index === -1) return false;

    this.accounts[index] = {
      ...this.accounts[index],
      ...updates
    };
    this.saveAccounts();
    return true;
  }

  // สำรองข้อมูลทั้งระบบขึ้น Google Drive (Full Backup to Drive 3)
  public async createSystemCloudBackup(systemPayload: any, createdBy: string): Promise<DriveFileItem> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `FK_SMART_GOV_FULL_BACKUP_${timestamp}.json`;
    
    // สร้าง JSON string
    const jsonString = JSON.stringify({
      version: '2.0.0',
      system: 'FANGKHAM SMART GOVERNMENT',
      timestamp: new Date().toISOString(),
      backupTarget: 'Google Drive Account 3 (5TB Pool)',
      data: systemPayload
    }, null, 2);

    const sizeBytes = new Blob([jsonString]).size || 18500000;

    const backupFile = await this.uploadFile({
      file: {
        name: backupFileName,
        size: sizeBytes,
        type: 'application/json'
      },
      category: 'backups',
      categoryLabel: 'สำรองข้อมูลทั้งระบบ (Full Cloud Backup)',
      uploadedBy: createdBy,
      folderPath: '/SystemBackups/FullSnapshots'
    });

    // บันทึกลงในรายการประวัติการสำรอง
    try {
      const existingBackups = JSON.parse(localStorage.getItem(STORAGE_KEY_BACKUPS) || '[]');
      existingBackups.unshift({
        id: backupFile.id,
        fileName: backupFileName,
        createdAt: new Date().toISOString(),
        createdBy,
        size: backupFile.sizeFormatted,
        driveAccountId: backupFile.driveAccountId,
        googleDriveLink: backupFile.webViewLink
      });
      localStorage.setItem(STORAGE_KEY_BACKUPS, JSON.stringify(existingBackups.slice(0, 30)));
    } catch (e) {
      console.warn('Failed to record backup log', e);
    }

    return backupFile;
  }
}

export const googleDriveService = new GoogleDriveManagerService();
