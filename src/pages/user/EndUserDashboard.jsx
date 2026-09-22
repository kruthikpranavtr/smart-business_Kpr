// End-User / Client Portal Dashboard for SMARTORA
// Role-restricted self-service portal for customers, clients, students, or patients

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  CreditCard,
  LifeBuoy,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Send,
  Building2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function EndUserDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const {
    currentOrganization,
    invoices,
    appointments,
    addAppointment,
    projects,
    logAuditEvent
  } = useData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'invoices', 'appointments', 'support'
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    title: '',
    service: 'Enterprise Architecture Consultation',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00 AM',
    notes: ''
  });

  // Support Ticket Form State
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-1092',
      subject: 'API Webhook integration payload query',
      priority: 'Medium',
      status: 'In Progress',
      date: '2025-02-18',
      response: 'Senior architect assigned. Analysis underway.'
    },
    {
      id: 'TCK-1045',
      subject: 'Q1 Service Level Agreement report request',
      priority: 'Low',
      status: 'Resolved',
      date: '2025-02-10',
      response: 'Report transmitted via email to CTO office.'
    }
  ]);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: 'Medium',
    category: 'Technical Inquiry',
    details: ''
  });

  // Filter invoices for client / tenant
  const clientInvoices = useMemo(() => {
    return invoices.slice(0, 5);
  }, [invoices]);

  const totalBilled = useMemo(() => {
    return clientInvoices.reduce((acc, inv) => acc + (Number(inv.total) || Number(inv.amount) || 0), 0);
  }, [clientInvoices]);

  const totalPaid = useMemo(() => {
    return clientInvoices
      .filter(inv => (inv.status || '').toLowerCase() === 'paid')
      .reduce((acc, inv) => acc + (Number(inv.total) || Number(inv.amount) || 0), 0);
  }, [clientInvoices]);

  // Client Appointments
  const clientAppointments = useMemo(() => {
    return appointments.slice(0, 4);
  }, [appointments]);

  // Handle Download Receipt
  const handleDownloadReceipt = (inv) => {
    logAuditEvent({
      action: 'INVOICE_RECEIPT_DOWNLOAD',
      module: 'Client Portal',
      details: `Client ${currentUser?.name} downloaded invoice receipt for ${inv.invoiceNumber || inv.id}`
    });
    addToast('Receipt Downloaded', `Official receipt for ${inv.invoiceNumber || inv.id} generated and downloaded.`, 'success');
  };

  // Handle Book Appointment
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.title.trim()) {
      addToast('Missing Details', 'Please provide a subject or purpose for the appointment.', 'error');
      return;
    }

    addAppointment({
      title: bookingForm.title,
      clientName: currentUser?.name || 'Enterprise Client',
      clientEmail: currentUser?.email || 'customer@techsolutions.demo',
      service: bookingForm.service,
      date: bookingForm.date,
      time: bookingForm.time,
      status: 'Confirmed',
      notes: bookingForm.notes
    });

    logAuditEvent({
      action: 'CLIENT_APPOINTMENT_BOOKED',
      module: 'Client Portal',
      details: `Client scheduled session: ${bookingForm.title} on ${bookingForm.date} at ${bookingForm.time}`
    });

    addToast('Session Scheduled', 'Your consultation has been booked and confirmed with your account team.', 'success');
    setIsBookModalOpen(false);
    setBookingForm({
      title: '',
      service: 'Enterprise Architecture Consultation',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '11:00 AM',
      notes: ''
    });
  };

  // Handle Pay Invoice
  const handlePayInvoice = () => {
    if (!selectedInvoice) return;
    logAuditEvent({
      action: 'CLIENT_INVOICE_PAYMENT',
      module: 'Client Portal',
      details: `Client payment simulated for ${selectedInvoice.invoiceNumber || selectedInvoice.id} of ₹${(selectedInvoice.total || selectedInvoice.amount || 0).toLocaleString('en-IN')}`
    });
    addToast('Payment Processed', `Payment of ₹${(selectedInvoice.total || selectedInvoice.amount || 0).toLocaleString('en-IN')} confirmed! Thank you.`, 'success');
    setIsPayModalOpen(false);
  };

  // Handle Ticket Submit
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.details.trim()) {
      addToast('Missing Information', 'Please provide a ticket subject and description.', 'error');
      return;
    }

    const newTicket = {
      id: `TCK-${Math.floor(1100 + Math.random() * 8900)}`,
      subject: ticketForm.subject,
      priority: ticketForm.priority,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      response: 'Ticket logged with Priority Support Queue. Assigned within 30 minutes.'
    };

    setTickets([newTicket, ...tickets]);
    logAuditEvent({
      action: 'CLIENT_SUPPORT_TICKET_CREATED',
      module: 'Client Portal',
      details: `Client submitted ticket: ${newTicket.subject} (${newTicket.id})`
    });

    addToast('Ticket Created', `Your support inquiry ${newTicket.id} has been dispatched to engineering support.`, 'success');
    setTicketForm({
      subject: '',
      priority: 'Medium',
      category: 'Technical Inquiry',
      details: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* End User Greeting Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-bold">
              Client Portal • Tier 5 Access
            </span>
            <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Logical Tenant Isolation Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome, {currentUser?.name || 'Valued Client'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise account with <strong className="text-blue-600 dark:text-blue-400">{currentOrganization.name}</strong> • Account ID: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono">CLT-NX-001</code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={Calendar}
            onClick={() => setIsBookModalOpen(true)}
          >
            Book Session
          </Button>
          <Button
            variant="primary"
            icon={LifeBuoy}
            onClick={() => setActiveTab('support')}
          >
            Get Support
          </Button>
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Billed"
          value={`₹${totalBilled.toLocaleString('en-IN')}`}
          icon={CreditCard}
          color="blue"
          trend="Lifetime enterprise billing"
        />
        <StatCard
          title="Total Settled"
          value={`₹${totalPaid.toLocaleString('en-IN')}`}
          icon={DollarSign}
          color="emerald"
          trend="All invoices up to date"
        />
        <StatCard
          title="Active Engagements"
          value="2 Projects"
          icon={Building2}
          color="purple"
          trend="SLA 99.98% uptime"
        />
        <StatCard
          title="Support Tickets"
          value={`${tickets.filter(t => t.status !== 'Resolved').length} Active`}
          icon={LifeBuoy}
          color="amber"
          trend="Average response: 18m"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          My Services & Projects
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'invoices'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Billing & Invoices ({clientInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'appointments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Scheduled Sessions ({clientAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'support'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Support Desk ({tickets.length})
        </button>
      </div>

      {/* Tab 1: Overview & Services */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Active Enterprise Engagements
                </h3>
                <span className="text-xs text-slate-500">Service Level: Platinum Enterprise</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Cloud Infrastructure Migration - Phase II</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Assigned to: Architecture & DevOps Team</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Milestone Progress</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">75% Complete</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Target Delivery: March 31, 2025</span>
                    <span>Next Review: Thursday 2:00 PM</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">24/7 AI Automation & Incident Monitoring</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Service tier: Guaranteed 15-minute response SLA</p>
                    </div>
                    <Badge variant="info">Subscribed</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Renewal: Annual Contract (Oct 2025)</span>
                    <span className="text-emerald-600 font-medium">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Invoices snippet */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Recent Invoices
                </h3>
                <button
                  onClick={() => setActiveTab('invoices')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                      <th className="pb-3 font-semibold">Invoice #</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {clientInvoices.slice(0, 3).map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="py-3 font-mono font-medium text-slate-900 dark:text-white">
                          {inv.invoiceNumber || inv.id}
                        </td>
                        <td className="py-3 text-slate-500">{inv.issueDate || inv.date || '2025-02-15'}</td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">
                          ₹{(Number(inv.total) || Number(inv.amount) || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3">
                          <Badge variant={(inv.status || '').toLowerCase() === 'paid' ? 'success' : 'warning'}>
                            {inv.status || 'Paid'}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDownloadReceipt(inv)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 justify-end ml-auto"
                          >
                            <Download className="w-3 h-3" /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Account Manager & Quick Support */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Assigned Account Team
              </h3>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
                  alt="Rahul Verma"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Rahul Verma</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Head of Enterprise Sales</p>
                  <p className="text-xs text-slate-400">{currentOrganization.name}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Direct Email:</span>
                  <span className="font-mono">sales.manager@techsolutions.demo</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Direct Hotline:</span>
                  <span>+91 98450 12345</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Office Hours:</span>
                  <span>Mon - Fri, 9 AM - 6 PM IST</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 text-xs"
                onClick={() => setIsBookModalOpen(true)}
              >
                Schedule Sync Meeting
              </Button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-sky-200" />
                <h4 className="font-bold">Need Custom Integration?</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                SMARTORA’s dedicated solutions engineers are ready to build customized ERP and API connectors for your enterprise.
              </p>
              <button
                onClick={() => setActiveTab('support')}
                className="w-full py-2 bg-white text-blue-700 font-semibold rounded-lg text-xs hover:bg-blue-50 transition-colors shadow-sm"
              >
                Request Custom Solution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Billing & Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Invoices & Payment Records
              </h3>
              <p className="text-xs text-slate-500">
                All records filtered strictly to your organization account ({currentOrganization.name}).
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Account Balance: </span>
              <span className="text-sm font-bold text-emerald-600">₹0.00 Outstanding</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                  <th className="py-3 font-semibold">Invoice Number</th>
                  <th className="py-3 font-semibold">Issue Date</th>
                  <th className="py-3 font-semibold">Due Date</th>
                  <th className="py-3 font-semibold">Total Amount</th>
                  <th className="py-3 font-semibold">Payment Status</th>
                  <th className="py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {clientInvoices.map((inv) => {
                  const isPaid = (inv.status || '').toLowerCase() === 'paid';
                  const amount = Number(inv.total) || Number(inv.amount) || 0;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {inv.invoiceNumber || inv.id}
                      </td>
                      <td className="py-3.5 text-slate-500">{inv.issueDate || inv.date || '2025-02-15'}</td>
                      <td className="py-3.5 text-slate-500">{inv.dueDate || '2025-03-01'}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        ₹{amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5">
                        <Badge variant={isPaid ? 'success' : 'warning'}>
                          {inv.status || 'Paid'}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPaid && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setIsPayModalOpen(true);
                              }}
                            >
                              Pay Now
                            </Button>
                          )}
                          <button
                            onClick={() => handleDownloadReceipt(inv)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                            title="Download PDF Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Appointments & Sessions */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Scheduled Consultations & Reviews
                </h3>
                <p className="text-xs text-slate-500">Upcoming calendar meetings with your SMARTORA enterprise delivery leads.</p>
              </div>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setIsBookModalOpen(true)}
              >
                Book New Session
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientAppointments.map((appt, idx) => (
                <div
                  key={appt.id || idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider">
                      {appt.service || 'Executive Consultation'}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {appt.title || 'Quarterly Architecture Strategy Session'}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {appt.date || '2025-02-28'} • {appt.time || '11:00 AM IST'}
                    </p>
                    {appt.notes && (
                      <p className="text-xs text-slate-400 italic mt-1">"{appt.notes}"</p>
                    )}
                  </div>
                  <Badge variant="success">Confirmed</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Support & Requests */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <LifeBuoy className="w-5 h-5 text-blue-600" />
              Your Support & Engineering Tickets
            </h3>

            <div className="space-y-4">
              {tickets.map((tck) => (
                <div
                  key={tck.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{tck.id}</span>
                      <Badge variant={tck.status === 'Resolved' ? 'success' : 'warning'}>
                        {tck.status}
                      </Badge>
                      <span className="text-xs text-slate-400">• Priority: {tck.priority}</span>
                    </div>
                    <span className="text-xs text-slate-400">{tck.date}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mt-2 text-sm">
                    {tck.subject}
                  </h4>
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-blue-600 dark:text-blue-400 font-medium">Engineer Update: </strong>
                    {tck.response}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Ticket Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Submit Service Request
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Direct line to SMARTORA engineering and customer success teams.
            </p>

            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="e.g. Need quota increase on API key"
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Priority Level
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low - General Inquiry</option>
                  <option value="Medium">Medium - Operational Question</option>
                  <option value="High">High - Impaired Functionality</option>
                  <option value="Critical">Critical - Production Blocker</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description & Details
                </label>
                <textarea
                  rows={4}
                  value={ticketForm.details}
                  onChange={(e) => setTicketForm({ ...ticketForm, details: e.target.value })}
                  placeholder="Provide step-by-step details or request specifications..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                icon={Send}
                className="w-full text-xs mt-2"
              >
                Dispatch Ticket
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Book Session */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Client Consultation"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Meeting Purpose / Agenda
            </label>
            <input
              type="text"
              required
              value={bookingForm.title}
              onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
              placeholder="e.g. Q2 Roadmap Review & Automation Audit"
              className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Requested Date
              </label>
              <input
                type="date"
                required
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Requested Time
              </label>
              <select
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="10:00 AM">10:00 AM IST</option>
                <option value="11:30 AM">11:30 AM IST</option>
                <option value="02:00 PM">02:00 PM IST</option>
                <option value="04:30 PM">04:30 PM IST</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Domain
            </label>
            <select
              value={bookingForm.service}
              onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Enterprise Architecture Consultation">Enterprise Architecture Consultation</option>
              <option value="AI Workflow & Bot Configuration">AI Workflow & Bot Configuration</option>
              <option value="Account Billing & Commercial Review">Account Billing & Commercial Review</option>
              <option value="Security & Compliance Audit">Security & Compliance Audit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes or Specific Questions
            </label>
            <textarea
              rows={3}
              value={bookingForm.notes}
              onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
              placeholder="Any details you would like the team to prepare in advance..."
              className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBookModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Pay Invoice Simulator */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Simulated Enterprise Payment Gateway"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400">Total Payable Amount</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                ₹{(Number(selectedInvoice.total) || Number(selectedInvoice.amount) || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Invoice {selectedInvoice.invoiceNumber || selectedInvoice.id} • Payable to {currentOrganization.name}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="p-3 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium text-center"
                >
                  Corporate NEFT / RTGS
                </button>
                <button
                  type="button"
                  className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-center"
                >
                  UPI / Corporate Card
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              256-Bit Encrypted Secure Payment Sandbox (Hackathon Simulation)
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsPayModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePayInvoice}
              >
                Simulate Instant Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
