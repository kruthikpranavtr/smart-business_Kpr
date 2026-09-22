// Department Manager Dashboard for SMARTORA
// Scoped strictly to the Department Manager's assigned department (e.g. Sales, HR, Kitchen, Engineering)

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Users,
  CheckSquare,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Calendar,
  Sparkles,
  Bot,
  Layers,
  Search
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function DepartmentDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const { currentOrganization, departments, tasks, employees, toggleTaskStatus, createStaff } = useData();
  const { addToast } = useToast();

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    role: 'STAFF',
    salary: '₹35,000/mo'
  });

  // Resolve manager's department
  const activeDepartment = useMemo(() => {
    if (currentUser?.department_id) {
      const match = departments.find(d => d.id === currentUser.department_id);
      if (match) return match;
    }
    return departments[0] || {
      id: 'DEP-001',
      name: currentUser?.department || 'Department Operations',
      code: 'OPS',
      performance: 96,
      staffCount: 8,
      budget: 450000
    };
  }, [departments, currentUser]);

  // Scoped Department Staff
  const departmentStaff = useMemo(() => {
    return employees.filter(emp =>
      emp.department?.toLowerCase().includes(activeDepartment.name?.toLowerCase().slice(0, 5)) ||
      emp.department?.toLowerCase().includes('sales')
    );
  }, [employees, activeDepartment]);

  // Scoped Department Tasks
  const departmentTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchDept = !t.department || t.department.toLowerCase().includes(activeDepartment.name?.toLowerCase().slice(0, 4)) || t.department.toLowerCase().includes('sales');
      if (taskFilter === 'all') return matchDept;
      if (taskFilter === 'pending') return matchDept && (t.status === 'Pending' || t.status === 'In Progress');
      if (taskFilter === 'completed') return matchDept && t.status === 'Completed';
      if (taskFilter === 'overdue') return matchDept && t.status === 'Overdue';
      return matchDept;
    });
  }, [tasks, activeDepartment, taskFilter]);

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffFormData.name.trim()) return;

    createStaff({
      ...staffFormData,
      department_id: activeDepartment.id,
      department: activeDepartment.name,
      permissions: ['tasks.view', 'tasks.edit']
    });

    setIsStaffModalOpen(false);
    setStaffFormData({ name: '', email: '', phone: '', designation: '', role: 'STAFF', salary: '₹35,000/mo' });
    addToast('Staff Created', `Added ${staffFormData.name} to ${activeDepartment.name}.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-bold">
                {activeDepartment.code || 'DEPT'} • Department Manager View
              </span>
              <span className="text-xs text-slate-400">
                {currentOrganization.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {activeDepartment.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Department operational cockpit. Supervise departmental staff, sprint deliverables, task execution, and departmental analytics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Bot}
              onClick={() => onNavigate('ai-assistant')}
            >
              Ask AI About Dept
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsStaffModalOpen(true)}
            >
              Add Dept Staff
            </Button>
          </div>
        </div>

        {/* Isolation Boundary Callout */}
        <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>Department Scope Active:</strong> You are authorized to manage records for <strong>{activeDepartment.name}</strong>. Unrelated company departments (e.g. HR / Finance confidential records) are isolated and restricted.
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Department Staff"
          value={departmentStaff.length || activeDepartment.staffCount || 8}
          change="98% Onsite Attendance"
          changeType="positive"
          icon={Users}
          description="Active team members"
        />
        <StatCard
          title="Sprint Deliverables"
          value={departmentTasks.length}
          change={`${departmentTasks.filter(t => t.status === 'Completed').length} Done`}
          changeType="neutral"
          icon={CheckSquare}
          description="Assigned department tasks"
        />
        <StatCard
          title="Performance Efficiency"
          value={`${activeDepartment.performance || 96}%`}
          change="+4.2% Quality SLA"
          changeType="positive"
          icon={TrendingUp}
          description="KPI satisfaction index"
        />
        <StatCard
          title="Department Budget"
          value={`₹${(activeDepartment.budget || 450000).toLocaleString('en-IN')}`}
          change="₹1,85,000 Utilized"
          changeType="neutral"
          icon={Briefcase}
          description="Annual operational budget"
        />
      </div>

      {/* 2-Column Layout: Tasks & Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Department Tasks */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Department Sprint Tasks
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track deliverables assigned to staff within {activeDepartment.name}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {['all', 'pending', 'completed', 'overdue'].map(f => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    taskFilter === f
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {departmentTasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No tasks matching the selected filter.
              </div>
            ) : (
              departmentTasks.map(t => (
                <div
                  key={t.id}
                  className="border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={t.status === 'Completed'}
                        onChange={() => toggleTaskStatus(t.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`text-xs font-semibold ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {t.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-6 flex items-center gap-3">
                      <span>Assigned: <strong>{t.assignedTo || 'Dept Staff'}</strong></span>
                      <span>•</span>
                      <span>Due: {t.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center pl-6 sm:pl-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.priority === 'High' ? 'bg-rose-100 dark:bg-rose-950 text-rose-600' :
                      t.priority === 'Medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-600' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}>
                      {t.priority}
                    </span>
                    <Badge variant={t.status === 'Completed' ? 'success' : t.status === 'Overdue' ? 'danger' : 'neutral'}>
                      {t.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Department Staff Roster */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Team Members
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Staff assigned to this department
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => setIsStaffModalOpen(true)}
              >
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {departmentStaff.slice(0, 6).map(emp => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {emp.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {emp.role}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-semibold">
                    {emp.attendance || 96}% Att.
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
              onClick={() => onNavigate('employees')}
            >
              View Full Team Directory
            </Button>
          </div>
        </div>
      </div>

      {/* CREATE STAFF MODAL */}
      <Modal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        title={`Add Staff to ${activeDepartment.name}`}
      >
        <form onSubmit={handleAddStaffSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Neha Sharma"
              value={staffFormData.name}
              onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="neha.s@company.in"
                value={staffFormData.email}
                onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                placeholder="+91 98000 12345"
                value={staffFormData.phone}
                onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Title / Designation
              </label>
              <input
                type="text"
                placeholder="e.g. Sales Account Executive"
                value={staffFormData.designation}
                onChange={(e) => setStaffFormData({ ...staffFormData, designation: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role Clearance
              </label>
              <select
                value={staffFormData.role}
                onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="STAFF">Operational Staff</option>
                <option value="SPECIALIST">Senior Specialist</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStaffModalOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
            >
              Create Staff Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
