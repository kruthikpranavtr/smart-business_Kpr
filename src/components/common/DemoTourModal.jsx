// Hackathon Demo Tour Component for SMARTORA
import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, X, Play, RefreshCw } from 'lucide-react';
import Button from './Button';
import confetti from 'canvas-confetti';

const TOUR_STEPS = [
  {
    step: 1,
    page: 'dashboard',
    title: '1. Executive Dashboard & Telemetry',
    talkingPoint: 'Showcase real-time telemetry: Good Morning Admin greeting, 6 key KPI cards with trend percentages, and 6 interactive charts (Revenue vs Expenses, User Growth, Attendance, Tasks, Sales, Department Pie).',
    actionText: 'Inspect Live Dashboard'
  },
  {
    step: 2,
    page: 'dashboard',
    title: '2. Proactive AI Insights Engine',
    talkingPoint: 'Highlight the AI Insights card atop the dashboard. Notice immediate automatic flags: "Attendance decreased by 8.4%", "3 inventory items low stock", "Marketing spend increased 14%". Click "View Full Analysis".',
    actionText: 'Review AI Insights'
  },
  {
    step: 3,
    page: 'analytics',
    title: '3. Deep Multi-Domain Analytics',
    talkingPoint: 'Demonstrate the unified dual-engine analytics covering Financials, Attendance, Operational Tasks, Inventory, and User Growth with interactive timeframe filters (Daily, Weekly, Monthly, Yearly).',
    actionText: 'Explore Analytics'
  },
  {
    step: 4,
    page: 'notifications',
    title: '4. Smart Automated Alerts Center',
    talkingPoint: 'Demonstrate the 6 automated alert categories: Attendance, Inventory, Expense, Task, Payment, and System Alerts. Show the 43 below-threshold students alert and low toner warning.',
    actionText: 'View Smart Alerts'
  },
  {
    step: 5,
    page: 'ai-assistant',
    title: '5. Intelligent AI Copilot & Querying',
    talkingPoint: 'Engage with the ChatGPT-style AI Assistant. Ask questions like "How many students have attendance below 75%?" or "Which products have low stock?" to watch real-time heuristic inference on live organizational data.',
    actionText: 'Chat with AI Assistant'
  },
  {
    step: 6,
    page: 'reports',
    title: '6. One-Click Executive Reporting & Export',
    talkingPoint: 'Generate real CSV audit logs or format printable executive summary reports on the fly (Business, Attendance, Faculty, Sales, Inventory).',
    actionText: 'Generate Sample Report'
  }
];

export default function DemoTourModal({ isOpen, onClose, onNavigate, onResetData }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onClose();
    } else {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onNavigate(TOUR_STEPS[nextIndex].page);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onNavigate(TOUR_STEPS[prevIndex].page);
    }
  };

  const jumpToStep = (index) => {
    setCurrentStepIndex(index);
    onNavigate(TOUR_STEPS[index].page);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl">
      <div className="bg-slate-900/95 text-white border border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <h4 className="font-bold text-sm tracking-wide text-white flex items-center gap-2">
                HACKATHON DEMO TOUR
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-mono px-2 py-0.5 rounded-full border border-blue-500/40">
                  Step {currentStep.step} of {TOUR_STEPS.length}
                </span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              title="Reset sample data"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo Data</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close demo tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tour Body */}
        <div className="mt-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h5 className="font-semibold text-sm text-blue-300">
              {currentStep.title}
            </h5>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <span className="text-amber-400 font-medium">Presenter Talking Point:</span> {currentStep.talkingPoint}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStepIndex === 0}
              onClick={handlePrev}
              className="text-white border-slate-700 hover:bg-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>

            <Button
              variant="gradient"
              size="sm"
              onClick={handleNext}
              className="font-semibold"
            >
              <span>{isLastStep ? 'Finish Demo 🎉' : 'Next Step'}</span>
              {!isLastStep && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.step}
              onClick={() => jumpToStep(idx)}
              className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                idx === currentStepIndex
                  ? 'bg-blue-600 text-white shadow-sm'
                  : idx < currentStepIndex
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              {idx < currentStepIndex ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-current text-[10px] flex items-center justify-center">
                  {step.step}
                </span>
              )}
              <span>{step.title.split('.')[1]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
