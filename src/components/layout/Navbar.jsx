// Top Navbar Component for SMARTORA
// Includes Multi-Tenant Organization Switcher, Global Search, Theme Switcher,
// Dynamic Role Badge, Quick Role Switcher (for Hackathon Live Evaluation), and Smart Alerts

import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  Sparkles,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Check,
  ArrowRight,
  Building2,
  Plus,
  Store,
  Utensils,
  Laptop,
  Stethoscope,
  GraduationCap,
  ShieldCheck,
  Globe,
  Briefcase,
  Users,
  UserCheck,
  Crown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../data/mockData';

export default function Navbar({
  onOpenMobile,
  onOpenSearch,
  onStartDemoTour,
  onNavigate,
  isSidebarCollapsed
}) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout, loginDemo } = useAuth();
  const { addToast } = useToast();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    organizations,
    currentOrganization,
    switchOrganization
  } = useData();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const orgRef = useRef(null);
  const roleRef = useRef(null);

  const unreadNotifications = notifications.filter(n => !n.read);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (orgRef.current && !orgRef.current.contains(e.target)) {
        setIsOrgDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getOrgIcon = (type) => {
    if (type?.includes('Restaurant')) return Utensils;
    if (type?.includes('Company') || type?.includes('Startup')) return Laptop;
    if (type?.includes('Clinic') || type?.includes('Health')) return Stethoscope;
    if (type?.includes('Education') || type?.includes('College')) return GraduationCap;
    return Store;
  };

  const OrgIcon = getOrgIcon(currentOrganization?.type);

  // Role Badge Styling and Title
  const getRoleMeta = (role) => {
    switch (role) {
      case ROLES.PLATFORM_OWNER:
        return {
          label: 'Platform Owner (HQ)',
          icon: Crown,
          badgeClass: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
        };
      case ROLES.DEPARTMENT_MANAGER:
        return {
          label: 'Dept Manager',
          icon: Briefcase,
          badgeClass: 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800'
        };
      case ROLES.STAFF:
        return {
          label: 'Staff Member',
          icon: Users,
          badgeClass: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
        };
      case ROLES.END_USER:
        return {
          label: 'Client Portal',
          icon: UserCheck,
          badgeClass: 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-800'
        };
      case ROLES.COMPANY_ADMIN:
      default:
        return {
          label: 'Company Admin',
          icon: Building2,
          badgeClass: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
        };
    }
  };

  const roleMeta = getRoleMeta(currentUser?.role);
  const CurrentRoleIcon = roleMeta.icon;

  // Quick Role Switching Handler
  const handleSwitchRole = (roleKey, targetPage) => {
    const user = loginDemo(roleKey);
    setIsRoleDropdownOpen(false);
    addToast('Role Switched', `Logged in as ${user.name} (${user.role}).`, 'success');
    onNavigate(targetPage);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4">
      
      {/* Left Area: Mobile Menu + Org Switcher + Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Multi-Tenant Organization Switcher */}
        <div className="relative" ref={orgRef}>
          <button
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-800 text-left transition-all"
            title="Switch Active Business Workspace"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <OrgIcon className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block leading-tight max-w-[150px] truncate">
              <span className="block text-xs font-extrabold text-slate-900 dark:text-white truncate">
                {currentOrganization?.name || 'SMARTORA Tech Solutions'}
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                {currentOrganization?.type || 'Technology Services'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Org Dropdown Menu */}
          {isOrgDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Business Workspace
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-tenant isolated business environments
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
                {organizations.map((org) => {
                  const Icon = getOrgIcon(org.type);
                  const isCurrent = org.id === currentOrganization?.id;

                  return (
                    <button
                      key={org.id}
                      onClick={() => {
                        switchOrganization(org.id);
                        setIsOrgDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {org.name}
                          </p>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {org.type} • {org.location?.city || 'India'}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <button
                  onClick={() => {
                    setIsOrgDropdownOpen(false);
                    onNavigate('register');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register New Business Org</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs sm:text-sm border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="truncate">Search products, invoices, customers...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Area: Role Badge + Quick Role Switcher + Tour + Theme + Alerts + Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        
        {/* Quick Role Switcher for Hackathon Evaluation */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${roleMeta.badgeClass}`}
            title="Switch Role to test 5-Tier RBAC & Tenant Data Isolation"
          >
            <CurrentRoleIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{roleMeta.label}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {/* Quick Role Dropdown */}
          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Quick Role Switcher (Hackathon Test)
                  </span>
                  <span className="text-[9px] bg-blue-100 dark:bg-blue-950 font-mono px-1.5 py-0.5 rounded text-blue-700 dark:text-blue-300 font-bold">
                    5 TIERS
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Instantly switch roles to verify strict multi-tenant isolation and RBAC.
                </p>
              </div>

              <div className="p-1.5 space-y-1">
                {/* 1. Platform Owner */}
                <button
                  onClick={() => handleSwitchRole('owner', 'platform-dashboard')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    currentUser?.role === ROLES.PLATFORM_OWNER
                      ? 'bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">1. Platform Owner</span>
                      <span className="text-[10px] text-slate-400 truncate block">Global SaaS HQ • Cross-tenant console</span>
                    </div>
                  </div>
                  {currentUser?.role === ROLES.PLATFORM_OWNER && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                </button>

                {/* 2A. Company Admin A */}
                <button
                  onClick={() => handleSwitchRole('admin_tech', 'dashboard')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    currentUser?.email === 'admin@techsolutions.demo'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">2A. Company Admin (Tech)</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate block">Company A • ₹5,00,000 Sales</span>
                    </div>
                  </div>
                  {currentUser?.email === 'admin@techsolutions.demo' && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>

                {/* 2B. Company Admin B */}
                <button
                  onClick={() => handleSwitchRole('admin_greenleaf', 'dashboard')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    currentUser?.email === 'admin@greenleaf.demo'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">2B. Company Admin (Cafe)</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate block">Company B • ₹2,50,000 Sales</span>
                    </div>
                  </div>
                  {currentUser?.email === 'admin@greenleaf.demo' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>

                {/* 3. Department Manager */}
                <button
                  onClick={() => handleSwitchRole('dept_manager', 'department-dashboard')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    currentUser?.role === ROLES.DEPARTMENT_MANAGER
                      ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">3. Department Manager</span>
                      <span className="text-[10px] text-slate-400 truncate block">Sales Dept • Scoped Access</span>
                    </div>
                  </div>
                  {currentUser?.role === ROLES.DEPARTMENT_MANAGER && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                </button>

                {/* 4. Staff */}
                <button
                  onClick={() => handleSwitchRole('staff', 'staff-dashboard')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    currentUser?.role === ROLES.STAFF
                      ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">4. Staff Workforce</span>
                      <span className="text-[10px] text-slate-400 truncate block">Shift clock-in & assigned tasks</span>
                    </div>
                  </div>
                  {currentUser?.role === ROLES.STAFF && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                </button>

                {/* 5. End User */}
                <button
                  onClick={() => handleSwitchRole('end_user', 'user-dashboard')}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    currentUser?.role === ROLES.END_USER
                      ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">5. Client / End User</span>
                      <span className="text-[10px] text-slate-400 truncate block">Self-service invoices & bookings</span>
                    </div>
                  </div>
                  {currentUser?.role === ROLES.END_USER && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hackathon Presentation Tour Button */}
        <button
          onClick={onStartDemoTour}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Demo Tour</span>
        </button>

        {/* Dark/Light Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Smart Alerts Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Flyout Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Smart Alerts</h4>
                  {unreadNotifications.length > 0 && (
                    <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
                      {unreadNotifications.length} new
                    </span>
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    onNavigate('notifications');
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Alerts</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="User profile menu"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <span className="hidden sm:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
              {currentUser?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Menu Flyout */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'Authenticated User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {currentUser?.email || 'user@smartora.io'}
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                  {currentUser?.role || 'Admin'}
                </span>
              </div>

              <div className="p-1.5 space-y-0.5 text-xs font-medium">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate('profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings & Security</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                    onNavigate('landing');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
