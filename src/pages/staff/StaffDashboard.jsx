// Staff Dashboard for SMARTORA
// Operational role-restricted dashboard for individual employees and workforce staff

import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Clock,
  Calendar,
  Bell,
  Activity,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  Coffee,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function StaffDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const { tasks, toggleTaskStatus, notifications, currentOrganization } = useData();
  const { addToast } = useToast();

  const [clockedIn, setClockedIn] = useState(true);

  // My Tasks
  const myTasks = useMemo(() => {
    return tasks.slice(0, 6);
  }, [tasks]);

  const handleClockToggle = () => {
    const nextState = !clockedIn;
    setClockedIn(nextState);
    if (nextState) {
      addToast('Clocked In', 'Your daily shift timestamp has been recorded.', 'success');
    } else {
      addToast('Clocked Out', 'Shift recorded. Enjoy your rest!', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Staff Greeting Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-bold">
              Staff Portal • {currentUser?.department || 'Operations'}
            </span>
            <span className="text-xs text-slate-400">
              {currentOrganization.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Hello, {currentUser?.name || 'Team Member'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {currentUser?.designation || 'Staff Associate'}. Here is your operational task sprint and daily agenda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={clockedIn ? 'outline' : 'primary'}
            size="sm"
            icon={clockedIn ? Coffee : UserCheck}
            onClick={handleClockToggle}
            className={clockedIn ? 'border-emerald-400 text-emerald-600' : ''}
          >
            {clockedIn ? 'Clocked In (Active)' : 'Clock In Now'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={CheckSquare}
            onClick={() => onNavigate('tasks')}
          >
            Full Task Board
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Assigned Tasks"
          value={myTasks.length}
          change="3 Priority Items"
          changeType="neutral"
          icon={CheckSquare}
          description="Assigned to your queue"
        />
        <StatCard
          title="Completed This Week"
          value={myTasks.filter(t => t.status === 'Completed').length || 4}
          change="100% On-Time"
          changeType="positive"
          icon={CheckCircle2}
          description="Closed deliverables"
        />
        <StatCard
          title="Attendance & Punctuality"
          value="98.5%"
          change="Regular Tier"
          changeType="positive"
          icon={Calendar}
          description="Monthly attendance record"
        />
        <StatCard
          title="Performance Rating"
          value="4.9 / 5.0"
          change="Top 5% Staff"
          changeType="positive"
          icon={Award}
          description="Department supervisor score"
        />
      </div>

      {/* 2-Col Layout: Tasks & Daily Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Tasks */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                My Task Deliverables
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check off items as you complete them during your shift
              </p>
            </div>
            <span className="text-xs text-blue-600 font-medium">
              {myTasks.filter(t => t.status === 'Completed').length} / {myTasks.length} Done
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {myTasks.map(t => (
              <div
                key={t.id}
                className="border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.status === 'Completed'}
                    onChange={() => {
                      toggleTaskStatus(t.id);
                      addToast('Task Updated', `Task status toggled.`, 'info');
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <div className={`text-xs font-semibold ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {t.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Due: {t.deadline} • Priority: {t.priority}
                    </div>
                  </div>
                </div>

                <Badge variant={t.status === 'Completed' ? 'success' : t.status === 'Overdue' ? 'danger' : 'neutral'}>
                  {t.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Today's Shift Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Shift Timeline & Agenda
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Today's operational checkpoints
            </p>
          </div>

          <div className="space-y-3.5 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-3">
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[19px] top-1" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">09:00 AM</div>
              <div className="text-xs text-slate-500">Morning Shift Standup & Attendance Sync</div>
            </div>

            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[19px] top-1" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">11:30 AM</div>
              <div className="text-xs text-slate-500">Department Sprint & Deliverables Check</div>
            </div>

            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute -left-[19px] top-1" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">02:30 PM</div>
              <div className="text-xs text-slate-500">Client / Customer Follow-ups & Service Logs</div>
            </div>

            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 absolute -left-[19px] top-1" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">05:30 PM</div>
              <div className="text-xs text-slate-500">Evening Log Verification & Sign-off</div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-800 dark:text-blue-300">
            💡 <strong>Pro Tip:</strong> Need help with task prioritization? Use the AI Assistant to review your daily workload.
          </div>
        </div>
      </div>
    </div>
  );
}
