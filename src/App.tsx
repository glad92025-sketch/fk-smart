import React, { useState, useMemo, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_CATEGORIES,
  INITIAL_STAFF,
  INITIAL_TASKS,
  INITIAL_COMPLAINTS,
  INITIAL_DOCUMENTS,
  INITIAL_PROJECTS,
  INITIAL_PROCUREMENTS,
  INITIAL_SETTINGS,
  INITIAL_FIELD_OPS,
  INITIAL_MEETINGS,
  INITIAL_ASSETS,
  INITIAL_KPIS,
  INITIAL_DOC_ARCHIVE,
  INITIAL_AUDIT_LOGS
} from './mockData';
import { 
  User, 
  Task, 
  CitizenComplaint, 
  OfficialDocument, 
  ProjectItem, 
  TaskStatus,
  FieldOperation,
  MeetingItem,
  MeetingAgenda,
  AssetRecord,
  DepartmentKpi,
  DocumentArchive,
  AuditLogEntry,
  SystemSettings
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, NavSection } from './components/Sidebar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { TaskManagement } from './components/TaskManagement';
import { TaskDetailModal } from './components/TaskDetailModal';
import { KanbanBoard } from './components/KanbanBoard';
import { CitizenComplaints } from './components/CitizenComplaints';
import { OfficialDocuments } from './components/OfficialDocuments';
import { ProjectsAndBudget } from './components/ProjectsAndBudget';
import { ProcurementModule } from './components/ProcurementModule';
import { StaffAndWorkload } from './components/StaffAndWorkload';
import { GovernmentCalendar } from './components/GovernmentCalendar';
import { ReportCenter } from './components/ReportCenter';
import { PhpSourceExport } from './components/PhpSourceExport';
import { GovAiAssistantModal } from './components/GovAiAssistantModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FieldOperations } from './components/FieldOperations';
import { MeetingManagement } from './components/MeetingManagement';
import { AssetManagement } from './components/AssetManagement';
import { KpiPerformance } from './components/KpiPerformance';
import { CentralDocArchive } from './components/CentralDocArchive';
import { AuditLogsView } from './components/AuditLogsView';
import { SystemSettingsView } from './components/SystemSettingsView';
import { ResponsiveUtilityBar } from './components/ResponsiveUtilityBar';
import { MobileQuickActions } from './components/MobileQuickActions';
import { EasyUseGuideModal } from './components/EasyUseGuideModal';
import { NewTaskModal } from './components/NewTaskModal';
import { LoginView } from './components/LoginView';
import { UserManagementView } from './components/UserManagementView';
import { GoogleDriveManager } from './components/GoogleDriveManager';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { userService } from './services/userService';
import { firebaseService } from './services/firebaseService';
import { Search, X } from 'lucide-react';

