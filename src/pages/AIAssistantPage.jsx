// AI Assistant Page for SMARTORA
// Central Intelligence Hub integrating LLM Chat, RAG Knowledge Base, and Autonomous Agent Orchestrator

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  MessageSquare,
  Plus,
  Trash2,
  Cpu,
  Zap,
  Shield,
  ArrowRight,
  BookOpen,
  Activity,
  ShieldCheck
} from 'lucide-react';
import AIChatBox from '../components/ai/AIChatBox';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';

export default function AIAssistantPage({ onNavigate }) {
  const { currentOrganization, knowledgeDocs, agentRuns, pendingApprovals } = useData();
  const { addToast } = useToast();

  const [sessions, setSessions] = useState([
    { id: 'sess-1', title: 'Operational Health & Sales Analysis', time: '10 mins ago', active: true },
    { id: 'sess-2', title: 'HR Leave Policy Query (RAG)', time: 'Yesterday', active: false },
    { id: 'sess-3', title: 'Low-Stock Task Dispatch (Agent)', time: '3 days ago', active: false },
    { id: 'sess-4', title: 'Purchase Order Approval (PO-08)', time: 'Last week', active: false }
  ]);

  const [activeSessionId, setActiveSessionId] = useState('sess-1');

  const handleNewChat = () => {
    const newId = `sess-${Date.now()}`;
    const newSession = {
      id: newId,
      title: 'New Investigation',
      time: 'Just now',
      active: true
    };
    setSessions([newSession, ...sessions.map(s => ({ ...s, active: false }))]);
    setActiveSessionId(newId);
    addToast('New Conversation', 'Started fresh AI telemetry session.', 'info');
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    setSessions(sessions.map(s => ({ ...s, active: s.id === id })));
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id && filtered.length > 0) {
      setActiveSessionId(filtered[0].id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              SMARTORA Intelligence Copilot
            </h1>
            <span className="text-[10px] bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              LLM + RAG + AGENT
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Autonomous multi-tenant intelligence layer grounded in live SMARTORA records and organization documents
          </p>
        </div>

        {/* Quick Hub Navigation Pills */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={BookOpen}
            onClick={() => onNavigate('knowledge-base')}
            className="text-xs"
          >
            Knowledge Base ({knowledgeDocs.length})
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={Activity}
            onClick={() => onNavigate('agent-activity')}
            className="text-xs"
          >
            Agent Activity ({agentRuns.length})
          </Button>
        </div>
      </div>

      {/* Main Container: Chat History Left + Chat Box Main */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: Chat Session History & AI Status */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm h-[78vh] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Saved Sessions
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleNewChat}
                className="text-xs px-2 py-1"
              >
                New Chat
              </Button>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[42vh]">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => handleSelectSession(sess.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-medium transition-colors group ${
                    sess.id === activeSessionId
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/60'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-blue-600" />
                    <div className="truncate">
                      <p className="truncate">{sess.title}</p>
                      <span className="text-[10px] text-slate-400 font-normal">{sess.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteSession(sess.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                    title="Delete session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Layer Operational Status Widget */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Layer Status
              </span>
              <span className="text-emerald-600 font-mono text-[10px]">ALL GREEN</span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>LLM Grounding:</span>
                <span className="text-slate-700 dark:text-slate-300">Active (Live DB)</span>
              </div>
              <div className="flex justify-between">
                <span>RAG Vector Store:</span>
                <span className="text-teal-600 font-semibold">{knowledgeDocs.length} Docs Indexed</span>
              </div>
              <div className="flex justify-between">
                <span>Agent Orchestrator:</span>
                <span className="text-purple-600 font-semibold">Ready (11 Tools)</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Approvals:</span>
                <span className="text-amber-600 font-bold">{pendingApprovals.filter(a => a.status === 'Pending').length} Action</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-1 text-[11px]">
              <button
                onClick={() => onNavigate('knowledge-base')}
                className="text-blue-600 dark:text-blue-400 hover:underline text-left font-medium flex items-center justify-between"
              >
                <span>Browse Knowledge Base</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => onNavigate('agent-activity')}
                className="text-purple-600 dark:text-purple-400 hover:underline text-left font-medium flex items-center justify-between"
              >
                <span>Agent Activity Telemetry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Chat Box Component */}
        <div className="lg:col-span-3">
          <AIChatBox onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
