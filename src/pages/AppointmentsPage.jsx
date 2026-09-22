// Appointments & Bookings Management Page for SMARTORA
// Handles client consultations, service bookings, doctor/specialist slots, and customer schedule

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Trash2,
  Edit2,
  Check,
  X
} from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function AppointmentsPage() {
  const { appointments, addAppointment, updateAppointment, cancelAppointment, currentOrganization } = useData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);

  const [formData, setFormData] = useState({
    clientName: '',
    service: '',
    staff: 'General Staff',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    status: 'Confirmed',
    notes: ''
  });

  // Metrics
  const metrics = useMemo(() => {
    const totalCount = appointments.length;
    const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
    const pendingCount = appointments.filter(a => a.status === 'Pending').length;
    const completedCount = appointments.filter(a => a.status === 'Completed').length;

    return {
      totalCount,
      confirmedCount,
      pendingCount,
      completedCount
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchSearch =
        a.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.staff?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;

      return true;
    });
  }, [appointments, searchTerm, statusFilter]);

  const handleOpenBook = () => {
    setEditingApt(null);
    setFormData({
      clientName: '',
      service: '',
      staff: 'General Staff',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      status: 'Confirmed',
      notes: ''
    });
    setIsBookOpen(true);
  };

  const handleOpenEdit = (apt) => {
    setEditingApt(apt);
    setFormData({
      clientName: apt.clientName,
      service: apt.service,
      staff: apt.staff,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      notes: apt.notes || ''
    });
    setIsBookOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.service.trim()) {
      addToast('Missing Info', 'Please enter client name and service description.', 'warning');
      return;
    }

    if (editingApt) {
      updateAppointment(editingApt.id, formData);
      addToast('Appointment Updated', `Booking for ${formData.clientName} saved.`, 'success');
    } else {
      addAppointment(formData);
      addToast('Appointment Scheduled', `Booking for ${formData.clientName} confirmed.`, 'success');
    }

    setIsBookOpen(false);
  };

  const handleStatusChange = (id, nextStatus) => {
    updateAppointment(id, { status: nextStatus });
    addToast('Status Updated', `Booking status changed to ${nextStatus}.`, 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Appointments & Bookings
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
              Scheduler
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage customer appointments, doctor consultations, service slots, and VIP meetings.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenBook}
          icon={Plus}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
        >
          Book Appointment
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Bookings</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">
            {metrics.totalCount}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Scheduled on calendar
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Confirmed Slots</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {metrics.confirmedCount}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
            Ready for service
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Pending Approval</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
            {metrics.pendingCount}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Awaiting slot confirmation
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Completed Sessions</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
            {metrics.completedCount}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Satisfied client visits
          </span>
        </div>
      </div>

      {/* Filter and Table View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setStatusFilter('Confirmed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'Confirmed'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'Pending'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('Completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'Completed'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search client, service or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Client / Patient</th>
                <th className="py-3 px-3">Service / Meeting</th>
                <th className="py-3 px-3">Staff Assigned</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Notes</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No appointments scheduled matching filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {apt.date}
                      </div>
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {apt.time}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {apt.clientName}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {apt.service}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {apt.staff}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          apt.status === 'Confirmed'
                            ? 'success'
                            : apt.status === 'Pending'
                            ? 'warning'
                            : apt.status === 'Completed'
                            ? 'info'
                            : 'neutral'
                        }
                      >
                        {apt.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-[200px] truncate">
                      {apt.notes || '-'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {apt.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                            className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Confirm Booking"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {apt.status === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'Completed')}
                            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="Mark Completed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(apt)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                          title="Cancel Booking"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOOK / EDIT MODAL */}
      <Modal
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        title={editingApt ? 'Edit Appointment' : 'Book New Appointment'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Client / Patient Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Patel"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Service / Meeting Purpose *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bulk Grocery Review or Consultation"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Time Slot
              </label>
              <input
                type="text"
                placeholder="e.g. 11:30 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Staff / Specialist Assigned
              </label>
              <input
                type="text"
                placeholder="e.g. Rajeshwari Iyer"
                value={formData.staff}
                onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Internal Notes
            </label>
            <textarea
              rows={2}
              placeholder="Any specific customer instructions or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsBookOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingApt ? 'Save Changes' : 'Confirm Slot'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
