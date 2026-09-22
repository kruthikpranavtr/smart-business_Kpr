// Invoices Page for SMARTORA
// Universal Billing, GST Invoicing, PDF Print Preview and Payment Lifecycle Management

import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  Trash2,
  ExternalLink,
  DollarSign,
  Calendar,
  Building2,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function InvoicesPage() {
  const { invoices, addInvoice, updateInvoiceStatus, deleteInvoice, currentOrganization } = useData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'paid' | 'pending' | 'overdue'
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  // New Invoice Form State
  const [newInv, setNewInv] = useState({
    customer: '',
    customerEmail: '',
    customerAddress: '',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'Pending',
    paymentMethod: 'UPI / Net Banking',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: 'Payment terms: Net 15 days from issuance date.'
  });

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalCount = invoices.length;
    const paidInvoices = invoices.filter(i => i.status === 'Paid');
    const pendingInvoices = invoices.filter(i => i.status === 'Pending');
    const overdueInvoices = invoices.filter(i => i.status === 'Overdue');

    const totalBilled = invoices.reduce((acc, i) => acc + i.total, 0);
    const paidTotal = paidInvoices.reduce((acc, i) => acc + i.total, 0);
    const pendingTotal = pendingInvoices.reduce((acc, i) => acc + i.total, 0);
    const overdueTotal = overdueInvoices.reduce((acc, i) => acc + i.total, 0);

    return {
      totalCount,
      totalBilled,
      paidTotal,
      paidCount: paidInvoices.length,
      pendingTotal,
      pendingCount: pendingInvoices.length,
      overdueTotal,
      overdueCount: overdueInvoices.length
    };
  }, [invoices]);

  // Filter Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch =
        inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (activeTab === 'paid') return inv.status === 'Paid';
      if (activeTab === 'pending') return inv.status === 'Pending';
      if (activeTab === 'overdue') return inv.status === 'Overdue';

      return true;
    });
  }, [invoices, searchTerm, activeTab]);

  // Line Item Handlers
  const handleItemChange = (index, field, val) => {
    const updated = [...newInv.items];
    updated[index][field] = field === 'quantity' || field === 'unitPrice' ? Number(val) : val;
    setNewInv({ ...newInv, items: updated });
  };

  const addItemRow = () => {
    setNewInv({
      ...newInv,
      items: [...newInv.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const removeItemRow = (index) => {
    if (newInv.items.length === 1) return;
    setNewInv({
      ...newInv,
      items: newInv.items.filter((_, idx) => idx !== index)
    });
  };

  const calculateFormTotals = () => {
    const subtotal = newInv.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newInv.customer.trim()) {
      addToast('Customer Name Required', 'Please enter a valid customer or business name.', 'warning');
      return;
    }

    const { subtotal, tax, total } = calculateFormTotals();
    const created = addInvoice({
      ...newInv,
      subtotal,
      tax,
      total
    });

    addToast('Invoice Created', `Invoice #${created.invoiceNumber} has been generated.`, 'success');
    setIsCreateOpen(false);
    setNewInv({
      customer: '',
      customerEmail: '',
      customerAddress: '',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      paymentMethod: 'UPI / Net Banking',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: 'Payment terms: Net 15 days from issuance date.'
    });
  };

  const handleStatusToggle = (invId, currentStatus) => {
    const nextStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    updateInvoiceStatus(invId, nextStatus);
    addToast(
      'Status Updated',
      `Invoice marked as ${nextStatus}.`,
      nextStatus === 'Paid' ? 'success' : 'info'
    );
    if (viewInvoice && viewInvoice.id === invId) {
      setViewInvoice({ ...viewInvoice, status: nextStatus });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Customer', 'Date', 'Due Date', 'Subtotal', 'Tax', 'Total', 'Status', 'Payment Method'];
    const rows = filteredInvoices.map(i => [
      i.invoiceNumber,
      `"${i.customer}"`,
      i.date,
      i.dueDate,
      i.subtotal,
      i.tax,
      i.total,
      i.status,
      i.paymentMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SMARTORA_Invoices_${currentOrganization?.name || 'Store'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Export Complete', 'Invoices exported to CSV successfully.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const curr = currentOrganization?.currencySymbol || '₹';

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Invoices & Billing
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
              GST Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage customer invoicing, automated overdue payment reminders, and print GST tax receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={Download}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            icon={Plus}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Invoiced</span>
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">
            {curr}{metrics.totalBilled.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {metrics.totalCount} Invoices generated
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Paid Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {curr}{metrics.paidTotal.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
            {metrics.paidCount} Cleared accounts
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Pending Collection</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
            {curr}{metrics.pendingTotal.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {metrics.pendingCount} Invoices within terms
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Overdue Receivables</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
            {curr}{metrics.overdueTotal.toLocaleString()}
          </p>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 block">
            {metrics.overdueCount} Critical reminders sent
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'paid'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Paid ({metrics.paidCount})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pending ({metrics.pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'overdue'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Overdue ({metrics.overdueCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search invoice or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Customer / Organization</th>
                <th className="py-3 px-3">Issue Date</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Subtotal</th>
                <th className="py-3 px-3">GST (18%)</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No invoices found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {inv.customer}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {inv.customerEmail || 'No email registered'}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {inv.date}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {inv.dueDate}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {curr}{inv.subtotal?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {curr}{inv.tax?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                      {curr}{inv.total?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleStatusToggle(inv.id, inv.status)}
                        title="Click to toggle payment status"
                        className="cursor-pointer transition-transform hover:scale-105"
                      >
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
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setViewInvoice(inv)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                          title="View & Print Tax Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            deleteInvoice(inv.id);
                            addToast('Invoice Deleted', `Invoice #${inv.invoiceNumber} removed.`, 'info');
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Tax Invoice"
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Customer / Enterprise Client *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Tech Solutions"
                value={newInv.customer}
                onChange={(e) => setNewInv({ ...newInv, customer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Customer Email
              </label>
              <input
                type="email"
                placeholder="accounts@client.com"
                value={newInv.customerEmail}
                onChange={(e) => setNewInv({ ...newInv, customerEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Billing Address
              </label>
              <input
                type="text"
                placeholder="e.g. Indiranagar, Bengaluru, Karnataka"
                value={newInv.customerAddress}
                onChange={(e) => setNewInv({ ...newInv, customerAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                value={newInv.dueDate}
                onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Initial Status
              </label>
              <select
                value={newInv.status}
                onChange={(e) => setNewInv({ ...newInv, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Pending">Pending (Net 15)</option>
                <option value="Paid">Paid (Immediate Clearance)</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Line Items List */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Invoice Line Items
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {newInv.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Product or Service Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-center outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-right outline-none"
                  />
                  <span className="w-20 text-right text-xs font-bold text-slate-700 dark:text-slate-300">
                    {curr}{(item.quantity * item.unitPrice).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    disabled={newInv.items.length === 1}
                    className="text-slate-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Totals Summary */}
          {(() => {
            const { subtotal, tax, total } = calculateFormTotals();
            return (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span>{curr}{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST (18%):</span>
                  <span>{curr}{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Amount:</span>
                  <span className="text-blue-600 dark:text-blue-400">{curr}{total.toLocaleString()}</span>
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Generate & Save Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW & PRINT INVOICE MODAL */}
      <Modal
        isOpen={Boolean(viewInvoice)}
        onClose={() => setViewInvoice(null)}
        title={`Tax Invoice Preview: ${viewInvoice?.invoiceNumber}`}
        size="lg"
      >
        {viewInvoice && (
          <div className="space-y-6">
            
            {/* Printable Invoice Container */}
            <div id="printable-invoice" className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 text-xs text-slate-800 dark:text-slate-200">
              
              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-blue-600 tracking-tight">
                    {currentOrganization?.name || 'SMARTORA Enterprise'}
                  </h2>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {currentOrganization?.location?.address || 'Commercial Center'}, {currentOrganization?.location?.city || 'Bengaluru'}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    GSTIN: <strong>{currentOrganization?.details?.gstin || '29AABCA1234F1Z8'}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    TAX INVOICE
                  </h3>
                  <p className="font-mono font-bold text-blue-600">
                    {viewInvoice.invoiceNumber}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Date: {viewInvoice.date}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Due Date: {viewInvoice.dueDate}
                  </p>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Billed To:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {viewInvoice.customer}
                  </p>
                  {viewInvoice.customerEmail && (
                    <p className="text-slate-500">{viewInvoice.customerEmail}</p>
                  )}
                  {viewInvoice.customerAddress && (
                    <p className="text-slate-500 mt-0.5">{viewInvoice.customerAddress}</p>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Payment Status:
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant={
                        viewInvoice.status === 'Paid'
                          ? 'success'
                          : viewInvoice.status === 'Overdue'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {viewInvoice.status}
                    </Badge>
                  </div>
                  <p className="text-slate-500 mt-1">Method: {viewInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2 text-left">Item Description</th>
                    <th className="py-2 text-center w-16">Qty</th>
                    <th className="py-2 text-right w-24">Unit Price</th>
                    <th className="py-2 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {viewInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium">{item.description}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">{curr}{item.unitPrice?.toLocaleString()}</td>
                      <td className="py-2 text-right font-bold">{curr}{(item.quantity * item.unitPrice)?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculation Summary */}
              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Taxable Subtotal:</span>
                    <span>{curr}{viewInvoice.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>GST (CGST 9% + SGST 9%):</span>
                    <span>{curr}{viewInvoice.tax?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-300 dark:border-slate-700">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">{curr}{viewInvoice.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes / Footer */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500">
                <p><strong>Terms & Notes:</strong> {viewInvoice.notes}</p>
                <p className="mt-1">Computer generated electronic tax invoice under SMARTORA Platform. No physical signature required.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusToggle(viewInvoice.id, viewInvoice.status)}
              >
                Mark as {viewInvoice.status === 'Paid' ? 'Pending' : 'Paid'}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewInvoice(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrint}
                  icon={Printer}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Print / Save PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
