// Departments Management Page for SMARTORA
import React, { useState } from 'react';
import { Building2, Plus, Users, GraduationCap, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function DepartmentsPage() {
  const { departments, addDepartment } = useData();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: '',
    staffCount: 10,
    studentCount: 150,
    budget: 1200000,
    performance: 90
  });

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.head.trim()) {
      addToast('Validation Error', 'Department name and Head of Department are required.', 'warning');
      return;
    }
    addDepartment({
      ...formData,
      staffCount: Number(formData.staffCount),
      studentCount: Number(formData.studentCount),
      budget: Number(formData.budget),
      performance: Number(formData.performance)
    });
    addToast('Department Established', `${formData.name} added to the institutional directory.`, 'success');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Academic & Operational Departments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Departmental hierarchy, faculty head allocation, and budget telemetry
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-sm shadow-blue-500/20"
        >
          Add Department
        </Button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  {dept.code || dept.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {dept.performance}% KPI Score
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {dept.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Head: <span className="font-semibold text-slate-700 dark:text-slate-300">{dept.head}</span>
              </p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Operational Efficiency</span>
                  <span className="font-semibold">{dept.performance}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
                    style={{ width: `${dept.performance}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Staff</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{dept.staffCount}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Students</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{dept.studentCount || 'N/A'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Budget</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">₹{(dept.budget / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Department */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Establish Department"
        subtitle="Define new operational wing and designate leadership"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Department Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Electrical & Electronics Engg."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Department Code
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. EEE"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Head of Department (HOD) *
              </label>
              <input
                type="text"
                required
                value={formData.head}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                placeholder="e.g. Dr. Priya Sundaram"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Staff Count
              </label>
              <input
                type="number"
                value={formData.staffCount}
                onChange={(e) => setFormData({ ...formData, staffCount: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Student Enrolment
              </label>
              <input
                type="number"
                value={formData.studentCount}
                onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Annual Budget (₹)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
