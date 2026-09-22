// Landing Page for SMARTORA
// Universal AI-Powered Business Management and Automation Platform
// "Manage Smarter. Automate Faster. Grow Better."

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Zap,
  BarChart2,
  Bot,
  Bell,
  FileSpreadsheet,
  Building,
  GraduationCap,
  Layers,
  Cpu,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Lock,
  Store,
  Utensils,
  Laptop,
  Briefcase,
  Factory,
  Truck,
  Hotel,
  Stethoscope,
  Boxes,
  Receipt,
  Package,
  CheckSquare,
  TrendingUp,
  CreditCard,
  Users
} from 'lucide-react';
import Button from '../components/common/Button';

export default function LandingPage({ onNavigate, onDemoLogin }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('retail');

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const industries = [
    {
      id: 'retail',
      name: 'Retail Shops & Supermarkets',
      icon: Store,
      badge: 'Default Demo Org: ABC Retail',
      tagline: 'Groceries, FMCG, electronics, POS billing counters & SKU inventory.',
      kpis: [
        { label: 'Today\'s Sales', value: '₹34,850' },
        { label: 'Stock Valuation', value: '₹4,80,000' },
        { label: 'Low Stock Items', value: '6 SKUs' },
        { label: 'Billing Terminals', value: '3 Counters' }
      ],
      modules: ['POS Checkout', 'GST Invoices', 'Inventory Reorders', 'Supplier Ledgers', 'Smart Automation']
    },
    {
      id: 'restaurant',
      name: 'Restaurants, Cafes & QSR',
      icon: Utensils,
      badge: 'Demo Org: The Royal Spice Bistro',
      tagline: 'Table reservations, kitchen display system (KDS), and ingredient pantry buffer.',
      kpis: [
        { label: 'Tables Served', value: '96 Today' },
        { label: 'Dining Revenue', value: '₹1,28,000' },
        { label: 'Table Occupancy', value: '94% Peak' },
        { label: 'Avg Order Value', value: '₹1,330' }
      ],
      modules: ['Table Management', 'Kitchen KOT', 'Pantry Inventory', 'Recipe Costing', 'Daily Settlements']
    },
    {
      id: 'company',
      name: 'Companies, IT & Startups',
      icon: Laptop,
      badge: 'Demo Org: Zenith Tech Solutions',
      tagline: 'Client project deliverables, SOW budgets, developer sprint tasks & ARR invoicing.',
      kpis: [
        { label: 'Active Projects', value: '6 Deliverables' },
        { label: 'Monthly ARR', value: '₹24,50,000' },
        { label: 'Sprint Velocity', value: '91% Done' },
        { label: 'Billable Team', value: '45 Engineers' }
      ],
      modules: ['Project Pipelines', 'Task Sprints', 'Client Invoicing', 'Employee HR', 'Expense Approval']
    },
    {
      id: 'clinic',
      name: 'Clinics & Healthcare',
      icon: Stethoscope,
      badge: 'Demo Org: LifeCare Clinic',
      tagline: 'Patient records, doctor appointment slots, in-house pharmacy stock & treatment billing.',
      kpis: [
        { label: 'Appointments', value: '38 Booked' },
        { label: 'Consult Rooms', value: '6 Suites' },
        { label: 'Doctors on Duty', value: '8 Specialists' },
        { label: 'Pharmacy Stock', value: '98% Ready' }
      ],
      modules: ['Patient Scheduling', 'Consultation Records', 'Medical Invoicing', 'Pharmacy Stock', 'Doctor Rosters']
    },
    {
      id: 'logistics',
      name: 'Logistics & Supply Chain',
      icon: Truck,
      badge: 'Logistics Ready',
      tagline: 'Delivery fleets, freight routes, driver tasks, warehouse transit & consignment dispatch.',
      kpis: [
        { label: 'Fleet Vehicles', value: '28 Trucks' },
        { label: 'On-Time Dispatch', value: '96.8%' },
        { label: 'Pending Cargo', value: '14 Consignments' },
        { label: 'Fuel & Transit Cost', value: '₹1,45,000' }
      ],
      modules: ['Fleet Tracking', 'Dispatch Tasks', 'Supplier Freight', 'Driver Attendance', 'Fuel Ledgers']
    },
    {
      id: 'education',
      name: 'Educational Institutions',
      icon: GraduationCap,
      badge: 'Demo Org: Apex Institute',
      tagline: 'Student attendance tracking, academic faculty, departmental budgets & accreditation.',
      kpis: [
        { label: 'Enrolled Students', value: '2,400' },
        { label: 'Overall Attendance', value: '92% Rate' },
        { label: 'Faculty & Staff', value: '128 Members' },
        { label: 'Departments', value: '7 Divisions' }
      ],
      modules: ['Student Directory', 'Attendance Analytics', 'Department Budgets', 'Faculty Tasks', 'Smart Alerts']
    }
  ];

  const keyFeatures = [
    {
      icon: Store,
      title: 'Universal Multi-Tenant SaaS',
      desc: 'One unified codebase tailored for 12+ business types (Retail, Restaurants, Startups, Clinics, Logistics, Education).'
    },
    {
      icon: Zap,
      title: 'Smart Automation Engine',
      desc: 'Automate repetitive workflows: low-stock warnings, overdue payment escalations, VIP customer upgrades & task alerts.'
    },
    {
      icon: Bot,
      title: 'AI Business Copilot',
      desc: 'Natural language intelligence analyzing live operational telemetry, top-selling items, and margin discrepancies.'
    },
    {
      icon: Receipt,
      title: 'GST-Compliant Invoicing',
      desc: 'Create, track, and print formatted tax invoices with automatic CGST/SGST calculations and one-click PDF download.'
    },
    {
      icon: BarChart2,
      title: 'Multi-Tab Real-Time Analytics',
      desc: 'Interactive telemetry charts for sales revenue, operating expenses, cashflow burn, and inventory turnover.'
    },
    {
      icon: Bell,
      title: 'Smart Proactive Alerts',
      desc: 'Heuristic anomaly detection flagging stockouts, overdue customer invoices, and high-value sale orders.'
    },
    {
      icon: FileSpreadsheet,
      title: 'Export & Audit Center',
      desc: 'One-click CSV exports and printable audit statements for GST filings, financial audits, and executive reviews.'
    },
    {
      icon: ShieldCheck,
      title: 'Multi-Role Access Control',
      desc: 'Granular permissions for Super Admin, Store Owner, Operations Manager, POS Cashier, and Accountant.'
    }
  ];

  const faqs = [
    {
      q: 'Is SMARTORA only for colleges and schools?',
      a: 'No! SMARTORA is a Universal AI-Powered Business Management and Automation Platform. It is designed out-of-the-box for 12+ business types including Retail Shops, Supermarkets, Restaurants, Startups, Clinics, Logistics, and Institutions.'
    },
    {
      q: 'What is the default demo organization in SMARTORA?',
      a: 'The default demo organization is "ABC Retail Store" (Retail Shop), populated with realistic Indian business data (25+ Customers, 15+ Employees, 30+ FMCG & Grocery products, 20+ Invoices, 20+ Sales Orders, 10+ Suppliers, and 8 active automation rules).'
    },
    {
      q: 'Can I test other business types or create my own?',
      a: 'Yes! You can use the Organization Switcher in the top navigation bar to instantly switch between demo organizations (ABC Retail Store, The Royal Spice Bistro, Zenith Tech Solutions, LifeCare Clinic, Apex Institute), or use the 6+1 step Registration Wizard to launch a brand-new custom workspace.'
    },
    {
      q: 'How does the Smart Automation Engine work?',
      a: 'SMARTORA includes an event-driven automation engine. When stock drops below minimum buffer, it automatically triggers an alert and generates a reorder task. When customer lifetime spend exceeds ₹50,000, it automatically upgrades them to VIP Gold status. When invoices pass due date, automated reminders are dispatched.'
    },
    {
      q: 'Does SMARTORA support Indian GST billing?',
      a: 'Yes! SMARTORA supports Indian GST compliance with configurable tax slabs (18%, 12%, 5%), printable professional PDF tax invoices, customer GSTIN tracking, and one-click CSV financial exports for GSTR filings.'
    }
  ];

  const activeInd = industries.find(i => i.id === selectedIndustry) || industries[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              SMARTORA
            </span>
            <span className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-widest">
              Universal Business Automation
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#industries" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Industries</a>
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
          <a href="#automation" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Automation</a>
          <a href="#ai" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Copilot</a>
          <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('login')}
            className="text-slate-700 dark:text-slate-200 text-xs font-bold"
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onDemoLogin('admin')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 text-xs font-bold"
          >
            <span>Explore Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow backdrop elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>Universal AI-Powered Business Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Manage Smarter.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 bg-clip-text text-transparent">
              Automate Faster.
            </span>{' '}
            Grow Better.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            One intelligent platform built for <strong>Retail Shops, Supermarkets, Restaurants, Startups, Clinics, Logistics, and Institutions</strong>. Configurable modules, rule-based automation, and an AI copilot that understands your numbers.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onDemoLogin('admin')}
              className="w-full sm:w-auto font-black shadow-xl shadow-blue-500/30 text-base px-8 py-3.5 hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span>Launch ABC Retail Demo</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto font-bold text-base px-6 py-3.5 border-slate-300 dark:border-slate-700"
            >
              Create New Business Workspace
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Multi-Tenant</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">12+ Types</p>
              <span className="text-xs text-blue-600 font-semibold">Retail, Dining, Tech, Health</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Automated Engine</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">8 Rules</p>
              <span className="text-xs text-emerald-600 font-semibold">Low stock, Overdue alerts</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">GST Invoicing</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">100% Ready</p>
              <span className="text-xs text-blue-600 font-semibold">CGST/SGST PDF prints</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">AI Copilot</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">&lt; 300ms</p>
              <span className="text-xs text-sky-500 font-semibold">Live business intelligence</span>
            </div>
          </div>
        </div>

        {/* Hero Visual: Modern ABC Retail Store Mockup */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-5 group">
            {/* Top Mockup Window Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl mb-4 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
                  smartora.io/demo/abc-retail-store
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                ABC Retail Store (Live Workspace)
              </div>
            </div>

            {/* Mockup Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] font-bold text-slate-400 uppercase">MONTHLY SALES</span>
                <p className="text-xl font-extrabold text-blue-600 mt-1">₹8,45,000</p>
                <span className="text-[11px] text-emerald-600 font-semibold">+18.4% this month</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                <span className="text-[10px] font-bold text-slate-400 uppercase">INVOICED RECEIVABLES</span>
                <p className="text-xl font-extrabold text-amber-600 mt-1">₹18,207</p>
                <span className="text-[11px] text-slate-500">Corporate pantry orders</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                <span className="text-[10px] font-bold text-slate-400 uppercase">INVENTORY ALERT</span>
                <p className="text-xl font-extrabold text-rose-600 mt-1">6 Low SKUs</p>
                <span className="text-[11px] text-rose-500">Lay's & Good Knight Out</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold text-slate-400 uppercase">AUTOMATION RUNS</span>
                <p className="text-xl font-extrabold text-emerald-600 mt-1">142 Executed</p>
                <span className="text-[11px] text-slate-500">~35 Hours saved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: One Platform. Every Business. (Interactive Industry Showcase) */}
      <section id="industries" className="py-20 px-4 sm:px-8 bg-white dark:bg-[#0f172a] border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">
              ONE PLATFORM. EVERY BUSINESS.
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Tailored For Your Exact Industry
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Click any business below to see how SMARTORA configures dedicated modules, metric cards, and automation rules.
            </p>
          </div>

          {/* Industry Selection Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8">
            {industries.map((ind) => {
              const Icon = ind.icon;
              const isSelected = selectedIndustry === ind.id;

              return (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{ind.name.split('&')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Industry Showcase Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {activeInd.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeInd.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                  {activeInd.tagline}
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => onDemoLogin('admin')}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md font-bold"
              >
                <span>Launch This Business Mode</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            {/* KPIs for this Industry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
              {activeInd.kpis.map((k, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase">{k.label}</span>
                  <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{k.value}</p>
                </div>
              ))}
            </div>

            {/* Configured Modules for this Industry */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Auto-Configured Modules:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeInd.modules.map((m, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{m}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">
            CORE SAAS CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Engineered for Autonomous Excellence
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Every feature is built with reactive data persistence, responsive mobile layouts, and modern SaaS polish.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-8 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200/50 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
            SMARTORA
          </span>
        </div>
        <p className="max-w-md mx-auto text-slate-500">
          "Manage Smarter. Automate Faster. Grow Better." — Universal AI-Powered Business Management & Automation Platform.
        </p>
        <p className="mt-4 text-slate-400 text-[11px]">
          © {new Date().getFullYear()} SMARTORA Inc. All rights reserved. Hackathon Demonstration Edition.
        </p>
      </footer>

    </div>
  );
}
