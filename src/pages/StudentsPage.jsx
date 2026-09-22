// Student / Customer Management Page for SMARTORA
// Seamlessly handles Student view (Institution) and Customer view (Business)

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Plus,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  Layers
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatCard from '../components/common/StatCard';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function StudentsPage() {
  const {
    students,
    customers,
    addStudent,
    updateStudent,
    deleteStudent,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    viewMode,
    toggleViewMode
  } = useData();

  const { addToast } = useToast();

  const isInstitution = viewMode === 'institution';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Student Form
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    year: '1st Year',
    attendance: 85,
    gpa: '3.6',
    status: 'Regular'
  });

  // Customer Form
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    orders: 1,
    totalSpent: 50000,
    status: 'Active'
  });

  const handleOpenAdd = () => {
    if (isInstitution) {
      setStudentForm({
        name: '',
        email: '',
        department: 'Computer Science',
        year: '1st Year',
        attendance: 85,
        gpa: '3.6',
        status: 'Regular'
      });
    } else {
      setCustomerForm({
        name: '',
        email: '',
        phone: '',
        orders: 1,
        totalSpent: 0,
        status: 'Active'
      });
    }
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    if (isInstitution) {
      setStudentForm({
        name: item.name,
        email: item.email,
        department: item.department,
        year: item.year,
        attendance: item.attendance,
        gpa: item.gpa,
        status: item.status
      });
    } else {
      setCustomerForm({
        name: item.name,
        email: item.email,
        phone: item.phone,
        orders: item.orders,
        totalSpent: item.totalSpent,
        status: item.status
      });
    }
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (isInstitution) {
      if (!studentForm.name.trim() || !studentForm.email.trim()) {
        addToast('Validation Error', 'Name and email are mandatory.', 'warning');
        return;
      }
      addStudent(studentForm);
      addToast('Student Enrolled', `${studentForm.name} added to the register.`, 'success');
    } else {
      if (!customerForm.name.trim() || !customerForm.email.trim()) {
        addToast('Validation Error', 'Client name and email are mandatory.', 'warning');
        return;
      }
      addCustomer(customerForm);
      addToast('Customer Created', `${customerForm.name} added to CRM ledger.`, 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (isInstitution) {
      updateStudent(selectedItem.id, studentForm);
      addToast('Student Record Updated', `${studentForm.name} details saved.`, 'success');
    } else {
      updateCustomer(selectedItem.id, customerForm);
      addToast('Customer Record Updated', `${customerForm.name} details saved.`, 'success');
    }
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      if (isInstitution) {
        deleteStudent(selectedItem.id);
        addToast('Student Removed', `${selectedItem.name} removed from roster.`, 'info');
      } else {
        deleteCustomer(selectedItem.id);
        addToast('Customer Removed', `${selectedItem.name} removed from CRM.`, 'info');
      }
      setIsDeleteOpen(false);
    }
  };

  // Student Columns
  const studentColumns = [
    {
      key: 'id',
      label: 'Student ID',
      sortable: true,
      render: (s) => <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">{s.id}</span>
    },
    {
      key: 'name',
      label: 'Student Name',
      sortable: true,
      render: (s) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white block">{s.name}</span>
          <span className="text-xs text-slate-400">{s.email}</span>
        </div>
      )
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true
    },
    {
      key: 'year',
      label: 'Academic Year',
      sortable: true,
      render: (s) => <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{s.year}</span>
    },
    {
      key: 'attendance',
      label: 'Attendance Rate',
      sortable: true,
      render: (s) => {
        const isLow = s.attendance < 75;
        return (
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isLow
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
            }`}>
              {s.attendance}%
            </span>
            {isLow && (
              <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Below Threshold
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (s) => (
        <Badge variant={s.status === 'Regular' ? 'success' : s.status === 'Critical Alert' ? 'danger' : 'warning'}>
          {s.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenEdit(s)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(s)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Customer Columns
  const customerColumns = [
    {
      key: 'id',
      label: 'Customer ID',
      sortable: true,
      render: (c) => <span className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400">{c.id}</span>
    },
    {
      key: 'name',
      label: 'Account / Contact Name',
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white block">{c.name}</span>
          <span className="text-xs text-slate-400">{c.email}</span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone Contact',
      sortable: true
    },
    {
      key: 'orders',
      label: 'Lifetime Orders',
      sortable: true,
      render: (c) => <span className="font-semibold text-xs">{c.orders} orders</span>
    },
    {
      key: 'totalSpent',
      label: 'Total Valuation (₹)',
      sortable: true,
      render: (c) => <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">₹{c.totalSpent.toLocaleString('en-IN')}</span>
    },
    {
      key: 'status',
      label: 'Tier Status',
      sortable: true,
      render: (c) => (
        <Badge variant={c.status.includes('VIP') ? 'blue' : 'info'}>
          {c.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenEdit(c)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(c)}
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
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            {isInstitution ? <GraduationCap className="w-6 h-6 text-blue-600" /> : <Users className="w-6 h-6 text-cyan-600" />}
            {isInstitution ? 'Student Management' : 'Customer & Client CRM'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isInstitution
              ? 'Enrolled student directory, academic year batches, and attendance threshold monitoring'
              : 'Enterprise client relationships, order transaction records, and account valuations'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Dual Perspective Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => toggleViewMode('institution')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isInstitution
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Students (Edu)
            </button>
            <button
              onClick={() => toggleViewMode('business')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !isInstitution
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Customers (Biz)
            </button>
          </div>

          <Button
            variant="gradient"
            size="sm"
            icon={Plus}
            onClick={handleOpenAdd}
            className="shadow-sm shadow-blue-500/20"
          >
            {isInstitution ? 'Add Student' : 'Add Customer'}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {isInstitution ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={students.length}
            change="+18 this semester"
            isPositive={true}
            icon={GraduationCap}
            color="blue"
          />
          <StatCard
            title="Average Attendance"
            value="87.2%"
            change="-8.4% dip"
            isPositive={false}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Low Attendance Alert"
            value={students.filter(s => s.attendance < 75).length}
            change="Critical"
            isPositive={false}
            icon={AlertTriangle}
            color="rose"
          />
          <StatCard
            title="Regular Status"
            value={students.filter(s => s.status === 'Regular').length}
            change="Compliant"
            isPositive={true}
            icon={CheckCircle2}
            color="emerald"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Total Customers"
            value={customers.length}
            change="+3 new accounts"
            isPositive={true}
            icon={Users}
            color="cyan"
          />
          <StatCard
            title="VIP Enterprise"
            value={customers.filter(c => c.status.includes('VIP')).length}
            change="High LTV"
            isPositive={true}
            icon={ShoppingBag}
            color="blue"
          />
          <StatCard
            title="CRM Valuation"
            value="₹26,72,000"
            change="+21% QoQ"
            isPositive={true}
            icon={TrendingUp}
            color="emerald"
          />
          <StatCard
            title="Active Pipeline"
            value="8 Corporate"
            change="100% Retained"
            isPositive={true}
            icon={Layers}
            color="blue"
          />
        </div>
      )}

      {/* Main Table */}
      {isInstitution ? (
        <DataTable
          columns={studentColumns}
          data={students}
          searchPlaceholder="Search by name, ID, department..."
          searchKeys={['name', 'id', 'department', 'email']}
          filterKey="department"
          filterLabel="Department"
          filterOptions={['Computer Science', 'Information Technology', 'Mechanical Engineering', 'Electronics & Comm.', 'Business Admin']}
          pageSize={8}
        />
      ) : (
        <DataTable
          columns={customerColumns}
          data={customers}
          searchPlaceholder="Search client account, phone, email..."
          searchKeys={['name', 'id', 'email', 'phone']}
          filterKey="status"
          filterLabel="Status"
          filterOptions={['VIP Enterprise', 'Active', 'Standard']}
          pageSize={8}
        />
      )}

      {/* Modal: Add Student/Customer */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={isInstitution ? 'Enroll New Student' : 'Add New Client / Customer'}
        subtitle={isInstitution ? 'Register student into department roster' : 'Add commercial enterprise account to CRM'}
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isInstitution ? 'Student Full Name *' : 'Client Organization Name *'}
            </label>
            <input
              type="text"
              required
              value={isInstitution ? studentForm.name : customerForm.name}
              onChange={(e) =>
                isInstitution
                  ? setStudentForm({ ...studentForm, name: e.target.value })
                  : setCustomerForm({ ...customerForm, name: e.target.value })
              }
              placeholder={isInstitution ? 'e.g. Aarav Sharma' : 'e.g. Apex Tech Solutions'}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={isInstitution ? studentForm.email : customerForm.email}
              onChange={(e) =>
                isInstitution
                  ? setStudentForm({ ...studentForm, email: e.target.value })
                  : setCustomerForm({ ...customerForm, email: e.target.value })
              }
              placeholder={isInstitution ? 'aarav@campus.edu' : 'contact@apextech.in'}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          {isInstitution ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  value={studentForm.department}
                  onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electronics & Comm.">Electronics & Comm.</option>
                  <option value="Business Admin">Business Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Academic Year
                </label>
                <select
                  value={studentForm.year}
                  onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="+91 98450 11223"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Status Tier
                </label>
                <select
                  value={customerForm.status}
                  onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="VIP Enterprise">VIP Enterprise</option>
                  <option value="Active">Active</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Student/Customer */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={isInstitution ? 'Update Student Record' : 'Edit Customer Account'}
        subtitle={`Modifying profile for ${selectedItem?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={isInstitution ? studentForm.name : customerForm.name}
              onChange={(e) =>
                isInstitution
                  ? setStudentForm({ ...studentForm, name: e.target.value })
                  : setCustomerForm({ ...customerForm, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={isInstitution ? studentForm.email : customerForm.email}
              onChange={(e) =>
                isInstitution
                  ? setStudentForm({ ...studentForm, email: e.target.value })
                  : setCustomerForm({ ...customerForm, email: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          {isInstitution && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Attendance Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={studentForm.attendance}
                  onChange={(e) => setStudentForm({ ...studentForm, attendance: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Compliance Status
                </label>
                <select
                  value={studentForm.status}
                  onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Regular">Regular</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Critical Alert">Critical Alert</option>
                </select>
              </div>
            </div>
          )}

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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Record"
        message={`Are you sure you want to remove ${selectedItem?.name}? This action cannot be reverted.`}
      />
    </div>
  );
}
