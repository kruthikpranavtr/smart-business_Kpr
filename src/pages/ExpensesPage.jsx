// Expense Management & Ledger Page for SMARTORA
// Handles operational expenditure vouchers, budget distribution, category breakdowns, and audit trails

import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  DollarSign,
  AlertCircle,
  PieChart,
  Trash2,
  Calendar,
  Eye,
  CheckCircle2,
  Building,
  CreditCard,
  FileText,
  Clock,
  Printer,
  X,
  TrendingDown,
  ArrowUpRight,
  Wallet,
  ShieldCheck
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Doughnut } from 'react-chartjs-2';
import '../utils/chartConfig';

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, stats, currentOrganization } = useData();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptExpense, setReceiptExpense] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Maintenance',
    amount: 12000,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    notes: ''
  });

  // Ensure safe array representation to prevent crashes on undefined or null lists
  const safeExpenses = useMemo(() => {
    return Array.isArray(expenses) ? expenses : [];
  }, [expenses]);

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Validation Error', 'Expense description title is required', 'warning');
      return;
    }
    const numAmount = Number(formData.amount);
    if (!numAmount || numAmount <= 0) {
      addToast('Validation Error', 'Please specify a valid expense amount in INR.', 'warning');
      return;
    }

    const newVoucher = addExpense({
      title: formData.title.trim(),
      category: formData.category,
      amount: numAmount,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      notes: formData.notes?.trim() || '',
      date: new Date().toISOString().split('T')[0],
      paymentRef: `PAY-${Date.now().toString().slice(-4)}`,
      receipt: `VCH-${Date.now().toString().slice(-4)}`
    });

    addToast(
      'Expense Voucher Logged',
      `₹${numAmount.toLocaleString('en-IN')} successfully debited to ${formData.category} ledger.`,
      'success'
    );
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      category: 'Maintenance',
      amount: 12000,
      paymentMethod: 'Bank Transfer',
      status: 'Paid',
      notes: ''
    });
  };

  const handleOpenReceipt = (exp) => {
    setReceiptExpense(exp);
    setIsReceiptModalOpen(true);
  };

  const handleOpenDelete = (exp) => {
    setSelectedExpense(exp);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      addToast('Expense Removed', `Voucher #${selectedExpense.id} removed from ledger.`, 'info');
      setIsDeleteOpen(false);
      setSelectedExpense(null);
    }
  };

  // Category totals for Pie Chart
  const categoryTotals = useMemo(() => {
    const categories = ['Salary', 'Rent', 'Electricity', 'Marketing', 'Transport', 'Maintenance', 'Other'];
    const map = {};
    categories.forEach(c => (map[c] = 0));

    safeExpenses.forEach(e => {
      const amt = Number(e.amount) || 0;
      if (map[e.category] !== undefined) map[e.category] += amt;
      else map.Other = (map.Other || 0) + amt;
    });

    return map;
  }, [safeExpenses]);

  const totalExpenseSum = useMemo(() => {
    return Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  }, [categoryTotals]);

  // Largest Category calculation
  const largestCategory = useMemo(() => {
    let topName = 'None';
    let topVal = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > topVal) {
        topVal = amt;
        topName = cat;
      }
    });
    return { name: topName, amount: topVal };
  }, [categoryTotals]);

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#6366f1', // Salary - Indigo
          '#3b82f6', // Rent - Blue
          '#f59e0b', // Electricity - Amber
          '#ec4899', // Marketing - Pink
          '#06b6d4', // Transport - Cyan
          '#10b981', // Maintenance - Emerald
          '#8b5cf6'  // Other - Purple
        ],
        borderWidth: 0
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { boxWidth: 12, font: { size: 11 } }
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Expense Description & Reference',
      sortable: true,
      render: (e) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white block">{e.title}</span>
          <span className="text-xs text-slate-400 font-mono">
            {e.id} • Ref: {e.paymentRef || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (e) => {
        let variant = 'info';
        if (e.category === 'Salary') variant = 'blue';
        if (e.category === 'Marketing') variant = 'info';
        if (e.category === 'Electricity') variant = 'warning';
        if (e.category === 'Maintenance') variant = 'success';
        if (e.category === 'Rent') variant = 'purple';
        return <Badge variant={variant}>{e.category}</Badge>;
      }
    },
    {
      key: 'amount',
      label: 'Amount (₹)',
      sortable: true,
      render: (e) => (
        <span className="font-semibold text-slate-900 dark:text-white">
          ₹{(Number(e.amount) || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'date',
      label: 'Disbursement Date',
      sortable: true,
      render: (e) => e.date || 'Today'
    },
    {
      key: 'paymentMethod',
      label: 'Payment Mode',
      sortable: true,
      render: (e) => e.paymentMethod || 'Bank Transfer'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (e) => (
        <Badge variant={e.status === 'Paid' ? 'success' : 'warning'}>
          {e.status || 'Paid'}
        </Badge>
      )
    },
    {
      key: 'receipt',
      label: 'Voucher #',
      sortable: false,
      render: (e) => (
        <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
          {e.receipt || e.paymentRef || 'VCH-AUTO'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      className: 'text-right',
      render: (e) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleOpenReceipt(e)}
            title="Inspect Voucher Receipt"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenDelete(e)}
            title="Delete Voucher"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            Expense Management & Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Operational expenditure vouchers, category disbursements, and budget reconciliation for{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {currentOrganization?.name || 'Workspace'}
            </span>
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-sm shadow-blue-500/20"
        >
          Add Expense Voucher
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Ledger Outflow"
          value={`₹${totalExpenseSum > 100000 ? (totalExpenseSum / 100000).toFixed(2) + 'L' : totalExpenseSum.toLocaleString('en-IN')}`}
          change={`${safeExpenses.length} Vouchers Recorded`}
          isPositive={true}
          icon={Receipt}
          color="rose"
          subtext="Total debit transactions"
        />
        <StatCard
          title="Current Period Outflow"
          value={`₹${(totalExpenseSum * 0.85).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          change="Operational burn rate"
          isPositive={false}
          icon={Calendar}
          color="amber"
          subtext="Current billing cycle"
        />
        <StatCard
          title="Primary Expenditure"
          value={largestCategory.name}
          change={
            totalExpenseSum > 0
              ? `₹${largestCategory.amount.toLocaleString('en-IN')} (${Math.round(
                  (largestCategory.amount / totalExpenseSum) * 100
                )}%)`
              : 'No expenses logged'
          }
          isPositive={true}
          icon={PieChart}
          color="blue"
          subtext="Highest category share"
        />
      </div>

      {/* Category Pie Chart Card */}
      <ChartCard
        title="Expenditure Breakdown by Category"
        subtitle="Distribution of operational disbursements (Salaries, Rent, Utilities, Maintenance, etc.)"
        actions={
          <span className="text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
            Total Outflow: ₹{totalExpenseSum.toLocaleString('en-IN')}
          </span>
        }
      >
        <div className="h-64 flex items-center justify-center">
          {totalExpenseSum > 0 ? (
            <Doughnut data={pieData} options={pieOptions} />
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <span>No expense records found for this workspace. Click "Add Expense Voucher" to begin tracking.</span>
            </div>
          )}
        </div>
      </ChartCard>

      {/* Expenses DataTable */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Operational Expense Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit-ready disbursement records partitioned for {currentOrganization?.name || 'Workspace'}
            </p>
          </div>
          <Badge variant="neutral">
            {safeExpenses.length} Records
          </Badge>
        </div>

        <DataTable
          columns={columns}
          data={safeExpenses}
          searchPlaceholder="Search expense title, ID, or voucher ref..."
          searchKeys={['title', 'id', 'category', 'paymentRef', 'receipt']}
          filterKey="category"
          filterLabel="Category"
          filterOptions={['Salary', 'Rent', 'Electricity', 'Marketing', 'Transport', 'Maintenance', 'Other']}
          pageSize={8}
        />
      </div>

      {/* Modal: Add Expense */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Operational Expense"
        subtitle="Submit expense voucher for financial reconciliation"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Expense Description / Purpose *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Server Infrastructure & Cloud Backup Subscription"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Salary">Salary & Payroll</option>
                <option value="Rent">Office / Facility Rent</option>
                <option value="Electricity">Electricity & Utilities</option>
                <option value="Marketing">Marketing & Advertising</option>
                <option value="Transport">Logistics & Transport</option>
                <option value="Maintenance">Maintenance & Repairs</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Disbursement Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Payment Mode
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI Instant</option>
                <option value="Credit Card">Corporate Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Petty Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Payment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Paid">Paid / Settled</option>
                <option value="Pending">Pending Approval</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Internal Reconciliation Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Vendor details, GST voucher notes, or invoice reconciliation reference..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Record Voucher
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Voucher Receipt */}
      {receiptExpense && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setReceiptExpense(null);
          }}
          title="Expense Voucher Dossier"
          subtitle={`Voucher #${receiptExpense.receipt || receiptExpense.id} • ${currentOrganization?.name || 'Workspace'}`}
        >
          <div className="space-y-4 text-xs">
            {/* Top Voucher Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-blue-500/10 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Disbursed Amount
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{(Number(receiptExpense.amount) || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right">
                <Badge variant={receiptExpense.status === 'Paid' ? 'success' : 'warning'}>
                  {receiptExpense.status || 'Paid'}
                </Badge>
                <span className="block text-[10px] text-slate-400 mt-1">
                  {receiptExpense.paymentMethod || 'Bank Transfer'}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Purpose</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {receiptExpense.title}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Category</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {receiptExpense.category}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Disbursement Date</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                  {receiptExpense.date || 'Today'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Transaction Reference</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                  {receiptExpense.paymentRef || receiptExpense.id}
                </p>
              </div>
            </div>

            {/* Tenant Trust Footnote */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>
                Reconciled under SMARTORA Multi-Tenant Financial Security & Ledger Auditing.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                icon={Printer}
                onClick={() => {
                  window.print();
                  addToast('Print Triggered', 'Opening browser print dialog for expense voucher.', 'info');
                }}
              >
                Print Voucher
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsReceiptModalOpen(false);
                  setReceiptExpense(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense Voucher"
        message={`Are you sure you want to remove "${selectedExpense?.title}"? This action modifies the active financial ledger.`}
      />
    </div>
  );
}
