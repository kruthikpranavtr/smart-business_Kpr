// Settings & Configuration Page for SMARTORA
import React, { useState } from 'react';
import {
  Settings,
  User,
  Building,
  Shield,
  Bell,
  Palette,
  Bot,
  Save,
  RefreshCw,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import Button from '../components/common/Button';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, resetDemoData } = useData();
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('organization');

  // Org Settings Form
  const [orgForm, setOrgForm] = useState({
    orgName: settings.orgName || 'Apex Institute of Technology & Management',
    orgType: settings.orgType || 'College',
    timezone: settings.timezone || 'Asia/Kolkata (IST)',
    currency: settings.currency || 'INR (₹)',
    attendanceThreshold: settings.attendanceThreshold || 75
  });

  // Notifications Form
  const [notifForm, setNotifForm] = useState(
    settings.notifications || {
      email: true,
      taskAlerts: true,
      inventoryAlerts: true,
      attendanceAlerts: true
    }
  );

  // Security Form
  const [securityForm, setSecurityForm] = useState({
    twoFactor: settings.security?.twoFactor || false,
    sessionTimeout: settings.security?.sessionTimeout || '60 minutes',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // AI Settings Form
  const [aiForm, setAiForm] = useState(
    settings.ai || {
      autoInsights: true,
      model: 'SMARTORA Heuristic Neural v2.5 (Fast Local)',
      confidenceThreshold: 85
    }
  );

  const handleSaveOrg = (e) => {
    e.preventDefault();
    updateSettings({
      ...orgForm,
      attendanceThreshold: Number(orgForm.attendanceThreshold)
    });
    addToast('Settings Saved', 'Organization parameters updated.', 'success');
  };

  const handleSaveNotif = (e) => {
    e.preventDefault();
    updateSettings({ notifications: notifForm });
    addToast('Preferences Saved', 'Alert channel settings updated.', 'success');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      addToast('Password Mismatch', 'New password and confirmation do not match.', 'danger');
      return;
    }
    updateSettings({
      security: {
        twoFactor: securityForm.twoFactor,
        sessionTimeout: securityForm.sessionTimeout
      }
    });
    addToast('Security Configured', 'Security policies applied successfully.', 'success');
  };

  const handleSaveAI = (e) => {
    e.preventDefault();
    updateSettings({ ai: aiForm });
    addToast('AI Configuration Saved', 'Telemetry parameters tuned.', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demonstration data back to fresh factory state?')) {
      resetDemoData();
      addToast('Demo Store Reset', 'All database tables restored to initial state.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            System Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure organization branding, security policies, AI telemetry sensitivity, and theme
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={handleResetData}
          className="text-xs font-semibold hover:border-rose-500 hover:text-rose-500"
        >
          Reset Demo Data
        </Button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Navigation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm space-y-1">
          {[
            { id: 'organization', label: 'Organization', icon: Building },
            { id: 'security', label: 'Security & 2FA', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
            { id: 'ai', label: 'AI Engine Settings', icon: Bot }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Configuration Form */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          {/* Organization Tab */}
          {activeTab === 'organization' && (
            <form onSubmit={handleSaveOrg} className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Organization Profile
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Organization Legal Name
                </label>
                <input
                  type="text"
                  value={orgForm.orgName}
                  onChange={(e) => setOrgForm({ ...orgForm, orgName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Institution / Entity Type
                  </label>
                  <select
                    value={orgForm.orgType}
                    onChange={(e) => setOrgForm({ ...orgForm, orgType: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="College">College</option>
                    <option value="School">School</option>
                    <option value="Business">Business Enterprise</option>
                    <option value="Training Institute">Training Institute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Mandatory Attendance Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="95"
                    value={orgForm.attendanceThreshold}
                    onChange={(e) => setOrgForm({ ...orgForm, attendanceThreshold: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit" variant="gradient" size="sm" icon={Save}>
                  Save Organization Settings
                </Button>
              </div>
            </form>
          )}

          {/* Security & 2FA Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Security & Authentication Policies
              </h3>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white block">
                    Two-Factor Authentication (2FA)
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Require authenticator passcode (TOTP) on administrative login
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityForm.twoFactor}
                    onChange={(e) => setSecurityForm({ ...securityForm, twoFactor: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Change Password
                </h4>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit" variant="gradient" size="sm" icon={Save}>
                  Update Security Policies
                </Button>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotif} className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Notification & Dispatch Channels
              </h3>

              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Send daily summary digest to organization admin' },
                  { key: 'attendanceAlerts', label: 'Attendance Threshold Alerts', desc: 'Trigger immediate notice when candidate drops below 75%' },
                  { key: 'inventoryAlerts', label: 'Inventory Reorder Alerts', desc: 'Notify logistics manager when stock reaches safety minimum' },
                  { key: 'taskAlerts', label: 'Task Milestone Alerts', desc: 'Escalate overdue tasks and scheduled deadlines' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifForm[item.key]}
                      onChange={(e) => setNotifForm({ ...notifForm, [item.key]: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit" variant="gradient" size="sm" icon={Save}>
                  Save Alert Channels
                </Button>
              </div>
            </form>
          )}

          {/* Appearance & Theme Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Appearance & Visual Theme
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your preferred UI presentation mode. Changes persist in local storage.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-blue-600 bg-blue-50/40 text-blue-900 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">Light Mode</span>
                      <span className="text-xs text-slate-500">Crisp, high-contrast daytime interface</span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">Dark Mode</span>
                      <span className="text-xs text-slate-400">Low eye-strain deep slate SaaS style</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Settings Tab */}
          {activeTab === 'ai' && (
            <form onSubmit={handleSaveAI} className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Autonomous AI & Reasoning Parameters
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Active Reasoning Model
                </label>
                <select
                  value={aiForm.model}
                  onChange={(e) => setAiForm({ ...aiForm, model: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="SMARTORA Heuristic Neural v2.5 (Fast Local)">SMARTORA Heuristic Neural v2.5 (Fast Local)</option>
                  <option value="Google Gemini 2.0 Flash (Endpoint Ready)">Google Gemini 2.0 Flash (Endpoint Ready)</option>
                  <option value="Anthropic Claude 3.5 Sonnet (Endpoint Ready)">Anthropic Claude 3.5 Sonnet (Endpoint Ready)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Confidence Threshold: {aiForm.confidenceThreshold}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={aiForm.confidenceThreshold}
                  onChange={(e) => setAiForm({ ...aiForm, confidenceThreshold: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white block">
                    Real-Time Anomaly Interception
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Automatically surface unusual spikes in expense vouchers and student absenteeism
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={aiForm.autoInsights}
                  onChange={(e) => setAiForm({ ...aiForm, autoInsights: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit" variant="gradient" size="sm" icon={Save}>
                  Save AI Settings
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
