// Sales & Revenue Management Page for SMARTORA
import React, { useState } from 'react';
import { TrendingUp, Plus, DollarSign, ShoppingBag, CreditCard, ArrowUpRight, BarChart3 } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Line, Bar } from 'react-chartjs-2';
import '../utils/chartConfig';

export default function SalesPage() {
  const { sales, addSale, updateSaleStatus } = useData();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    amount: 45000,
    paymentMethod: 'Corporate Wire'
  });

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.customer.trim() || !formData.product.trim()) {
      addToast('Validation Error', 'Customer and product are required.', 'warning');
      return;
    }
    addSale(formData);
    addToast('Order Recorded', `Order for ${formData.customer} registered.`, 'success');
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateSaleStatus(orderId, newStatus);
    addToast('Status Updated', `Order #${orderId} marked as ${newStatus}.`, 'info');
  };

  // Sales Trends Line Data
  const salesTrendData = {
    labels: ['1 Sep', '4 Sep', '8 Sep', '12 Sep', '16 Sep', '20 Sep'],
    datasets: [
      {
        label: 'Daily Revenue (₹)',
        data: [42000, 68500, 79000, 58000, 139996, 230000],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  // Computed Sales stats
  const completedSales = sales.filter(s => s.status === 'Completed');
  const totalCompletedAmount = completedSales.reduce((acc, s) => acc + s.amount, 0);
  const todaySales = 369996; // Presentation figure
  const avgOrderValue = Math.round(totalCompletedAmount / (completedSales.length || 1));

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (s) => <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">{s.id}</span>
    },
    {
      key: 'customer',
      label: 'Customer / Institution',
      sortable: true,
      render: (s) => <span className="font-semibold text-slate-900 dark:text-white">{s.customer}</span>
    },
    {
      key: 'product',
      label: 'Product / Service Description',
      sortable: true,
      render: (s) => <span className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate block">{s.product}</span>
    },
    {
      key: 'amount',
      label: 'Amount (₹)',
      sortable: true,
      render: (s) => (
        <span className="font-bold text-xs text-slate-900 dark:text-white">
          ₹{s.amount.toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'date',
      label: 'Order Date',
      sortable: true,
      render: (s) => <span className="text-xs text-slate-400 font-mono">{s.date}</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (s) => {
        let variant = 'info';
        if (s.status === 'Completed') variant = 'success';
        if (s.status === 'Cancelled') variant = 'danger';

        return (
          <div className="flex items-center gap-1.5">
            <Badge variant={variant}>{s.status}</Badge>
            {s.status === 'Pending' && (
              <button
                onClick={() => handleStatusChange(s.id, 'Completed')}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Mark Paid
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sales & Revenue Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise procurement contracts, supply shipments, and transaction receipts
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          className="shadow-sm shadow-blue-500/20"
        >
          New Sales Order
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value="₹3,69,996"
          change="+24.2%"
          isPositive={true}
          icon={TrendingUp}
          color="blue"
          subtext="2 corporate orders"
        />
        <StatCard
          title="Monthly Sales"
          value={`₹${(totalCompletedAmount / 100000).toFixed(2)}L`}
          change="+15.8% MoM"
          isPositive={true}
          icon={ShoppingBag}
          color="emerald"
          subtext="Total MTD revenue"
        />
        <StatCard
          title="Orders"
          value={sales.length}
          change="95% clearance"
          isPositive={true}
          icon={CreditCard}
          color="cyan"
          subtext="Across all channels"
        />
        <StatCard
          title="Avg Order Value"
          value={`₹${(avgOrderValue / 1000).toFixed(1)}k`}
          change="+8.4%"
          isPositive={true}
          icon={DollarSign}
          color="blue"
          subtext="Average ticket size"
        />
      </div>

      {/* Sales Trend Chart */}
      <ChartCard
        title="Revenue Trajectory (September 2026)"
        subtitle="Gross order revenue progression in INR"
        actions={
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
            Target Met (112%)
          </span>
        }
      >
        <div className="h-64">
          <Line data={salesTrendData} options={chartOptions} />
        </div>
      </ChartCard>

      {/* Orders DataTable */}
      <DataTable
        columns={columns}
        data={sales}
        searchPlaceholder="Search order ID, client, product..."
        searchKeys={['id', 'customer', 'product']}
        filterKey="status"
        filterLabel="Status"
        filterOptions={['Completed', 'Pending', 'Cancelled']}
        pageSize={8}
      />

      {/* Modal: New Sales Order */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record New Sales Order"
        subtitle="Register customer contract and issue invoice"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Customer / Organization Name *
            </label>
            <input
              type="text"
              required
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              placeholder="e.g. Apex Tech Solutions"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Product / Item Details *
            </label>
            <input
              type="text"
              required
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              placeholder="e.g. Dell UltraSharp 27 Monitor x 2"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Order Amount (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Payment Channel
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Corporate Wire">Corporate Wire</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI / Razorpay">UPI / Razorpay</option>
                <option value="Invoice (Net 30)">Invoice (Net 30)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Record Sale
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
