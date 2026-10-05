/**
 * FANGKHAM SMART GOVERNMENT - User & Authentication Management Service
 * จัดการข้อมูลผู้ใช้งาน บัญชี รหัสผ่าน สิทธิ์ตามกอง/ตำแหน่ง จากไฟล์ D:\อบต\รายชื่อพนักงาน.xlsx
 */

import { User, RoleType } from '../types';
import { INITIAL_STAFF_USERS } from '../data/initialUsers';

const USERS_STORAGE_KEY = 'fk_smart_users_v2';
const CURRENT_SESSION_KEY = 'fk_smart_current_user_session';

class UserService {
  private users: User[] = [];

  constructor() {
    this.initUsers();
  }

  private initUsers() {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        this.users = JSON.parse(stored);
      } else {
        this.users = [...INITIAL_STAFF_USERS];
        this.persistUsers();
      }
    } catch (e) {
      console.warn('Failed to load users from localStorage, using initial dataset', e);
      this.users = [...INITIAL_STAFF_USERS];
    }
  }

  private persistUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to persist users to localStorage', e);
    }
  }

  // ดึงรายการผู้ใช้งานทั้งหมด (69+ ท่าน)
  public getUsers(): User[] {
    return [...this.users];
  }

  // ดึงผู้ใช้งานตาม ID
  public getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  // ตรวจสอบการเข้าสู่ระบบด้วย Username หรือ รหัสพนักงาน หรือ Email
  public authenticate(identifier: string, password: string): { success: boolean; user?: User; message: string } {
    if (!identifier || !password) {
      return { success: false, message: 'กรุณากรอกชื่อผู้ใช้/รหัสพนักงาน และรหัสผ่าน' };
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = this.users.find(u => 
      (u.username && u.username.toLowerCase() === cleanId) ||
      (u.employeeCode && u.employeeCode.toLowerCase() === cleanId) ||
      (u.email && u.email.toLowerCase() === cleanId)
    );

    if (!user) {
      return { success: false, message: 'ไม่พบชื่อผู้ใช้งานหรือรหัสพนักงานนี้ในระบบ' };
    }

    if (user.status === 'suspended') {
      return { success: false, message: 'บัญชีผู้ใช้นี้ถูกระงับการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบ' };
    }

    // ตรวจสอบรหัสผ่าน (รหัสผ่านเริ่มต้นคือ password123 หรือตามที่บันทึกไว้)
    const storedPassword = user.password || 'password123';
    if (password !== storedPassword) {
      return { success: false, message: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' };
    }

    // อัปเดตเวลาเข้าสู่ระบบล่าสุด
    user.lastLogin = new Date().toISOString();
    this.persistUsers();

    return { 
      success: true, 
      user: { ...user },
      message: `ยินดีต้อนรับคุณ ${user.name} เข้าสู่ระบบ Fangkham Smart Government`
    };
  }

  // เพิ่มผู้ใช้งานใหม่
  public addUser(newUser: Omit<User, 'id'>): { success: boolean; user?: User; message: string } {
    const username = (newUser.username || newUser.employeeCode || `fk${Date.now()}`).trim().toLowerCase();
    
    // ตรวจสอบว่าชื่อผู้ใช้ซ้ำหรือไม่
    const existing = this.users.find(u => 
      u.username?.toLowerCase() === username || 
      (newUser.employeeCode && u.employeeCode?.toLowerCase() === newUser.employeeCode.trim().toLowerCase())
    );

    if (existing) {
      return { success: false, message: `รหัสพนักงานหรือ Username '${username}' มีอยู่ในระบบแล้ว` };
    }

    const user: User = {
      ...newUser,
      id: `usr_${username}`,
      username: username,
      password: newUser.password || 'password123',
      status: newUser.status || 'active',
      createdAt: new Date().toISOString()
    };

    this.users.unshift(user);
    this.persistUsers();

    return { success: true, user, message: `เพิ่มผู้ใช้งาน ${user.name} เรียบร้อยแล้ว` };
  }

  // แก้ไขข้อมูลผู้ใช้งาน
  public updateUser(userId: string, updates: Partial<User>): { success: boolean; user?: User; message: string } {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) {
      return { success: false, message: 'ไม่พบผู้ใช้งานที่ต้องการแก้ไข' };
    }

    // ห้ามแก้ ID
    const { id, ...allowedUpdates } = updates;

    this.users[index] = {
      ...this.users[index],
      ...allowedUpdates
    };

    this.persistUsers();

    // ถ้าเป็นผู้ใช้ที่ล็อกอินอยู่ ให้อัปเดต session ด้วย
    const session = this.getCurrentSession();
    if (session && session.id === userId) {
      this.setCurrentSession(this.users[index]);
    }

    return { 
      success: true, 
      user: this.users[index], 
      message: `บันทึกการแก้ไขข้อมูลของ ${this.users[index].name} เรียบร้อยแล้ว` 
    };
  }

  // รีเซ็ตรหัสผ่าน (โดย Admin)
  public resetPassword(userId: string, newPass: string): { success: boolean; message: string } {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'ไม่พบผู้ใช้งาน' };
    }

    user.password = newPass;
    user.mustChangePassword = true;
    this.persistUsers();

    return { success: true, message: `รีเซ็ตรหัสผ่านของ ${user.name} เป็น '${newPass}' สำเร็จ` };
  }

  // เปลี่ยนรหัสผ่านโดยผู้ใช้เอง
  public changePassword(userId: string, oldPass: string, newPass: string): { success: boolean; message: string } {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: 'ไม่พบผู้ใช้งาน' };
    }

    const currentPass = user.password || 'password123';
    if (currentPass !== oldPass) {
      return { success: false, message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' };
    }

    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' };
    }

    user.password = newPass;
    user.mustChangePassword = false;
    this.persistUsers();

    return { success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จแล้ว' };
  }

  // ลบผู้ใช้งาน
  public deleteUser(userId: string): { success: boolean; message: string } {
    if (userId === 'usr_admin') {
      return { success: false, message: 'ไม่สามารถลบบัญชีผู้ดูแลระบบหลัก (Super Admin) ได้' };
    }

    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) {
      return { success: false, message: 'ไม่พบผู้ใช้งานที่ต้องการลบ' };
    }

    const deleted = this.users.splice(index, 1)[0];
    this.persistUsers();

    return { success: true, message: `ลบผู้ใช้งาน ${deleted.name} เรียบร้อยแล้ว` };
  }

  // รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นจากไฟล์ Excel (D:\อบต\รายชื่อพนักงาน.xlsx)
  public resetToOriginalExcel(): { success: boolean; message: string; count: number } {
    this.users = [...INITIAL_STAFF_USERS];
    this.persistUsers();
    return { 
      success: true, 
      message: `รีเซ็ตและโหลดข้อมูลบุคลากรจำนวน ${this.users.length} คน จากไฟล์ Excel เรียบร้อยแล้ว`,
      count: this.users.length
    };
  }

  // การจัดการ Session
  public getCurrentSession(): User | null {
    try {
      const session = localStorage.getItem(CURRENT_SESSION_KEY) || sessionStorage.getItem(CURRENT_SESSION_KEY);
      if (session) {
        return JSON.parse(session);
      }
    } catch (e) {
      console.warn('Failed to parse current user session', e);
    }
    return null;
  }

  public setCurrentSession(user: User, rememberMe: boolean = true) {
    try {
      const str = JSON.stringify(user);
      if (rememberMe) {
        localStorage.setItem(CURRENT_SESSION_KEY, str);
      } else {
        sessionStorage.setItem(CURRENT_SESSION_KEY, str);
      }
    } catch (e) {
      console.error('Failed to set current user session', e);
    }
  }

  public clearSession() {
    try {
      localStorage.removeItem(CURRENT_SESSION_KEY);
      sessionStorage.removeItem(CURRENT_SESSION_KEY);
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  }
}

export const userService = new UserService();
