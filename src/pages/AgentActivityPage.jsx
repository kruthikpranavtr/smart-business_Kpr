// Agent Activity Page for SMARTORA
// Autonomous Agent Execution Log, Reasoning Plans, Tool Traces, and Human Approval Audit

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Cpu,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Zap,
  Play,
  Filter,
  Eye,
  ArrowRight,
  Sparkles,
  FileCheck,
  User,
  Check,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { agentOrchestrator } from '../services/ai/agentOrchestrator';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function AgentActivityPage({ onNavigate }) {
  const {
    currentOrganization,
    agentRuns,
    pendingApprovals,
    approveAgentAction,
    rejectAgentAction
  } = useData();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRun, setSelectedRun] = useState(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchGoal, setDispatchGoal] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Filtered runs
  const filteredRuns = useMemo(() => {
    return agentRuns.filter(r => {
      if (filterStatus === 'All') return true;
      if (filterStatus === 'Pending Approval') return r.approvalStatus === 'Pending Approval';
      if (filterStatus === 'Autonomous') return r.approvalStatus === 'Autonomous';
      if (filterStatus === 'Completed') return r.status === 'Completed';
      return true;
    });
  }, [agentRuns, filterStatus]);

  // Handle Manual Agent Dispatch
  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!dispatchGoal.trim()) return;

    setIsExecuting(true);
    addToast('Agent Orchestrator Engaged', 'Formulating execution plan and evaluating tools...', 'info');

    try {
      const result = await agentOrchestrator.runAgent(dispatchGoal, {
        userId: currentUser?.id,
        userName: currentUser?.name,
        role: currentUser?.role,
        department: currentUser?.department,
        department_id: currentUser?.department_id,
        organization_id: currentOrganization?.id,
        organizationName: currentOrganization?.name,
        currencySymbol: currentOrganization?.currencySymbol || '₹'
      });

      setIsExecuting(false);
      setIsDispatchModalOpen(false);
      setDispatchGoal('');

      if (result.requiresApproval) {
        addToast('Action Requires Approval', 'High-risk action prepared and queued for executive review.', 'warning');
      } else {
        addToast('Agent Plan Executed', `Run ${result.runId} completed successfully.`, 'success');
      }
    } catch (err) {
      setIsExecuting(false);
      addToast('Execution Error', 'Failed to execute agent workflow.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              Autonomous Agent Orchestrator
            </span>
            <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Scoped: {currentOrganization?.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            Agent Activity & Reasoning Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time audit telemetry of autonomous AI agent goals, reasoning plans, tool executions, and executive approval checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={Play}
            onClick={() => setIsDispatchModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
          >
            Dispatch Agent Task
          </Button>
        </div>
      </div>

      {/* Pending Human Approvals Queue Callout */}
      {pendingApprovals.filter(a => a.status === 'Pending').length > 0 && (
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 animate-pulse" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Pending Human Approvals Required ({pendingApprovals.filter(a => a.status === 'Pending').length})
              </h3>
            </div>
            <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
              High-Risk Action Boundary Active
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The autonomous agent has formulated high-impact actions (financial commitments or automations) that require executive verification before execution.
          </p>

          <div className="space-y-2 pt-1">
            {pendingApprovals.filter(a => a.status === 'Pending').map((appr) => (
              <div
                key={appr.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">{appr.id}</span>
                    <Badge variant="warning">{appr.category}</Badge>
                    <span className="text-xs text-slate-400">• Requested: {appr.requestedAt}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{appr.title}</h4>
                  {appr.details?.justification && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">"{appr.details.justification}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={X}
                    onClick={() => {
                      rejectAgentAction(appr.id);
                      addToast('Proposal Rejected', 'High-risk action canceled.', 'info');
                    }}
                    className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Check}
                    onClick={() => {
                      approveAgentAction(appr.id);
                      addToast('Proposal Approved', 'Action committed to SMARTORA records.', 'success');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    Approve Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {['All', 'Completed', 'Pending Approval', 'Autonomous'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredRuns.length} runs
        </span>
      </div>

      {/* Agent Activity Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-3 px-4 font-semibold">Run ID</th>
                <th className="py-3 px-4 font-semibold">User Request / Goal</th>
                <th className="py-3 px-4 font-semibold">Tools Employed</th>
                <th className="py-3 px-4 font-semibold">Risk & Approval</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-purple-600 dark:text-purple-400">
                    {run.id}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                      {run.request}
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">
                      User: {run.userName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {run.toolsUsed?.map((tool, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-700 dark:text-slate-300">
                          {tool}()
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={run.approvalStatus === 'Approved' ? 'success' : run.approvalStatus === 'Pending Approval' ? 'warning' : 'info'}>
                      {run.approvalStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs font-semibold ${
                      run.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-400 font-mono whitespace-nowrap">
                    {run.timestamp}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedRun(run)}
                      className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-lg transition-colors"
                      title="Inspect Reasoning Plan & Tools"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Dispatch Agent Goal */}
      <Modal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        title="Dispatch Autonomous Agent Task"
      >
        <form onSubmit={handleDispatchSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Agent Goal / Instruction
            </label>
            <textarea
              rows={3}
              required
              value={dispatchGoal}
              onChange={(e) => setDispatchGoal(e.target.value)}
              placeholder="e.g. 'Find low-stock products and create tasks for the inventory team' or 'Prepare purchase order draft for server components'..."
              className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Preset Quick Goals:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setDispatchGoal('Find low-stock products and create tasks for the inventory team.')}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 hover:text-purple-600 px-2 py-1 rounded text-slate-600 dark:text-slate-300 text-left"
              >
                • Find low-stock and create tasks
              </button>
              <button
                type="button"
                onClick={() => setDispatchGoal('Analyze my business and tell me what needs attention.')}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 hover:text-purple-600 px-2 py-1 rounded text-slate-600 dark:text-slate-300 text-left"
              >
                • Holistic business diagnostic
              </button>
              <button
                type="button"
                onClick={() => setDispatchGoal('Prepare Purchase Order draft for ₹48,500 server buffer components.')}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 hover:text-purple-600 px-2 py-1 rounded text-slate-600 dark:text-slate-300 text-left"
              >
                • Purchase order draft (Approval required)
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDispatchModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isExecuting || !dispatchGoal.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isExecuting ? 'Planning & Executing...' : 'Execute Agent Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Inspect Agent Run */}
      <Modal
        isOpen={Boolean(selectedRun)}
        onClose={() => setSelectedRun(null)}
        title={`Agent Telemetry: ${selectedRun?.id}`}
      >
        {selectedRun && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">User Goal</span>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                "{selectedRun.request}"
              </p>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                Initiated by: {selectedRun.userName} • {selectedRun.timestamp}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Autonomous Execution Plan:
              </span>
              <div className="space-y-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
                {selectedRun.plan?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Tools Employed:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRun.toolsUsed?.map((tool, idx) => (
                  <span key={idx} className="text-xs font-mono bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-1 rounded border border-purple-200 dark:border-purple-800">
                    {tool}()
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Actions Outcome:
              </span>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                {selectedRun.actions?.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
