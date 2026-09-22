// Global Search Command Palette Component for SMARTORA
import React, { useState, useEffect, useMemo } from 'react';
import { Search, User, BookOpen, Briefcase, CheckSquare, Package, FileText, ArrowRight, X, Receipt, Truck, FolderKanban, GraduationCap, Calendar, Award, Bell } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const {
    currentOrganization,
    users = [],
    students = [],
    employees = [],
    tasks = [],
    products = [],
    invoices = [],
    suppliers = [],
    projects = [],
    courses = [],
    subjects = [],
    exams = [],
    notices = []
  } = useData();

  const isCollege = currentOrganization?.type?.toUpperCase().includes('COLLEGE') || currentOrganization?.type?.toUpperCase().includes('EDUCATION');

  // Handle keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Aggregate and search across all entities
  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        users: [], students: [], employees: [], tasks: [], products: [], invoices: [],
        suppliers: [], projects: [], reports: [], courses: [], subjects: [], exams: [], notices: []
      };
    }
    const q = query.toLowerCase().trim();

    const matchedUsers = (users || []).filter(u =>
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedStudents = (students || []).filter(s =>
      s.name?.toLowerCase().includes(q) || s.department?.toLowerCase().includes(q) || s.id?.toLowerCase().includes(q) || s.studentId?.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedEmployees = (employees || []).filter(e =>
      e.name?.toLowerCase().includes(q) || e.department?.toLowerCase().includes(q) || e.role?.toLowerCase().includes(q) || e.employeeId?.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedTasks = (tasks || []).filter(t =>
      t.title?.toLowerCase().includes(q) || t.assignedTo?.toLowerCase().includes(q)
    ).slice(0, 4);

    // College Specific Search
    const matchedCourses = isCollege ? (courses || []).filter(c =>
      c.name?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q)
    ).slice(0, 4) : [];

    const matchedSubjects = isCollege ? (subjects || []).filter(s =>
      s.name?.toLowerCase().includes(q) || s.subjectCode?.toLowerCase().includes(q) || s.faculty?.toLowerCase().includes(q)
    ).slice(0, 4) : [];

    const matchedExams = isCollege ? (exams || []).filter(e =>
      e.title?.toLowerCase().includes(q) || e.subjectCode?.toLowerCase().includes(q) || e.room?.toLowerCase().includes(q)
    ).slice(0, 4) : [];

    const matchedNotices = isCollege ? (notices || []).filter(n =>
      n.title?.toLowerCase().includes(q) || n.department?.toLowerCase().includes(q)
    ).slice(0, 3) : [];

    // Company Specific Search (Strictly zero matches if isCollege)
    const matchedProducts = !isCollege ? (products || []).filter(p =>
      p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    ).slice(0, 4) : [];

    const matchedInvoices = !isCollege ? (invoices || []).filter(inv =>
      inv.invoiceNumber?.toLowerCase().includes(q) || inv.customerName?.toLowerCase().includes(q)
    ).slice(0, 4) : [];

    const matchedSuppliers = !isCollege ? (suppliers || []).filter(s =>
      s.name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q)
    ).slice(0, 4) : [];

    const matchedProjects = !isCollege ? (projects || []).filter(pr =>
      pr.title?.toLowerCase().includes(q) || pr.client?.toLowerCase().includes(q)
    ).slice(0, 4) : [];

    const reportsList = isCollege ? [
      { id: 'rep-c1', name: 'Academic Attendance Compliance', category: 'Academic' },
      { id: 'rep-c2', name: 'Semester Examination & Grade Ledger', category: 'Examinations' },
      { id: 'rep-c3', name: 'Faculty Workload & Mentorship Roster', category: 'Faculty' }
    ] : [
      { id: 'rep-1', name: 'Monthly Business Report', category: 'Executive' },
      { id: 'rep-2', name: 'Tax Invoices & Billing Ledger', category: 'Finance' },
      { id: 'rep-3', name: 'Suppliers & Procurement Directory', category: 'Procurement' },
      { id: 'rep-4', name: 'Inventory Reorder & Valuation Report', category: 'Logistics' },
      { id: 'rep-5', name: 'Project Milestones & Delivery Tracker', category: 'Operations' }
    ];
    const matchedReports = reportsList.filter(r =>
      r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      users: matchedUsers,
      students: matchedStudents,
      employees: matchedEmployees,
      tasks: matchedTasks,
      products: matchedProducts,
      invoices: matchedInvoices,
      suppliers: matchedSuppliers,
      projects: matchedProjects,
      reports: matchedReports,
      courses: matchedCourses,
      subjects: matchedSubjects,
      exams: matchedExams,
      notices: matchedNotices
    };
  }, [query, users, students, employees, tasks, products, invoices, suppliers, projects, courses, subjects, exams, notices, isCollege]);

  const totalMatches =
    results.users.length +
    results.students.length +
    results.employees.length +
    results.tasks.length +
    results.products.length +
    results.invoices.length +
    results.suppliers.length +
    results.projects.length +
    results.reports.length +
    results.courses.length +
    results.subjects.length +
    results.exams.length +
    results.notices.length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative border-b border-slate-100 dark:border-slate-800 p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, students, tasks, products, reports (e.g. 'Rahul', 'Monitor')..."
            className="w-full text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded font-mono border border-slate-200 dark:border-slate-700">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm">Type a name, task, product or keyword to search across the entire organization.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Rahul', 'Sneha', 'Monitor', 'Audit', 'Attendance'].map(chip => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : totalMatches === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm">No results found for "{query}".</p>
            </div>
          ) : (
            <>
              {/* Users */}
              {results.users.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-500" /> Users ({results.users.length})
                  </div>
                  <div className="space-y-1">
                    {results.users.map(u => (
                      <div
                        key={u.id}
                        onClick={() => {
                          onNavigate('users');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {u.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{u.role} • {u.department}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Students */}
              {results.students.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-500" /> Students ({results.students.length})
                  </div>
                  <div className="space-y-1">
                    {results.students.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onNavigate('students');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {s.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{s.id} • {s.department} ({s.year})</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${s.attendance < 75 ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'}`}>
                            {s.attendance}% Att.
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Tasks ({results.tasks.length})
                  </div>
                  <div className="space-y-1">
                    {results.tasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onNavigate('tasks');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {t.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Assigned: {t.assignedTo} • Due: {t.deadline}</p>
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* College: Degree Courses */}
              {results.courses && results.courses.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" /> Degree Courses ({results.courses.length})
                  </div>
                  <div className="space-y-1">
                    {results.courses.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigate('courses');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{c.code} • {c.department}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* College: Curriculum Subjects */}
              {results.subjects && results.subjects.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-500" /> Subjects & Modules ({results.subjects.length})
                  </div>
                  <div className="space-y-1">
                    {results.subjects.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onNavigate('subjects');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {s.subjectCode} — {s.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{s.department} • Faculty: {s.faculty}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* College: Examinations */}
              {results.exams && results.exams.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" /> Examinations ({results.exams.length})
                  </div>
                  <div className="space-y-1">
                    {results.exams.map(e => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onNavigate('exams');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {e.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Hall: {e.room} • Date: {e.date}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* College: Academic Notices */}
              {results.notices && results.notices.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-purple-500" /> Academic Notices ({results.notices.length})
                  </div>
                  <div className="space-y-1">
                    {results.notices.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onNavigate('notices');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{n.department} • {n.date}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {results.products.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-500" /> Inventory ({results.products.length})
                  </div>
                  <div className="space-y-1">
                    {results.products.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigate('inventory');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {p.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{p.category} • ₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'Low Stock' || p.status === 'Out of Stock' ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          {p.stock} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {results.invoices.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-blue-500" /> Invoices ({results.invoices.length})
                  </div>
                  <div className="space-y-1">
                    {results.invoices.map(inv => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          onNavigate('invoices');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {inv.invoiceNumber} — {inv.customerName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">₹{(inv.totalAmount || 0).toLocaleString('en-IN')} • Due {inv.dueDate}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          inv.status === 'Paid' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' :
                          inv.status === 'Overdue' ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' :
                          'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suppliers */}
              {results.suppliers.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-indigo-500" /> Suppliers ({results.suppliers.length})
                  </div>
                  <div className="space-y-1">
                    {results.suppliers.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onNavigate('suppliers');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {s.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{s.category} • Lead Time: {s.leadTimeDays}d</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          ★ {s.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {results.projects.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-cyan-500" /> Projects ({results.projects.length})
                  </div>
                  <div className="space-y-1">
                    {results.projects.map(pr => (
                      <div
                        key={pr.id}
                        onClick={() => {
                          onNavigate('projects');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {pr.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Client: {pr.client} • {pr.progress}% done</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium">
                          {pr.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports */}
              {results.reports.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-500" /> Reports ({results.reports.length})
                  </div>
                  <div className="space-y-1">
                    {results.reports.map(r => (
                      <div
                        key={r.id}
                        onClick={() => {
                          onNavigate('reports');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {r.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{r.category} Analytics</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
