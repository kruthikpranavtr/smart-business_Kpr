// Sidebar Component for SMARTORA
// Dynamic Navigation Filtered by Current Organization's Enabled Modules & User's 5-Tier Role

import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Package,
  Factory,
  Layers,
  Calendar,
  Zap,
  CheckSquare,
  Clock,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  BarChart3,
  Bot,
  Bell,
  FileText,
  Settings,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Store,
  Utensils,
  Laptop,
  Stethoscope,
  Crown,
  Globe,
  LifeBuoy,
  ShieldCheck,
  BookOpen,
  Activity,
  BedDouble,
  Key,
  ConciergeBell
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';

export default function Sidebar({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) {
  const { stats, currentOrganization } = useData();
  const { currentUser } = useAuth();

  const userRole = currentUser?.role || ROLES.COMPANY_ADMIN;

  // Master definition of all nav items across business models
  const allNavItems = [
    // Core
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Core' },
    { id: 'ai-assistant', label: 'AI Business Copilot', icon: Bot, category: 'Core', badge: 'AI', badgeColor: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white' },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen, category: 'Core', badge: 'RAG', badgeColor: 'bg-indigo-600 text-white' },
    { id: 'agent-activity', label: 'Agent Activity', icon: Activity, category: 'Core', badge: 'Agent', badgeColor: 'bg-purple-600 text-white' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, category: 'Core' },

    // Operations & Revenue
    { id: 'sales', label: 'Sales & Orders', icon: TrendingUp, category: 'Revenue' },
    { id: 'invoices', label: 'Invoices & Billing', icon: Receipt, category: 'Revenue', badge: stats.pendingInvoicesTotal > 0 ? 'Due' : null, badgeColor: 'bg-amber-500 text-white' },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, category: 'Operations', badge: stats.lowStockCount ? `${stats.lowStockCount} Low` : null, badgeColor: 'bg-amber-500 text-white' },
    { id: 'suppliers', label: 'Suppliers & Vendors', icon: Factory, category: 'Operations' },
    { id: 'projects', label: 'Projects & Pipeline', icon: Layers, category: 'Operations' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, category: 'Operations', badge: stats.upcomingAppointmentsCount ? String(stats.upcomingAppointmentsCount) : null },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, category: 'Operations', badge: stats.pendingTasksLive ? String(stats.pendingTasksLive) : null },
    { id: 'automation', label: 'Smart Automation', icon: Zap, category: 'Operations', badge: 'Active', badgeColor: 'bg-emerald-500 text-white' },
    { id: 'attendance', label: 'Attendance', icon: Clock, category: 'Operations' },

    // Financials
    { id: 'finance', label: 'Finance', icon: Receipt, category: 'Financials' },
    { id: 'expenses', label: 'Expenses', icon: Receipt, category: 'Financials' },

    // People & CRM
    { id: 'customers', label: 'Customers & CRM', icon: Users, category: 'People' },
    { id: 'employees', label: 'Employees & Staff', icon: Briefcase, category: 'People' },
    { id: 'students', label: 'Students', icon: GraduationCap, category: 'People' },
    { id: 'departments', label: 'Departments', icon: Building2, category: 'People' },

    // System
    { id: 'notifications', label: 'Smart Alerts', icon: Bell, category: 'System', badge: stats.unreadAlertsLive > 0 ? String(stats.unreadAlertsLive) : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'reports', label: 'Reports', icon: FileText, category: 'System' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'System' },
    { id: 'profile', label: 'My Profile', icon: UserCheck, category: 'System' }
  ];

  // Role-Specific & Category-Aware Navigation Definitions
  const getNavItemsForRole = () => {
    // 1. Platform Owner
    if (userRole === ROLES.PLATFORM_OWNER) {
      return [
        { id: 'platform-dashboard', label: 'Platform Console', icon: Crown, badge: 'HQ', badgeColor: 'bg-purple-600 text-white' },
        { id: 'ai-assistant', label: 'AI Platform Copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white' },
        { id: 'agent-activity', label: 'Platform Agent Logs', icon: Activity, badge: 'Agent', badgeColor: 'bg-purple-600 text-white' },
        { id: 'settings', label: 'System Settings', icon: Settings },
        { id: 'profile', label: 'Owner Profile', icon: UserCheck }
      ];
    }

    const orgType = currentOrganization?.type || 'Company';
    const isCollege = orgType.includes('College') || orgType.includes('Education');
    const isHotel = orgType.includes('Hotel') || orgType.includes('Resort');

    // 2. COLLEGE PORTAL NAVIGATION
    if (isCollege) {
      if (userRole === 'HOD') {
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'HOD', badgeColor: 'bg-indigo-600 text-white' },
          { id: 'my-department', label: 'My Department', icon: Building2 },
          { id: 'employees', label: 'Faculty / Staff', icon: Briefcase },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'courses', label: 'Courses', icon: GraduationCap },
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'classes', label: 'Classes / Sections', icon: Layers },
          { id: 'attendance', label: 'Attendance', icon: Clock },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'assignments', label: 'Assignments', icon: FileText },
          { id: 'exams', label: 'Exams', icon: CheckSquare },
          { id: 'results', label: 'Results', icon: Award },
          { id: 'tasks', label: 'Department Tasks', icon: CheckSquare },
          { id: 'knowledge-base', label: 'Department Documents', icon: BookOpen, badge: 'Docs', badgeColor: 'bg-indigo-600 text-white' },
          { id: 'notices', label: 'Department Notices', icon: Bell },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'finance', label: 'Finance', icon: Receipt },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'AI', badgeColor: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white' },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      }

      if (userRole === 'FACULTY') {
        return [
          { id: 'dashboard', label: 'Faculty Console', icon: Briefcase, badge: 'Faculty', badgeColor: 'bg-blue-600 text-white' },
          { id: 'academic', label: 'Curriculum & Exams', icon: GraduationCap },
          { id: 'students', label: 'Enrolled Scholars', icon: Users },
          { id: 'attendance', label: 'Class Attendance', icon: Clock },
          { id: 'ai-assistant', label: 'AI Teaching Copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white' },
          { id: 'notifications', label: 'Campus Circulars', icon: Bell },
          { id: 'profile', label: 'My Profile', icon: UserCheck }
        ];
      }

      if (userRole === 'STUDENT' || userRole === ROLES.END_USER) {
        return [
          { id: 'dashboard', label: 'My Scholar Portal', icon: GraduationCap, badge: 'Scholar', badgeColor: 'bg-teal-600 text-white' },
          { id: 'academic', label: 'Exams & Grades', icon: BookOpen },
          { id: 'attendance', label: 'My Attendance', icon: Clock },
          { id: 'ai-assistant', label: 'AI Study Copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white' },
          { id: 'notifications', label: 'Hall Tickets & Notices', icon: Bell },
          { id: 'profile', label: 'My Profile', icon: UserCheck }
        ];
      }

      // College Principal / Admin
      return [
        { id: 'dashboard', label: 'Campus Directorate', icon: LayoutDashboard },
        { id: 'academic', label: 'Curriculum & Exams', icon: GraduationCap, badge: 'Academic', badgeColor: 'bg-blue-600 text-white' },
        { id: 'students', label: 'Enrolled Scholars', icon: Users },
        { id: 'employees', label: 'Faculty & Mentors', icon: Briefcase },
        { id: 'departments', label: 'Academic Departments', icon: Building2 },
        { id: 'attendance', label: 'Campus Attendance', icon: Clock },
        { id: 'finance', label: 'College Finance', icon: Receipt },
        { id: 'ai-assistant', label: 'AI Campus Copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white' },
        { id: 'knowledge-base', label: 'Institutional Docs', icon: BookOpen, badge: 'RAG', badgeColor: 'bg-indigo-600 text-white' },
        { id: 'agent-activity', label: 'Agent Automations', icon: Activity, badge: 'Agent', badgeColor: 'bg-purple-600 text-white' },
        { id: 'reports', label: 'Accreditation Reports', icon: FileText },
        { id: 'notifications', label: 'Campus Circulars', icon: Bell },
        { id: 'settings', label: 'Campus Settings', icon: Settings },
        { id: 'profile', label: 'Admin Profile', icon: UserCheck }
      ];
    }

    // 3. HOTEL / RESORT PORTAL NAVIGATION
    if (isHotel) {
      const deptLower = (currentUser?.department || '').toLowerCase();
      const desigLower = (currentUser?.designation || '').toLowerCase();

      if (userRole === ROLES.STAFF && (deptLower.includes('front desk') || desigLower.includes('front desk') || desigLower.includes('receptionist'))) {
        return [
          { id: 'front-desk', label: 'Front Desk Console', icon: ConciergeBell, badge: 'Desk', badgeColor: 'bg-sky-600 text-white' },
          { id: 'rooms', label: 'Rooms & Suites', icon: BedDouble },
          { id: 'housekeeping', label: 'Turnover Status', icon: Sparkles },
          { id: 'attendance', label: 'Shift Clock', icon: Clock },
          { id: 'ai-assistant', label: 'Concierge AI', icon: Bot, badge: 'AI', badgeColor: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white' },
          { id: 'notifications', label: 'Arrival Alerts', icon: Bell },
          { id: 'profile', label: 'My Profile', icon: UserCheck }
        ];
      }

      if (userRole === ROLES.STAFF && (deptLower.includes('housekeeping') || desigLower.includes('housekeeping'))) {
        return [
          { id: 'housekeeping', label: 'Housekeeping Grid', icon: Sparkles, badge: 'Clean', badgeColor: 'bg-amber-600 text-white' },
          { id: 'rooms', label: 'Room Matrix', icon: BedDouble },
          { id: 'attendance', label: 'Shift Clock', icon: Clock },
          { id: 'notifications', label: 'Turnover Alerts', icon: Bell },
          { id: 'profile', label: 'My Profile', icon: UserCheck }
        ];
      }

      if (userRole === ROLES.STAFF) {
        return [
          { id: 'staff-dashboard', label: 'Staff Console', icon: Briefcase, badge: 'Shift', badgeColor: 'bg-emerald-600 text-white' },
          { id: 'rooms', label: 'Rooms Matrix', icon: BedDouble },
          { id: 'attendance', label: 'Shift Clock', icon: Clock },
          { id: 'notifications', label: 'Alerts', icon: Bell },
          { id: 'profile', label: 'My Profile', icon: UserCheck }
        ];
      }

      if (userRole === ROLES.END_USER) {
        return [
          { id: 'user-dashboard', label: 'Guest Folio', icon: BedDouble, badge: 'Guest', badgeColor: 'bg-teal-600 text-white' },
          { id: 'notifications', label: 'Property Notices', icon: Bell },
          { id: 'profile', label: 'My Account', icon: Settings }
        ];
      }

      // Hotel Admin / General Manager
      return [
        { id: 'dashboard', label: 'Resort Overview', icon: LayoutDashboard },
        { id: 'rooms', label: 'Rooms & Suites', icon: BedDouble, badge: 'Rooms', badgeColor: 'bg-blue-600 text-white' },
        { id: 'front-desk', label: 'Front Desk Arrivals', icon: ConciergeBell },
        { id: 'housekeeping', label: 'Housekeeping Grid', icon: Sparkles },
        { id: 'employees', label: 'Staff & Associates', icon: Briefcase },
        { id: 'departments', label: 'Property Divisions', icon: Building2 },
        { id: 'expenses', label: 'Operating Expenses', icon: Receipt },
        { id: 'ai-assistant', label: 'Resort AI Copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white' },
        { id: 'knowledge-base', label: 'SOPs & Safety', icon: BookOpen, badge: 'RAG', badgeColor: 'bg-indigo-600 text-white' },
        { id: 'agent-activity', label: 'Guest Automations', icon: Activity, badge: 'Agent', badgeColor: 'bg-purple-600 text-white' },
        { id: 'reports', label: 'Occupancy Reports', icon: FileText },
        { id: 'notifications', label: 'Property Alerts', icon: Bell },
        { id: 'settings', label: 'Property Settings', icon: Settings },
        { id: 'profile', label: 'GM Profile', icon: UserCheck }
      ];
    }

    // 4. ENTERPRISE / COMPANY PORTAL NAVIGATION
    if (userRole === ROLES.DEPARTMENT_MANAGER) {
      return [
        { id: 'department-dashboard', label: 'Department Console', icon: Briefcase, badge: 'Lead', badgeColor: 'bg-sky-600 text-white' },
        { id: 'sales', label: 'Department Sales', icon: TrendingUp },
        { id: 'tasks', label: 'Team Tasks', icon: CheckSquare, badge: stats.pendingTasksLive ? String(stats.pendingTasksLive) : null },
        { id: 'analytics', label: 'Department Analytics', icon: BarChart3 },
        { id: 'ai-assistant', label: 'AI Business Copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white' },
        { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen, badge: 'RAG', badgeColor: 'bg-indigo-600 text-white' },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'My Profile', icon: UserCheck }
      ];
    }

    if (userRole === ROLES.STAFF) {
      return [
        { id: 'staff-dashboard', label: 'Staff Console', icon: Briefcase, badge: 'Shift', badgeColor: 'bg-emerald-600 text-white' },
        { id: 'tasks', label: 'My Work Tasks', icon: CheckSquare, badge: stats.pendingTasksLive ? String(stats.pendingTasksLive) : null },
        { id: 'knowledge-base', label: 'Org Knowledge Base', icon: BookOpen, badge: 'SOPs', badgeColor: 'bg-indigo-600 text-white' },
        { id: 'attendance', label: 'My Clock & Logs', icon: Clock },
        { id: 'notifications', label: 'Alerts', icon: Bell },
        { id: 'profile', label: 'My Profile', icon: UserCheck }
      ];
    }

    if (userRole === ROLES.END_USER) {
      return [
        { id: 'user-dashboard', label: 'My Client Portal', icon: UserCheck, badge: 'Client', badgeColor: 'bg-teal-600 text-white' },
        { id: 'notifications', label: 'Updates & Alerts', icon: Bell },
        { id: 'profile', label: 'Account Profile', icon: Settings }
      ];
    }

    // Default: Company Admin (Standard tenant module filter)
    const enabledSet = new Set(currentOrganization?.enabledModules || []);
    return allNavItems.filter(item => {
      if (
        item.id === 'dashboard' ||
        item.id === 'finance' ||
        item.id === 'notifications' ||
        item.id === 'settings' ||
        item.id === 'profile' ||
        item.id === 'ai-assistant' ||
        item.id === 'knowledge-base' ||
        item.id === 'agent-activity'
      ) {
        return true;
      }
      return enabledSet.has(item.id);
    });
  };

  const visibleNavItems = getNavItemsForRole();

  const handleItemClick = (pageId) => {
    onNavigate(pageId);
    if (onCloseMobile) onCloseMobile();
  };

  const getOrgIcon = (type) => {
    if (type?.includes('Restaurant')) return Utensils;
    if (type?.includes('Company') || type?.includes('Startup')) return Laptop;
    if (type?.includes('Clinic') || type?.includes('Health')) return Stethoscope;
    if (type?.includes('Education') || type?.includes('College')) return GraduationCap;
    return Store;
  };

  const OrgIcon = getOrgIcon(currentOrganization?.type);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div
            onClick={() => {
              if (userRole === ROLES.PLATFORM_OWNER) onNavigate('platform-dashboard');
              else if (userRole === ROLES.DEPARTMENT_MANAGER) onNavigate('department-dashboard');
              else if (userRole === ROLES.STAFF) onNavigate('staff-dashboard');
              else if (userRole === ROLES.END_USER) onNavigate('user-dashboard');
              else onNavigate('dashboard');
            }}
            className="flex items-center gap-3 cursor-pointer overflow-hidden select-none"
          >
            {/* Logo Mark */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            {!isCollapsed && (
              <div className="leading-tight truncate">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
                  SMARTORA
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                  Manage • Automate • Grow
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Organization / Scope Badge */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1">
            {userRole === ROLES.PLATFORM_OWNER ? (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    Platform Owner HQ
                  </p>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold truncate block">
                    Global Multi-Tenancy Root
                  </span>
                </div>
              </div>
            ) : userRole === ROLES.END_USER ? (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-900/50 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-teal-500/20">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    Client Portal
                  </p>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold truncate block">
                    {currentOrganization?.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-sky-50/50 dark:from-blue-950/40 dark:to-sky-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                  <OrgIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentOrganization?.name || 'SMARTORA Tech Solutions'}
                  </p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate block">
                    {currentOrganization?.type || 'Technology Services'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Links (Tailored by Role) */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 hover:text-blue-700 dark:hover:text-white'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 dark:text-slate-400'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        {!isCollapsed && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Tenant Isolated</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {userRole === ROLES.PLATFORM_OWNER ? 'Global Governance Mode' : `Scoped: ${currentOrganization?.id || 'org-001'}`}
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
