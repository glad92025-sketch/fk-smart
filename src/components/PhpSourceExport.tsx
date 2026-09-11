import React, { useState } from 'react';
import {
  Code2,
  Database,
  Download,
  Copy,
  Check,
  Server,
  FileCode,
  Layers,
  Terminal
} from 'lucide-react';

export const PhpSourceExport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'config' | 'controller' | 'api' | 'view'>('sql');
  const [copied, setCopied] = useState(false);

  const SQL_SCHEMA = `-- ==========================================================
-- FANGKHAM SMART GOVERNMENT (ระบบบริหารงาน อบต. ครบวงจร)
-- Target Database: MySQL 8.0+ / MariaDB 10.4+ (XAMPP Ready)
-- Character Set: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`fangkham_smart_gov\` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE \`fangkham_smart_gov\`;

-- 1. ตารางกอง / ส่วนราชการ
CREATE TABLE IF NOT EXISTS \`departments\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`head_name\` VARCHAR(150) NOT NULL,
  \`head_position\` VARCHAR(150) NOT NULL,
  \`color\` VARCHAR(20) DEFAULT '#2563EB',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. ตารางผู้ใช้งานและบทบาท (7 Roles)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`username\` VARCHAR(100) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`position\` VARCHAR(150) NOT NULL,
  \`role\` ENUM('super_admin','mayor','deputy_mayor','clerk','dept_head','officer','guest') NOT NULL,
  \`department_id\` VARCHAR(50) NULL,
  \`phone\` VARCHAR(30) NULL,
  \`email\` VARCHAR(100) NULL,
  \`rating\` DECIMAL(3,2) DEFAULT 5.00,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. ตารางภารกิจงานราชการ (Tasks)
CREATE TABLE IF NOT EXISTS \`tasks\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`task_no\` VARCHAR(50) NOT NULL UNIQUE,
  \`title\` VARCHAR(255) NOT NULL,
  \`category_id\` VARCHAR(50) NOT NULL,
  \`department_id\` VARCHAR(50) NOT NULL,
  \`applicant\` VARCHAR(150) NOT NULL,
  \`applicant_type\` ENUM('citizen','council','mayor','internal') DEFAULT 'internal',
  \`assigner_id\` VARCHAR(50) NULL,
  \`assignee_id\` VARCHAR(50) NOT NULL,
  \`reviewer_id\` VARCHAR(50) NULL,
  \`approver_id\` VARCHAR(50) NULL,
  \`received_date\` DATE NOT NULL,
  \`start_date\` DATE NOT NULL,
  \`due_date\` DATE NOT NULL,
  \`completed_date\` DATE NULL,
  \`urgency\` ENUM('normal','urgent','critical') DEFAULT 'normal',
  \`status\` ENUM(
    'pending_receive','received','pending_assign','assigned',
    'in_progress','waiting_info','pending_review','revision',
    'pending_approve','approved','completed','closed','cancelled','overdue'
  ) DEFAULT 'pending_receive',
  \`progress\` INT DEFAULT 0,
  \`budget\` DECIMAL(12,2) DEFAULT 0.00,
  \`budget_source\` VARCHAR(200) NULL,
  \`description\` TEXT NULL,
  \`obstacle_notes\` TEXT NULL,
  \`solution_notes\` TEXT NULL,
  \`fiscal_year\` VARCHAR(10) DEFAULT '2569',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`),
  FOREIGN KEY (\`assignee_id\`) REFERENCES \`users\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ตารางงานย่อย (Subtasks Checklist)
CREATE TABLE IF NOT EXISTS \`subtasks\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`task_id\` VARCHAR(50) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`assignee_name\` VARCHAR(150) NULL,
  \`due_date\` DATE NULL,
  \`completed\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ตารางไทม์ไลน์และ Audit Trail
CREATE TABLE IF NOT EXISTS \`task_timeline\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`task_id\` VARCHAR(50) NOT NULL,
  \`action\` VARCHAR(255) NOT NULL,
  \`actor_name\` VARCHAR(150) NOT NULL,
  \`actor_role\` VARCHAR(100) NOT NULL,
  \`status_from\` VARCHAR(50) NULL,
  \`status_to\` VARCHAR(50) NULL,
  \`details\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. ตารางคำร้องประชาชน 7 สเต็ป
CREATE TABLE IF NOT EXISTS \`citizen_complaints\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`ticket_no\` VARCHAR(50) NOT NULL UNIQUE,
  \`complainant_name\` VARCHAR(150) NOT NULL,
  \`phone\` VARCHAR(30) NOT NULL,
  \`village_no\` VARCHAR(50) NOT NULL,
  \`location_description\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`department_id\` VARCHAR(50) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`current_step\` TINYINT NOT NULL DEFAULT 1,
  \`status\` ENUM('new','in_progress','resolved','closed') DEFAULT 'new',
  \`satisfaction_rating\` TINYINT NULL,
  \`received_date\` DATE NOT NULL,
  \`due_date\` DATE NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ข้อมูลจำลองตั้งต้น (Initial Seed Data)
INSERT INTO \`departments\` (\`id\`, \`name\`, \`code\`, \`head_name\`, \`head_position\`, \`color\`) VALUES
('dept_clerk', 'สำนักปลัด อบต.', 'สป.', 'นางสาวรัชนี บุญรักษา', 'หัวหน้าสำนักปลัด', '#2563EB'),
('dept_finance', 'กองคลัง', 'กค.', 'นางนภาลักษณ์ มั่งมี', 'ผู้อำนวยการกองคลัง', '#059669'),
('dept_tech', 'กองช่าง', 'กช.', 'นายชาญณรงค์ โยธาดี', 'ผู้อำนวยการกองช่าง', '#D97706'),
('dept_edu', 'กองการศึกษา ศาสนาและวัฒนธรรม', 'กศ.', 'นายกิตติศักดิ์ ปัญญาวงศ์', 'ผู้อำนวยการกองการศึกษา', '#7C3AED');
`;

  const PHP_CONFIG = `<?php
/**
 * config/database.php
 * เชื่อมต่อฐานข้อมูล MySQL ด้วย PDO (รองรับ UTF-8 ภาษาไทยสมบูรณ์)
 */
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'fangkham_smart_gov');
define('DB_PORT', 3306);

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            try {
                $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ];
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                die("Database Connection Error: " . $e->getMessage());
            }
        }
        return self::$instance;
    }
}
?>`;

  const PHP_CONTROLLER = `<?php
/**
 * controllers/TaskController.php
 * ตัวควบคุมภารกิจงานราชการ (CRUD, Workflow, Timeline)
 */
require_once __DIR__ . '/../config/database.php';

class TaskController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * ดึงรายการภารกิจทั้งหมด พร้อมตัวกรอง
     */
    public function getTasks(array $filters = []): array {
        $sql = "SELECT t.*, d.name AS department_name, u.name AS assignee_name 
                FROM tasks t
                LEFT JOIN departments d ON t.department_id = d.id
                LEFT JOIN users u ON t.assignee_id = u.id
                WHERE 1=1";
        $params = [];

        if (!empty($filters['department_id']) && $filters['department_id'] !== 'all') {
            $sql .= " AND t.department_id = :dept";
            $params[':dept'] = $filters['department_id'];
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $sql .= " AND t.status = :status";
            $params[':status'] = $filters['status'];
        }

        $sql .= " ORDER BY t.due_date ASC, t.created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * อัปเดตความคืบหน้า (Progress) และสถานะ
     */
    public function updateProgress(string $taskId, int $progress, string $notes, string $actorName): bool {
        $this->db->beginTransaction();
        try {
            $status = ($progress === 100) ? 'pending_review' : 'in_progress';

            $stmt = $this->db->prepare(
                "UPDATE tasks SET progress = :prog, status = :status, actual_outcome = :notes WHERE id = :id"
            );
            $stmt->execute([
                ':prog' => $progress,
                ':status' => $status,
                ':notes' => $notes,
                ':id' => $taskId
            ]);

            // บันทึก Timeline ประวัติ
            $timelineStmt = $this->db->prepare(
                "INSERT INTO task_timeline (id, task_id, action, actor_name, actor_role, details) 
                 VALUES (:id, :task_id, :action, :actor, 'เจ้าหน้าที่', :details)"
            );
            $timelineStmt->execute([
                ':id' => uniqid('tm_'),
                ':task_id' => $taskId,
                ':action' => "อัปเดตความคืบหน้าเป็น {$progress}%",
                ':actor' => $actorName,
                ':details' => $notes
            ]);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }
}
?>`;

  const PHP_API = `<?php
/**
 * api/tasks.php
 * REST API Endpoint สำหรับเชื่อมต่อ AJAX / jQuery ในระบบ อบต.
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../controllers/TaskController.php';

$controller = new TaskController();
$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        $filters = [
            'department_id' => $_GET['department_id'] ?? 'all',
            'status' => $_GET['status'] ?? 'all'
        ];
        $tasks = $controller->getTasks($filters);
        echo json_encode(['status' => 'success', 'data' => $tasks], JSON_UNESCAPED_UNICODE);
        break;

    case 'update_progress':
        $data = json_decode(file_get_contents('php://input'), true);
        $success = $controller->updateProgress(
            $data['task_id'],
            (int)$data['progress'],
            $data['notes'] ?? '',
            $data['actor_name'] ?? 'เจ้าหน้าที่'
        );
        echo json_encode(['status' => $success ? 'success' : 'error']);
        break;

    default:
        echo json_encode(['status' => 'invalid_action']);
}
?>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSql = () => {
    const blob = new Blob([SQL_SCHEMA], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fangkham_smart_gov_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-emerald-600" />
            ชุดสถาปัตยกรรม PHP 8+ / MySQL (XAMPP Blueprint Package)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            โครงสร้างโค้ดตามความต้องการของ อบต. สำหรับติดตั้งบน Apache / PHP 8.2 / phpMyAdmin ในเครือข่ายภายใน
          </p>
        </div>

        <button
          onClick={downloadSql}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>ดาวน์โหลด .SQL สำหรับ phpMyAdmin</span>
        </button>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-slate-200">
        {/* Code Tabs */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'sql' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" /> fangkham_smart_gov.sql
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'config' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" /> config/database.php
            </button>
            <button
              onClick={() => setActiveTab('controller')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'controller' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" /> controllers/TaskController.php
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'api' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> api/tasks.php
            </button>
          </div>

          <button
            onClick={() => copyToClipboard(
              activeTab === 'sql' ? SQL_SCHEMA :
              activeTab === 'config' ? PHP_CONFIG :
              activeTab === 'controller' ? PHP_CONTROLLER : PHP_API
            )}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed max-h-[600px] overflow-y-auto">
          <pre className="text-emerald-300">
            {activeTab === 'sql' && SQL_SCHEMA}
            {activeTab === 'config' && PHP_CONFIG}
            {activeTab === 'controller' && PHP_CONTROLLER}
            {activeTab === 'api' && PHP_API}
          </pre>
        </div>
      </div>
    </div>
  );
};
