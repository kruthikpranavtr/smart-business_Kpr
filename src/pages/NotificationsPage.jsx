// Smart Alerts & Notifications Page for SMARTORA
import React, { useState, useMemo } from 'react';
import {
  Bell,
  AlertTriangle,
  Package,
  Receipt,
  CheckCircle2,
  DollarSign,
  Cpu,
  Trash2,
  Check,
  Filter,
  ArrowRight,
  Clock
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function NotificationsPage({ onNavigate }) {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useData();
  const { addToast } = useToast();

  const [activeFilter, setActiveFilter] = useState('All');

  const alertTypes = [
    'All',
    'Attendance Alert',
    'Inventory Alert',
    'Expense Alert',
    'Task Alert',
    'Payment Alert',
    'System Alert'
  ];

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'All') return notifications;
    return notifications.filter(n => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id) => {
    markNotificationRead(id);
    addToast('Alert Marked as Read', '', 'info');
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteNotification(id);
    addToast('Notification Removed', '', 'info');
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'Attendance Alert':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'Inventory Alert':
        return <Package className="w-5 h-5 text-amber-500" />;
      case 'Expense Alert':
        return <Receipt className="w-5 h-5 text-blue-500" />;
      case 'Task Alert':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Payment Alert':
        return <DollarSign className="w-5 h-5 text-sky-500" />;
      default:
        return <Cpu className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Smart Alerts & Incident Telemetry
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated signals triggered by threshold breaches, stock minimums, and system anomalies
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={Check}
            onClick={() => {
              markAllNotificationsRead();
              addToast('All Caught Up', 'All notifications marked as read.', 'success');
            }}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {alertTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === type
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.targetPage && onNavigate) onNavigate(notif.targetPage);
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group ${
                !notif.read
                  ? 'bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-800 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getAlertIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {notif.title}
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {notif.type}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3" /> {notif.time}
                      </span>
                      {notif.targetPage && (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline flex items-center gap-0.5">
                          Inspect in {notif.targetPage} <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleDelete(notif.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-slate-400">
            <p className="text-sm">No alerts found for category "{activeFilter}".</p>
          </div>
        )}
      </div>
    </div>
  );
}