export default function App() {
  // Current user state (from session storage or null if not logged in)
  const [currentUser, setCurrentUser] = useState<User | null>(() => userService.getCurrentSession());
  const [allUsersList, setAllUsersList] = useState<User[]>(() => userService.getUsers());
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Application Data States (Persistent LocalStorage + Real-time Firebase)
  const [tasks, setTasks] = useState<Task[]>(() => firebaseService.getTasks());
  const [departments] = useState(INITIAL_DEPARTMENTS);
  const [categories] = useState(INITIAL_CATEGORIES);
  const [staff] = useState(INITIAL_STAFF);
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(() => firebaseService.getComplaints());
  const [documents, setDocuments] = useState<OfficialDocument[]>(() => firebaseService.getDocuments());
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [procurements] = useState(INITIAL_PROCUREMENTS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [fieldOps, setFieldOps] = useState<FieldOperation[]>(INITIAL_FIELD_OPS);
  const [meetings, setMeetings] = useState<MeetingItem[]>(INITIAL_MEETINGS);
  const [assets, setAssets] = useState<AssetRecord[]>(INITIAL_ASSETS);
  const [kpis, setKpis] = useState<DepartmentKpi[]>(INITIAL_KPIS);
  const [docArchives, setDocArchives] = useState<DocumentArchive[]>(INITIAL_DOC_ARCHIVE);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modal States
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Sync font size class to root html element for accessibility
  useEffect(() => {
    document.documentElement.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xl');
    document.documentElement.classList.add(`font-scale-${fontSize}`);
  }, [fontSize]);

  // Counts for sidebar badges
  const urgentCount = useMemo(() => {
    return tasks.filter(t => (t.urgency === 'critical' || t.urgency === 'urgent') && !['completed', 'closed'].includes(t.status)).length;
  }, [tasks]);

  const myTasksCount = useMemo(() => {
    if (!currentUser) return 0;
    return tasks.filter(t => t.assigneeId === currentUser.id && !['completed', 'closed'].includes(t.status)).length;
  }, [tasks, currentUser]);

  const overdueCount = useMemo(() => {
    return tasks.filter(t => t.status === 'overdue' || (t.dueDate < '2026-09-08' && !['completed', 'closed'].includes(t.status))).length;
  }, [tasks]);

  const activeComplaintsCount = useMemo(() => {
    return complaints.filter(c => c.status !== 'closed').length;
  }, [complaints]);

  // Active Task Object for modal
  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;
    return tasks.find(t => t.id === activeTaskId) || null;
  }, [activeTaskId, tasks]);

  // Handler: Add new task
  const handleAddTask = (newTask: Task) => {
    firebaseService.saveTask(newTask, tasks);
    setTasks(prev => [newTask, ...prev.filter(t => t.id !== newTask.id)]);
  };

  // Handler: Update task
  const handleUpdateTask = (updatedTask: Task) => {
    firebaseService.saveTask(updatedTask, tasks);
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  // Handler: Delete task
  const handleDeleteTask = (taskId: string) => {
    firebaseService.deleteTask(taskId, tasks);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  // Handler: Update single task status (e.g. from Kanban)
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const upd = {
            ...t,
            status: newStatus,
            progress: newStatus === 'completed' || newStatus === 'closed' ? 100 : t.progress,
            completedDate: newStatus === 'completed' || newStatus === 'closed' ? new Date().toISOString().slice(0, 10) : t.completedDate,
            timeline: [
              {
                id: `tm_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                action: `เลื่อนสถานะเป็น [${newStatus}]`,
                actorName: currentUser ? currentUser.name : 'เจ้าหน้าที่',
                actorRole: currentUser ? currentUser.roleTitle : 'ผู้ปฏิบัติงาน'
              },
              ...t.timeline
            ]
          };
          firebaseService.saveTask(upd, prev);
          return upd;
        }
        return t;
      });
      return updated;
    });
  };

  // Handler: Convert document to Task
  const handleCreateTaskFromDoc = (doc: OfficialDocument) => {
    const today = new Date().toISOString().slice(0, 10);
    const dept = departments.find(d => d.id === doc.departmentId) || departments[0];

    const newTask: Task = {
      id: `tsk_from_doc_${Date.now()}`,
      taskNo: `${dept.code}-2569/${Math.floor(Math.random() * 800) + 100}`,
      title: `ปฏิบัติตามหนังสือ ${doc.docNo}: ${doc.subject}`,
      categoryId: 'cat_policy',
      categoryName: 'งานตามนโยบาย',
      departmentId: doc.departmentId,
      departmentName: dept.name,
      applicant: doc.fromSource,
      applicantType: 'internal',
      assignerName: `${currentUser.name} (${currentUser.roleTitle})`,
      assigneeId: currentUser.id,
      assigneeName: `${currentUser.name} (${currentUser.position})`,
      receivedDate: today,
      startDate: today,
      dueDate: doc.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      urgency: 'urgent',
      status: 'assigned',
      progress: 0,
      budget: 0,
      description: `สร้างจากหนังสือราชการเลขที่ ${doc.docNo} (${doc.subject})\nหน่วยงานต้นทาง: ${doc.fromSource}`,
      fiscalYear: '2569',
      subtasks: [
        {
          id: `sub_${Date.now()}`,
          title: 'ศึกษาข้อเท็จจริงและสรุปแนวทางเสนอผู้บริหาร',
          assigneeName: currentUser.name,
          dueDate: today,
          completed: false,
          progress: 0
        }
      ],
      timeline: [
        {
          id: `tm_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: `แปลงจากหนังสือราชการ ${doc.docNo} เป็นภารกิจงาน`,
          actorName: currentUser.name,
          actorRole: currentUser.roleTitle
        }
      ],
      comments: [],
      attachments: []
    };

    setTasks(prev => [newTask, ...prev]);
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, linkedTaskId: newTask.id } : d));
    setActiveTaskId(newTask.id);
  };

  // Handler: Convert meeting resolution to task
  const handleConvertMeetingResolutionToTask = (meeting: MeetingItem, agenda: MeetingAgenda) => {
    const today = new Date().toISOString().slice(0, 10);
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const dept = departments.find(d => d.id === 'dept_office') || departments[0];

    const newTask: Task = {
      id: `tsk_${Date.now()}`,
      taskNo: `มต-${meeting.fiscalYear}/${String(tasks.length + 1).padStart(4, '0')}`,
      title: `[มติที่ประชุม] ${agenda.title}`,
      categoryId: 'cat_meeting',
      categoryName: 'งานตามมติที่ประชุม',
      departmentId: dept.id,
      departmentName: dept.name,
      applicant: meeting.chairman,
      applicantType: 'meeting',
      assigneeId: currentUser.id,
      assigneeName: currentUser.name,
      assignerName: meeting.chairman,
      urgency: 'urgent',
      status: 'assigned',
      progress: 10,
      receivedDate: today,
      startDate: today,
      dueDate: dueDate,
      budget: 0,
      description: `การประชุม: ${meeting.title} (${meeting.meetingNo})\nวาระที่ ${agenda.orderNo}: ${agenda.title}\nมติที่ประชุม: ${agenda.resolution || agenda.description}`,
      fiscalYear: meeting.fiscalYear,
      subtasks: [
        {
          id: `sub_${Date.now()}`,
          title: 'จัดทำแผนปฏิบัติการตามมติที่ประชุม',
          assigneeName: currentUser.name,
          dueDate: dueDate,
          completed: false,
          progress: 0
        }
      ],
      timeline: [
        {
          id: `tm_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: `แปลงมติที่ประชุม (${meeting.meetingNo}) เป็นภารกิจงาน`,
          actorName: currentUser.name,
          actorRole: currentUser.roleTitle
        }
      ],
      comments: [],
      attachments: []
    };

    setTasks(prev => [newTask, ...prev]);
    setMeetings(prev =>
      prev.map(m =>
        m.id === meeting.id
          ? {
              ...m,
              agendas: m.agendas.map(a =>
                a.id === agenda.id ? { ...a, convertedToTaskId: newTask.id } : a
              )
            }
          : m
      )
    );

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        userName: currentUser.name,
        userRole: currentUser.roleTitle,
        action: 'มอบหมายงานราชการ',
        targetType: 'Task',
        targetId: newTask.taskNo,
        details: `สร้างภารกิจงานจากมติการประชุม ${meeting.meetingNo}: ${agenda.title}`,
        ipAddress: '192.168.1.15'
      },
      ...prev
    ]);

    setActiveTaskId(newTask.id);
  };

  // Filter for global search
  const globalSearchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return { tasks: [], complaints: [], docs: [] };
    const q = globalSearchQuery.toLowerCase();
    const taskMatches = tasks.filter(t => t.title.toLowerCase().includes(q) || t.taskNo.toLowerCase().includes(q)).slice(0, 5);
    const complaintMatches = complaints.filter(c => (c.description || '').toLowerCase().includes(q) || c.ticketNo.toLowerCase().includes(q)).slice(0, 3);
    const docMatches = documents.filter(d => d.subject.toLowerCase().includes(q) || d.docNo.toLowerCase().includes(q)).slice(0, 3);
    return { tasks: taskMatches, complaints: complaintMatches, docs: docMatches };
  }, [globalSearchQuery, tasks, complaints, documents]);

  // Authentication Guard: If not logged in, render the login view
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          setAllUsersList(userService.getUsers());
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={(user) => {
          setCurrentUser(user);
          userService.setCurrentSession(user);
        }}
        allUsers={allUsersList}
        settings={settings}
        tasks={tasks}
        onOpenTaskDetail={setActiveTaskId}
        onOpenGlobalSearch={() => setShowGlobalSearch(true)}
        onOpenAiAssistant={() => setShowAiModal(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        onLogout={() => {
          userService.clearSession();
          setCurrentUser(null);
        }}
        onOpenChangePassword={() => setShowChangePasswordModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop fixed, Mobile sliding drawer) */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          currentUser={currentUser}
          urgentCount={urgentCount}
          myTasksCount={myTasksCount}
          overdueCount={overdueCount}
          complaintsCount={activeComplaintsCount}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onLogout={() => {
            userService.clearSession();
            setCurrentUser(null);
          }}
          onOpenChangePassword={() => setShowChangePasswordModal(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 pb-28 lg:pb-12 max-w-[1600px] mx-auto w-full">
          {/* Universal Responsive Utility & Accessibility Bar */}
          <ResponsiveUtilityBar
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            onOpenNewTask={() => setShowNewTaskModal(true)}
            onOpenGlobalSearch={() => setShowGlobalSearch(true)}
            onOpenAiAssistant={() => setShowAiModal(true)}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
            onOpenGuide={() => setShowGuideModal(true)}
          />

          {/* Section: Dashboard */}
          {activeSection === 'dashboard' && (
            <ExecutiveDashboard
              tasks={tasks}
              departments={departments}
              projects={projects}
              currentUser={currentUser}
              onOpenTaskDetail={setActiveTaskId}
              onNavigateToTasks={(_) => {
                setActiveSection('tasks');
              }}
            />
          )}

          {/* Section: All Tasks */}
          {activeSection === 'tasks' && (
            <TaskManagement
              tasks={tasks}
              departments={departments}
              categories={categories}
              staff={staff}
              currentUser={currentUser}
              onOpenTaskDetail={setActiveTaskId}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onOpenFirebaseModal={() => setShowFirebaseModal(true)}
            />
          )}

          {/* Section: My Tasks */}
          {activeSection === 'my_tasks' && (
            <TaskManagement
              tasks={tasks.filter(t => t.assigneeId === currentUser.id)}
              departments={departments}
              categories={categories}
              staff={staff}
              currentUser={currentUser}
              onOpenTaskDetail={setActiveTaskId}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onOpenFirebaseModal={() => setShowFirebaseModal(true)}
            />
          )}

          {/* Section: Urgent Tasks */}
          {activeSection === 'urgent_tasks' && (
            <TaskManagement
              tasks={tasks.filter(t => t.urgency === 'critical' || t.urgency === 'urgent')}
              departments={departments}
              categories={categories}
              staff={staff}
              currentUser={currentUser}
              initialFilter="urgent"
              onOpenTaskDetail={setActiveTaskId}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onOpenFirebaseModal={() => setShowFirebaseModal(true)}
            />
          )}

          {/* Section: Kanban Board */}
          {activeSection === 'kanban' && (
            <KanbanBoard
              tasks={tasks}
              departments={departments}
              onOpenTaskDetail={setActiveTaskId}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {/* Section: Calendar */}
          {activeSection === 'calendar' && (
            <GovernmentCalendar
              tasks={tasks}
              departments={departments}
              onOpenTaskDetail={setActiveTaskId}
            />
          )}

          {/* Section: Citizen Complaints */}
          {activeSection === 'complaints' && (
            <CitizenComplaints
              complaints={complaints}
              departments={departments}
              onUpdateComplaint={(up) => {
                firebaseService.saveComplaint(up, complaints);
                setComplaints(prev => prev.map(c => c.id === up.id ? up : c));
              }}
              onAddComplaint={(newC) => {
                firebaseService.saveComplaint(newC, complaints);
                setComplaints(prev => [newC, ...prev]);
              }}
            />
          )}

          {/* Section: Official Documents */}
          {activeSection === 'documents' && (
            <OfficialDocuments
              documents={documents}
              departments={departments}
              onAddDocument={(d) => setDocuments(prev => [d, ...prev])}
              onCreateTaskFromDoc={handleCreateTaskFromDoc}
            />
          )}

          {/* Section: Projects & Budget */}
          {activeSection === 'projects' && (
            <ProjectsAndBudget
              projects={projects}
              departments={departments}
              onAddProject={(p) => setProjects(prev => [p, ...prev])}
            />
          )}

          {/* Section: Budget (also points to projects and budget) */}
          {activeSection === 'budget' && (
            <ProjectsAndBudget
              projects={projects}
              departments={departments}
              onAddProject={(p) => setProjects(prev => [p, ...prev])}
            />
          )}

          {/* Section: Procurement (10 steps) */}
          {activeSection === 'procurement' && (
            <ProcurementModule procurements={procurements} />
          )}

          {/* Section: Staff & Workload */}
          {activeSection === 'staff' && (
            <StaffAndWorkload
              staff={staff}
              departments={departments}
              tasks={tasks}
              onOpenNewTaskForStaff={(_) => {
                setActiveSection('tasks');
              }}
            />
          )}

          {/* Section: Report Center */}
          {activeSection === 'reports' && (
            <ReportCenter
              tasks={tasks}
              departments={departments}
              complaints={complaints}
              projects={projects}
            />
          )}

          {/* Section: PHP / MySQL Source Code */}
          {activeSection === 'php_source' && (
            <PhpSourceExport />
          )}

          {/* Section: Field Operations */}
          {activeSection === 'field_ops' && (
            <FieldOperations
              fieldOps={fieldOps}
              departments={departments}
              currentUser={currentUser}
              onAddFieldOp={(newOp) => setFieldOps(prev => [newOp, ...prev])}
              onUpdateFieldOp={(updatedOp) => setFieldOps(prev => prev.map(o => o.id === updatedOp.id ? updatedOp : o))}
              onViewTask={(taskId) => {
                setActiveTaskId(taskId);
              }}
            />
          )}

          {/* Section: Meeting Management */}
          {activeSection === 'meetings' && (
            <MeetingManagement
              meetings={meetings}
              currentUser={currentUser}
              departments={departments}
              onAddMeeting={(newM) => setMeetings(prev => [newM, ...prev])}
              onUpdateMeeting={(updM) => setMeetings(prev => prev.map(m => m.id === updM.id ? updM : m))}
              onConvertResolutionToTask={handleConvertMeetingResolutionToTask}
              onViewTask={(taskId) => setActiveTaskId(taskId)}
            />
          )}

          {/* Section: Asset Management */}
          {activeSection === 'assets' && (
            <AssetManagement
              assets={assets}
              departments={departments}
              currentUser={currentUser}
              onAddAsset={(newAsset) => setAssets(prev => [newAsset, ...prev])}
              onUpdateAsset={(updAsset) => setAssets(prev => prev.map(a => a.id === updAsset.id ? updAsset : a))}
            />
          )}

          {/* Section: KPI Performance */}
          {activeSection === 'kpis' && (
            <KpiPerformance
              kpis={kpis}
              departments={departments}
              currentUser={currentUser}
              onAddKpi={(newKpi) => setKpis(prev => [newKpi, ...prev])}
              onUpdateKpi={(updKpi) => setKpis(prev => prev.map(k => k.id === updKpi.id ? updKpi : k))}
            />
          )}

          {/* Section: Central Document Archive */}
          {activeSection === 'doc_center' && (
            <CentralDocArchive
              archives={docArchives}
              departments={departments}
              currentUser={currentUser}
              onAddArchive={(newArc) => setDocArchives(prev => [newArc, ...prev])}
              onNavigateToGoogleDrive={() => setActiveSection('google_drive')}
            />
          )}

          {/* Section: Google Drive Cloud Pool (15TB) */}
          {activeSection === 'google_drive' && (
            <GoogleDriveManager
              currentUser={currentUser}
              systemData={{
                tasks,
                departments,
                categories,
                staff,
                complaints,
                documents,
                projects,
                procurements,
                settings,
                fieldOps,
                meetings,
                assets,
                kpis,
                docArchives,
                users: allUsersList
              }}
            />
          )}

          {/* Section: User Management & Access Control */}
          {activeSection === 'users_admin' && (
            <UserManagementView
              currentUser={currentUser}
              onSwitchUser={(user) => {
                setCurrentUser(user);
                userService.setCurrentSession(user);
              }}
              onRefreshData={() => {
                setAllUsersList(userService.getUsers());
              }}
            />
          )}

          {/* Section: Audit Logs */}
          {activeSection === 'audit_logs' && (
            <AuditLogsView
              logs={auditLogs}
            />
          )}

          {/* Section: System Settings */}
          {activeSection === 'settings' && (
            <SystemSettingsView
              settings={settings}
              currentUser={currentUser}
              onUpdateSettings={(newSettings) => setSettings(newSettings)}
              onNavigateToGoogleDrive={() => setActiveSection('google_drive')}
              onOpenFirebaseModal={() => setShowFirebaseModal(true)}
            />
          )}
        </main>
      </div>

      {/* Task Detail Modal */}
      {activeTask && (
        <TaskDetailModal
          task={activeTask}
          currentUser={currentUser}
          onClose={() => setActiveTaskId(null)}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {/* GovAI Assistant Modal */}
      {showAiModal && (
        <GovAiAssistantModal
          onClose={() => setShowAiModal(false)}
          tasks={tasks}
          departments={departments}
        />
      )}

      {/* Global Search Modal */}
      {showGlobalSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="ค้นหาเลขงาน, หนังสือราชการ, คำร้องประชาชน, บุคลากร..."
                className="w-full text-sm outline-none text-slate-800"
              />
              <button
                onClick={() => setShowGlobalSearch(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
              {globalSearchQuery.trim() ? (
                <>
                  {/* Tasks */}
                  {globalSearchResults.tasks && globalSearchResults.tasks.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-500 uppercase block mb-1">
                        ภารกิจงาน ({globalSearchResults.tasks.length})
                      </span>
                      {globalSearchResults.tasks.map(t => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setActiveTaskId(t.id);
                            setShowGlobalSearch(false);
                          }}
                          className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <div className="font-semibold text-slate-800">{t.taskNo} - {t.title}</div>
                          <div className="text-[11px] text-slate-400">{t.departmentName} • {t.assigneeName}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Complaints */}
                  {globalSearchResults.complaints && globalSearchResults.complaints.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-500 uppercase block mb-1">
                        คำร้องประชาชน ({globalSearchResults.complaints.length})
                      </span>
                      {globalSearchResults.complaints.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setActiveSection('complaints');
                            setShowGlobalSearch(false);
                          }}
                          className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <div className="font-semibold text-slate-800">{c.ticketNo} - {c.categoryLabel}</div>
                          <div className="text-[11px] text-slate-400">ผู้แจ้ง: {c.citizenName} ({c.villageNo})</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Docs */}
                  {globalSearchResults.docs && globalSearchResults.docs.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-500 uppercase block mb-1">
                        หนังสือราชการ ({globalSearchResults.docs.length})
                      </span>
                      {globalSearchResults.docs.map(d => (
                        <div
                          key={d.id}
                          onClick={() => {
                            setActiveSection('documents');
                            setShowGlobalSearch(false);
                          }}
                          className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <div className="font-semibold text-slate-800">{d.docNo} - {d.subject}</div>
                          <div className="text-[11px] text-slate-400">จาก: {d.fromSource} → ถึง: {d.toTarget}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {globalSearchResults.tasks.length === 0 && globalSearchResults.complaints.length === 0 && globalSearchResults.docs.length === 0 && (
                    <div className="py-8 text-center text-slate-400">
                      ไม่พบข้อมูลที่ตรงกับคำค้นหา "{globalSearchQuery}"
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  พิมพ์คำค้นหาเพื่อเริ่มค้นหาทั่วทั้งระบบ อบต.ฝางคำ
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setIsMobileMenuOpen(false);
        }}
        onToggleMenu={() => setIsMobileMenuOpen(prev => !prev)}
        urgentCount={urgentCount}
        complaintsCount={activeComplaintsCount}
      />

      {/* Mobile Floating Quick Actions Speed-Dial */}
      <MobileQuickActions
        onOpenNewTask={() => setShowNewTaskModal(true)}
        onOpenGlobalSearch={() => setShowGlobalSearch(true)}
        onOpenAiAssistant={() => setShowAiModal(true)}
        onNavigateToComplaints={() => setActiveSection('complaints')}
      />

      {/* Easy Use Guide Modal */}
      {showGuideModal && (
        <EasyUseGuideModal onClose={() => setShowGuideModal(false)} />
      )}

      {/* Reusable New Task Modal */}
      <NewTaskModal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onAddTask={handleAddTask}
        departments={departments}
        categories={categories}
        staff={staff}
        currentUser={currentUser}
      />

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          currentUser={currentUser}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}

      {/* Firebase & Cloud Database Config Modal */}
      {showFirebaseModal && (
        <FirebaseConfigModal
          onClose={() => setShowFirebaseModal(false)}
          onDataReset={() => {
            setTasks(firebaseService.getTasks());
            setComplaints(firebaseService.getComplaints());
            setDocuments(firebaseService.getDocuments());
          }}
        />
      )}
    </div>
  );
}
