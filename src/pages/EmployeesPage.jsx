// Workforce & Staff Management Page for SMARTORA
// Tenant-Isolated Staff Operations with Role RBAC & Credential Lifecycle
// Supports STF-CMP-xxxx ID Generation, Temp Password Provisioning & Live Confirmation Modals

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Key,
  Copy,
  Check,
  Power,
  Shield,
  RefreshCw,
  Lock,
  Mail,
  Phone,
  Building2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { ROLES } from '../data/mockData';
import { generateStaffId, generateTempPassword } from '../services/cryptoService';

export default function EmployeesPage() {
  const {
    currentOrganization,
    users,
    employees,
    departments,
    createStaff,
    updateStaff,
    toggleStaffStatus,
    resetStaffPassword,
    deleteEmployee,
    viewMode
  } = useData();

  const { addToast } = useToast();
  const isInstitution = viewMode === 'institution' || currentOrganization?.type?.includes('Education');

  // Terminology helpers based on tenant organization
  const staffTerm = currentOrganization?.terminology?.employeeTerm || (isInstitution ? 'Faculty' : 'Staff');
  const deptTerm = currentOrganization?.terminology?.departmentTerm || 'Department';

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState('');
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [credentialModalData, setCredentialModalData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    role: ROLES.STAFF,
    designation: '',
    tempPassword: '',
    performance: 'Good',
    status: 'Active',
    salary: '₹45,000/mo'
  });

  // Strict Tenant-Isolated Staff Roster:
  // Combines users with STAFF or DEPARTMENT_MANAGER roles and employees belonging to currentOrganization.id
  const staffMembers = useMemo(() => {
    const orgId = currentOrganization?.id || 'org-001';

    // 1. Filter tenant users
    const staffUsers = (users || []).filter(
      u => u.organization_id === orgId && (u.role === ROLES.STAFF || u.role === ROLES.DEPARTMENT_MANAGER)
    );

    // 2. Build roster mapping
    const roster = staffUsers.map(u => {
      const matchingEmp = (employees || []).find(e => e.id === u.id || e.id === u.staffId || e.name === u.name);
      return {
        id: u.staffId || u.id,
        userId: u.id,
        staffId: u.staffId || u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '+91 98450 12345',
        role: u.role,
        designation: u.designation || (u.role === ROLES.DEPARTMENT_MANAGER ? 'Department Manager' : 'Staff Associate'),
        department: u.department || 'Operations',
        status: u.status || 'Active',
        mustChangePassword: !!u.mustChangePassword,
        attendance: matchingEmp?.attendance || 95,
        tasks: matchingEmp?.tasks || 0,
        performance: matchingEmp?.performance || 'Good',
        joined: u.joinedDate || matchingEmp?.joined || '2024-01-15',
        avatar: u.avatar || matchingEmp?.avatar,
        isUserAccount: true
      };
    });

    // 3. Fallback: Include any employee records from this tenant not yet synced to users
    (employees || []).forEach(emp => {
      if (emp.orgId === orgId || emp.organization_id === orgId) {
        const exists = roster.some(r => r.id === emp.id || r.staffId === emp.id || r.name === emp.name);
        if (!exists) {
          roster.push({
            id: emp.id,
            userId: emp.id,
            staffId: emp.id,
            name: emp.name,
            email: emp.email || `${emp.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@${currentOrganization?.companyCode?.toLowerCase() || 'smartora'}.demo`,
            phone: emp.phone || '+91 98000 00000',
            role: emp.role?.toLowerCase().includes('manager') || emp.role?.toLowerCase().includes('lead') || emp.role?.toLowerCase().includes('head')
              ? ROLES.DEPARTMENT_MANAGER
              : ROLES.STAFF,
            designation: emp.role || 'Staff Associate',
            department: emp.department || 'Operations',
            status: emp.status || 'Active',
            mustChangePassword: false,
            attendance: emp.attendance || 90,
            tasks: emp.tasks || 0,
            performance: emp.performance || 'Good',
            joined: emp.joined || '2024-01-01',
            avatar: emp.avatar,
            isUserAccount: false
          });
        }
      }
    });

    return roster;
  }, [users, employees, currentOrganization]);

  // Available departments for current tenant
  const availableDepartments = useMemo(() => {
    const list = (departments || []).map(d => d.name);
    if (list.length > 0) return list;
    return ['Engineering', 'Sales & Marketing', 'Operations', 'Finance & Accounts', 'Human Resources'];
  }, [departments]);

  // Aggregate Stats
  const metrics = useMemo(() => {
    const total = staffMembers.length;
    const managers = staffMembers.filter(s => s.role === ROLES.DEPARTMENT_MANAGER).length;
    const staff = staffMembers.filter(s => s.role === ROLES.STAFF).length;
    const active = staffMembers.filter(s => s.status === 'Active').length;
    const avgAttendance = total > 0
      ? Math.round(staffMembers.reduce((acc, s) => acc + (s.attendance || 0), 0) / total)
      : 95;
    return { total, managers, staff, active, avgAttendance };
  }, [staffMembers]);

  // Copy helper
  const copyToClipboard = (text, label) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedField(label);
    addToast('Copied to Clipboard', `${label} copied successfully.`, 'success');
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Open Add Modal with auto-generated Staff ID and temporary password
  const handleOpenAdd = () => {
    const orgCode = currentOrganization?.companyCode || 'CMP';
    const nextSeq = staffMembers.length + 1;
    const generatedId = generateStaffId(orgCode, nextSeq);
    const generatedPass = generateTempPassword();

    setFormData({
      staffId: generatedId,
      name: '',
      email: '',
      phone: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
      department: availableDepartments[0] || 'Operations',
      role: ROLES.STAFF,
      designation: isInstitution ? 'Assistant Professor' : 'Operations Specialist',
      tempPassword: generatedPass,
      performance: 'Good',
      status: 'Active',
      salary: '₹40,000/mo'
    });
    setIsAddModalOpen(true);
  };

  // Refresh temporary password in Add modal
  const handleRegenerateTempPassword = () => {
    const nextPass = generateTempPassword();
    setFormData(prev => ({ ...prev, tempPassword: nextPass }));
    addToast('New Password', 'Generated new high-entropy temporary password.', 'info');
  };

  // Open Edit Modal
  const handleOpenEdit = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      staffId: staff.staffId || staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      department: staff.department,
      role: staff.role,
      designation: staff.designation,
      tempPassword: '',
      performance: staff.performance,
      status: staff.status,
      salary: staff.salary || '₹45,000/mo'
    });
    setIsEditModalOpen(true);
  };

  // Open View Dossier Modal
  const handleOpenProfile = (staff) => {
    setSelectedStaff(staff);
    setIsProfileModalOpen(true);
  };

  // Open Delete Dialog
  const handleOpenDelete = (staff) => {
    setSelectedStaff(staff);
    setDeleteConfirmationId('');
    setIsPermanentDelete(false);
    setIsDeleteOpen(true);
  };

  // Save New Staff Member
  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast('Validation Error', 'Full name and email address are required.', 'warning');
      return;
    }

    const result = createStaff({
      staffId: formData.staffId,
      tempPassword: formData.tempPassword,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      department: formData.department,
      role: formData.role,
      designation: formData.designation.trim() || (formData.role === ROLES.DEPARTMENT_MANAGER ? 'Department Manager' : 'Staff Associate'),
      performance: formData.performance,
      salary: formData.salary
    });

    setIsAddModalOpen(false);

    // Show Credential Confirmation Modal
    setCredentialModalData({
      type: 'create',
      name: formData.name,
      staffId: result.staffId || formData.staffId,
      email: formData.email,
      tempPassword: result.tempPassword || formData.tempPassword,
      role: formData.role,
      department: formData.department
    });
    setIsCredentialModalOpen(true);
  };

  // Save Edited Staff Member
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Validation Error', 'Staff name cannot be empty.', 'warning');
      return;
    }

    updateStaff(selectedStaff.userId || selectedStaff.id, {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      department: formData.department,
      role: formData.role,
      designation: formData.designation.trim(),
      status: formData.status,
      performance: formData.performance
    });

    addToast('Staff Updated', `${formData.name}'s profile was updated successfully.`, 'success');
    setIsEditModalOpen(false);
  };

  // Activate / Deactivate Staff Toggle
  const handleToggleStatus = (staff) => {
    toggleStaffStatus(staff.userId || staff.id);
    const nextStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
    addToast(
      nextStatus === 'Active' ? 'Staff Activated' : 'Staff Deactivated',
      `${staff.name} is now ${nextStatus}. ${nextStatus === 'Inactive' ? 'Login access is revoked.' : 'Access restored.'}`,
      nextStatus === 'Active' ? 'success' : 'warning'
    );
  };

  // Reset Staff Password
  const handleResetPassword = (staff) => {
    const result = resetStaffPassword(staff.userId || staff.id || staff.staffId);
    if (result && result.success) {
      setCredentialModalData({
        type: 'reset',
        name: staff.name,
        staffId: result.staffId || staff.staffId || staff.id,
        email: staff.email,
        tempPassword: result.tempPassword,
        role: staff.role,
        department: staff.department
      });
      setIsCredentialModalOpen(true);
      addToast('Password Reset', `Temporary password generated for ${staff.name}.`, 'info');
    } else {
      addToast('Error', 'Unable to reset password for this user.', 'danger');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async (permanent = false) => {
    if (!selectedStaff) return;
    const targetId = selectedStaff.userId || selectedStaff.staffId || selectedStaff.id;

    if (permanent) {
      if (deleteConfirmationId.trim().toUpperCase() !== String(targetId).trim().toUpperCase()) {
        addToast('Validation Error', `Please type the exact User ID "${targetId}" to confirm permanent deletion.`, 'warning');
        return;
      }
    }

    const res = await deleteEmployee(targetId, permanent);
    if (res && res.success === false) {
      addToast('Deletion Blocked', res.message || 'Unable to delete this account.', 'danger');
      return;
    }

    addToast(
      permanent ? 'Account Permanently Deleted' : 'Account Deactivated',
      `${selectedStaff.name} [${targetId}] was ${permanent ? 'permanently removed from system' : 'deactivated and login access revoked'}.`,
      permanent ? 'info' : 'warning'
    );
    setIsDeleteOpen(false);
    setSelectedStaff(null);
    setDeleteConfirmationId('');
  };

  // Build Full Credential Packet String for "Copy All"
  const getCredentialClipboardString = (data) => {
    if (!data) return '';
    return [
      `=========================================`,
      `SMARTORA CREDENTIAL NOTICE`,
      `=========================================`,
      `Organization: ${currentOrganization?.name || 'SMARTORA'}`,
      `Staff Member: ${data.name}`,
      `Staff ID:     ${data.staffId}`,
      `Login Email:  ${data.email}`,
      `Temporary PW: ${data.tempPassword}`,
      `Role:         ${data.role}`,
      `Department:   ${data.department}`,
      `Portal Link:  ${window.location.origin}/#/login`,
      `-----------------------------------------`,
      `IMPORTANT: This is a temporary password.`,
      `You will be required to create your own`,
      `permanent password upon your first login.`,
      `=========================================`
    ].join('\n');
  };

  // DataTable Columns Configuration
  const columns = [
    {
      key: 'staffId',
      label: 'Staff ID',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-1.5 font-mono">
          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800">
            {s.staffId}
          </span>
          {s.mustChangePassword && (
            <span title="Temporary password active - first login pending" className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
        </div>
      )
    },
    {
      key: 'name',
      label: `${staffTerm} Member`,
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          <img
            src={s.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`}
            alt={s.name}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block text-sm">{s.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Mail className="w-3 h-3" /> {s.email}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role & Designation',
      sortable: true,
      render: (s) => (
        <div>
          <span className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-md ${
            s.role === ROLES.DEPARTMENT_MANAGER
              ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            <Shield className="w-3 h-3 text-current" />
            {s.role === ROLES.DEPARTMENT_MANAGER ? 'Dept Manager' : 'Staff'}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {s.designation}
          </span>
        </div>
      )
    },
    {
      key: 'department',
      label: deptTerm,
      sortable: true,
      render: (s) => <Badge variant="info">{s.department}</Badge>
    },
    {
      key: 'attendance',
      label: 'Attendance',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="w-14 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${s.attendance < 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${s.attendance}%` }}
            />
          </div>
          <span className={`text-xs font-semibold ${s.attendance < 80 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
            {s.attendance}%
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Account Status',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2">
          <Badge variant={s.status === 'Active' ? 'success' : 'neutral'}>
            {s.status}
          </Badge>
          {s.status === 'Inactive' && (
            <span className="text-[10px] text-rose-500 font-medium">(Locked)</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Operations',
      sortable: false,
      render: (s) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleOpenProfile(s)}
            title="View Dossier"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(s)}
            title="Edit Staff Details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleResetPassword(s)}
            title="Reset Password & Issue Temporary Credential"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(s)}
            title={s.status === 'Active' ? 'Deactivate Account (Revoke Login)' : 'Activate Account (Restore Login)'}
            className={`p-1.5 rounded-lg transition-colors ${
              s.status === 'Active'
                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(s)}
            title="Remove from Roster"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-lg shadow-blue-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
              Tenant Isolated • {currentOrganization?.companyCode || 'CMP'}
            </span>
            <span className="text-xs text-blue-100 font-medium">
              {currentOrganization?.name}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            {staffTerm} Management & Workforce Roster
          </h1>
          <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
            Provision unique Staff IDs, generate cryptographic temporary credentials, and manage role-based access control with live tenant isolation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenAdd}
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-md shadow-black/10 border-0"
            icon={Plus}
          >
            Provision New {staffTerm}
          </Button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Workforce</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{metrics.total}</span>
          <span className="text-[11px] text-slate-500">Live tenant records</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Dept Managers</span>
          <span className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-1 block">{metrics.managers}</span>
          <span className="text-[11px] text-slate-500">Department leads</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Operational Staff</span>
          <span className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1 block">{metrics.staff}</span>
          <span className="text-[11px] text-slate-500">Active contributors</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Active Accounts</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 block">{metrics.active}</span>
          <span className="text-[11px] text-slate-500">{metrics.total - metrics.active} deactivated</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Avg Attendance</span>
          <span className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1 block">{metrics.avgAttendance}%</span>
          <span className="text-[11px] text-slate-500">Compliance rate</span>
        </div>
      </div>

      {/* Main Staff DataTable */}
      <DataTable
        columns={columns}
        data={staffMembers}
        searchPlaceholder={`Search by name, Staff ID, designation, ${deptTerm.toLowerCase()}...`}
        searchKeys={['name', 'staffId', 'id', 'email', 'role', 'designation', 'department']}
        filterKey="department"
        filterLabel={deptTerm}
        filterOptions={availableDepartments}
        pageSize={8}
      />

      {/* Modal: Provision New Staff */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Provision New ${staffTerm} Member`}
        subtitle={`Register employee account for ${currentOrganization?.name || 'Company'}`}
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          {/* Generated Staff ID Banner */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                Auto-Generated Staff ID
              </span>
              <span className="text-sm font-mono font-black text-blue-900 dark:text-blue-100">
                {formData.staffId}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200/60 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-semibold">
              Format: STF-{currentOrganization?.companyCode || 'CMP'}-xxxx
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikramaditya Hegde"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. staff@company.demo"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98450 00000"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {deptTerm} Assignment *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                {availableDepartments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                System Role (RBAC) *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value={ROLES.STAFF}>Operational Staff</option>
                <option value={ROLES.DEPARTMENT_MANAGER}>Department Manager (Tier 3)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Designation / Job Title
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder={isInstitution ? 'Associate Professor' : 'Lead Specialist'}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Monthly Compensation
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="₹45,000/mo"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          {/* Temporary Password Provisioning */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-500" />
                Temporary Password (Auto-Generated)
              </label>
              <button
                type="button"
                onClick={handleRegenerateTempPassword}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={formData.tempPassword}
                onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                className="flex-1 px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => copyToClipboard(formData.tempPassword, 'Temporary Password')}
              >
                <Copy className="w-3.5 h-3.5 mr-1" /> Copy
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Staff will be forced to change this temporary password upon first login.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Provision Staff Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Staff */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Update ${staffTerm} Record`}
        subtitle={`Editing details for ${selectedStaff?.name} [${selectedStaff?.staffId}]`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {deptTerm} Assignment
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                {availableDepartments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                System Role (RBAC)
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
              >
                <option value={ROLES.STAFF}>Operational Staff</option>
                <option value={ROLES.DEPARTMENT_MANAGER}>Department Manager (Tier 3)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Designation / Job Title
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
              >
                <option value="Active">Active (Permit Login)</option>
                <option value="Inactive">Inactive (Revoke Access)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Staff Credential Confirmation Screen */}
      <Modal
        isOpen={isCredentialModalOpen}
        onClose={() => setIsCredentialModalOpen(false)}
        title={credentialModalData?.type === 'create' ? 'Staff Provisioned Successfully' : 'Password Reset Confirmation'}
        subtitle="Secure temporary credentials generated for staff member"
      >
        {credentialModalData && (
          <div className="space-y-4">
            {/* Success Banner */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  {credentialModalData.type === 'create'
                    ? `Staff account for ${credentialModalData.name} is ready.`
                    : `Password for ${credentialModalData.name} has been reset.`}
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-1">
                  Share these credentials securely with the user. They are flagged with <strong className="font-semibold">mustChangePassword</strong> and must set a personal password upon next login.
                </p>
              </div>
            </div>

            {/* Credential Data Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              {/* Name & Role */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Staff Member</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{credentialModalData.name}</span>
                </div>
                <Badge variant={credentialModalData.role === ROLES.DEPARTMENT_MANAGER ? 'info' : 'neutral'}>
                  {credentialModalData.role === ROLES.DEPARTMENT_MANAGER ? 'Department Manager' : 'Staff'}
                </Badge>
              </div>

              {/* Staff ID Field */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unique Staff ID</span>
                  <span className="text-sm font-mono font-black text-blue-600 dark:text-blue-400">
                    {credentialModalData.staffId}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentialModalData.staffId, 'Staff ID')}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copiedField === 'Staff ID' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === 'Staff ID' ? 'Copied' : 'Copy ID'}
                </button>
              </div>

              {/* Login Email */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Login Email</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {credentialModalData.email}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentialModalData.email, 'Login Email')}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copiedField === 'Login Email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === 'Login Email' ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Temporary Password */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                    Temporary Password
                  </span>
                  <span className="text-base font-mono font-black text-amber-900 dark:text-amber-200">
                    {credentialModalData.tempPassword}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentialModalData.tempPassword, 'Temporary Password')}
                  className="px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copiedField === 'Temporary Password' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === 'Temporary Password' ? 'Copied' : 'Copy Password'}
                </button>
              </div>
            </div>

            {/* Action Buttons: Copy Staff ID, Copy All, Done */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => copyToClipboard(credentialModalData.staffId, 'Staff ID')}
                className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Staff ID
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(getCredentialClipboardString(credentialModalData), 'Full Credentials Packet')}
                  className="flex-1 sm:flex-none"
                  icon={Copy}
                >
                  {copiedField === 'Full Credentials Packet' ? 'All Copied!' : 'Copy All Credentials'}
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setIsCredentialModalOpen(false)}
                  className="flex-1 sm:flex-none"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: View Staff Profile & Dossier */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Staff Dossier & Telemetry"
        subtitle={`Audit profile for ${selectedStaff?.name}`}
      >
        {selectedStaff && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <img
                src={selectedStaff.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`}
                alt={selectedStaff.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                    {selectedStaff.name}
                  </h4>
                  <Badge variant={selectedStaff.status === 'Active' ? 'success' : 'neutral'}>
                    {selectedStaff.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedStaff.designation} • {selectedStaff.department}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {selectedStaff.staffId}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Joined: {selectedStaff.joined}
                  </span>
                </div>
              </div>
            </div>

            {/* Credential Status Box */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              selectedStaff.mustChangePassword
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            }`}>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-current" />
                <div>
                  <span className="font-bold block">
                    {selectedStaff.mustChangePassword ? 'Temporary Password Active' : 'Permanent Password Secured'}
                  </span>
                  <span className="text-[11px] opacity-80">
                    {selectedStaff.mustChangePassword
                      ? 'User has not yet updated their initial temporary credential.'
                      : 'Cryptographic SHA-256 salted hash verified.'}
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  handleResetPassword(selectedStaff);
                }}
              >
                Reset Password
              </Button>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Attendance</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                  {selectedStaff.attendance}%
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Active Tasks</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                  {selectedStaff.tasks} sprints
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Rating Tier</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm mt-0.5 block">
                  {selectedStaff.performance}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Role Hierarchy</span>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-sm mt-0.5 block">
                  {selectedStaff.role === ROLES.DEPARTMENT_MANAGER ? 'Tier 3 (Mgr)' : 'Tier 4 (Staff)'}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {selectedStaff.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {selectedStaff.phone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> {deptTerm}
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedStaff.department}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsProfileModalOpen(false)}>
                Close Dossier
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete / Deactivate Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete / Deactivate Account"
        subtitle="Manage account lifecycle, credentials, and organizational access"
      >
        {selectedStaff && (
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            {/* Staff Details Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">User Name:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaff.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">User ID:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {selectedStaff.userId || selectedStaff.staffId || selectedStaff.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Role:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{selectedStaff.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Department:</span>
                <span className="font-medium">{selectedStaff.department}</span>
              </div>
            </div>

            {/* Warning Box */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block">Access Revocation Notice</span>
                <span>This action will revoke all system access for this account. Login attempts will be rejected.</span>
              </div>
            </div>

            {/* Toggle Soft vs Permanent Delete */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="radio"
                  name="deleteMode"
                  checked={!isPermanentDelete}
                  onChange={() => setIsPermanentDelete(false)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Safe Deactivation (Recommended — Preserves historical records & revokes login)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-rose-600">
                <input
                  type="radio"
                  name="deleteMode"
                  checked={isPermanentDelete}
                  onChange={() => setIsPermanentDelete(true)}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Permanent Deletion (Permanently wipes account)</span>
              </label>
            </div>

            {isPermanentDelete && (
              <div className="space-y-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <label className="block text-xs font-bold text-rose-700 dark:text-rose-300">
                  Type User ID <span className="font-mono underline">{selectedStaff.userId || selectedStaff.staffId || selectedStaff.id}</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationId}
                  onChange={(e) => setDeleteConfirmationId(e.target.value)}
                  placeholder={selectedStaff.userId || selectedStaff.staffId || selectedStaff.id}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              {isPermanentDelete ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleConfirmDelete(true)}
                  disabled={deleteConfirmationId.trim().toUpperCase() !== String(selectedStaff.userId || selectedStaff.staffId || selectedStaff.id).trim().toUpperCase()}
                >
                  Permanently Delete
                </Button>
              ) : (
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleConfirmDelete(false)}
                >
                  Deactivate Account
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
