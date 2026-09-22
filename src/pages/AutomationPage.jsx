// Smart Business Automation Engine for SMARTORA
// Configurable rule builder with event triggers, conditions, automated actions, and real-time execution logs

import React, { useState, useMemo } from 'react';
import {
  Zap,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Sliders,
  Filter
} from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function AutomationPage() {
  const { automationRules, toggleAutomationRule, addAutomationRule, runAutomationRuleManually } = useData();
  const { addToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Rule Form State
  const [newRule, setNewRule] = useState({
    name: '',
    category: 'Inventory',
    trigger: 'Inventory Stock Update',
    condition: 'When product stock <= minStock',
    action: 'Generate high-urgency alert & create pending restock task'
  });

  // Metrics
  const metrics = useMemo(() => {
    const totalCount = automationRules.length;
    const activeCount = automationRules.filter(r => r.enabled).length;
    const totalExecutions = automationRules.reduce((acc, r) => acc + (r.executionCount || 0), 0);
    const estimatedHoursSaved = Math.round(totalExecutions * 0.25); // ~15 mins per manual routine automated

    return {
      totalCount,
      activeCount,
      totalExecutions,
      estimatedHoursSaved
    };
  }, [automationRules]);

  const filteredRules = useMemo(() => {
    if (categoryFilter === 'all') return automationRules;
    return automationRules.filter(r => r.category === categoryFilter);
  }, [automationRules, categoryFilter]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newRule.name.trim()) {
      addToast('Rule Name Required', 'Please provide a name for this automation rule.', 'warning');
      return;
    }

    addAutomationRule(newRule);
    addToast('Rule Activated', `Automation "${newRule.name}" created and online.`, 'success');
    setIsCreateOpen(false);
    setNewRule({
      name: '',
      category: 'Inventory',
      trigger: 'Inventory Stock Update',
      condition: 'When product stock <= minStock',
      action: 'Generate high-urgency alert & create pending restock task'
    });
  };

  const handleRunNow = (ruleId, ruleName) => {
    runAutomationRuleManually(ruleId);
    addToast('Automation Triggered', `Rule "${ruleName}" executed successfully.`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Smart Automation Engine
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              Active Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automate routine business operations, stock replenishment alerts, invoice escalations, and VIP customer enrollments.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          icon={Plus}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
        >
          Create Automation Rule
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Active Automations</span>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
            {metrics.activeCount} <span className="text-xs text-slate-400 font-normal">/ {metrics.totalCount} rules</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Listening for system events
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Automated Executions</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">
            {metrics.totalExecutions.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
            Zero human intervention
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Operational Hours Saved</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">
            ~{metrics.estimatedHoursSaved} Hours
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Productivity gain this month
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Rule Health Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            99.9%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            All event listeners active
          </span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Inventory', 'Finance', 'CRM', 'Sales', 'Tasks', 'Operations', 'Procurement'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300'
            }`}
          >
            {cat === 'all' ? 'All Automation Rules' : cat}
          </button>
        ))}
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-3xl border transition-all ${
              rule.enabled
                ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/50 dark:border-slate-800/50 opacity-70'
            }`}
          >
            {/* Rule Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  rule.enabled ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-800/40">
                    {rule.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                    {rule.name}
                  </h3>
                </div>
              </div>

              {/* Enable / Disable Toggle */}
              <button
                onClick={() => toggleAutomationRule(rule.id)}
                title={rule.enabled ? 'Click to disable rule' : 'Click to enable rule'}
                className="text-slate-400 hover:text-blue-600 transition"
              >
                {rule.enabled ? (
                  <ToggleRight className="w-8 h-8 text-blue-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            {/* Rule Logic Schema */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/80 space-y-2 text-xs mb-4">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 w-16 shrink-0 mt-0.5">
                  Trigger:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {rule.trigger}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-extrabold uppercase text-amber-500 w-16 shrink-0 mt-0.5">
                  Condition:
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  {rule.condition}
                </span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 w-16 shrink-0 mt-0.5">
                  Action:
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {rule.action}
                </span>
              </div>
            </div>

            {/* Rule Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="block text-[11px]">Last Run: <strong>{rule.lastRun}</strong></span>
                <span className="block text-[10px] text-slate-400">Fired {rule.executionCount} times</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRunNow(rule.id, rule.name)}
                icon={Play}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Run Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Automation Logs Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Live Execution Audit Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time feed of automated triggers evaluated by the SMARTORA background engine.
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        <div className="space-y-3">
          {[
            { rule: 'Low Stock Auto-Alert', time: '12 mins ago', outcome: 'Out-of-stock notification dispatched for Lay\'s Chips & Good Knight refilled in reorder queue.', status: 'Success' },
            { rule: 'VIP Customer Auto-Enrollment', time: '2 hours ago', outcome: 'Upgraded Tanmay Bhat to VIP Enterprise tier (Cumulative Spend: ₹1,04,500).', status: 'Success' },
            { rule: 'Overdue Task Auto-Escalation', time: '4 hours ago', outcome: 'Elevated Task "Inspect Fire Extinguishers" to Urgent priority.', status: 'Success' },
            { rule: 'Overdue Invoice Reminder', time: '12 hours ago', outcome: 'Dispatched automated reminder for Invoice #INV-2026-006 (Nexus BioLabs).', status: 'Success' },
            { rule: 'Daily Closing POS Reconciliation', time: 'Yesterday 9:30 PM', outcome: 'Triggered closing balance prompt for Counter 1, 2 and 3.', status: 'Success' }
          ].map((log, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {log.rule}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {log.time}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    {log.outcome}
                  </p>
                </div>
              </div>
              <Badge variant="success">Executed</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE AUTOMATION RULE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Custom Automation Rule"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Rule Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. High Value Sale Slack Alert"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Category
              </label>
              <select
                value={newRule.category}
                onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Inventory">Inventory</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="CRM">CRM & Customers</option>
                <option value="Tasks">Tasks & Operations</option>
                <option value="Procurement">Procurement</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Event Trigger
              </label>
              <select
                value={newRule.trigger}
                onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Inventory Stock Update">Inventory Stock Update</option>
                <option value="POS Checkout Order Created">POS Checkout Order Created</option>
                <option value="Daily Midnight Clock (00:00 IST)">Daily Midnight Clock</option>
                <option value="Expense Log Entry Added">Expense Log Entry Added</option>
                <option value="Customer Total Spend Milestone">Customer Total Spend Milestone</option>
                <option value="Task Due Date Elapsed">Task Due Date Elapsed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Condition Expression
            </label>
            <input
              type="text"
              placeholder="e.g. When product stock <= minStock or order amount >= 15000"
              value={newRule.condition}
              onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Automated Action to Dispatch
            </label>
            <input
              type="text"
              placeholder="e.g. Generate high-urgency alert & create pending restock task"
              value={newRule.action}
              onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Activate Rule
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
