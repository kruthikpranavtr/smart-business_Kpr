// Company Finance & Treasury Management Page for SMARTORA
// Tenant-Isolated Financial Accounting, Live P&L Computation & Safe Ledger Auditing

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Eye,
  Edit2,
  RotateCcw,
  Ban,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  BarChart3,
  Receipt,
  Download,
  Check,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import DataTable from '../components/common/DataTable';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../utils/chartConfig';

const INCOME_CATEGORIES = [
  'Service Revenue',
  'Product Sales',
  'Consulting & Advisory',
  'SaaS Subscriptions',
  'Tuition Fees',
  'Investments & Interest',
  'Grants & Subsidies',
  'Other Income'
];

const EXPENSE_CATEGORIES = [
  'Office Rent & Facilities',
  'Payroll & Salaries',
  'Cloud & IT Infrastructure',
  'Marketing & Advertising',
  'Software & Subscriptions',
  'Office Supplies & Stationary',
  'Travel & Entertainment',
  'Legal & Professional Fees',
  'Lab Equipment & Supplies',
  'Utilities & Maintenance',
  'Inventory & Raw Materials',
  'Other Expense'
];

export default function FinancePage({ onNavigate }) {
  const { currentUser } = useAuth();
  const {
    currentOrganization,
    transactions = [],
    departments = [],
    addTransaction,
    updateTransactionStatus
  } = useData();
  const { addToast } = useToast();

  const currencySymbol = currentOrganization?.currencySymbol || '₹';

  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'pnl' | 'charts'
  const [chartTrendRange, setChartTrendRange] = useState('monthly'); // 'daily' | 'weekly' | 'monthly' | 'yearly'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [voidReason, setVoidReason] = useState('');
  const [voidActionType, setVoidActionType] = useState('VOID'); // 'VOID' | 'REVERSED'

  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'INCOME' | 'EXPENSE'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'COMPLETED' | 'PENDING' | 'VOID' | 'REVERSED'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL'); // 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'LAST_MONTH' | 'THIS_QUARTER' | 'THIS_YEAR'

  // Form State for Add Transaction
  const [formData, setFormData] = useState({
    transactionType: 'INCOME',
    amount: '',
    category: 'Service Revenue',
    customCategory: '',
    subcategory: '',
    transactionDate: new Date().toISOString().split('T')[0],
    department: 'General / Corporate',
    description: '',
    paymentMethod: 'Bank Transfer',
    referenceNumber: '',
    notes: '',
    attachmentUrl: ''
  });

  // Available departments list
  const availableDepartments = useMemo(() => {
    const list = (departments || []).map(d => d.name);
    return list.length > 0 ? list : ['Engineering', 'Sales & Marketing', 'Operations', 'Finance & Accounts', 'Human Resources'];
  }, [departments]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return transactions.filter(t => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          (t.transactionId || '').toLowerCase().includes(query) ||
          (t.description || '').toLowerCase().includes(query) ||
          (t.category || '').toLowerCase().includes(query) ||
          (t.subcategory || '').toLowerCase().includes(query) ||
          (t.department || '').toLowerCase().includes(query) ||
          (t.referenceNumber || '').toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (typeFilter !== 'ALL' && t.transactionType !== typeFilter) return false;

      // Status filter
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

      // Category filter
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;

      // Department filter
      if (departmentFilter !== 'ALL' && t.department !== departmentFilter) return false;

      // Date Range filter
      if (dateRangeFilter !== 'ALL' && t.transactionDate) {
        const txnDate = new Date(t.transactionDate);
        if (dateRangeFilter === 'TODAY' && t.transactionDate !== todayStr) return false;
        if (dateRangeFilter === 'THIS_MONTH') {
          if (txnDate.getMonth() !== now.getMonth() || txnDate.getFullYear() !== now.getFullYear()) return false;
        }
        if (dateRangeFilter === 'LAST_MONTH') {
          const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          if (txnDate.getMonth() !== lastMonth || txnDate.getFullYear() !== lastMonthYear) return false;
        }
        if (dateRangeFilter === 'THIS_YEAR') {
          if (txnDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      return true;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter, categoryFilter, departmentFilter, dateRangeFilter]);

  // Live dynamic calculations
  const { totalIncome, totalExpense, netProfit, isProfit, totalCount } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    let count = 0;

    (transactions || []).forEach(t => {
      if (t.status === 'COMPLETED') {
        count++;
        const amt = Number(t.amount) || 0;
        if (t.transactionType === 'INCOME') {
          inc += amt;
        } else if (t.transactionType === 'EXPENSE') {
          exp += amt;
        }
      }
    });

    const net = inc - exp;
    return {
      totalIncome: inc,
      totalExpense: exp,
      netProfit: net,
      isProfit: net >= 0,
      totalCount: count
    };
  }, [transactions]);

  // Breakdown by Category for charts
  const categoryBreakdown = useMemo(() => {
    const incomeMap = {};
    const expenseMap = {};

    transactions.forEach(t => {
      if (t.status === 'COMPLETED') {
        const amt = Number(t.amount) || 0;
        if (t.transactionType === 'INCOME') {
          incomeMap[t.category] = (incomeMap[t.category] || 0) + amt;
        } else {
          expenseMap[t.category] = (expenseMap[t.category] || 0) + amt;
        }
      }
    });

    return { incomeMap, expenseMap };
  }, [transactions]);

  // Trend Data for Charts
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const incomeByMonth = new Array(12).fill(0);
    const expenseByMonth = new Array(12).fill(0);

    transactions.forEach(t => {
      if (t.status === 'COMPLETED' && t.transactionDate) {
        const d = new Date(t.transactionDate);
        if (!isNaN(d.getTime())) {
          const m = d.getMonth();
          const amt = Number(t.amount) || 0;
          if (t.transactionType === 'INCOME') {
            incomeByMonth[m] += amt;
          } else {
            expenseByMonth[m] += amt;
          }
        }
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeByMonth,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Expense',
          data: expenseByMonth,
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  }, [transactions]);

  // Handlers
  const handleOpenAdd = (defaultType = 'INCOME') => {
    setFormData({
      transactionType: defaultType,
      amount: '',
      category: defaultType === 'INCOME' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
      customCategory: '',
      subcategory: '',
      transactionDate: new Date().toISOString().split('T')[0],
      department: availableDepartments[0] || 'General / Corporate',
      description: '',
      paymentMethod: 'Bank Transfer',
      referenceNumber: '',
      notes: '',
      attachmentUrl: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    const parsedAmount = Number(formData.amount);
    if (!parsedAmount || parsedAmount <= 0) {
      addToast('Validation Error', 'Transaction amount must be a positive number.', 'warning');
      return;
    }
    if (!formData.description.trim()) {
      addToast('Validation Error', 'Please provide a transaction description / narration.', 'warning');
      return;
    }

    const finalCategory = formData.category === 'CUSTOM'
      ? (formData.customCategory.trim() || 'Custom Category')
      : formData.category;

    const newTxn = await addTransaction({
      transactionType: formData.transactionType,
      amount: parsedAmount,
      category: finalCategory,
      subcategory: formData.subcategory.trim(),
      transactionDate: formData.transactionDate,
      department: formData.department,
      description: formData.description.trim(),
      paymentMethod: formData.paymentMethod,
      referenceNumber: formData.referenceNumber.trim(),
      notes: formData.notes.trim(),
      attachmentUrl: formData.attachmentUrl.trim()
    });

    addToast(
      'Transaction Recorded',
      `${formData.transactionType} of ${currencySymbol}${parsedAmount.toLocaleString()} saved to company ledger.`,
      'success'
    );
    setIsAddModalOpen(false);
  };

  const handleOpenVoidModal = (txn, actionType = 'VOID') => {
    setSelectedTxn(txn);
    setVoidActionType(actionType);
    setVoidReason('');
    setIsVoidModalOpen(true);
  };

  const handleConfirmVoid = async () => {
    if (!selectedTxn) return;
    if (!voidReason.trim()) {
      addToast('Validation Required', 'Please state the reason for voiding or reversing this record.', 'warning');
      return;
    }

    await updateTransactionStatus(selectedTxn.transactionId || selectedTxn.id, voidActionType, voidReason.trim());
    addToast(
      voidActionType === 'VOID' ? 'Transaction Voided' : 'Transaction Reversed',
      `Transaction ${selectedTxn.transactionId} has been marked as ${voidActionType}. Ledger adjusted.`,
      'info'
    );
    setIsVoidModalOpen(false);
    setSelectedTxn(null);
  };

  // Table Columns
  const columns = [
    {
      key: 'transactionDate',
      label: 'Date',
      sortable: true,
      render: (t) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {t.transactionDate || '2026-09-01'}
        </span>
      )
    },
    {
      key: 'transactionId',
      label: 'TXN ID',
      sortable: true,
      render: (t) => (
        <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
          {t.transactionId || t.id}
        </span>
      )
    },
    {
      key: 'transactionType',
      label: 'Type',
      sortable: true,
      render: (t) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          t.transactionType === 'INCOME'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
        }`}>
          {t.transactionType === 'INCOME' ? (
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
          ) : (
            <ArrowDownRight className="w-3 h-3 text-rose-600" />
          )}
          {t.transactionType}
        </span>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (t) => (
        <div>
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
            {t.category}
          </span>
          {t.subcategory && (
            <span className="text-[10px] text-slate-400 block">{t.subcategory}</span>
          )}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (t) => (
        <div className="max-w-xs truncate" title={t.description}>
          <span className="text-xs text-slate-700 dark:text-slate-300">{t.description}</span>
          {t.department && (
            <span className="block text-[10px] text-slate-400">{t.department}</span>
          )}
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (t) => {
        const isInc = t.transactionType === 'INCOME';
        const isVoided = t.status === 'VOID' || t.status === 'REVERSED';
        return (
          <span className={`font-mono font-black text-xs ${
            isVoided
              ? 'line-through text-slate-400'
              : isInc
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}>
            {isInc ? '+' : '-'}{currencySymbol}{Number(t.amount).toLocaleString()}
          </span>
        );
      }
    },
    {
      key: 'paymentMethod',
      label: 'Method & Ref',
      sortable: false,
      render: (t) => (
        <div className="text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300 block">{t.paymentMethod || 'Bank Transfer'}</span>
          {t.referenceNumber && (
            <span className="font-mono text-[10px] text-slate-400 block truncate max-w-[120px]">{t.referenceNumber}</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (t) => {
        let variant = 'success';
        if (t.status === 'PENDING') variant = 'warning';
        if (t.status === 'VOID' || t.status === 'REVERSED') variant = 'neutral';
        return <Badge variant={variant}>{t.status || 'COMPLETED'}</Badge>;
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (t) => {
        const isVoided = t.status === 'VOID' || t.status === 'REVERSED';
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedTxn(t);
                setIsDetailModalOpen(true);
              }}
              title="View Transaction Details"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            {!isVoided && (
              <>
                <button
                  onClick={() => handleOpenVoidModal(t, 'VOID')}
                  title="Void Transaction (Soft Reverse)"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenVoidModal(t, 'REVERSED')}
                  title="Reverse Transaction"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
              Finance & Treasury • {currentOrganization?.companyCode || 'CMP'}
            </span>
            <span className="text-xs text-emerald-100 font-medium">
              {currentOrganization?.name}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Company Financial Ledger & P&L
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Live dynamic cashflow tracking, income vs expenses reconciliation, profit/loss analysis, and audit-grade immutable records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenAdd('INCOME')}
            className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold shadow-md shadow-black/10 border-0"
            icon={Plus}
          >
            + Add Income
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenAdd('EXPENSE')}
            className="bg-emerald-800 text-white hover:bg-emerald-900 font-bold shadow-md shadow-black/10 border-0"
            icon={Plus}
          >
            + Add Expense
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Cards (Live Dynamic Sums) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL INCOME */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Income
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {currencySymbol}{totalIncome.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Live</span>
            <span>from verified completed transactions</span>
          </div>
        </div>

        {/* TOTAL EXPENSE */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Expense
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {currencySymbol}{totalExpense.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-rose-600 dark:text-rose-400">Operational</span>
            <span>total company expenditure</span>
          </div>
        </div>

        {/* NET PROFIT / LOSS */}
        <div className={`p-4 rounded-2xl border shadow-sm relative overflow-hidden ${
          isProfit
            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider ${
              isProfit ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
            }`}>
              {isProfit ? 'NET PROFIT' : 'NET LOSS'}
            </span>
            <div className={`p-2 rounded-xl ${
              isProfit
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'
            }`}>
              {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-black ${
              isProfit ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
            }`}>
              {isProfit ? '+' : '-'}{currencySymbol}{Math.abs(netProfit).toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Formula: Total Income – Total Expense</span>
          </div>
        </div>

        {/* TOTAL TRANSACTIONS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Transactions
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalCount}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-blue-600">Active</span>
            <span>settled ledger entries</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Transactions Ledger ({filteredTransactions.length})
        </button>
        <button
          onClick={() => setActiveTab('pnl')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'pnl'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Profit & Loss Statement
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'charts'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Financial Analytics & Breakdown
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS LEDGER */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID, description, category, reference..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL">All Types</option>
                <option value="INCOME">Income Only</option>
                <option value="EXPENSE">Expense Only</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="VOID">Void</option>
                <option value="REVERSED">Reversed</option>
              </select>

              {/* Date Range */}
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today</option>
                <option value="THIS_MONTH">This Month</option>
                <option value="LAST_MONTH">Last Month</option>
                <option value="THIS_YEAR">This Year</option>
              </select>

              {/* Clear filters button */}
              {(searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL' || dateRangeFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('ALL');
                    setStatusFilter('ALL');
                    setDateRangeFilter('ALL');
                  }}
                  className="p-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1 font-semibold"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            columns={columns}
            data={filteredTransactions}
            searchPlaceholder="Search in ledger..."
            pageSize={10}
          />
        </div>
      )}

      {/* TAB 2: PROFIT & LOSS STATEMENT */}
      {activeTab === 'pnl' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Statement of Profit and Loss
              </h2>
              <p className="text-xs text-slate-500">
                Entity: {currentOrganization?.name} • Year-to-Date (YTD) FY 2026-27
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isProfit
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
              }`}>
                {isProfit ? 'PROFITABLE OPERATION' : 'NET DEFICIT'}
              </span>
            </div>
          </div>

          {/* Income Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-xl">
              <span className="font-bold text-sm text-emerald-800 dark:text-emerald-200">
                I. REVENUE FROM OPERATIONS
              </span>
              <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-300">
                {currencySymbol}{totalIncome.toLocaleString()}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 px-3 text-xs">
              {Object.entries(categoryBreakdown.incomeMap).map(([cat, amt]) => (
                <div key={cat} className="py-2 flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>{cat}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {currencySymbol}{amt.toLocaleString()}
                  </span>
                </div>
              ))}
              {Object.keys(categoryBreakdown.incomeMap).length === 0 && (
                <div className="py-2 text-slate-400 italic">No income transactions recorded yet.</div>
              )}
            </div>
          </div>

          {/* Expense Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-rose-50/70 dark:bg-rose-950/30 p-3 rounded-xl">
              <span className="font-bold text-sm text-rose-800 dark:text-rose-200">
                II. OPERATING EXPENDITURES
              </span>
              <span className="font-mono font-black text-sm text-rose-700 dark:text-rose-300">
                {currencySymbol}{totalExpense.toLocaleString()}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 px-3 text-xs">
              {Object.entries(categoryBreakdown.expenseMap).map(([cat, amt]) => (
                <div key={cat} className="py-2 flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>{cat}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {currencySymbol}{amt.toLocaleString()}
                  </span>
                </div>
              ))}
              {Object.keys(categoryBreakdown.expenseMap).length === 0 && (
                <div className="py-2 text-slate-400 italic">No expense transactions recorded yet.</div>
              )}
            </div>
          </div>

          {/* Net Result Bar */}
          <div className={`p-4 rounded-xl flex items-center justify-between font-black text-base border ${
            isProfit
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
          }`}>
            <span>III. NET PROFIT / (LOSS) FOR THE PERIOD</span>
            <span className="font-mono text-xl">
              {isProfit ? '+' : '-'}{currencySymbol}{Math.abs(netProfit).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIAL CHARTS & ANALYTICS */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* Trend Chart */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Income vs Expense Flow Trend
                </h3>
                <p className="text-xs text-slate-500">Real-time monthly aggregation</p>
              </div>
            </div>
            <div className="h-72">
              <Line
                data={trendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } }
                }}
              />
            </div>
          </div>

          {/* Doughnut Category Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income by Category */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Income Source Breakdown
              </h3>
              <div className="h-60 flex items-center justify-center">
                {Object.keys(categoryBreakdown.incomeMap).length > 0 ? (
                  <Doughnut
                    data={{
                      labels: Object.keys(categoryBreakdown.incomeMap),
                      datasets: [
                        {
                          data: Object.values(categoryBreakdown.incomeMap),
                          backgroundColor: ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b']
                        }
                      ]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                ) : (
                  <span className="text-xs text-slate-400">No income data</span>
                )}
              </div>
            </div>

            {/* Expense by Category */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Expense Allocation Breakdown
              </h3>
              <div className="h-60 flex items-center justify-center">
                {Object.keys(categoryBreakdown.expenseMap).length > 0 ? (
                  <Doughnut
                    data={{
                      labels: Object.keys(categoryBreakdown.expenseMap),
                      datasets: [
                        {
                          data: Object.values(categoryBreakdown.expenseMap),
                          backgroundColor: ['#f43f5e', '#fb923c', '#eab308', '#a855f7', '#ec4899']
                        }
                      ]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                ) : (
                  <span className="text-xs text-slate-400">No expense data</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: + Add Transaction */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Record Financial Transaction`}
        subtitle={`Add immutable entry to ${currentOrganization?.name || 'Company'} ledger`}
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, transactionType: 'INCOME', category: INCOME_CATEGORIES[0] })}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                formData.transactionType === 'INCOME'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> INCOME
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, transactionType: 'EXPENSE', category: EXPENSE_CATEGORIES[0] })}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                formData.transactionType === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" /> EXPENSE
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Amount ({currencySymbol}) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Transaction Date *
              </label>
              <input
                type="date"
                required
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {(formData.transactionType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="CUSTOM">+ Custom Category...</option>
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Subcategory (Optional)
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g. AWS Nodes or Retainer"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {formData.category === 'CUSTOM' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  Specify Custom Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  placeholder="e.g. Patent Filing Fees"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {availableDepartments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT / RTGS)</option>
                <option value="UPI">UPI / Instant Transfer</option>
                <option value="Credit Card">Corporate Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash Voucher</option>
                <option value="Cheque">Cheque</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Reference Number */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Reference / Transaction Number
              </label>
              <input
                type="text"
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                placeholder="e.g. UTR-998234 or INV-2026-44"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {/* Description / Narration */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Narration / Description *
              </label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about the financial transaction..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Record Transaction
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: View Transaction Details */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Transaction Dossier"
        subtitle={`Audit Record ${selectedTxn?.transactionId || selectedTxn?.id}`}
      >
        {selectedTxn && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            {/* Header pill */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Amount Recorded
                </span>
                <span className={`text-2xl font-black font-mono ${
                  selectedTxn.transactionType === 'INCOME'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {selectedTxn.transactionType === 'INCOME' ? '+' : '-'}{currencySymbol}{Number(selectedTxn.amount).toLocaleString()}
                </span>
              </div>
              <Badge variant={selectedTxn.transactionType === 'INCOME' ? 'success' : 'danger'}>
                {selectedTxn.transactionType}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 block font-semibold">Category</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTxn.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Subcategory</span>
                <span className="font-medium">{selectedTxn.subcategory || 'None'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Date</span>
                <span className="font-mono">{selectedTxn.transactionDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Department</span>
                <span>{selectedTxn.department || 'General'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Payment Method</span>
                <span>{selectedTxn.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Reference ID</span>
                <span className="font-mono">{selectedTxn.referenceNumber || 'N/A'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1">Description</span>
              <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {selectedTxn.description}
              </p>
            </div>

            {selectedTxn.notes && (
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Audit Notes</span>
                <p className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  {selectedTxn.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsDetailModalOpen(false)}>
                Close Dossier
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: Void / Reverse Transaction */}
      <Modal
        isOpen={isVoidModalOpen}
        onClose={() => setIsVoidModalOpen(false)}
        title={voidActionType === 'VOID' ? 'Void Transaction' : 'Reverse Transaction'}
        subtitle="Audited financial ledger reversal"
      >
        {selectedTxn && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block">Immutable Accounting Guard</span>
                <span>Financial records are never destroyed. Voiding or reversing marks the entry inactive and adjusts ledger balances while maintaining audit history.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">TXN ID:</span>
                <span className="font-mono font-bold text-blue-600">{selectedTxn.transactionId || selectedTxn.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-mono font-bold">{currencySymbol}{Number(selectedTxn.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Description:</span>
                <span>{selectedTxn.description}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Reason for {voidActionType === 'VOID' ? 'Voiding' : 'Reversing'} *
              </label>
              <textarea
                required
                rows={3}
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="e.g. Duplicate voucher recorded by mistake, or refund processed."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsVoidModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmVoid}
                disabled={!voidReason.trim()}
              >
                Confirm {voidActionType === 'VOID' ? 'Void' : 'Reverse'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
