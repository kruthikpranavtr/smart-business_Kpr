// Advanced Analytics Page for SMARTORA
import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  GraduationCap,
  Building,
  Users,
  Clock,
  DollarSign,
  CheckSquare,
  Package,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import ChartCard from '../components/common/ChartCard';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../utils/chartConfig';

export default function AnalyticsPage({ onNavigate }) {
  const { stats, viewMode } = useData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('financial'); // 'financial' | 'academic' | 'tasks' | 'inventory' | 'users'
  const [timeframe, setTimeframe] = useState('Monthly'); // 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'

  const tabs = [
    { id: 'financial', label: 'Financial Analytics', icon: DollarSign },
    { id: 'academic', label: 'Attendance & Academic', icon: GraduationCap },
    { id: 'tasks', label: 'Task & Sprint Velocity', icon: CheckSquare },
    { id: 'inventory', label: 'Inventory & Supplies', icon: Package },
    { id: 'users', label: 'User & Demographics', icon: Users }
  ];

  // Financial Chart Data
  const financialData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Proj)'],
    datasets: [
      {
        label: 'Gross Revenue (₹)',
        data: [310000, 345000, 390000, 415000, 450000, 490000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Disbursements (₹)',
        data: [175000, 190000, 185000, 205000, 220000, 230000],
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Academic / Attendance Data
  const attendanceData = {
    labels: ['Computer Science', 'Information Tech', 'Mechanical', 'ECE', 'MBA', 'Civil', 'Biotech'],
    datasets: [
      {
        label: 'Present Attendance %',
        data: [94.5, 91.2, 82.4, 88.0, 64.2, 73.0, 69.1],
        backgroundColor: '#2563eb',
        borderRadius: 6
      },
      {
        label: 'Threshold Benchmark (75%)',
        data: [75, 75, 75, 75, 75, 75, 75],
        type: 'line',
        borderColor: '#f43f5e',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  // Tasks Sprint Data
  const tasksSprintData = {
    labels: ['Sprint 31', 'Sprint 32', 'Sprint 33', 'Sprint 34', 'Sprint 35', 'Sprint 36'],
    datasets: [
      {
        label: 'Tasks Delivered',
        data: [18, 22, 19, 26, 21, 24],
        backgroundColor: '#0ea5e9',
        borderRadius: 6
      },
      {
        label: 'Backlog / Overdue',
        data: [5, 4, 6, 2, 4, 3],
        backgroundColor: '#f43f5e',
        borderRadius: 6
      }
    ]
  };

  // Inventory Asset Distribution
  const inventoryAssetData = {
    labels: ['Hardware (Displays)', 'Networking Switch', 'AV Interactive Boards', 'Power & UPS', 'Lab Sensors', 'Office Ergonomics'],
    datasets: [
      {
        data: [140000, 84000, 345000, 411000, 128250, 114000],
        backgroundColor: ['#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#38bdf8', '#1d4ed8'],
        borderWidth: 0
      }
    ]
  };

  // Users Demographics
  const userGrowthTrend = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    datasets: [
      {
        label: 'Daily Active Sessions',
        data: [620, 710, 690, 780, 850, 890, 940, 986],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Unified Analytics & Predictive Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cross-domain intelligence across Academic Attendance, Financials, Task Velocity & Supplies
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === t
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Button
            variant="gradient"
            size="sm"
            icon={Download}
            onClick={() => onNavigate('reports')}
            className="shadow-sm shadow-blue-500/20"
          >
            Export Reports
          </Button>
        </div>
      </div>

      {/* Analytics Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Financial Analytics */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Net Operating Margin"
              value="51.1%"
              change="+4.2% QoQ"
              isPositive={true}
              icon={TrendingUp}
              color="emerald"
              subtext="Revenue ₹4.5L vs Exp ₹2.2L"
            />
            <StatCard
              title="Gross Profit Margin"
              value="₹2,30,000"
              change="Strong surplus"
              isPositive={true}
              icon={DollarSign}
              color="blue"
              subtext="Positive net liquidity"
            />
            <StatCard
              title="Projected Next Month"
              value="₹4,90,000"
              change="+8.8% growth"
              isPositive={true}
              icon={BarChart3}
              color="cyan"
              subtext="Pipeline orders confirmed"
            />
          </div>

          <ChartCard
            title="Cash Flow & Operating Trajectory"
            subtitle="6-Month revenue vs expense performance curves"
          >
            <div className="h-72">
              <Line data={financialData} options={chartOptions} />
            </div>
          </ChartCard>
        </div>
      )}

      {/* Tab Content 2: Academic & Attendance Analytics */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Average Attendance"
              value="87.2%"
              change="-8.4% dip"
              isPositive={false}
              icon={Clock}
              color="amber"
              subtext="Institutional average"
            />
            <StatCard
              title="Critical Threshold Alerts"
              value="43 students"
              change="Under 75%"
              isPositive={false}
              icon={GraduationCap}
              color="rose"
              subtext="Immediate counseling needed"
            />
            <StatCard
              title="Top Performing Wing"
              value="Computer Science"
              change="94.5% rate"
              isPositive={true}
              icon={Building}
              color="emerald"
              subtext="Highest attendance record"
            />
          </div>

          <ChartCard
            title="Departmental Attendance vs 75% Accreditation Threshold"
            subtitle="Departments below dashed red line trigger mandatory notification notices"
          >
            <div className="h-72">
              <Bar data={attendanceData} options={chartOptions} />
            </div>
          </ChartCard>
        </div>
      )}

      {/* Tab Content 3: Task & Sprint Velocity */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Sprint Velocity"
              value="24 tasks/wk"
              change="+14.2%"
              isPositive={true}
              icon={CheckSquare}
              color="cyan"
              subtext="Average delivery volume"
            />
            <StatCard
              title="On-Time Delivery Rate"
              value="91.4%"
              change="Grade A"
              isPositive={true}
              icon={TrendingUp}
              color="emerald"
              subtext="Met scheduled milestone"
            />
            <StatCard
              title="Overdue Escalations"
              value="3 tasks"
              change="Urgent follow-up"
              isPositive={false}
              icon={CheckSquare}
              color="rose"
              subtext="Assigned to Facilities & Exam"
            />
          </div>

          <ChartCard
            title="Sprint Velocity History"
            subtitle="Bi-weekly operational throughput vs delayed milestones"
          >
            <div className="h-72">
              <Bar data={tasksSprintData} options={chartOptions} />
            </div>
          </ChartCard>
        </div>
      )}

      {/* Tab Content 4: Inventory & Supplies Analytics */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Warehouse Valuation"
              value="₹12.22 Lakhs"
              change="Asset total"
              isPositive={true}
              icon={Package}
              color="blue"
              subtext="Classroom tech & infrastructure"
            />
            <StatCard
              title="Buffer Health Index"
              value="81.2%"
              change="3 items low"
              isPositive={false}
              icon={Package}
              color="amber"
              subtext="4K Displays & Cisco Switches"
            />
            <StatCard
              title="Consumables Out of Stock"
              value="1 item"
              change="HP LaserJet Toner"
              isPositive={false}
              icon={Package}
              color="rose"
              subtext="Requisition created"
            />
          </div>

          <ChartCard
            title="Capital Asset Valuation by Category"
            subtitle="Valuation proportion across infrastructure sectors"
          >
            <div className="h-72">
              <Doughnut data={inventoryAssetData} options={chartOptions} />
            </div>
          </ChartCard>
        </div>
      )}

      {/* Tab Content 5: Users & Demographics */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Active Daily Users"
              value="986 users"
              change="+8.2% growth"
              isPositive={true}
              icon={Users}
              color="blue"
              subtext="Online in last 24 hours"
            />
            <StatCard
              title="Registered Accounts"
              value="1,245"
              change="+12.5% MTD"
              isPositive={true}
              icon={Users}
              color="cyan"
              subtext="Students, Faculty & Staff"
            />
            <StatCard
              title="Avg Session Duration"
              value="28m 40s"
              change="+3.1m engagement"
              isPositive={true}
              icon={Clock}
              color="emerald"
              subtext="High portal utilization"
            />
          </div>

          <ChartCard
            title="User Telemetry & Concurrent Portal Sessions"
            subtitle="Weekly active sessions progression"
          >
            <div className="h-72">
              <Line data={userGrowthTrend} options={chartOptions} />
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
