// Login Page for SMARTORA
// Universal Clean Login with User ID + Password Authentication and 1-Click Evaluation Chips for All Categories & Hierarchy Tiers

import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  Users,
  Briefcase,
  UserCheck,
  Globe,
  Utensils,
  GraduationCap,
  BedDouble,
  Key,
  BookOpen
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROLES } from '../data/mockData';

export default function Login({ onNavigate }) {
  const { login, loginDemo } = useAuth();
  const { addToast } = useToast();

  const [userId, setUserId] = useState('kruthikpranavtr');
  const [password, setPassword] = useState('admin');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [presetCategory, setPresetCategory] = useState('ALL');

  // Route user to the appropriate dashboard based on hierarchy tier and domain
  const routeByRole = (user) => {
    const deptLower = (user?.department || '').toLowerCase();
    const desigLower = (user?.designation || '').toLowerCase();
    const roleUpper = (user?.role || '').toUpperCase();

    // College specialized roles & Hotel specialized staff route directly to dynamic domain dashboard
    if (
      roleUpper === 'HOD' || 
      roleUpper === 'FACULTY' || 
      roleUpper === 'STUDENT' ||
      deptLower.includes('front desk') || 
      desigLower.includes('front desk') ||
      deptLower.includes('housekeeping') || 
      desigLower.includes('housekeeping')
    ) {
      onNavigate('dashboard');
      return;
    }

    switch (user?.role) {
      case ROLES.PLATFORM_OWNER:
        onNavigate('platform-dashboard');
        break;
      case ROLES.DEPARTMENT_MANAGER:
        onNavigate('department-dashboard');
        break;
      case ROLES.STAFF:
        onNavigate('staff-dashboard');
        break;
      case ROLES.END_USER:
        onNavigate('user-dashboard');
        break;
      case ROLES.COMPANY_ADMIN:
      default:
        onNavigate('dashboard');
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedId = userId.trim();
    const trimmedPw = password.trim();

    if (!trimmedId || !trimmedPw) {
      setError('Please enter both User ID and password.');
      addToast('Validation Error', 'Please enter your User ID and password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await login(trimmedId, trimmedPw, remember);
      setLoading(false);
      if (res.success && res.user) {
        addToast('Welcome Back!', `Signed in as ${res.user.name} (${res.user.role}).`, 'success');
        routeByRole(res.user);
      } else {
        setError(res.message || 'Invalid User ID or password.');
        addToast('Authentication Failed', res.message || 'Invalid credentials.', 'danger');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during authentication.');
      addToast('Error', 'Could not authenticate.', 'danger');
    }
  };

  const handleQuickDemo = (roleKey) => {
    const user = loginDemo(roleKey);
    addToast('Demo Session Initialized', `Authenticated as ${user.name} (${user.role}).`, 'success');
    routeByRole(user);
  };

  const PRESETS = [
    // Platform Owner
    {
      category: 'ALL',
      roleKey: 'owner',
      id: 'kruthikpranavtr',
      title: 'Platform Owner',
      subtitle: 'kruthikpranavtr • Global System',
      badge: 'Platform',
      icon: Globe,
      color: 'purple'
    },
    // Company Presets
    {
      category: 'COMPANY',
      roleKey: 'admin_tech',
      id: 'ADM-CMP-0001',
      title: 'Company Admin',
      subtitle: 'ADM-CMP-0001 • Tech Solutions',
      badge: 'Admin',
      icon: Building2,
      color: 'blue'
    },
    {
      category: 'COMPANY',
      roleKey: 'dept_manager',
      id: 'MGR-TECH-01',
      title: 'Dept Manager',
      subtitle: 'MGR-TECH-01 • Enterprise Sales',
      badge: 'Manager',
      icon: Briefcase,
      color: 'sky'
    },
    {
      category: 'COMPANY',
      roleKey: 'staff',
      id: 'STF-001',
      title: 'Staff Associate',
      subtitle: 'STF-001 • Shift Clock-In',
      badge: 'Staff',
      icon: Users,
      color: 'amber'
    },
    {
      category: 'COMPANY',
      roleKey: 'end_user',
      id: 'usr-client-001',
      title: 'Client / Customer',
      subtitle: 'usr-client-001 • Invoices & Portal',
      badge: 'Client',
      icon: UserCheck,
      color: 'teal'
    },
    // College Presets
    {
      category: 'COLLEGE',
      roleKey: 'college_admin',
      id: 'ADM-CMP-0003',
      title: 'College Principal',
      subtitle: 'ADM-CMP-0003 • BrightFuture College',
      badge: 'Principal',
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      category: 'COLLEGE',
      roleKey: 'college_hod',
      id: 'PRIYA-CS-001',
      title: 'Head of Dept (HOD)',
      subtitle: 'PRIYA-CS-001 • CS Department',
      badge: 'HOD',
      icon: BookOpen,
      color: 'purple'
    },
    {
      category: 'COLLEGE',
      roleKey: 'college_faculty',
      id: 'RAMESH-CS-001',
      title: 'Faculty Professor',
      subtitle: 'RAMESH-CS-001 • Gradebook',
      badge: 'Faculty',
      icon: Users,
      color: 'blue'
    },
    {
      category: 'COLLEGE',
      roleKey: 'college_student',
      id: 'ARUN-CS-2026-001',
      title: 'Student Scholar',
      subtitle: 'ARUN-CS-2026-001 • B.Tech CSE',
      badge: 'Student',
      icon: GraduationCap,
      color: 'emerald'
    },
    // Hotel / Resort Presets
    {
      category: 'HOTEL',
      roleKey: 'admin_greenleaf',
      id: 'ADM-CMP-0002',
      title: 'Resort General Manager',
      subtitle: 'ADM-CMP-0002 • Grand Mirage Resort',
      badge: 'GM',
      icon: Utensils,
      color: 'emerald'
    },
    {
      category: 'HOTEL',
      roleKey: 'hotel_frontdesk',
      id: 'ARUN-FRONTDESK-001',
      title: 'Front Desk Reception',
      subtitle: 'ARUN-FRONTDESK-001 • Check-In & Keys',
      badge: 'Reception',
      icon: BedDouble,
      color: 'rose'
    },
    {
      category: 'HOTEL',
      roleKey: 'hotel_housekeeping',
      id: 'PRIYA-HOUSEKEEPING-001',
      title: 'Housekeeping Supervisor',
      subtitle: 'PRIYA-HOUSEKEEPING-001 • Room Turnovers',
      badge: 'Housekeeping',
      icon: Key,
      color: 'amber'
    }
  ];

  const filteredPresets = PRESETS.filter(p => {
    if (presetCategory === 'ALL') return true;
    return p.category === presetCategory || p.category === 'ALL';
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-slate-50 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-xl">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2.5 cursor-pointer mb-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
              SMARTORA
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Sign In to Your Workspace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Universal AI-Powered SaaS & Multi-Category Portal Matrix
          </p>
        </div>

        {/* 1-Click Evaluation Presets with Category Filter Tabs */}
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              1-Click Evaluation Presets
            </span>
            <span className="text-[9px] bg-blue-200/70 dark:bg-blue-900 font-bold px-2 py-0.5 rounded-full text-blue-800 dark:text-blue-200">
              Instant Demo Access
            </span>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-blue-100 dark:border-slate-800 mb-3">
            {['ALL', 'COMPANY', 'COLLEGE', 'HOTEL'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setPresetCategory(cat)}
                className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all text-center ${
                  presetCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'All Roles' : cat === 'COMPANY' ? '🏢 Company' : cat === 'COLLEGE' ? '🎓 College' : '🏨 Hotel'}
              </button>
            ))}
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {filteredPresets.map(preset => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.id + preset.roleKey}
                  type="button"
                  onClick={() => {
                    setUserId(preset.id);
                    setPassword('admin');
                    handleQuickDemo(preset.roleKey);
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:border-blue-500 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700/60 hover:shadow-md transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-colors">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="block truncate font-bold text-slate-900 dark:text-white">{preset.title}</span>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1 rounded font-medium shrink-0">
                          {preset.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal truncate block">
                        {preset.subtitle}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/5">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                User ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter User ID (e.g. kruthikpranavtr, ADM-CMP-0001)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => addToast('Universal Demo Mode', 'Password for all demo accounts is "admin".', 'info')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Demo password: admin
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this workstation</span>
              </label>
              <button
                type="button"
                onClick={() => addToast('Credential Recovery', 'To reset your User ID password, please contact your Organization Administrator or Platform Support (support@smartora.com).', 'info')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Forgot Password / Contact Admin
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            <span>New business? </span>
            <button
              onClick={() => onNavigate('register')}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Register Organization Workspace
            </button>
          </div>
        </div>

        {/* Security Trust Note */}
        <div className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Strict 5-Tier RBAC & Multi-Tenant Logical Partitioning</span>
        </div>

      </div>
    </div>
  );
}
