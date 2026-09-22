// User Management Page for SMARTORA
import React, { useState } from 'react';
import { Users, Plus, Eye, Edit2, Trash2, Power, Check, Shield } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus } = useData();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Administrator',
    department: 'Management',
    status: 'Active'
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Administrator',
      department: 'Management',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast('Validation Error', 'Name and email are required', 'warning');
      return;
    }
    addUser(formData);
    addToast('User Created', `${formData.name} added to the directory.`, 'success');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast('Validation Error', 'Name and email are required', 'warning');
      return;
    }
    updateUser(selectedUser.id, formData);
    addToast('User Updated', `${formData.name}'s profile has been updated.`, 'success');
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      addToast('User Removed', `${selectedUser.name} was removed from the system.`, 'info');
      setIsDeleteOpen(false);
    }
  };

  const handleToggleStatus = (user) => {
    toggleUserStatus(user.id);
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    addToast('Status Changed', `${user.name} is now ${nextStatus}.`, 'info');
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={u.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">{u.name}</span>
            <span className="text-xs text-slate-400">{u.id}</span>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (u) => <span className="text-slate-600 dark:text-slate-300">{u.email}</span>
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (u) => (
        <span className="inline-flex items-center gap-1 font-medium text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          <Shield className="w-3 h-3 text-blue-500" />
          {u.role}
        </span>
      )
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (u) => (
        <Badge variant={u.status === 'Active' ? 'success' : 'neutral'}>
          {u.status}
        </Badge>
      )
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      sortable: true,
      render: (u) => <span className="text-xs text-slate-400">{u.lastActive}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenView(u)}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(u)}
            title="Edit User"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(u)}
            title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
            className={`p-1.5 rounded-lg transition-colors ${
              u.status === 'Active'
                ? 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(u)}
            title="Delete User"
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            User Directory & Access Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage administrative personnel, faculty privileges, and credentials
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          icon={Plus}
          onClick={handleOpenAdd}
          className="shadow-sm shadow-blue-500/20"
        >
          Add New User
        </Button>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search by name, email, department..."
        searchKeys={['name', 'email', 'role', 'department']}
        filterKey="role"
        filterLabel="Role"
        filterOptions={['Super Admin', 'Operations Manager', 'Dean of Academics', 'Finance Director', 'Senior Faculty', 'HR Lead', 'Administrator']}
        pageSize={8}
      />

      {/* Modal: Add User */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Organization User"
        subtitle="Create access credentials and assign departmental roles"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Maya Iyer"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
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
              placeholder="maya.i@smartora.io"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Administrator">Administrator</option>
                <option value="Senior Faculty">Senior Faculty</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Finance Director">Finance Director</option>
                <option value="HR Lead">HR Lead</option>
                <option value="Quality Analyst">Quality Analyst</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Management">Management</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit User */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User Profile"
        subtitle={`Updating details for ${selectedUser?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Administrator">Administrator</option>
                <option value="Senior Faculty">Senior Faculty</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Finance Director">Finance Director</option>
                <option value="HR Lead">HR Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: View User Details */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Profile Details"
        subtitle="Identity verification and permissions profile"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/40"
              />
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedUser.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedUser.status === 'Active' ? 'success' : 'neutral'}>
                    {selectedUser.status}
                  </Badge>
                  <span className="text-xs text-slate-400">ID: {selectedUser.id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase">Assigned Role</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{selectedUser.role}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase">Department</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{selectedUser.department}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase">Last Activity</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{selectedUser.lastActive}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold uppercase">Security Level</span>
                <span className="font-medium text-blue-600 dark:text-blue-400 text-sm mt-0.5 block">2FA Enabled</span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="secondary" size="sm" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Dialog: Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove User Account"
        message={`Are you sure you want to delete ${selectedUser?.name}? This will revoke their platform credentials.`}
      />
    </div>
  );
}
