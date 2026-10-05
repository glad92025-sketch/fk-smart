/**
 * FANGKHAM SMART GOVERNMENT - Firebase & Cloud Database Service
 * รองรับการเชื่อมต่อ Firebase Cloud Firestore & Realtime Database แบบ Real-time
 * โปรเจกต์: duty-fangkham (https://duty-fangkham-default-rtdb.asia-southeast1.firebasedatabase.app)
 * พร้อมระบบ LocalStorage Caching (บันทึกข้อมูลถาวรแม้รีเฟรชหน้าเว็บ ลบแล้วไม่ย้อนกลับมา)
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  Firestore 
} from 'firebase/firestore';
import { 
  getDatabase, 
  ref, 
  set, 
  remove, 
  get, 
  Database as RTDatabase 
} from 'firebase/database';
import { Task, CitizenComplaint, OfficialDocument, ProjectItem } from '../types';
import { INITIAL_TASKS, INITIAL_COMPLAINTS, INITIAL_DOCUMENTS, INITIAL_PROJECTS } from '../mockData';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const STORAGE_KEY_FIREBASE_CONFIG = 'fk_smart_firebase_config';
const STORAGE_KEY_TASKS = 'fk_smart_db_tasks';
const STORAGE_KEY_COMPLAINTS = 'fk_smart_db_complaints';
const STORAGE_KEY_DOCUMENTS = 'fk_smart_db_documents';
const STORAGE_KEY_PROJECTS = 'fk_smart_db_projects';

// ข้อมูลเชื่อมต่อ Firebase ของ อบต.ฝางคำ (duty-fangkham) ตัวจริง
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyCmCyAPpiFe4NIuyaTCQ400J0iN4NpiX6c",
  authDomain: "duty-fangkham.firebaseapp.com",
  databaseURL: "https://duty-fangkham-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "duty-fangkham",
  storageBucket: "duty-fangkham.firebasestorage.app",
  messagingSenderId: "223843550015",
  appId: "1:223843550015:web:5b7e007de0c5196002498a",
  measurementId: "G-LC6LW3X625"
};

class FirebaseDatabaseService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private rtdb: RTDatabase | null = null;
  private config: FirebaseConfig;
  private isConnected = false;

  constructor() {
    this.config = this.loadConfig();
    this.initFirebase();
  }

  private loadConfig(): FirebaseConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && parsed.projectId === 'duty-fangkham') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load Firebase config from localStorage', e);
    }
    // ใช้ค่า config จริงของ duty-fangkham และบันทึกลง localStorage ทันที
    this.saveConfig(DEFAULT_FIREBASE_CONFIG);
    return { ...DEFAULT_FIREBASE_CONFIG };
  }

  public saveConfig(newConfig: FirebaseConfig): boolean {
    this.config = newConfig;
    try {
      localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(newConfig));
      this.initFirebase();
      return true;
    } catch (e) {
      console.error('Failed to save Firebase config', e);
      return false;
    }
  }

  public getConfig(): FirebaseConfig {
    return { ...this.config };
  }

  public isCloudConnected(): boolean {
    return this.isConnected;
  }

  public initFirebase() {
    try {
      if (this.config.apiKey && this.config.projectId) {
        const apps = getApps();
        this.app = apps.length > 0 ? getApp() : initializeApp(this.config);

        // 1. เชื่อมต่อ Firestore
        try {
          this.db = getFirestore(this.app);
        } catch (e) {
          console.warn('[Firebase] Firestore init notice:', e);
        }

        // 2. เชื่อมต่อ Realtime Database
        try {
          if (this.config.databaseURL) {
            this.rtdb = getDatabase(this.app, this.config.databaseURL);
          } else {
            this.rtdb = getDatabase(this.app);
          }
        } catch (e) {
          console.warn('[Firebase] RTDB init notice:', e);
        }

        this.isConnected = true;
        console.log('[Firebase] Connected to project:', this.config.projectId);
      } else {
        this.isConnected = false;
        this.db = null;
        this.rtdb = null;
      }
    } catch (e) {
      console.warn('[Firebase] Initialization error (fallback to local persistent DB):', e);
      this.isConnected = false;
      this.db = null;
      this.rtdb = null;
    }
  }

  // ==========================================
  // TASKS (ภารกิจงาน) - CRUD & PERSISTENCE
  // ==========================================

  public getTasks(): Task[] {
    try {
      const local = localStorage.getItem(STORAGE_KEY_TASKS);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Error reading tasks from localStorage', e);
    }
    // Seed initial tasks if first run
    this.saveTasksToLocal(INITIAL_TASKS);
    return INITIAL_TASKS;
  }

  public saveTasksToLocal(tasks: Task[]) {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }

  public async syncTasksFromCloud(): Promise<Task[] | null> {
    // 1. ลองอ่านจาก Realtime Database ก่อน
    if (this.rtdb) {
      try {
        const snapshot = await get(ref(this.rtdb, 'tasks'));
        if (snapshot.exists()) {
          const val = snapshot.val();
          const cloudTasks: Task[] = Object.values(val);
          if (cloudTasks && cloudTasks.length > 0) {
            this.saveTasksToLocal(cloudTasks);
            return cloudTasks;
          }
        }
      } catch (e) {
        console.warn('[Firebase RTDB] Sync notice:', e);
      }
    }

    // 2. ถ้าไม่พบใน RTDB ลองอ่านจาก Firestore
    if (this.db) {
      try {
        const colRef = collection(this.db, 'tasks');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const cloudTasks: Task[] = [];
          snapshot.forEach(docSnap => {
            cloudTasks.push(docSnap.data() as Task);
          });
          this.saveTasksToLocal(cloudTasks);
          return cloudTasks;
        }
      } catch (e) {
        console.warn('[Firebase Firestore] Sync notice:', e);
      }
    }

    return null;
  }

  public async saveTask(task: Task, allTasks: Task[]): Promise<void> {
    const updated = allTasks.some(t => t.id === task.id)
      ? allTasks.map(t => (t.id === task.id ? task : t))
      : [task, ...allTasks];

    // บันทึกลง LocalStorage ทันที
    this.saveTasksToLocal(updated);

    // บันทึกขึ้น Cloud Realtime Database
    if (this.rtdb) {
      try {
        await set(ref(this.rtdb, `tasks/${task.id}`), task);
      } catch (e) {
        console.warn('[Firebase RTDB] Task write notice:', e);
      }
    }

    // บันทึกขึ้น Firestore
    if (this.db) {
      try {
        await setDoc(doc(this.db, 'tasks', task.id), task, { merge: true });
      } catch (e) {
        console.warn('[Firebase Firestore] Task write notice:', e);
      }
    }
  }

  public async deleteTask(taskId: string, allTasks: Task[]): Promise<Task[]> {
    const filtered = allTasks.filter(t => t.id !== taskId);
    
    // 1. ลบออกจาก LocalStorage อย่างถาวรทันที
    this.saveTasksToLocal(filtered);

    // 2. ลบออกจาก Realtime Database
    if (this.rtdb) {
      try {
        await remove(ref(this.rtdb, `tasks/${taskId}`));
        console.log(`[Firebase RTDB] Deleted task: ${taskId}`);
      } catch (e) {
        console.warn('[Firebase RTDB] Delete notice:', e);
      }
    }

    // 3. ลบออกจาก Cloud Firestore
    if (this.db) {
      try {
        await deleteDoc(doc(this.db, 'tasks', taskId));
        console.log(`[Firebase Firestore] Deleted task: ${taskId}`);
      } catch (e) {
        console.warn('[Firebase Firestore] Delete notice:', e);
      }
    }

    return filtered;
  }

  // ==========================================
  // COMPLAINTS (เรื่องร้องเรียนประชาชน)
  // ==========================================

  public getComplaints(): CitizenComplaint[] {
    try {
      const local = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Error reading complaints', e);
    }
    this.saveComplaintsToLocal(INITIAL_COMPLAINTS);
    return INITIAL_COMPLAINTS;
  }

  public saveComplaintsToLocal(complaints: CitizenComplaint[]) {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to save complaints', e);
    }
  }

  public async saveComplaint(complaint: CitizenComplaint, all: CitizenComplaint[]): Promise<void> {
    const updated = all.some(c => c.id === complaint.id)
      ? all.map(c => (c.id === complaint.id ? complaint : c))
      : [complaint, ...all];

    this.saveComplaintsToLocal(updated);

    if (this.rtdb) {
      try {
        await set(ref(this.rtdb, `complaints/${complaint.id}`), complaint);
      } catch (e) {}
    }

    if (this.db) {
      try {
        await setDoc(doc(this.db, 'complaints', complaint.id), complaint, { merge: true });
      } catch (e) {}
    }
  }

  public async deleteComplaint(complaintId: string, all: CitizenComplaint[]): Promise<CitizenComplaint[]> {
    const filtered = all.filter(c => c.id !== complaintId);
    this.saveComplaintsToLocal(filtered);

    if (this.rtdb) {
      try {
        await remove(ref(this.rtdb, `complaints/${complaintId}`));
      } catch (e) {}
    }

    if (this.db) {
      try {
        await deleteDoc(doc(this.db, 'complaints', complaintId));
      } catch (e) {}
    }

    return filtered;
  }

  // ==========================================
  // OFFICIAL DOCUMENTS (งานสารบรรณ)
  // ==========================================

  public getDocuments(): OfficialDocument[] {
    try {
      const local = localStorage.getItem(STORAGE_KEY_DOCUMENTS);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Error reading documents', e);
    }
    this.saveDocumentsToLocal(INITIAL_DOCUMENTS);
    return INITIAL_DOCUMENTS;
  }

  public saveDocumentsToLocal(docs: OfficialDocument[]) {
    try {
      localStorage.setItem(STORAGE_KEY_DOCUMENTS, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save documents', e);
    }
  }

  public async saveDocument(docItem: OfficialDocument, all: OfficialDocument[]): Promise<void> {
    const updated = all.some(d => d.id === docItem.id)
      ? all.map(d => (d.id === docItem.id ? docItem : d))
      : [docItem, ...all];

    this.saveDocumentsToLocal(updated);

    if (this.rtdb) {
      try {
        await set(ref(this.rtdb, `documents/${docItem.id}`), docItem);
      } catch (e) {}
    }

    if (this.db) {
      try {
        await setDoc(doc(this.db, 'documents', docItem.id), docItem, { merge: true });
      } catch (e) {}
    }
  }

  public async deleteDocument(docId: string, all: OfficialDocument[]): Promise<OfficialDocument[]> {
    const filtered = all.filter(d => d.id !== docId);
    this.saveDocumentsToLocal(filtered);

    if (this.rtdb) {
      try {
        await remove(ref(this.rtdb, `documents/${docId}`));
      } catch (e) {}
    }

    if (this.db) {
      try {
        await deleteDoc(doc(this.db, 'documents', docId));
      } catch (e) {}
    }

    return filtered;
  }

  // รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้น
  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEY_TASKS);
    localStorage.removeItem(STORAGE_KEY_COMPLAINTS);
    localStorage.removeItem(STORAGE_KEY_DOCUMENTS);
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
  }
}

export const firebaseService = new FirebaseDatabaseService();
