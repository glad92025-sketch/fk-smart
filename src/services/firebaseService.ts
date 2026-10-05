/**
 * FANGKHAM SMART GOVERNMENT - Firebase & Cloud Database Service
 * รองรับการเชื่อมต่อ Firebase Cloud Firestore แบบ Real-time
 * พร้อมระบบ LocalStorage Caching (บันทึกข้อมูลถาวรแม้รีเฟรชหน้าเว็บ)
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  Firestore 
} from 'firebase/firestore';
import { Task, CitizenComplaint, OfficialDocument, ProjectItem } from '../types';
import { INITIAL_TASKS, INITIAL_COMPLAINTS, INITIAL_DOCUMENTS, INITIAL_PROJECTS } from '../mockData';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const STORAGE_KEY_FIREBASE_CONFIG = 'fk_smart_firebase_config';
const STORAGE_KEY_TASKS = 'fk_smart_db_tasks';
const STORAGE_KEY_COMPLAINTS = 'fk_smart_db_complaints';
const STORAGE_KEY_DOCUMENTS = 'fk_smart_db_documents';
const STORAGE_KEY_PROJECTS = 'fk_smart_db_projects';

// Default project configuration referencing the user's Google Cloud project: mineral-rune-386615
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: '',
  authDomain: 'mineral-rune-386615.firebaseapp.com',
  projectId: 'mineral-rune-386615',
  storageBucket: 'mineral-rune-386615.appspot.com',
  messagingSenderId: '739587588005',
  appId: ''
};

class FirebaseDatabaseService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
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
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load Firebase config from localStorage', e);
    }
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
    return this.isConnected && this.db !== null;
  }

  public initFirebase() {
    try {
      if (this.config.apiKey && this.config.projectId) {
        const apps = getApps();
        this.app = apps.length > 0 ? getApp() : initializeApp(this.config);
        this.db = getFirestore(this.app);
        this.isConnected = true;
        console.log('[Firebase] Cloud Firestore connected to project:', this.config.projectId);
      } else {
        this.isConnected = false;
        this.db = null;
      }
    } catch (e) {
      console.warn('[Firebase] Initialization error (falling back to Local Persistent DB):', e);
      this.isConnected = false;
      this.db = null;
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
    if (!this.db) return null;
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
      console.warn('[Firebase] Error fetching tasks from Firestore:', e);
    }
    return null;
  }

  public async saveTask(task: Task, allTasks: Task[]): Promise<void> {
    const updated = allTasks.some(t => t.id === task.id)
      ? allTasks.map(t => (t.id === task.id ? task : t))
      : [task, ...allTasks];

    this.saveTasksToLocal(updated);

    if (this.db) {
      try {
        const docRef = doc(this.db, 'tasks', task.id);
        await setDoc(docRef, task, { merge: true });
      } catch (e) {
        console.error('[Firebase] Failed to write task to Firestore:', e);
      }
    }
  }

  public async deleteTask(taskId: string, allTasks: Task[]): Promise<Task[]> {
    const filtered = allTasks.filter(t => t.id !== taskId);
    this.saveTasksToLocal(filtered);

    if (this.db) {
      try {
        const docRef = doc(this.db, 'tasks', taskId);
        await deleteDoc(docRef);
        console.log(`[Firebase] Deleted task ${taskId} from Firestore`);
      } catch (e) {
        console.error('[Firebase] Failed to delete task from Firestore:', e);
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

    if (this.db) {
      try {
        await setDoc(doc(this.db, 'complaints', complaint.id), complaint, { merge: true });
      } catch (e) {
        console.error('[Firebase] Failed to write complaint to Firestore:', e);
      }
    }
  }

  public async deleteComplaint(complaintId: string, all: CitizenComplaint[]): Promise<CitizenComplaint[]> {
    const filtered = all.filter(c => c.id !== complaintId);
    this.saveComplaintsToLocal(filtered);

    if (this.db) {
      try {
        await deleteDoc(doc(this.db, 'complaints', complaintId));
      } catch (e) {
        console.error('[Firebase] Failed to delete complaint:', e);
      }
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

    if (this.db) {
      try {
        await setDoc(doc(this.db, 'documents', docItem.id), docItem, { merge: true });
      } catch (e) {
        console.error('[Firebase] Failed to write document:', e);
      }
    }
  }

  public async deleteDocument(docId: string, all: OfficialDocument[]): Promise<OfficialDocument[]> {
    const filtered = all.filter(d => d.id !== docId);
    this.saveDocumentsToLocal(filtered);

    if (this.db) {
      try {
        await deleteDoc(doc(this.db, 'documents', docId));
      } catch (e) {
        console.error('[Firebase] Failed to delete document:', e);
      }
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
