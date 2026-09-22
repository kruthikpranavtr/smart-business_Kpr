// Hotel Housekeeping & Room Turnover Management for SMARTORA
// Cleaning tasks, room inspection status, turnover velocity, and maintenance alerts

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Wrench,
  Search,
  CheckSquare,
  BedDouble,
  ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function HotelHousekeepingPage({ onNavigate }) {
  const {
    housekeeping = [],
    rooms = [],
    updateHousekeepingTask,
    updateRoomStatus,
    currentOrganization
  } = useData();
  const { addToast } = useToast();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const dirtyCount = housekeeping.filter(h => h.state === 'DIRTY').length;
  const inProgressCount = housekeeping.filter(h => h.state === 'IN_PROGRESS').length;
  const cleanCount = housekeeping.filter(h => h.state === 'CLEAN').length;
  const maintCount = housekeeping.filter(h => h.state === 'MAINTENANCE').length;

  const filteredTasks = useMemo(() => {
    return housekeeping.filter(h => {
      const matchSearch = h.roomNumber?.includes(searchQuery) ||
        h.assignedStaff?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchState = activeFilter === 'ALL' || h.state === activeFilter;
      return matchSearch && matchState;
    });
  }, [housekeeping, searchQuery, activeFilter]);

  const handleAdvanceStatus = (task) => {
    let nextState = 'IN_PROGRESS';
    if (task.state === 'DIRTY') nextState = 'IN_PROGRESS';
    else if (task.state === 'IN_PROGRESS') nextState = 'CLEAN';
    else if (task.state === 'CLEAN') nextState = 'INSPECTED';

    updateHousekeepingTask(task.id, nextState);
    if (nextState === 'CLEAN' || nextState === 'INSPECTED') {
      updateRoomStatus(task.roomNumber, 'AVAILABLE');
    }
    addToast('Task Updated', `Room ${task.roomNumber} turnover advanced to ${nextState}.`, 'success');
  };

  const getStateBadge = (state) => {
    switch (state) {
      case 'DIRTY':
        return <Badge variant="danger">Dirty - Turnover Needed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">Cleaning In Progress</Badge>;
      case 'CLEAN':
        return <Badge variant="info">Cleaned - Ready for Check</Badge>;
      case 'INSPECTED':
        return <Badge variant="success">Inspected & Ready</Badge>;
      case 'MAINTENANCE':
        return <Badge variant="purple">Maintenance</Badge>;
      default:
        return <Badge>{state}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-800 text-white shadow-xl shadow-sky-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              Housekeeping Directorate
            </span>
            <span className="text-xs text-blue-100">
              • {currentOrganization?.name || 'Grand Mirage Resort'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Housekeeping & Room Turnovers
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
            Room sterilization, linens replenishment, maintenance dispatches, and arrival readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate && onNavigate('rooms')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            Room Matrix
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Turnovers Pending (Dirty)"
          value={dirtyCount}
          change={dirtyCount > 0 ? "Turnover Queue" : "All Clean"}
          isPositive={dirtyCount === 0}
          icon={Clock}
          color={dirtyCount > 0 ? "rose" : "emerald"}
        />
        <StatCard
          title="Turnover in Progress"
          value={inProgressCount}
          change="Staff Assigned"
          isPositive={true}
          icon={Sparkles}
          color="amber"
        />
        <StatCard
          title="Clean & Ready for Key"
          value={cleanCount}
          change="Available for Guest"
          isPositive={true}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Maintenance Holds"
          value={maintCount}
          change="Engineering Team"
          isPositive={maintCount === 0}
          icon={Wrench}
          color="purple"
        />
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Tasks ({housekeeping.length})
          </button>
          <button
            onClick={() => setActiveFilter('DIRTY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'DIRTY'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Dirty ({dirtyCount})
          </button>
          <button
            onClick={() => setActiveFilter('IN_PROGRESS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'IN_PROGRESS'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setActiveFilter('CLEAN')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'CLEAN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Clean ({cleanCount})
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search room, staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  Room #{task.roomNumber}
                </span>
                {getStateBadge(task.state)}
              </div>

              <h4 className="text-xs font-semibold text-slate-500 mt-0.5">
                {task.type} • Priority: <span className="font-bold text-slate-700 dark:text-slate-300">{task.priority}</span>
              </h4>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                <div><span className="text-slate-400">Assigned Staff:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{task.assignedStaff || 'Unassigned'}</span></div>
                <div><span className="text-slate-400">Turnover Notes:</span> <span className="font-medium text-slate-700 dark:text-slate-300">{task.notes}</span></div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Progress step:</span>
              <Button
                size="sm"
                onClick={() => handleAdvanceStatus(task)}
                className="text-xs py-1 px-3"
              >
                {task.state === 'DIRTY' && 'Start Cleaning'}
                {task.state === 'IN_PROGRESS' && 'Mark Cleaned'}
                {task.state === 'CLEAN' && 'Inspect & Release'}
                {task.state === 'INSPECTED' && 'Completed'}
                {task.state === 'MAINTENANCE' && 'Clear Maintenance'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
