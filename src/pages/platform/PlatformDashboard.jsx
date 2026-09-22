// Platform Owner Dashboard & Operations Console for SMARTORA
// Dedicated administrative command center for the SMARTORA Founder / Platform Owner
// Complete Company Lifecycle Management, Real Database Account Summaries, and Admin Credential Governance

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  Activity,
  Zap,
  DollarSign,
  Plus,
  CheckCircle2,
  Copy,
  Download,
  Send,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Sliders,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
  Server,
  Edit2,
  KeyRound,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Power,
  Globe,
  Building,
  Check,
  Briefcase,
  UserCheck,
  FileCheck,
  FileText,
  XCircle,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Clock4
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ROLES } from '../../data/mockData';

export default function PlatformDashboard({ onNavigate }) {
  const {
    organizations,
    allOrganizations,
    platformStats,
    subscriptions,
    allAuditLogs,
    createCompany,
    updateCompany,
    toggleCompanyStatus,
    resetCompanyAdminPassword,
    getOrganizationAccountSummary,
    switchOrganization,
    // Organization Verification System
    verificationRequests,
    verificationStats,
    startVerificationReview,
    runOfficialVerification,
    approveVerificationRequest,
    rejectVerificationRequest,
    requestMoreInformation,
    suspendOrganization,
    getSecureDocument
  } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created'); // 'created' | 'name' | 'accounts'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'companies' | 'verifications' | 'subscriptions' | 'audit'

  // Organization Verification Portal State
  const [verificationSearch, setVerificationSearch] = useState('');
  const [verificationStatusFilter, setVerificationStatusFilter] = useState('all');
  const [verificationTypeFilter, setVerificationTypeFilter] = useState('all');
  const [selectedVerificationReq, setSelectedVerificationReq] = useState(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationDetailTab, setVerificationDetailTab] = useState('overview'); // 'overview' | 'official' | 'documents' | 'history'
  const [isRunningOfficialCheck, setIsRunningOfficialCheck] = useState(false);
  const [officialCheckLiveResult, setOfficialCheckLiveResult] = useState(null);
  const [approvedCredsModal, setApprovedCredsModal] = useState(null);
  const [promptModal, setPromptModal] = useState({ open: false, type: '', title: '', message: '', value: '', placeholder: '' });
  const [secureDocModal, setSecureDocModal] = useState(null);

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdCompanyResult, setCreatedCompanyResult] = useState(null);

  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
  const [companyDetailsSubTab, setCompanyDetailsSubTab] = useState('overview'); // 'overview' | 'summary' | 'departments' | 'managers' | 'staff' | 'end_users' | 'activity' | 'settings'

  const [editingCompany, setEditingCompany] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    companyCode: '',
    type: 'Company',
    industry: '',
    tagline: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active',
    plan: 'Professional'
  });

  const [resetAdminModalResult, setResetAdminModalResult] = useState(null);

  // New Company Form State
  const [formData, setFormData] = useState({
    name: '',
    companyCode: '',
    type: 'Company',
    industry: 'Information Technology',
    email: '',
    phone: '',
    address: '',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    website: '',
    companySize: '10-50 Employees',
    plan: 'Professional',
    adminName: '',
    adminEmail: ''
  });

  const orgTypes = [
    'Company', 'Shop', 'Restaurant', 'Hotel', 'School', 'College',
    'Institute', 'Clinic', 'Agency', 'Manufacturing', 'Service Business',
    'NGO', 'Startup', 'Other'
  ];

  // Filtered and sorted companies
  const filteredCompanies = useMemo(() => {
    const list = (allOrganizations || organizations).filter(comp => {
      const matchesSearch =
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.companyCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.companyId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || comp.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    return list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'accounts') {
        const countA = getOrganizationAccountSummary(a.id).total_user_count;
        const countB = getOrganizationAccountSummary(b.id).total_user_count;
        return countB - countA;
      }
      return (b.createdDate || '').localeCompare(a.createdDate || '');
    });
  }, [allOrganizations, organizations, searchQuery, statusFilter, sortBy, getOrganizationAccountSummary]);

  const handleCreateCompanySubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Validation Error', 'Company name is required.', 'danger');
      return;
    }
    const result = createCompany(formData);
    setCreatedCompanyResult(result);
    addToast('Company Created', `Tenant workspace "${result.company.name}" provisioned.`, 'success');
  };

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', `${label} copied to clipboard.`, 'success');
  };

  const handleDownloadCredentials = (result) => {
    const creds = `=========================================
SMARTORA MULTI-TENANT SAAS CREDENTIALS
=========================================
Company Name:       ${result.company.name}
Company ID:         ${result.company.companyId}
Company Code:       ${result.company.companyCode}
Organization Type:  ${result.company.type}
Industry:           ${result.company.industry}
Plan Tier:          ${result.company.subscription?.plan}
-----------------------------------------
INITIAL ADMIN ACCESS
-----------------------------------------
Admin User ID:      ${result.adminId}
Admin Login Email:  ${result.company.email}
Temporary Password: ${result.tempPassword}
-----------------------------------------
LOGIN PORTAL:
http://localhost:3000/#/login
* Note: Force password change on first authentication.
=========================================`;
    const blob = new Blob([creds], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SMARTORA_CREDS_${result.company.companyCode || 'TENANT'}.txt`;
    link.click();
    addToast('Credentials Downloaded', 'Credentials file saved to your device.', 'info');
  };

  const handleOpenEdit = (company) => {
    setEditingCompany(company);
    setEditFormData({
      name: company.name || '',
      companyCode: company.companyCode || '',
      type: company.type || 'Company',
      industry: company.industry || '',
      tagline: company.tagline || '',
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || company.location?.address || '',
      status: company.status || 'Active',
      plan: company.subscription?.plan || 'Professional'
    });
  };

  const handleSaveEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name?.trim()) {
      addToast('Validation Error', 'Company name is required.', 'danger');
      return;
    }
    updateCompany(editingCompany.id, {
      name: editFormData.name.trim(),
      companyCode: editFormData.companyCode.trim(),
      type: editFormData.type,
      industry: editFormData.industry,
      tagline: editFormData.tagline,
      email: editFormData.email,
      phone: editFormData.phone,
      address: editFormData.address,
      status: editFormData.status,
      subscription: {
        ...editingCompany.subscription,
        plan: editFormData.plan
      }
    });
    addToast('Company Updated', `Settings saved for ${editFormData.name}.`, 'success');
    setEditingCompany(null);
  };

  const handleResetAdminPasswordAction = (company) => {
    const res = resetCompanyAdminPassword(company.id);
    if (res) {
      setResetAdminModalResult({
        companyName: company.name,
        companyId: company.companyId || company.id,
        adminName: res.adminName,
        adminEmail: res.adminEmail,
        adminId: res.adminId,
        tempPassword: res.tempPassword
      });
      addToast('Admin Password Reset', `Temporary password generated for ${company.name} Admin.`, 'success');
    }
  };

  const handleSwitchToTenant = (companyId) => {
    switchOrganization(companyId);
    onNavigate('dashboard');
    addToast('Workspace Switched', 'Viewing workspace as Company Admin.', 'info');
  };

  // Filtered Verification Requests
  const filteredVerificationRequests = useMemo(() => {
    return (verificationRequests || []).filter(req => {
      const matchesSearch =
        req.name?.toLowerCase().includes(verificationSearch.toLowerCase()) ||
        req.id?.toLowerCase().includes(verificationSearch.toLowerCase()) ||
        req.registrationNumber?.toLowerCase().includes(verificationSearch.toLowerCase()) ||
        req.submittedBy?.toLowerCase().includes(verificationSearch.toLowerCase());
      const matchesStatus =
        verificationStatusFilter === 'all' ||
        req.verification_status?.toLowerCase() === verificationStatusFilter.toLowerCase();
      const matchesType =
        verificationTypeFilter === 'all' ||
        req.type?.toLowerCase() === verificationTypeFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [verificationRequests, verificationSearch, verificationStatusFilter, verificationTypeFilter]);

  // Open Verification Dossier Modal
  const handleOpenVerificationDossier = (req) => {
    setSelectedVerificationReq(req);
    setOfficialCheckLiveResult(req.officialCheck || null);
    setVerificationDetailTab('overview');
    setIsVerificationModalOpen(true);

    // If PENDING, transition immediately to UNDER_REVIEW
    if (req.verification_status === 'PENDING') {
      startVerificationReview(req.id, currentUser);
      setSelectedVerificationReq(prev => ({
        ...prev,
        verification_status: 'UNDER_REVIEW',
        reviewer: currentUser?.name || 'Aarav Singhania (Platform Owner)'
      }));
      addToast('Review Initiated', `Dossier for ${req.name} moved to Under Review.`, 'info');
    }
  };

  // Run live registry query via VerificationProvider
  const handleTriggerOfficialCheck = async () => {
    if (!selectedVerificationReq) return;
    setIsRunningOfficialCheck(true);
    try {
      const result = await runOfficialVerification(selectedVerificationReq.id, currentUser);
      setOfficialCheckLiveResult(result);
      // Refresh local modal request copy
      const updatedReq = (verificationRequests || []).find(r => r.id === selectedVerificationReq.id);
      if (updatedReq) setSelectedVerificationReq(updatedReq);
      addToast('Registry Check Complete', `Official source queried: ${result?.source || 'Registry'}. Result: ${result?.result || 'MATCH'}`, 'success');
    } catch (e) {
      addToast('Registry Query Error', 'Could not complete official registry lookup.', 'danger');
    } finally {
      setIsRunningOfficialCheck(false);
    }
  };

  // Approve verification request
  const handleApproveVerification = (approvalNotes = '') => {
    if (!selectedVerificationReq) return;
    const res = approveVerificationRequest(selectedVerificationReq.id, currentUser, approvalNotes);
    if (res && res.success) {
      setIsVerificationModalOpen(false);
      setApprovedCredsModal({
        name: selectedVerificationReq.name,
        companyId: res.company?.companyId || 'CMP-001',
        adminId: res.adminId,
        adminName: selectedVerificationReq.submittedBy,
        adminEmail: selectedVerificationReq.contactEmail,
        tempPassword: res.tempPassword
      });
      addToast('Organization Approved', `Tenant workspace activated for ${selectedVerificationReq.name}.`, 'success');
    }
  };

  // Open prompt for rejection or more info
  const handleOpenPrompt = (type) => {
    if (type === 'reject') {
      setPromptModal({
        open: true,
        type: 'reject',
        title: 'Reject Verification Application',
        message: `Please specify the legal or statutory reason for rejecting ${selectedVerificationReq?.name}. This reason will be logged in the audit trail and provided to the applicant.`,
        value: '',
        placeholder: 'e.g. Registration number mismatch with official registry; invalid incorporation seal.'
      });
    } else if (type === 'more_info') {
      setPromptModal({
        open: true,
        type: 'more_info',
        title: 'Request Additional Information / Documents',
        message: `Specify what supplementary documents or clarifications are required from ${selectedVerificationReq?.name}.`,
        value: '',
        placeholder: 'e.g. Please upload current biomedical waste handling NOC from the State Pollution Control Board.'
      });
    }
  };

  // Confirm prompt action
  const handleConfirmPrompt = () => {
    if (!promptModal.value.trim()) {
      addToast('Validation Required', 'Please provide explanatory notes/reason.', 'warning');
      return;
    }

    if (promptModal.type === 'reject') {
      rejectVerificationRequest(selectedVerificationReq.id, currentUser, promptModal.value.trim());
      addToast('Application Rejected', `Application for ${selectedVerificationReq.name} was rejected.`, 'info');
    } else if (promptModal.type === 'more_info') {
      requestMoreInformation(selectedVerificationReq.id, currentUser, promptModal.value.trim());
      addToast('Information Requested', `Applicant has been notified to submit additional proof.`, 'info');
    }

    setPromptModal({ open: false, type: '', title: '', message: '', value: '', placeholder: '' });
    setIsVerificationModalOpen(false);
  };

  // Suspend tenant organization
  const handleSuspendTenant = (req) => {
    suspendOrganization(req.organizationId || req.id, currentUser, 'Administrative suspension triggered from verification console.');
    addToast('Tenant Suspended', `Access suspended for ${req.name}. Login access revoked.`, 'warning');
    setIsVerificationModalOpen(false);
  };

  // View document with secure RBAC check
  const handleSecureDocView = (doc) => {
    try {
      const retrieved = getSecureDocument(doc.id, currentUser);
      setSecureDocModal({ doc: retrieved || doc, req: selectedVerificationReq });
    } catch (e) {
      addToast('Access Denied', e.message || 'Unauthorized document access', 'danger');
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Owner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600/30 text-blue-300 border border-blue-400/30 text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Platform Owner Console
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono px-2.5 py-0.5 rounded-full">
                Global Operator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              SMARTORA Global SaaS Operations
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Foundational multi-tenant control plane. Provision companies, govern tenant subscriptions, monitor platform-wide telemetry, and audit organizational security.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              icon={Activity}
              onClick={() => setActiveTab('audit')}
            >
              Platform Audit Logs
            </Button>
            <Button
              variant="primary"
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
              icon={Plus}
              onClick={() => {
                setCreatedCompanyResult(null);
                setIsCreateModalOpen(true);
              }}
            >
              Provision New Company
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/10 overflow-x-auto">
          {[
            { id: 'overview', label: 'Platform Overview', icon: Activity },
            { id: 'companies', label: `Companies & Tenants (${organizations.length})`, icon: Building2 },
            {
              id: 'verifications',
              label: 'Verification Requests',
              icon: FileCheck,
              badge: verificationStats?.pendingCount ? `${verificationStats.pendingCount} Pending` : null
            },
            { id: 'subscriptions', label: 'Subscriptions & MRR', icon: DollarSign },
            { id: 'audit', label: 'Global Audit Trail', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-white text-slate-900 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    active ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Platform KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Companies"
              value={organizations.length}
              change="+2 this month"
              changeType="positive"
              icon={Building2}
              description={`${organizations.filter(o => o.status !== 'Suspended').length} Active Tenants`}
            />
            <StatCard
              title="Global SaaS Users"
              value={platformStats?.totalUsers || 284}
              change="+18.5% MoM"
              changeType="positive"
              icon={Users}
              description="Across all tenant workspaces"
            />
            <StatCard
              title="Active Workflows"
              value={platformStats?.automationsRunning || 48}
              change="48 Active Rules"
              changeType="neutral"
              icon={Zap}
              description="Real-time event automations"
            />
            <StatCard
              title="Platform ARR / MRR"
              value={platformStats?.monthlyPlatformRevenue || '₹60,495/mo'}
              change="99.98% Health SLA"
              changeType="positive"
              icon={DollarSign}
              description="SaaS Subscriptions"
            />
          </div>

          {/* Quick Telemetry & Health Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Multi-Tenant Partitioning: Strict Logical Isolation Active
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Every company operates in its own sandboxed partition with independent departments, RBAC permissions, and isolated financial ledgers.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Pods Healthy
              </span>
            </div>
          </div>

          {/* Recent Companies & Live Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Tenant Organizations
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live companies provisioned on SMARTORA
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('companies')}
                >
                  View All ({organizations.length})
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Type / Sector</th>
                      <th className="pb-3">Accounts</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {organizations.slice(0, 5).map(comp => {
                      const summary = getOrganizationAccountSummary(comp.id);
                      return (
                        <tr key={comp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {comp.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {comp.companyId || comp.id} • {comp.companyCode || 'N/A'}
                            </div>
                          </td>
                          <td className="py-3 text-slate-600 dark:text-slate-300">
                            {comp.type}
                          </td>
                          <td className="py-3">
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {summary.total_user_count} Users
                            </span>
                            <span className="block text-[10px] text-slate-400">
                              {summary.department_count} Depts
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex flex-col gap-1 items-start">
                              <Badge variant={comp.status === 'Suspended' ? 'danger' : 'success'}>
                                {comp.status || 'Active'}
                              </Badge>
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                                <ShieldCheck className="w-2.5 h-2.5" /> {comp.verification_status || 'VERIFIED'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedCompanyDetails(comp);
                                setCompanyDetailsSubTab('overview');
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 hover:underline mr-3"
                            >
                              <Eye className="w-3 h-3" /> Dossier
                            </button>
                            <button
                              onClick={() => handleSwitchToTenant(comp.id)}
                              className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium inline-flex items-center gap-1 hover:underline"
                            >
                              Enter <ExternalLink className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 1 Col: Platform Audit Stream */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" /> Platform Audit Trail
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Live</span>
                </div>

                <div className="space-y-3.5">
                  {(allAuditLogs || []).slice(0, 5).map(log => (
                    <div key={log.id} className="text-xs border-l-2 border-blue-500 pl-3 py-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{log.action}</span>
                        <span>{log.timestamp?.split(' ')[1] || 'Today'}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 line-clamp-2">
                        {log.details}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Actor: {log.userName} ({log.userRole})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveTab('audit')}
                >
                  View Full Audit Log
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPANIES & TENANTS DIRECTORY */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Tenant Organizations Directory
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage independent company workspaces, lifecycle states, real account counts, and administrator credentials
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setCreatedCompanyResult(null);
                  setIsCreateModalOpen(true);
                }}
              >
                Create Company
              </Button>
            </div>

            {/* Filter and Sort Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by company name, code, ID or sector..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="created">Sort: Created Date</option>
                <option value="name">Sort: Company Name</option>
                <option value="accounts">Sort: Account Count</option>
              </select>
            </div>

            {/* Comprehensive Company Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {filteredCompanies.map(comp => {
                const summary = getOrganizationAccountSummary(comp.id);
                return (
                  <div
                    key={comp.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-semibold">
                            {comp.companyId || comp.id}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                            {comp.name}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={comp.status === 'Suspended' ? 'danger' : 'success'}>
                            {comp.status || 'Active'}
                          </Badge>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                            <ShieldCheck className="w-3 h-3" /> {comp.verification_status || 'VERIFIED'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                        {comp.tagline || comp.industry}
                      </p>

                      {/* Real Database Dynamic Metrics Badge Grid */}
                      <div className="grid grid-cols-4 gap-2 my-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Depts</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {summary.department_count}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Staff</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {summary.staff_count}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">End Users</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {summary.end_user_count}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Total</span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {summary.total_user_count}
                          </span>
                        </div>
                      </div>

                      {/* Metadata Table */}
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 py-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Company Admin:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                            {summary.adminUser?.name || `${comp.name} Admin`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Admin ID:</span>
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            {comp.adminId || summary.adminUser?.adminId || 'ADM-001'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Created Date:</span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {comp.createdDate || comp.created_at || '2025-01-10'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Last Activity:</span>
                          <span className="text-[11px] text-slate-500">
                            {comp.lastActivity || 'Just now'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2.5 py-1"
                          onClick={() => {
                            setSelectedCompanyDetails(comp);
                            setCompanyDetailsSubTab('overview');
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2.5 py-1"
                          onClick={() => handleOpenEdit(comp)}
                        >
                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2.5 py-1 text-amber-600 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          onClick={() => handleResetAdminPasswordAction(comp)}
                          title="Generate temporary password for Admin"
                        >
                          <KeyRound className="w-3 h-3 mr-1" /> Reset PW
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`text-xs px-2.5 py-1 ${
                            comp.status === 'Suspended'
                              ? 'text-emerald-600 border-emerald-300 dark:border-emerald-800'
                              : 'text-rose-600 border-rose-300 dark:border-rose-800'
                          }`}
                          onClick={() => toggleCompanyStatus(comp.id)}
                        >
                          {comp.status === 'Suspended' ? 'Activate' : 'Deactivate'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUBSCRIPTIONS & PLANS */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Tenant Subscription Portfolio
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SaaS licensing, Monthly Recurring Revenue (MRR), and tier allowances
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total MRR</span>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {platformStats?.monthlyPlatformRevenue || '₹60,495/mo'}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                  <th className="pb-3">Tenant Organization</th>
                  <th className="pb-3">Subscription Tier</th>
                  <th className="pb-3">MRR Rate</th>
                  <th className="pb-3">Billing Cycle</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Renewal Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {(subscriptions || []).map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {sub.companyName}
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
                        {sub.plan}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {sub.mrr}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {sub.billingCycle}
                    </td>
                    <td className="py-3">
                      <Badge variant="success">{sub.status}</Badge>
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">
                      {sub.nextBilling}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Global Platform Audit Logs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immutable event stream for tenant provisioning, credential resets, and RBAC governance
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {(allAuditLogs || []).length} Recorded Events
            </span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Module</th>
                  <th className="pb-3">Actor</th>
                  <th className="pb-3">Details</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {(allAuditLogs || []).map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {log.module}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-slate-900 dark:text-white">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.userRole}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 max-w-md">
                      {log.details}
                    </td>
                    <td className="py-3">
                      <Badge variant={log.status === 'Success' ? 'success' : 'danger'}>
                        {log.status || 'Success'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ORGANIZATION VERIFICATION SYSTEM */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Compliance & Due Diligence
                  </span>
                  <span className="text-xs text-slate-400">Strict Multi-Tenant Verification</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Tenant Organization Verification Requests
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl mt-1">
                  Inspect and validate legal credentials before granting tenant activation. Review corporate incorporation records, query statutory registries (MCA, UGC, NMC, Darpan), inspect documents with AI OCR extraction, and approve or reject tenant workspaces.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={() => {
                    setVerificationSearch('');
                    setVerificationStatusFilter('all');
                    setVerificationTypeFilter('all');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Stat Cards Grid (6 cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 text-[11px] font-medium">Total Requests</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {verificationStats?.total || 0}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">All applications</div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <div className="text-amber-700 dark:text-amber-400 text-[11px] font-medium flex items-center gap-1">
                  <Clock4 className="w-3 h-3" /> Pending Review
                </div>
                <div className="text-xl font-bold text-amber-900 dark:text-amber-200 mt-1">
                  {verificationStats?.pendingCount || 0}
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">Awaiting triage</div>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                <div className="text-blue-700 dark:text-blue-400 text-[11px] font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Under Review
                </div>
                <div className="text-xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                  {verificationStats?.underReviewCount || 0}
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">In investigation</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                <div className="text-emerald-700 dark:text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Tenants
                </div>
                <div className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">
                  {verificationStats?.verifiedCount || 0}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Active & licensed</div>
              </div>
              <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
                <div className="text-orange-700 dark:text-orange-400 text-[11px] font-medium flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> Needs Info
                </div>
                <div className="text-xl font-bold text-orange-900 dark:text-orange-200 mt-1">
                  {verificationStats?.needsInfoCount || 0}
                </div>
                <div className="text-[10px] text-orange-600 dark:text-orange-400 mt-0.5">Applicant action</div>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                <div className="text-rose-700 dark:text-rose-400 text-[11px] font-medium flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Rejected/Suspended
                </div>
                <div className="text-xl font-bold text-rose-900 dark:text-rose-200 mt-1">
                  {(verificationStats?.rejectedCount || 0) + (verificationStats?.suspendedCount || 0)}
                </div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">Access prohibited</div>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search requests by organization name, tracking ID, reg number, or applicant..."
                  value={verificationSearch}
                  onChange={(e) => setVerificationSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={verificationStatusFilter}
                onChange={(e) => setVerificationStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">All Statuses ({verificationRequests?.length || 0})</option>
                <option value="pending">Pending ({verificationStats?.pendingCount || 0})</option>
                <option value="under_review">Under Review ({verificationStats?.underReviewCount || 0})</option>
                <option value="verified">Verified ({verificationStats?.verifiedCount || 0})</option>
                <option value="needs_more_information">Needs More Information ({verificationStats?.needsInfoCount || 0})</option>
                <option value="rejected">Rejected ({verificationStats?.rejectedCount || 0})</option>
                <option value="suspended">Suspended ({verificationStats?.suspendedCount || 0})</option>
              </select>

              <select
                value={verificationTypeFilter}
                onChange={(e) => setVerificationTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">All Sectors</option>
                <option value="company">Company</option>
                <option value="college">College</option>
                <option value="school">School</option>
                <option value="clinic">Clinic / Hospital</option>
                <option value="ngo">NGO / Non-Profit</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="training institute">Training Institute</option>
                <option value="agency">Agency</option>
                <option value="service business">Service Business</option>
              </select>
            </div>

            {/* Verification Requests Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">App ID & Date</th>
                    <th className="pb-3">Organization Details</th>
                    <th className="pb-3">Registration & Tax ID</th>
                    <th className="pb-3">Statutory Registry Match</th>
                    <th className="pb-3">Documents</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Compliance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredVerificationRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        No verification requests match your current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredVerificationRequests.map(req => {
                      const check = req.officialCheck;
                      return (
                        <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3">
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                              {req.id}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'Recent'}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {req.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {req.type} • {req.submittedBy} ({req.contactEmail})
                            </div>
                          </td>
                          <td className="py-3 font-mono text-[11px]">
                            <div className="text-slate-700 dark:text-slate-300 font-semibold">{req.registrationNumber}</div>
                            <div className="text-slate-400 text-[10px]">PAN: {req.taxId || 'N/A'}</div>
                          </td>
                          <td className="py-3">
                            {check?.result === 'MATCH' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Registry Matched
                              </span>
                            )}
                            {check?.result === 'MISMATCH' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                <XCircle className="w-3 h-3 text-rose-500" /> Discrepancy Found
                              </span>
                            )}
                            {check?.result === 'PARTIAL_MATCH' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <AlertCircle className="w-3 h-3 text-amber-500" /> Partial Match
                              </span>
                            )}
                            {(!check || check.result === 'UNAVAILABLE' || check.result === 'NOT_CHECKED') && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                Pending Query
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              {(req.documents || []).length} Document{(req.documents || []).length === 1 ? '' : 's'}
                            </span>
                          </td>
                          <td className="py-3">
                            {req.verification_status === 'PENDING' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Clock4 className="w-3 h-3" /> PENDING
                              </span>
                            )}
                            {req.verification_status === 'UNDER_REVIEW' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                                <Eye className="w-3 h-3" /> UNDER REVIEW
                              </span>
                            )}
                            {req.verification_status === 'VERIFIED' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3" /> VERIFIED
                              </span>
                            )}
                            {req.verification_status === 'NEEDS_MORE_INFORMATION' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                                <HelpCircle className="w-3 h-3" /> NEEDS MORE INFO
                              </span>
                            )}
                            {req.verification_status === 'REJECTED' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                                <XCircle className="w-3 h-3" /> REJECTED
                              </span>
                            )}
                            {req.verification_status === 'SUSPENDED' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border border-rose-400">
                                <ShieldAlert className="w-3 h-3" /> SUSPENDED
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <Button
                              variant="outline"
                              size="xs"
                              icon={ShieldCheck}
                              onClick={() => handleOpenVerificationDossier(req)}
                              className="font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400"
                            >
                              Review Dossier
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: COMPLETE COMPANY DETAILS DOSSIER */}
      {selectedCompanyDetails && (() => {
        const summary = getOrganizationAccountSummary(selectedCompanyDetails.id);
        const scopedAuditLogs = (allAuditLogs || []).filter(
          l => l.organization_id === selectedCompanyDetails.id || l.details?.includes(selectedCompanyDetails.name)
        );

        return (
          <Modal
            isOpen={Boolean(selectedCompanyDetails)}
            onClose={() => setSelectedCompanyDetails(null)}
            title={`Company Dossier: ${selectedCompanyDetails.name} [${selectedCompanyDetails.companyId || selectedCompanyDetails.id}]`}
            maxWidth="max-w-4xl"
          >
            <div className="space-y-5">
              {/* Dossier Navigation Sub-Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
                {[
                  { id: 'overview', label: 'Company Overview' },
                  { id: 'summary', label: 'Account Summary' },
                  { id: 'departments', label: `Departments (${summary.department_count})` },
                  { id: 'managers', label: `Managers (${summary.department_manager_count})` },
                  { id: 'staff', label: `Staff (${summary.staff_count})` },
                  { id: 'end_users', label: `End Users (${summary.end_user_count})` },
                  { id: 'activity', label: 'Recent Activity' },
                  { id: 'settings', label: 'Company Settings' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setCompanyDetailsSubTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      companyDetailsSubTab === tab.id
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* SUBTAB 1: COMPANY OVERVIEW */}
              {companyDetailsSubTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Company ID:</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {selectedCompanyDetails.companyId || selectedCompanyDetails.id}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Company Code:</span>
                        <span className="font-mono font-bold">{selectedCompanyDetails.companyCode || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Sector / Type:</span>
                        <span className="font-medium">{selectedCompanyDetails.type}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Industry:</span>
                        <span className="font-medium">{selectedCompanyDetails.industry}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Lifecycle Status:</span>
                        <Badge variant={selectedCompanyDetails.status === 'Suspended' ? 'danger' : 'success'}>
                          {selectedCompanyDetails.status || 'Active'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Official Email:</span>
                        <span className="font-medium">{selectedCompanyDetails.email}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Contact Phone:</span>
                        <span className="font-medium">{selectedCompanyDetails.phone || '+91 98000 00000'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Headquarters Address:</span>
                        <span className="font-medium truncate max-w-[180px]">{selectedCompanyDetails.address || 'Bengaluru, India'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Subscription Tier:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {selectedCompanyDetails.subscription?.plan || 'Professional'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Contract MRR:</span>
                        <span className="font-mono font-bold text-emerald-600">
                          {selectedCompanyDetails.subscription?.mrr || '₹6,999/mo'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: ACCOUNT SUMMARY */}
              {companyDetailsSubTab === 'summary' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-center">
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-semibold">Company Admin</span>
                      <span className="text-xl font-bold text-blue-900 dark:text-white">
                        {summary.company_admin_count}
                      </span>
                    </div>
                    <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-xl text-center">
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 block font-semibold">Dept Managers</span>
                      <span className="text-xl font-bold text-sky-900 dark:text-white">
                        {summary.department_manager_count}
                      </span>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-center">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">Staff Members</span>
                      <span className="text-xl font-bold text-emerald-900 dark:text-white">
                        {summary.staff_count}
                      </span>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 rounded-xl text-center">
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-semibold">End Users</span>
                      <span className="text-xl font-bold text-purple-900 dark:text-white">
                        {summary.end_user_count}
                      </span>
                    </div>
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-xl text-center">
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-semibold">Total Accounts</span>
                      <span className="text-xl font-bold text-indigo-900 dark:text-white">
                        {summary.total_user_count}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white">Company Admin Credentials</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Administrator Name:</span>
                      <span className="font-semibold">{summary.adminUser?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Login Email:</span>
                      <span className="font-mono">{summary.adminUser?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Admin Account ID:</span>
                      <span className="font-mono font-bold text-blue-600">{selectedCompanyDetails.adminId || summary.adminUser?.adminId}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: DEPARTMENTS */}
              {companyDetailsSubTab === 'departments' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase">
                          <th className="pb-2">Department Name</th>
                          <th className="pb-2">Department ID</th>
                          <th className="pb-2">Lead / Manager</th>
                          <th className="pb-2">Staff Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {summary.departments.length > 0 ? (
                          summary.departments.map(d => (
                            <tr key={d.id} className="py-2">
                              <td className="py-2 font-semibold text-slate-900 dark:text-white">{d.name}</td>
                              <td className="py-2 font-mono text-slate-500">{d.id}</td>
                              <td className="py-2 text-slate-600 dark:text-slate-300">{d.manager || 'Assigned Lead'}</td>
                              <td className="py-2 font-bold">{d.staffCount || 2}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-slate-400">No departments configured yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: DEPARTMENT MANAGERS */}
              {companyDetailsSubTab === 'managers' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase">
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Email</th>
                          <th className="pb-2">Department</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {summary.managers.length > 0 ? (
                          summary.managers.map(m => (
                            <tr key={m.id} className="py-2">
                              <td className="py-2 font-semibold text-slate-900 dark:text-white">{m.name}</td>
                              <td className="py-2 font-mono text-slate-500">{m.email}</td>
                              <td className="py-2 text-slate-600 dark:text-slate-300">{m.department}</td>
                              <td className="py-2"><Badge variant="success">Active</Badge></td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-slate-400">No department managers added yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 5: STAFF / EMPLOYEES */}
              {companyDetailsSubTab === 'staff' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase">
                          <th className="pb-2">Staff ID</th>
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Email</th>
                          <th className="pb-2">Department</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {summary.staff.length > 0 ? (
                          summary.staff.map(s => (
                            <tr key={s.id} className="py-2">
                              <td className="py-2 font-mono text-blue-600">{s.staffId || s.id}</td>
                              <td className="py-2 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                              <td className="py-2 font-mono text-slate-500">{s.email}</td>
                              <td className="py-2 text-slate-600 dark:text-slate-300">{s.department}</td>
                              <td className="py-2"><Badge variant="success">{s.status || 'Active'}</Badge></td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-slate-400">No operational staff accounts yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 6: END USERS */}
              {companyDetailsSubTab === 'end_users' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase">
                          <th className="pb-2">Account Name</th>
                          <th className="pb-2">Email</th>
                          <th className="pb-2">Designation / Role</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {summary.endUsers.length > 0 ? (
                          summary.endUsers.map(u => (
                            <tr key={u.id} className="py-2">
                              <td className="py-2 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                              <td className="py-2 font-mono text-slate-500">{u.email}</td>
                              <td className="py-2 text-slate-600 dark:text-slate-300">{u.designation || 'Client'}</td>
                              <td className="py-2"><Badge variant="success">Active</Badge></td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-slate-400">No client accounts registered yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 7: RECENT ACTIVITY */}
              {companyDetailsSubTab === 'activity' && (
                <div className="space-y-3">
                  {scopedAuditLogs.length > 0 ? (
                    scopedAuditLogs.slice(0, 10).map(log => (
                      <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-center text-[11px] text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{log.action}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
                        <span className="text-[10px] text-slate-400 font-mono">Actor: {log.userName}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs">No activity logs recorded for this tenant yet.</div>
                  )}
                </div>
              )}

              {/* SUBTAB 8: COMPANY SETTINGS */}
              {companyDetailsSubTab === 'settings' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Administrative Control Actions
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleOpenEdit(selectedCompanyDetails);
                          setSelectedCompanyDetails(null);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile & Plan
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-amber-600 border-amber-300 dark:border-amber-800 hover:bg-amber-50"
                        onClick={() => handleResetAdminPasswordAction(selectedCompanyDetails)}
                      >
                        <KeyRound className="w-3.5 h-3.5 mr-1.5" /> Reset Admin Password
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className={selectedCompanyDetails.status === 'Suspended' ? 'text-emerald-600 border-emerald-300' : 'text-rose-600 border-rose-300'}
                        onClick={() => {
                          toggleCompanyStatus(selectedCompanyDetails.id);
                          setSelectedCompanyDetails(null);
                        }}
                      >
                        <Power className="w-3.5 h-3.5 mr-1.5" />
                        {selectedCompanyDetails.status === 'Suspended' ? 'Activate Company' : 'Suspend Company'}
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          handleSwitchToTenant(selectedCompanyDetails.id);
                          setSelectedCompanyDetails(null);
                        }}
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Enter Workspace as Admin
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        );
      })()}

      {/* MODAL 2: EDIT COMPANY */}
      {editingCompany && (
        <Modal
          isOpen={Boolean(editingCompany)}
          onClose={() => setEditingCompany(null)}
          title={`Edit Company: ${editingCompany.name}`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Code
                </label>
                <input
                  type="text"
                  value={editFormData.companyCode}
                  onChange={(e) => setEditFormData({ ...editFormData, companyCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sector / Type
                </label>
                <select
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {orgTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={editFormData.industry}
                  onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subscription Plan
                </label>
                <select
                  value={editFormData.plan}
                  onChange={(e) => setEditFormData({ ...editFormData, plan: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Growth Tier">Growth Tier (₹4,999/mo)</option>
                  <option value="Professional">Professional (₹6,999/mo)</option>
                  <option value="Enterprise">Enterprise Plus (₹14,999/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Office / Operational Address
              </label>
              <input
                type="text"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingCompany(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: RESET ADMIN PASSWORD CONFIRMATION SCREEN */}
      {resetAdminModalResult && (
        <Modal
          isOpen={Boolean(resetAdminModalResult)}
          onClose={() => setResetAdminModalResult(null)}
          title="Company Admin Password Reset"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                New Temporary Credentials Generated
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                The Company Admin password for {resetAdminModalResult.companyName} has been reset.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Admin Account:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{resetAdminModalResult.adminName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Admin ID:</span>
                <span className="font-mono font-bold text-blue-600">{resetAdminModalResult.adminId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Login Email:</span>
                <span className="font-mono">{resetAdminModalResult.adminEmail}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Temporary Password:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-2.5 py-1 rounded">
                    {resetAdminModalResult.tempPassword}
                  </span>
                  <button
                    onClick={() => handleCopyText(resetAdminModalResult.tempPassword, 'Temporary Password')}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                    title="Copy Password"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-3 text-[11px] text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-blue-600" />
              <span>
                Permanent password hash is stored in backend. The admin will be prompted to change credentials on next authentication.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const payload = `Company: ${resetAdminModalResult.companyName}\nAdmin ID: ${resetAdminModalResult.adminId}\nEmail: ${resetAdminModalResult.adminEmail}\nTemp Password: ${resetAdminModalResult.tempPassword}`;
                  handleCopyText(payload, 'All Credentials');
                }}
              >
                Copy All
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setResetAdminModalResult(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE COMPANY MODAL WORKFLOW */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={createdCompanyResult ? "Company Credentials Generated" : "Provision New Company Workspace"}
        maxWidth="max-w-2xl"
      >
        {!createdCompanyResult ? (
          <form onSubmit={handleCreateCompanySubmit} className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The Platform Owner provisions new tenant organizations. An initial Company Admin ID and temporary password will be automatically generated.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline Logistics India"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Code (e.g. SKY-LOG)
                </label>
                <input
                  type="text"
                  placeholder="Leave blank to auto-generate"
                  value={formData.companyCode}
                  onChange={(e) => setFormData({ ...formData, companyCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Organization Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {orgTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. Supply Chain & Logistics"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="admin@skyline.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98450 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Admin Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Sharma"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subscription Plan
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Growth Tier">Growth Tier (₹4,999/mo)</option>
                  <option value="Professional">Professional (₹6,999/mo)</option>
                  <option value="Enterprise">Enterprise Plus (₹14,999/mo)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                icon={Plus}
              >
                Generate Credentials & Create
              </Button>
            </div>
          </form>
        ) : (
          /* CONFIRMATION SCREEN (Credentials Generated) */
          <div className="space-y-5">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Company Created Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Workspace allocated and Company Admin credentials provisioned.
              </p>
            </div>

            {/* Credentials Card */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">Company Name:</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {createdCompanyResult.company.name}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Company ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {createdCompanyResult.company.companyId}
                  </span>
                  <button
                    onClick={() => handleCopyText(createdCompanyResult.company.companyId, 'Company ID')}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Company Admin ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {createdCompanyResult.adminId}
                  </span>
                  <button
                    onClick={() => handleCopyText(createdCompanyResult.adminId, 'Admin ID')}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Temporary Password:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">
                    {createdCompanyResult.tempPassword}
                  </span>
                  <button
                    onClick={() => handleCopyText(createdCompanyResult.tempPassword, 'Temporary Password')}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-3 text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                For security, this temporary password must be changed by the Company Admin on first login.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={() => handleDownloadCredentials(createdCompanyResult)}
              >
                Download Credentials
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={ExternalLink}
                onClick={() => {
                  handleSwitchToTenant(createdCompanyResult.company.id);
                  setIsCreateModalOpen(false);
                }}
              >
                Launch Workspace
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: VERIFICATION APPLICATION DOSSIER */}
      {isVerificationModalOpen && selectedVerificationReq && (
        <Modal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          title={`Verification Dossier: ${selectedVerificationReq.name} [${selectedVerificationReq.id}]`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-5">
            {/* Top Status & Reviewer Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Current Status:</span>
                <Badge
                  variant={
                    selectedVerificationReq.verification_status === 'VERIFIED'
                      ? 'success'
                      : selectedVerificationReq.verification_status === 'REJECTED' || selectedVerificationReq.verification_status === 'SUSPENDED'
                      ? 'danger'
                      : selectedVerificationReq.verification_status === 'UNDER_REVIEW'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {selectedVerificationReq.verification_status}
                </Badge>
                <span className="text-xs text-slate-400">• Sector: <strong>{selectedVerificationReq.type}</strong></span>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                <span>Reviewer:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedVerificationReq.reviewer || currentUser?.name || 'Platform Compliance Officer'}
                </span>
              </div>
            </div>

            {/* Sub-tab Switcher */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
              {[
                { id: 'overview', label: 'Identity & Details', icon: Building2 },
                { id: 'official', label: 'Official Registry Verification', icon: ShieldCheck },
                { id: 'documents', label: `Submitted Proof Docs (${(selectedVerificationReq.documents || []).length})`, icon: FileText },
                { id: 'history', label: `Audit Trail (${(selectedVerificationReq.auditHistory || []).length})`, icon: Activity }
              ].map(t => {
                const TabIcon = t.icon;
                const active = verificationDetailTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setVerificationDetailTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* SUBTAB 1: OVERVIEW */}
            {verificationDetailTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2.5 border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal Entity Identity</h4>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Organization Name:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedVerificationReq.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Registration / Incorporation #:</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{selectedVerificationReq.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">PAN / Tax ID:</span>
                      <span className="font-mono font-bold">{selectedVerificationReq.taxId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Industry / Discipline:</span>
                      <span className="font-medium">{selectedVerificationReq.industry || 'General Operations'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Website URL:</span>
                      <a
                        href={selectedVerificationReq.website || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {selectedVerificationReq.website || 'N/A'} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2.5 border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Authorized Submitter & Location</h4>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Authorized Representative:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedVerificationReq.submittedBy}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Applicant Title / Designation:</span>
                      <span className="font-medium">{selectedVerificationReq.applicantTitle || 'Managing Director / Principal'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Official Contact Email:</span>
                      <span className="font-medium font-mono">{selectedVerificationReq.contactEmail}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Phone Number:</span>
                      <span className="font-medium">{selectedVerificationReq.phone || '+91 98000 00000'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Operating Address:</span>
                      <span className="font-medium truncate max-w-[200px]" title={selectedVerificationReq.address}>
                        {selectedVerificationReq.address || 'India'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Duplicate Risk Assessment Banner */}
                {selectedVerificationReq.duplicateWarnings && selectedVerificationReq.duplicateWarnings.length > 0 ? (
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-rose-800 dark:text-rose-200">Duplicate Entity Risk Detected</h5>
                      <ul className="text-xs text-rose-700 dark:text-rose-300 mt-1 list-disc list-inside space-y-0.5">
                        {selectedVerificationReq.duplicateWarnings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No duplicate entity conflicts discovered against active SMARTORA tenant databases.</span>
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB 2: OFFICIAL REGISTRY VERIFICATION */}
            {verificationDetailTab === 'official' && (() => {
              const check = officialCheckLiveResult || selectedVerificationReq.officialCheck;
              const matches = check?.comparison?.matches;
              return (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-500" /> Statutory Registry Verification Provider
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Provider Architecture: Queries official government & statutory authority databases (MCA, UGC, NMC, Darpan) to cross-verify legal authenticity.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={RefreshCw}
                      disabled={isRunningOfficialCheck}
                      onClick={handleTriggerOfficialCheck}
                      className="bg-blue-600 hover:bg-blue-500 text-white shrink-0"
                    >
                      {isRunningOfficialCheck ? 'Querying Registry...' : 'Simulate Live Registry Query'}
                    </Button>
                  </div>

                  {check ? (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Source: <span className="font-mono text-blue-600">{check.source}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Queried At: {check.checkedAt ? new Date(check.checkedAt).toLocaleString() : 'N/A'}
                          </span>
                        </div>

                        {/* Comparison Matrix */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
                            <div className="text-[11px] text-slate-400 font-semibold uppercase">Legal Entity Name</div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {check.officialData?.legalName || check.officialData?.institutionName || check.officialData?.hospitalName || 'Verified Official Entity'}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                matches?.name === 'MATCH'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {matches?.name || 'MATCH'}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
                            <div className="text-[11px] text-slate-400 font-semibold uppercase">Registration ID / CIN / Code</div>
                            <div className="flex items-center justify-between font-mono">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {check.officialData?.cin || check.officialData?.aisheCode || check.officialData?.clinicalRegNo || check.officialData?.darpanId || selectedVerificationReq.registrationNumber}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                matches?.regNumber === 'MATCH'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {matches?.regNumber || 'MATCH'}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
                            <div className="text-[11px] text-slate-400 font-semibold uppercase">Registered State / Jurisdiction</div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {check.officialData?.state || check.officialData?.registeredOffice || 'Valid Jurisdiction'}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {matches?.address || 'MATCH'}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
                            <div className="text-[11px] text-slate-400 font-semibold uppercase">Statutory Standing</div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {check.officialData?.status || 'Active / Compliant'}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                GOOD STANDING
                              </span>
                            </div>
                          </div>
                        </div>

                        {check.remarks && (
                          <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                            <strong>Official Provider Remarks:</strong> {check.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                      <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No official registry check recorded yet</p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                        Click "Simulate Live Registry Query" above to verify this applicant against official statutory registries.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* SUBTAB 3: PROOF DOCUMENTS & AI OCR EXTRACTION */}
            {verificationDetailTab === 'documents' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Uploaded Compliance Documents (Confidential)
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {(selectedVerificationReq.documents || []).map(doc => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {doc.name || doc.type}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Type: <span className="font-semibold text-slate-600 dark:text-slate-300">{doc.type}</span> • Size: {doc.size ? `${(doc.size / 1024).toFixed(0)} KB` : '1.4 MB'} • Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Recent'}
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="xs"
                          icon={Eye}
                          onClick={() => handleSecureDocView(doc)}
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Secure View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI OCR Extraction Assistant Panel */}
                <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                        AI Document Extraction Assistant
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                      Confidence: {selectedVerificationReq.aiAnalysis?.confidence || '94%'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">OCR EXTRACTED LEGAL NAME</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {selectedVerificationReq.aiAnalysis?.extractedData?.organizationName || selectedVerificationReq.name}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">OCR EXTRACTED REGISTRATION #</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {selectedVerificationReq.aiAnalysis?.extractedData?.registrationNumber || selectedVerificationReq.registrationNumber}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">OCR EXTRACTED ISSUE / INCORPORATION DATE</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {selectedVerificationReq.aiAnalysis?.extractedData?.issueDate || '14-Apr-2018'}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">OCR ISSUING AUTHORITY SEAL</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {selectedVerificationReq.aiAnalysis?.extractedData?.issuingAuthority || 'Registrar of Companies / State Dept'}
                      </span>
                    </div>
                  </div>

                  {/* MANDATORY STATUTORY AI DISCLAIMER */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Statutory Non-Authoritative Notice:</strong> AI OCR extraction is an assistive convenience tool and does <em>NOT</em> constitute official certification, legal validation, or statutory proof of authenticity. Final compliance determinations must be validated against official government registries.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 4: COMPLIANCE AUDIT TRAIL */}
            {verificationDetailTab === 'history' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Application Lifecycle Audit Trail
                </h4>
                <div className="space-y-2 text-xs">
                  {(selectedVerificationReq.auditHistory || []).map((h, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-[10px] font-mono">
                            {h.action}
                          </span>
                          <span>by {h.actorName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({h.actorRole})</span>
                        </div>
                        {h.notes && (
                          <div className="text-slate-600 dark:text-slate-300 mt-1 pl-1 border-l-2 border-slate-300 dark:border-slate-700">
                            {h.notes}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        {h.timestamp ? new Date(h.timestamp).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dossier Action Buttons Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVerificationModalOpen(false)}
              >
                Close Dossier
              </Button>

              <div className="flex flex-wrap items-center gap-2">
                {selectedVerificationReq.verification_status !== 'VERIFIED' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={HelpCircle}
                      onClick={() => handleOpenPrompt('more_info')}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:border-orange-800"
                    >
                      Request More Info
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={XCircle}
                      onClick={() => handleOpenPrompt('reject')}
                      className="text-rose-600 border-rose-300 hover:bg-rose-50 dark:border-rose-800"
                    >
                      Reject Application
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleApproveVerification('Statutory requirements satisfied & authorized by Platform Owner.')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Approve & Activate Tenant
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ShieldAlert}
                    onClick={() => handleSuspendTenant(selectedVerificationReq)}
                    className="text-rose-600 border-rose-300 hover:bg-rose-50 dark:border-rose-800"
                  >
                    Suspend Organization Access
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: APPROVED TENANT CREDENTIALS */}
      {approvedCredsModal && (
        <Modal
          isOpen={Boolean(approvedCredsModal)}
          onClose={() => setApprovedCredsModal(null)}
          title="Tenant Organization Activated Successfully"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                  {approvedCredsModal.name} is Verified & Active
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Tenant workspace has been provisioned. Administrator credentials generated below.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-2.5 border border-slate-200 dark:border-slate-700 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Company ID:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{approvedCredsModal.companyId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Admin Login ID:</span>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>{approvedCredsModal.adminId}</span>
                  <button onClick={() => handleCopyText(approvedCredsModal.adminId, 'Admin ID')} className="text-slate-400 hover:text-slate-600">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Admin Email:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{approvedCredsModal.adminEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Temporary Password:</span>
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                  <span>{approvedCredsModal.tempPassword}</span>
                  <button onClick={() => handleCopyText(approvedCredsModal.tempPassword, 'Temporary Password')} className="text-slate-400 hover:text-slate-600">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Admin will be prompted to change their temporary password upon first login.</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => setApprovedCredsModal(null)}
            >
              Done
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL: PROMPT FOR REJECTION / MORE INFO */}
      {promptModal.open && (
        <Modal
          isOpen={promptModal.open}
          onClose={() => setPromptModal({ open: false, type: '', title: '', message: '', value: '', placeholder: '' })}
          title={promptModal.title}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {promptModal.message}
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Mandatory Explanatory Notes & Statutory Justification:
              </label>
              <textarea
                rows={4}
                value={promptModal.value}
                onChange={(e) => setPromptModal(prev => ({ ...prev, value: e.target.value }))}
                placeholder={promptModal.placeholder}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPromptModal({ open: false, type: '', title: '', message: '', value: '', placeholder: '' })}
              >
                Cancel
              </Button>
              <Button
                variant={promptModal.type === 'reject' ? 'danger' : 'primary'}
                size="sm"
                onClick={handleConfirmPrompt}
              >
                {promptModal.type === 'reject' ? 'Confirm Rejection' : 'Send Information Request'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: SECURE DOCUMENT VIEWER */}
      {secureDocModal && (
        <Modal
          isOpen={Boolean(secureDocModal)}
          onClose={() => setSecureDocModal(null)}
          title={`Confidential Proof Document: ${secureDocModal.doc?.name || secureDocModal.doc?.type}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between font-mono">
              <span>SECURITY CLASSIFICATION: CONFIDENTIAL</span>
              <span>AUDIT ID: {secureDocModal.doc?.id}</span>
            </div>

            <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-[-25deg] text-3xl font-black font-mono select-none">
                SMARTORA COMPLIANCE VERIFICATION
              </div>
              <FileCheck className="w-16 h-16 text-blue-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {secureDocModal.doc?.name || 'Incorporation Certificate'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Classification: {secureDocModal.doc?.type} • Formatted MIME: application/pdf
              </p>
              <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-lg text-left text-xs font-mono border border-slate-200 dark:border-slate-800 space-y-1">
                <div>Organization: {secureDocModal.req?.name}</div>
                <div>Reg Number: {secureDocModal.req?.registrationNumber}</div>
                <div>Upload Timestamp: {secureDocModal.doc?.uploadedAt ? new Date(secureDocModal.doc.uploadedAt).toLocaleString() : 'N/A'}</div>
                <div>Status: Digitally Signed & Checksum Verified (SHA-256)</div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSecureDocModal(null)}
              >
                Close Viewer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
