// AI Chat Box Component for SMARTORA (Universal Intelligence Copilot)
// Supports LLM, RAG Source Citations, Agent Reasoning Traces, and Interactive Human Approval Cards

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Trash2,
  ArrowRight,
  CornerDownLeft,
  Copy,
  Check,
  FileText,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X,
  ExternalLink
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export default function AIChatBox({ onNavigate }) {
  const { currentOrganization, approveAgentAction, rejectAgentAction } = useData();
  const { addToast } = useToast();

  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      badge: 'SMARTORA AI Layer',
      text: `Hello! I am your SMARTORA Intelligence Copilot for **${currentOrganization?.name || 'Your Organization'}**.\n\nI combine **LLM Reasoning**, **Tenant-Isolated RAG**, and **Autonomous Agent Execution** to assist with live operations. How can I help you today?`,
      timestamp: 'Just now',
      actions: [
        { label: 'Check Leave Policy (RAG)', query: 'What is our casual leave policy?' },
        { label: 'Find Low Stock & Create Tasks (Agent)', query: 'Find low-stock products and create tasks for the inventory team.' },
        { label: 'Business Health Diagnostic (Agent)', query: 'Analyze my business and tell me what needs attention.' },
        { label: 'Sales Turnover (Live DB)', query: 'What were our sales this month?' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (customText) => {
    const textToSend = customText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await aiService.generateResponse(textToSend);

      const aiReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response.text,
        route: response.route,
        badge: response.badge,
        color: response.color,
        sources: response.sources,
        plan: response.plan,
        toolsUsed: response.toolsUsed,
        actionsExecuted: response.actionsExecuted,
        requiresApproval: response.requiresApproval,
        approvalItem: response.approvalItem,
        actions: response.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: "I encountered an error querying organization telemetry. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApproveAction = (msgId, approvalId) => {
    approveAgentAction(approvalId);
    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, isApproved: true } : m))
    );
    addToast('Action Authorized', 'High-risk action approved and committed to SMARTORA records.', 'success');
  };

  const handleRejectAction = (msgId, approvalId) => {
    rejectAgentAction(approvalId);
    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, isRejected: true } : m))
    );
    addToast('Action Canceled', 'Proposal rejected by user.', 'info');
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        badge: 'SMARTORA AI Layer',
        text: `Chat cleared. What else would you like to inspect for **${currentOrganization?.name}**?`,
        timestamp: 'Just now'
      }
    ]);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedPrompts = [
    "What is our casual leave policy?",
    "Find low-stock products and create tasks for the inventory team.",
    "Analyze my business and tell me what needs attention.",
    "Prepare Purchase Order draft for ₹48,500 server buffer components.",
    "What were our sales this month?",
    "Show me our pending invoices."
  ];

  return (
    <div className="flex flex-col h-[78vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                SMARTORA Intelligence Copilot
              </h3>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                LLM + RAG + Agent
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scoped strictly to <strong className="text-blue-600 dark:text-blue-400">{currentOrganization?.name}</strong> • Zero Data Fabrication
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in duration-200`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-xl sm:max-w-2xl ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                
                {/* AI Route Badge */}
                {!isUser && msg.badge && (
                  <div className="mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      {msg.badge}
                    </span>
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* RAG Grounded Source Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Grounded Sources (RAG Vector Store):
                      </span>
                      {msg.sources.map((src, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                          <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                            <span>{src.title}</span>
                            <span className="text-[10px] font-mono text-emerald-600 font-bold">{src.relevanceScore}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-sans italic">
                            "{src.snippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Agent Reasoning Plan Steps */}
                  {msg.plan && msg.plan.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        Agent Reasoning Trace & Plan:
                      </span>
                      <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                        {msg.plan.map((step, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Human Approval Card for High-Risk Actions */}
                  {msg.requiresApproval && msg.approvalItem && (
                    <div className="mt-3.5 p-3.5 rounded-xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          High-Risk Action Boundary: Approval Required
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded">
                          {msg.approvalItem.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {msg.approvalItem.title}
                      </p>

                      {msg.isApproved ? (
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
                          <Check className="w-4 h-4" /> Action Authorized & Committed to SMARTORA Database
                        </div>
                      ) : msg.isRejected ? (
                        <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 pt-1">
                          <X className="w-4 h-4" /> Action Canceled by User
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-1.5">
                          <button
                            onClick={() => handleRejectAction(msg.id, msg.approvalItem.id)}
                            className="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveAction(msg.id, msg.approvalItem.id)}
                            className="px-3.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                          >
                            Approve & Execute
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Action Buttons if returned by AI */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap gap-2">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (act.page && onNavigate) onNavigate(act.page);
                            if (act.query) handleSend(act.query);
                          }}
                          className="text-xs bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all shadow-2xs"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-600 dark:hover:text-slate-300"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Animation */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-mono">
                Querying SMARTORA live intelligence layer...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips */}
      <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-500" /> Suggested:
        </span>
        {suggestedPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleSend(prompt)}
            className="text-xs bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors shadow-2xs shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything (e.g. 'What is our leave policy?', 'Find low-stock products and create tasks')..."
            className="w-full pl-4 pr-24 py-3 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="absolute right-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2">
          LLM + RAG + Autonomous Agent • Multi-Tenant Logical Partitioning Active
        </p>
      </div>
    </div>
  );
}
