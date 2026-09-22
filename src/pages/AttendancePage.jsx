// Attendance Management Page for SMARTORA
import React, { useState, useMemo } from 'react';
import { Clock, AlertTriangle, CheckCircle2, XCircle, Filter, Calendar, Users, BarChart3, Plus } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Line, Bar } from 'react-chartjs-2';
import '../utils/chartConfig';

export default function AttendancePage() {
  const { attendance, addAttendanceRecord, stats } = useData();
  const { addToast } = useToast();

  const [timeFilter, setTimeFilter] = useState('This Month'); // 'Today' | 'This Week' | 'This Month'
  const [deptFilter, setDeptFilter] = useState('All');
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  const [markForm, setMarkForm] = useState({
    name: '',
    department: 'Computer Science',
    status: 'Present',
    percentage: 95
  });

  const handleSaveAttendance = (e) => {
    e.preventDefault();
    if (!markForm.name.trim()) {
      addToast('Validation Error', 'Candidate name is required', 'warning');
      return;
    }
    addAttendanceRecord({
      name: markForm.name,
      department: markForm.department,
      status: markForm.status,
      percentage: Number(markForm.percentage)
    });
    addToast('Attendance Recorded', `Status logged for ${markForm.name}.`, 'success');
    setIsMarkModalOpen(false);
  };

  // Filtered attendance data
  const filteredRecords = useMemo(() => {
    return attendance.filter(item => {
      if (deptFilter !== 'All' && item.department !== deptFilter) return false;
      return true;
    });
  }, [attendance, deptFilter]);

  // Attendance Trend Chart
  const attendanceChartData = {
    labels: ['1 Sep', '5 Sep', '9 Sep', '13 Sep', '17 Sep', '21 Sep'],
    datasets: [
      {
        label: 'Overall Attendance (%)',
        data: [92.4, 90.1, 88.6, 85.2, 86.8, 87.2],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5
      }
    ]
  };

  const deptAttendanceData = {
    labels: ['CS', 'IT', 'Mech', 'ECE', 'MBA', 'Civil', 'Biotech'],
    datasets: [
      {
        label: 'Average Attendance (%)',
        data: [94.5, 91.2, 82.4, 88.0, 64.2, 73.0, 69.1],
        backgroundColor: [
          '#10b981',
          '#06b6d4',
          '#f59e0b',
          '#6366f1',
          '#f43f5e', // MBA lowest
          '#f43f5e',
          '#f43f5e'
        ],
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { min: 50, max: 100 }
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Person / Candidate Name',
      sortable: true,
      render: (a) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white block">{a.name}</span>
          <span className="text-xs text-slate-400">{a.id}</span>
        </div>
      )
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true
    },
    {
      key: 'date',
      label: 'Log Date',
      sortable: true,
      render: (a) => <span className="text-xs text-slate-500 font-mono">{a.date}</span>
    },
    {
      key: 'status',
      label: 'Daily Status',
      sortable: true,
      render: (a) => (
        <Badge variant={a.status === 'Present' ? 'success' : 'danger'}>
          {a.status}
        </Badge>
      )
    },
    {
      key: 'percentage',
      label: 'Cumulative Attendance',
      sortable: true,
      render: (a) => {
        const isBelow = a.percentage < 75;
        return (
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isBelow ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {a.percentage}%
            </span>
            {isBelow && (
              <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-0.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Below 75%
              </span>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Attendance & Threshold Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time verification of classroom presence and academic compliance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            {['Today', 'This Week', 'This Month'].map(t => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeFilter === t
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Button
            variant="gradient"
            size="sm"
            icon={Plus}
            onClick={() => setIsMarkModalOpen(true)}
            className="shadow-sm shadow-blue-500/20"
          >
            Log Entry
          </Button>
        </div>
      </div>

      {/* Critical Alert Callout */}
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 dark:text-rose-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm">
              ⚠ AUTOMATED ATTENDANCE THRESHOLD ALERT
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
              <span className="font-bold underline">43 users/students</span> are currently below the configured institutional attendance threshold (75%).
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => addToast('Notifications Dispatched', 'Advisory SMS & Email alerts generated for 43 students.', 'info')}
          className="shrink-0 text-xs font-bold"
        >
          Dispatch Warning Notices
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value="87.2%"
          change="-8.4% this month"
          isPositive={false}
          icon={Clock}
          color="blue"
          subtext="Target goal: >= 85%"
        />
        <StatCard
          title="Present Today"
          value="92%"
          change="Normal session"
          isPositive={true}
          icon={CheckCircle2}
          color="emerald"
          subtext="1,145 checked in"
        />
        <StatCard
          title="Absent Rate"
          value="8%"
          change="3% excused"
          isPositive={false}
          icon={XCircle}
          color="amber"
          subtext="100 unaccounted"
        />
        <StatCard
          title="Below Threshold"
          value="43"
          change="Critical notice"
          isPositive={false}
          icon={AlertTriangle}
          color="rose"
          subtext="Eligible for exam hold"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Campus Attendance Velocity"
          subtitle="Daily trend progression throughout September"
        >
          <div className="h-60">
            <Line data={attendanceChartData} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard
          title="Department Attendance Comparison"
          subtitle="Notice low dip in Business Admin & Biotech"
          badge={
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">
              MBA at 64%
            </span>
          }
        >
          <div className="h-60">
            <Bar data={deptAttendanceData} options={chartOptions} />
          </div>
        </ChartCard>
      </div>

      {/* Table Toolbar & Attendance Records */}
      <DataTable
        columns={columns}
        data={filteredRecords}
        searchPlaceholder="Search person name, ID, or department..."
        searchKeys={['name', 'department', 'id']}
        filterKey="department"
        filterLabel="Department"
        filterOptions={['Computer Science', 'Information Technology', 'Mechanical Engineering', 'Electronics & Comm.', 'Business Admin', 'Civil Engineering', 'Biotechnology']}
        pageSize={10}
      />

      {/* Modal: Mark Attendance */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Log Attendance Record"
        subtitle="Manually record check-in status"
      >
        <form onSubmit={handleSaveAttendance} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Person Name *
            </label>
            <input
              type="text"
              required
              value={markForm.name}
              onChange={(e) => setMarkForm({ ...markForm, name: e.target.value })}
              placeholder="e.g. Aarav Choudhury"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={markForm.department}
                onChange={(e) => setMarkForm({ ...markForm, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Business Admin">Business Admin</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Daily Status
              </label>
              <select
                value={markForm.status}
                onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Excused Leave">Excused Leave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Cumulative Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={markForm.percentage}
              onChange={(e) => setMarkForm({ ...markForm, percentage: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setIsMarkModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Record Attendance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
