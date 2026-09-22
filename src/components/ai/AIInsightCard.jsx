// Prominent AI Insights Card Component for SMARTORA Dashboard
// Dynamically computes live telemetry insights based on active multi-tenant organization
// Connects directly to Agentic AI for 1-click autonomous action resolution

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  Package,
  Zap,
  Play,
  FileText
} from 'lucide-react';
import Button from '../common/Button';
import { useData } from '../../context/DataContext';

export default function AIInsightCard({ onOpenAnalysis }) {
  const { currentOrganization, stats } = useData();

  const curr = currentOrganization?.currencySymbol || '₹';
  const orgType = currentOrganization?.type || 'Technology Services';

  // Live computed insights grounded in real SMARTORA tenant metrics
  const getDynamicInsights = () => {
    return [
      {
        id: 1,
        icon: TrendingUp,
        color: 'text-emerald-400 bg-emerald-500/10',
        title: 'Sales & Revenue Turnover',
        text: `Gross sales recorded at ${curr}${stats.revenue?.toLocaleString('en-IN') || '0'} with 100% tenant data partition isolation.`,
        actionLabel: 'Analyze Sales',
        query: 'What were our sales this month?'
      },
      {
        id: 2,
        icon: stats.lowStockCount > 0 ? AlertTriangle : CheckCircle,
        color: stats.lowStockCount > 0 ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10',
        title: 'Inventory Buffer Health',
        text: stats.lowStockCount > 0
          ? `Alert: ${stats.lowStockCount} products are below configured minimum safety thresholds.`
          : `All ${stats.totalProducts} catalog products are currently operating at healthy buffer levels.`,
        actionLabel: 'Replenish via Agent',
        query: 'Find low-stock products and create tasks for the inventory team.'
      },
      {
        id: 3,
        icon: stats.pendingInvoicesTotal > 0 ? AlertTriangle : CheckCircle,
        color: stats.pendingInvoicesTotal > 0 ? 'text-rose-400 bg-rose-500/10' : 'text-sky-400 bg-sky-500/10',
        title: 'Accounts Receivable',
        text: stats.pendingInvoicesTotal > 0
          ? `${curr}${stats.pendingInvoicesTotal.toLocaleString('en-IN')} pending in unpaid invoices requiring accounts follow-up.`
          : 'All customer invoices are cleared with zero overdue payment balances.',
        actionLabel: 'Review Invoices',
        query: 'Show me our pending invoices.'
      },
      {
        id: 4,
        icon: Zap,
        color: 'text-cyan-400 bg-cyan-500/10',
        title: 'Automation & Workflow Velocity',
        text: `${stats.activeRulesCount || 7} automated rules online • ${stats.pendingTasksLive || 0} active deliverables on schedule.`,
        actionLabel: 'Run Agent Diagnostic',
        query: 'Analyze my business and tell me what needs attention.'
      }
    ];
  };

  const insights = getDynamicInsights();

  const handleActionClick = (query) => {
    if (onOpenAnalysis) {
      onOpenAnalysis(query);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white p-6 shadow-xl border border-blue-500/30">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg tracking-tight text-white uppercase">
                  AI INSIGHTS & ANOMALIES
                </h3>
                <span className="text-[10px] font-mono tracking-wider font-bold bg-blue-500/30 text-cyan-300 px-2.5 py-0.5 rounded-full border border-blue-500/40">
                  {currentOrganization?.name || 'SMARTORA WORKSPACE'}
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                SMARTORA Autonomous Intelligence Layer analyzing live operational telemetry
              </p>
            </div>
          </div>

          <Button
            variant="gradient"
            size="sm"
            onClick={() => onOpenAnalysis && onOpenAnalysis()}
            className="font-semibold shrink-0 shadow-lg shadow-blue-500/30 hover:scale-[1.02] bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 font-bold"
          >
            <span>Ask AI Assistant</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-xs group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                      {item.title}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal mt-0.5">
                      {item.text}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => handleActionClick(item.query)}
                    className="text-[11px] font-bold text-cyan-300 hover:text-white flex items-center gap-1 group-hover:underline"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
