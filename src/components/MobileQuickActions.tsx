import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Sparkles,
  Megaphone,
  ArrowUp,
  X
} from 'lucide-react';

interface MobileQuickActionsProps {
  onOpenNewTask: () => void;
  onOpenGlobalSearch: () => void;
  onOpenAiAssistant: () => void;
  onNavigateToComplaints: () => void;
}

export const MobileQuickActions: React.FC<MobileQuickActionsProps> = ({
  onOpenNewTask,
  onOpenGlobalSearch,
  onOpenAiAssistant,
  onNavigateToComplaints
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-3 bottom-20 z-40 lg:hidden flex flex-col items-end gap-2.5 pointer-events-none">
      {/* Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="pointer-events-auto w-10 h-10 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all animate-in fade-in cursor-pointer"
          title="เลื่อนกลับขึ้นด้านบน"
          aria-label="เลื่อนขึ้นด้านบน"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Expanded Speed Dial Menu */}
      {isOpen && (
        <div className="pointer-events-auto flex flex-col items-end gap-2 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Action 1: New Task */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenNewTask();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-lg active:scale-95 transition cursor-pointer border border-emerald-400/40"
          >
            <span>ลงทะเบียนงานใหม่</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Action 2: Citizen Complaint */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNavigateToComplaints();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-600 text-white text-xs font-bold shadow-lg active:scale-95 transition cursor-pointer border border-amber-400/40"
          >
            <span>รับเรื่องร้องทุกข์ ปชช.</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Megaphone className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Action 3: AI Assistant */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenAiAssistant();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold shadow-lg active:scale-95 transition cursor-pointer border border-cyan-400/40"
          >
            <span>ถามผู้ช่วย AI อบต.</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
          </button>

          {/* Action 4: Global Search */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenGlobalSearch();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-800 text-white text-xs font-bold shadow-lg active:scale-95 transition cursor-pointer border border-slate-700"
          >
            <span>ค้นหาข้อมูลทั้งระบบ</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform active:scale-95 cursor-pointer ${
          isOpen
            ? 'bg-rose-600 rotate-90 ring-4 ring-rose-200'
            : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 ring-4 ring-blue-200/50'
        }`}
        title="เมนูลัดใช้งานด่วน"
        aria-label="เมนูลัดใช้งานด่วน"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
};
