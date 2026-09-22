// Task Management Page for SMARTORA
import React, { useState } from 'react';
import { CheckSquare, Plus, Edit2, Trash2, Clock, AlertCircle, CheckCircle2, Filter } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatCard from '../components/common/StatCard';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useData();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    assignedTo: 'Rahul Verma',
    department: 'Operations',
    priority: 'Medium',
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Pending'
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      assignedTo: 'Rahul Verma',
      department: 'Operations',
      priority: 'Medium',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Pending'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      assignedTo: task.assignedTo,
      department: task.department,
      priority: task.priority,
      deadline: task.deadline,
      status: task.status
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Validation Error', 'Task title is required.', 'warning');
      return;
    }
    addTask(formData);
    addToast('Task Created', `"${formData.title}" assigned to ${formData.assignedTo}.`, 'success');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Validation Error', 'Task title is required.', 'warning');
      return;
    }
    updateTask(selectedTask.id, formData);
    addToast('Task Updated', `Task #${selectedTask.id} updated.`, 'success');
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      addToast('Task Deleted', `"${selectedTask.title}" has been deleted.`, 'info');
      setIsDeleteOpen(false);
    }
  };

  const handleToggle = (task) => {
    toggleTaskStatus(task.id);
    const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    addToast('Status Changed', `Task marked as ${nextStatus}.`, 'info');
  };

  const columns = [
    {
      key: 'title',
      label: 'Task & Department',
      sortable: true,
      render: (t) => (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={t.status === 'Completed'}
            onChange={() => handleToggle(t)}
            className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
          />
          <div>
            <span className={`font-semibold block ${t.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
              {t.title}
            </span>
            <span className="text-xs text-slate-400">{t.id} • {t.department}</span>
          </div>
        </div>
      )
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      sortable: true,
      render: (t) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.assignedTo}</span>
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (t) => {
        let variant = 'info';
        if (t.priority === 'High') variant = 'danger';
        if (t.priority === 'Medium') variant = 'warning';
        return <Badge variant={variant}>{t.priority}</Badge>;
      }
    },
    {
      key: 'deadline',
      label: 'Deadline',
      sortable: true,
      render: (t) => {
        const isOverdue = t.status === 'Overdue' || (new Date(t.deadline) < new Date() && t.status !== 'Completed');
        return (
          <div className="flex items-center gap-1.5 text-xs">
            <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className={isOverdue ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}>
              {t.deadline}
            </span>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (t) => {
        let variant = 'neutral';
        if (t.status === 'Completed') variant = 'success';
        if (t.status === 'In Progress') variant = 'info';
        if (t.status === 'Pending') variant = 'warning';
        if (t.status === 'Overdue') variant = 'danger';

        return <Badge variant={variant}>{t.status}</Badge>;
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      className: 'text-right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenEdit(t)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(t)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const totalCompleted = tasks.filter(t => t.status === 'Completed').length;
  const totalInProgress = tasks.filter(t => t.status === 'In Progress').length;
  const totalPending = tasks.filter(t => t.status === 'Pending').length;
  const totalOverdue = tasks.filter(t => t.status === 'Overdue').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Operational Task Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sprint work packages, faculty commitments, and administrative deadlines
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          icon={Plus}
          onClick={handleOpenAdd}
          className="shadow-sm shadow-blue-500/20"
        >
          Create Task
        </Button>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Completed"
          value={totalCompleted}
          change="91% on-time"
          isPositive={true}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="In Progress"
          value={totalInProgress}
          change="Active sprint"
          isPositive={true}
          icon={CheckSquare}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={totalPending}
          change="Awaiting start"
          isPositive={true}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Overdue"
          value={totalOverdue}
          change="Urgent follow-up"
          isPositive={false}
          icon={AlertCircle}
          color="rose"
        />
      </div>

      {/* Main Tasks Table */}
      <DataTable
        columns={columns}
        data={tasks}
        searchPlaceholder="Search task title, assignee, department..."
        searchKeys={['title', 'assignedTo', 'department', 'id']}
        filterKey="status"
        filterLabel="Status"
        filterOptions={['Pending', 'In Progress', 'Completed', 'Overdue']}
        pageSize={8}
      />

      {/* Modal: Add Task */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Operational Task"
        subtitle="Assign responsibility and set completion targets"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Conduct Semester Internal Assessment Audit"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Assigned To
              </label>
              <input
                type="text"
                required
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="e.g. Sneha Patel"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
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
                <option value="Academics">Academics</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Task */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modify Task"
        subtitle={`Updating task #${selectedTask?.id}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Assigned To
              </label>
              <input
                type="text"
                required
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
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
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Deadline
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to remove "${selectedTask?.title}"?`}
      />
    </div>
  );
}
