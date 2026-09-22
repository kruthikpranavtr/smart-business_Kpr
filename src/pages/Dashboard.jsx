// Admin Dashboard for SMARTORA
// Universal Multi-Tenant SaaS Platform with dynamic industry metrics and automated insights

import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckSquare,
  TrendingUp,
  Receipt,
  Bell,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  Calendar,
  Package,
  Factory,
  Layers,
  Zap,
  DollarSign,
  Store,
  Utensils,
  Laptop,
  Stethoscope,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  BedDouble,
  BookOpen
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import AIInsightCard from '../components/ai/AIInsightCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../utils/chartConfig';

import CollegeHODDashboard from './college/CollegeHODDashboard';
import CollegeFacultyDashboard from './college/CollegeFacultyDashboard';
import CollegeStudentDashboard from './college/CollegeStudentDashboard';
import HotelFrontDeskPage from './hotel/HotelFrontDeskPage';
import HotelHousekeepingPage from './hotel/HotelHousekeepingPage';

export default function Dashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const {
    stats,
    tasks,
    sales,
    invoices,
    products,
    suppliers,
    projects,
    appointments,
    currentOrganization,
    students = [],
    courses = [],
    subjects = [],
    exams = [],
    rooms = [],
    reservations = [],
    housekeeping = []
  } = useData();

  const [timeframe, setTimeframe] = useState('Monthly');

  const curr = currentOrganization?.currencySymbol || '₹';
  const orgType = currentOrganization?.type || 'Retail Shop';

  // Role-specific automated portal dispatch
  if (currentUser?.role === 'HOD') {
    return <CollegeHODDashboard onNavigate={onNavigate} />;
  }
  if (currentUser?.role === 'FACULTY') {
    return <CollegeFacultyDashboard onNavigate={onNavigate} />;
  }
  if (currentUser?.role === 'STUDENT') {
    return <CollegeStudentDashboard onNavigate={onNavigate} />;
  }
  if (orgType.includes('Hotel') || orgType.includes('Resort')) {
    const deptLower = (currentUser?.department || '').toLowerCase();
    const desigLower = (currentUser?.designation || '').toLowerCase();
    if (deptLower.includes('front desk') || desigLower.includes('front desk') || desigLower.includes('receptionist')) {
      return <HotelFrontDeskPage onNavigate={onNavigate} />;
    }
    if (deptLower.includes('housekeeping') || desigLower.includes('housekeeping')) {
      return <HotelHousekeepingPage onNavigate={onNavigate} />;
    }
  }

  // Dynamic Stat Cards based on Organization Type
  const statCardsData = useMemo(() => {
    if (orgType.includes('College') || orgType.includes('Education')) {
      return [
        {
          title: 'Enrolled Scholars',
          value: `${students.length}`,
          change: '+4 New This Term',
          isPositive: true,
          subtitle: 'Active student roster',
          icon: GraduationCap,
          color: 'blue',
          onClick: () => onNavigate('students')
        },
        {
          title: 'Faculty Mentors',
          value: `${stats.totalUsers || 12}`,
          change: 'Professors & Lecturers',
          isPositive: true,
          subtitle: 'Accredited teaching faculty',
          icon: Users,
          color: 'sky',
          onClick: () => onNavigate('employees')
        },
        {
          title: 'Curriculum & Courses',
          value: `${courses.length} Programs`,
          change: `${subjects.length} Modules`,
          isPositive: true,
          subtitle: 'Degree syllabus accredited',
          icon: BookOpen,
          color: 'emerald',
          onClick: () => onNavigate('academic')
        },
        {
          title: 'Scheduled Examinations',
          value: `${exams.length} Exams`,
          change: 'Hall Tickets Issued',
          isPositive: true,
          subtitle: 'Mid-term & semester assessments',
          icon: Calendar,
          color: 'amber',
          onClick: () => onNavigate('academic')
        }
      ];
    }

    if (orgType.includes('Hotel') || orgType.includes('Resort')) {
      const occRate = rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'OCCUPIED').length / rooms.length) * 100) : 0;
      return [
        {
          title: 'Property Occupancy',
          value: `${occRate}%`,
          change: `${rooms.filter(r => r.status === 'OCCUPIED').length} of ${rooms.length} Keys`,
          isPositive: true,
          subtitle: 'Current guest occupancy rate',
          icon: BedDouble,
          color: 'blue',
          onClick: () => onNavigate('rooms')
        },
        {
          title: 'Available Keys',
          value: `${rooms.filter(r => r.status === 'AVAILABLE').length} Rooms`,
          change: 'Clean & Ready',
          isPositive: true,
          subtitle: 'Ready for check-in & walk-ins',
          icon: CheckCircle2,
          color: 'emerald',
          onClick: () => onNavigate('rooms')
        },
        {
          title: 'Arrivals & In-House',
          value: `${reservations.filter(r => r.status === 'CHECKED_IN').length} Guests`,
          change: `${reservations.filter(r => r.status === 'CONFIRMED').length} Pending Arrival`,
          isPositive: true,
          subtitle: 'Front desk guest manifest',
          icon: Users,
          color: 'sky',
          onClick: () => onNavigate('front-desk')
        },
        {
          title: 'Housekeeping Queue',
          value: `${housekeeping.filter(h => h.state === 'DIRTY').length} Rooms`,
          change: `${housekeeping.filter(h => h.state === 'IN_PROGRESS').length} In Progress`,
          isPositive: housekeeping.filter(h => h.state === 'DIRTY').length === 0,
          subtitle: 'Turnover sterilization backlog',
          icon: Clock,
          color: housekeeping.filter(h => h.state === 'DIRTY').length > 0 ? 'amber' : 'emerald',
          onClick: () => onNavigate('housekeeping')
        }
      ];
    }

    if (orgType.includes('Company') || orgType.includes('Startup')) {
      return [
        {
          title: 'Monthly Billed Revenue',
          value: `${curr}${stats.revenue?.toLocaleString() || '24,50,000'}`,
          change: '+22.5%',
          isPositive: true,
          subtitle: 'Enterprise SaaS & Cloud SOWs',
          icon: TrendingUp,
          color: 'blue',
          onClick: () => onNavigate('invoices')
        },
        {
          title: 'Active Client Projects',
          value: `${stats.activeProjectsCount || 6}`,
          change: '+2 New',
          isPositive: true,
          subtitle: 'Active deliverable milestones',
          icon: Layers,
          color: 'sky',
          onClick: () => onNavigate('projects')
        },
        {
          title: 'Team Sprint Tasks',
          value: `${stats.pendingTasksLive || 14}`,
          change: `${stats.overdueTasksLive || 1} Overdue`,
          isPositive: false,
          subtitle: 'Sprint velocity at 91%',
          icon: CheckSquare,
          color: 'amber',
          onClick: () => onNavigate('tasks')
        },
        {
          title: 'Smart Automations',
          value: `${stats.activeRulesCount || 7} Rules`,
          change: '99.9% SLA',
          isPositive: true,
          subtitle: 'Automated workflow triggers online',
          icon: Zap,
          color: 'emerald',
          onClick: () => onNavigate('automation')
        }
      ];
    }

    if (orgType.includes('Restaurant')) {
      return [
        {
          title: "Monthly Dining Revenue",
          value: `${curr}${stats.revenue?.toLocaleString() || '12,80,000'}`,
          change: '+14.2%',
          isPositive: true,
          subtitle: 'Dine-in, Takeaway & Delivery',
          icon: TrendingUp,
          color: 'blue',
          onClick: () => onNavigate('sales')
        },
        {
          title: 'Table Reservations',
          value: `${stats.upcomingAppointmentsCount || 8} Tables`,
          change: '94% Occupancy',
          isPositive: true,
          subtitle: 'Booked for evening shift',
          icon: Calendar,
          color: 'sky',
          onClick: () => onNavigate('appointments')
        },
        {
          title: 'Kitchen Inventory Items',
          value: `${stats.totalProducts || 24} Items`,
          change: `${stats.lowStockCount || 3} Reorders`,
          isPositive: false,
          subtitle: 'Cold storage buffer healthy',
          icon: Package,
          color: 'amber',
          onClick: () => onNavigate('inventory')
        },
        {
          title: 'Automated Operations',
          value: `${stats.activeRulesCount || 7} Rules`,
          change: 'Active',
          isPositive: true,
          subtitle: 'End-of-day register reconciliation',
          icon: Zap,
          color: 'emerald',
          onClick: () => onNavigate('automation')
        }
      ];
    }

    // Default: Retail Shop / Supermarket (e.g. ABC Retail Store)
    return [
      {
        title: "Monthly Sales Revenue",
        value: `${curr}${stats.revenue?.toLocaleString() || '8,45,000'}`,
        change: currentOrganization?.stats?.monthlyGrowth || '+18.4%',
        isPositive: true,
        subtitle: `${sales.length} Orders processed`,
        icon: TrendingUp,
        color: 'blue',
        onClick: () => onNavigate('sales')
      },
      {
        title: 'Invoiced Receivables',
        value: `${curr}${stats.pendingInvoicesTotal?.toLocaleString() || '18,207'}`,
        change: `${invoices.filter(i => i.status === 'Overdue').length} Overdue`,
        isPositive: false,
        subtitle: 'Unpaid customer corporate balances',
        icon: Receipt,
        color: 'amber',
        onClick: () => onNavigate('invoices')
      },
      {
        title: 'Active Inventory SKUs',
        value: `${stats.totalProducts || 32} Products`,
        change: `${stats.lowStockCount || 6} Low Stock`,
        isPositive: false,
        subtitle: `${stats.outOfStockCount || 2} Out of stock items`,
        icon: Package,
        color: 'rose',
        onClick: () => onNavigate('inventory')
      },
      {
        title: 'Smart Automation Engine',
        value: `${stats.activeRulesCount || 7} Rules`,
        change: '142 Runs',
        isPositive: true,
        subtitle: 'Stock alerts & VIP enrollments',
        icon: Zap,
        color: 'emerald',
        onClick: () => onNavigate('automation')
      }
    ];
  }, [stats, currentOrganization, orgType, curr, sales.length, invoices]);

  // Chart 1: Revenue vs Expenses
  const revenueExpensesData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: `Revenue (${curr})`,
        data: [420000, 490000, 560000, 680000, 750000, 845000],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        fill: true,
        tension: 0.4,
        borderWidth: 2.5
      },
      {
        label: `Operating Expenses (${curr})`,
        data: [210000, 240000, 260000, 280000, 310000, 335000],
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  // Chart 2: Category Breakdown
  const categoryChartData = {
    labels: ['Groceries & Staples', 'Beverages & Snacks', 'Personal Care', 'Cleaning', 'Electronics'],
    datasets: [
      {
        data: [38, 24, 18, 12, 8],
        backgroundColor: ['#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'],
        borderWidth: 0
      }
    ]
  };

  // Chart 3: Weekly Order Transactions
  const ordersTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders Count',
        data: [18, 22, 27, 25, 34, 48, 42],
        backgroundColor: '#2563eb',
        borderRadius: 8
      }
    ]
  };

  // Chart 4: Invoice Status Breakdown
  const invoiceStatusData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [
          invoices.filter(i => i.status === 'Paid').length || 16,
          invoices.filter(i => i.status === 'Pending').length || 4,
          invoices.filter(i => i.status === 'Overdue').length || 2
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
        borderWidth: 0
      }
    ]
  };

  // Quick action items based on enabled modules
  const enabledModules = currentOrganization?.enabledModules || [];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 text-white shadow-xl shadow-blue-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs tracking-wider">
              {currentOrganization?.type || 'Retail Shop'} Workspace
            </span>
            <span className="text-xs text-blue-100">
              • {currentOrganization?.location?.city || 'Bengaluru'}, {currentOrganization?.location?.country || 'India'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {currentOrganization?.name || 'ABC Retail Store'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
            {currentOrganization?.tagline || 'Manage Smarter. Automate Faster. Grow Better.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {orgType.includes('College') ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('students')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
              >
                Enroll Scholar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('academic')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
              >
                Academic Directorate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('employees')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
              >
                Faculty Roster
              </Button>
            </>
          ) : (orgType.includes('Hotel') || orgType.includes('Resort')) ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('rooms')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
              >
                Rooms Matrix
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('front-desk')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
              >
                Front Desk
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('housekeeping')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
              >
                Housekeeping
              </Button>
            </>
          ) : (
            <>
              {enabledModules.includes('sales') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('sales')}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
                >
                  New POS Sale
                </Button>
              )}

              {enabledModules.includes('invoices') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('invoices')}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
                >
                  Create Invoice
                </Button>
              )}
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('ai-assistant')}
            icon={Sparkles}
            className="bg-white text-blue-700 hover:bg-blue-50 font-black border-transparent shadow-md text-xs"
          >
            Ask AI Copilot
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsData.map((card, idx) => (
          <StatCard
            key={idx}
            title={card.title}
            value={card.value}
            change={card.change}
            isPositive={card.isPositive}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            onClick={card.onClick}
          />
        ))}
      </div>

      {/* Prominent AI Insights Widget */}
      <AIInsightCard onOpenAnalysis={() => onNavigate('ai-assistant')} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue vs Expenses Line Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title={`Financial Overview: Revenue vs Operating Expenses (${curr})`}
            subtitle="Six-month cashflow velocity and margin trends"
            actions={
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setTimeframe('Monthly')}
                  className={`px-2 py-0.5 rounded ${timeframe === 'Monthly' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs' : 'text-slate-500'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeframe('Quarterly')}
                  className={`px-2 py-0.5 rounded ${timeframe === 'Quarterly' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs' : 'text-slate-500'}`}
                >
                  Quarterly
                </button>
              </div>
            }
          >
            <div className="h-64 sm:h-72">
              <Line
                data={revenueExpensesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } }
                }}
              />
            </div>
          </ChartCard>
        </div>

        {/* Category Contribution Doughnut Chart */}
        <div>
          <ChartCard
            title="Sales by Category"
            subtitle="Product sales share this month"
          >
            <div className="h-64 sm:h-72 flex items-center justify-center">
              <Doughnut
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </ChartCard>
        </div>

        {/* Weekly Transactions Bar Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Weekly Order Volume"
            subtitle="Customer footfall & checkout transactions by day"
          >
            <div className="h-60">
              <Bar
                data={ordersTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </ChartCard>
        </div>

        {/* Invoicing Status Doughnut */}
        <div>
          <ChartCard
            title="Invoice Payment Status"
            subtitle="Breakdown of customer receivables"
          >
            <div className="h-60 flex items-center justify-center">
              <Doughnut
                data={invoiceStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </ChartCard>
        </div>

      </div>

      {/* Two Column Section: Recent Sales / Invoices + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Invoices / Sales Table */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  Recent Invoices & Transactions
                </h3>
                <p className="text-xs text-slate-500">
                  Latest customer billing statements
                </p>
              </div>
              <button
                onClick={() => onNavigate('invoices')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {invoices.slice(0, 5).map((inv) => (
                <div key={inv.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      {inv.customer}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {inv.invoiceNumber} • {inv.date}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      {curr}{inv.total?.toLocaleString()}
                    </span>
                    <Badge
                      variant={
                        inv.status === 'Paid'
                          ? 'success'
                          : inv.status === 'Overdue'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {inv.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock & Inventory Action List */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-rose-500" />
                  Critical Stock Alerts
                </h3>
                <p className="text-xs text-slate-500">
                  Items below configured replenishment threshold
                </p>
              </div>
              <button
                onClick={() => onNavigate('inventory')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {products
                .filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock')
                .slice(0, 5)
                .map((prod) => (
                  <div key={prod.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 dark:text-white block truncate">
                        {prod.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        SKU: {prod.sku || prod.id} • Min: {prod.minStock} units
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {prod.stock} in stock
                      </span>
                      <Badge variant={prod.status === 'Out of Stock' ? 'danger' : 'warning'}>
                        {prod.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
