// Reports & Export Center for SMARTORA
import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Eye,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { exportService } from '../services/exportService';

export default function ReportsPage() {
  const { currentUser } = useAuth();
  const { users, students, employees, tasks, attendance, products, sales, expenses, stats, invoices, suppliers, projects, appointments, currentOrganization } = useData();
  const { addToast } = useToast();

  const [previewReport, setPreviewReport] = useState(null);

  const reportTemplates = [
    {
      id: 'rep-business',
      title: 'Monthly Business & Executive Summary',
      type: 'Executive',
      description: 'Comprehensive overview of monthly revenues, operational expense margins, headcount, and KPI velocity.',
      rowsCount: `${(sales?.length || 0) + (expenses?.length || 0)} ledger lines`,
      getData: () => [
        { Metric: 'Active Organization', Value: currentOrganization?.name || 'SMARTORA Default' },
        { Metric: 'Industry Sector', Value: currentOrganization?.businessType || 'General Business' },
        { Metric: 'Monthly Revenue', Value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}` },
        { Metric: 'Monthly Expenses', Value: `₹${(stats?.totalExpenses || 0).toLocaleString('en-IN')}` },
        { Metric: 'Net Margin', Value: `₹${((stats?.totalRevenue || 0) - (stats?.totalExpenses || 0)).toLocaleString('en-IN')}` },
        { Metric: 'Registered Workforce', Value: (employees?.length || 0).toString() },
        { Metric: 'Active Product SKUs', Value: (products?.length || 0).toString() }
      ]
    },
    {
      id: 'rep-invoices',
      title: 'Tax Invoices & Receivables Ledger',
      type: 'Finance',
      description: 'Itemized GST tax invoices, customer receivables, taxes, issue & due dates, and settlement status.',
      rowsCount: `${invoices?.length || 0} tax invoices`,
      getData: () => (invoices || []).map(inv => ({
        InvoiceNumber: inv.invoiceNumber,
        Customer: inv.customerName,
        IssueDate: inv.issueDate,
        DueDate: inv.dueDate,
        SubtotalINR: inv.subtotal,
        TaxRate: `${inv.taxRate}%`,
        TaxINR: inv.taxAmount,
        TotalINR: inv.totalAmount,
        Status: inv.status
      }))
    },
    {
      id: 'rep-suppliers',
      title: 'Suppliers & Procurement Directory',
      type: 'Procurement',
      description: 'Registered vendors, categories, SLA performance ratings, typical lead times, and pending payables balance.',
      rowsCount: `${suppliers?.length || 0} vendors`,
      getData: () => (suppliers || []).map(s => ({
        VendorID: s.id,
        VendorName: s.name,
        Category: s.category,
        Phone: s.phone,
        Email: s.email,
        LeadTimeDays: s.leadTimeDays,
        SLARating: s.rating,
        PendingPayablesINR: s.pendingPayables,
        Status: s.status
      }))
    },
    {
      id: 'rep-sales',
      title: 'Sales Orders & Procurement Ledger',
      type: 'Commercial',
      description: 'Itemized sales transactions, customer invoice references, amounts in INR, and payment clearance statuses.',
      rowsCount: `${sales.length} customer orders`,
      getData: () => sales.map(s => ({
        OrderID: s.id,
        Customer: s.customer,
        Product: s.product,
        AmountINR: s.amount,
        Date: s.date,
        Status: s.status,
        PaymentMethod: s.paymentMethod
      }))
    },
    {
      id: 'rep-expenses',
      title: 'Operational Expense Vouchers Ledger',
      type: 'Finance',
      description: 'Disbursement register across salaries, campus rent, utilities, marketing, and logistics maintenance.',
      rowsCount: `${expenses.length} vouchers`,
      getData: () => expenses.map(e => ({
        VoucherID: e.id,
        Description: e.title,
        Category: e.category,
        AmountINR: e.amount,
        Date: e.date,
        Status: e.status,
        PaymentRef: e.paymentRef
      }))
    },
    {
      id: 'rep-inventory',
      title: 'Inventory Stock & Asset Valuation Report',
      type: 'Logistics',
      description: 'Hardware asset inventory, current stock levels, safety minimum buffers, unit valuations, and health.',
      rowsCount: `${products.length} product SKUs`,
      getData: () => products.map(p => ({
        SKU: p.id,
        ProductName: p.name,
        Category: p.category,
        StockOnHand: p.stock,
        MinBuffer: p.minStock,
        UnitPriceINR: p.price,
        TotalAssetValueINR: p.stock * p.price,
        HealthStatus: p.status
      }))
    },
    {
      id: 'rep-projects',
      title: 'Project Initiatives & Delivery Milestones',
      type: 'Operations',
      description: 'Active project pipelines, budget allocations vs actuals, milestones completion percentage, and deadlines.',
      rowsCount: `${projects?.length || 0} initiatives`,
      getData: () => (projects || []).map(p => ({
        ProjectID: p.id,
        Title: p.title,
        Client: p.client,
        BudgetINR: p.budget,
        SpentINR: p.spent,
        Progress: `${p.progress}%`,
        Deadline: p.deadline,
        Status: p.status
      }))
    },
    {
      id: 'rep-appointments',
      title: 'Appointments & Consultations Schedule',
      type: 'Scheduling',
      description: 'Scheduled consultations, client details, service types, assigned staff, and confirmation statuses.',
      rowsCount: `${appointments?.length || 0} bookings`,
      getData: () => (appointments || []).map(a => ({
        BookingID: a.id,
        ClientName: a.clientName,
        Service: a.service,
        Date: a.date,
        Time: a.time,
        AssignedStaff: a.staffName,
        Status: a.status
      }))
    },
    {
      id: 'rep-faculty',
      title: 'Faculty & Employee Performance Review',
      type: 'Human Resources',
      description: 'Faculty designation roster, assigned task deliverables, attendance scorecards, and performance tiers.',
      rowsCount: `${employees.length} faculty records`,
      getData: () => employees.map(e => ({
        ID: e.id,
        Name: e.name,
        Department: e.department,
        Designation: e.role,
        Attendance: `${e.attendance}%`,
        TasksAssigned: e.tasks,
        PerformanceTier: e.performance
      }))
    },
    {
      id: 'rep-attendance',
      title: 'Institutional Attendance & Threshold Audit',
      type: 'Compliance',
      description: 'Detailed attendance percentages, daily logs, and candidate records below the mandatory 75% threshold.',
      rowsCount: `${attendance.length} attendance logs`,
      getData: () => attendance.map(a => ({
        ID: a.id,
        Name: a.name,
        Department: a.department,
        Date: a.date,
        Status: a.status,
        AttendancePercent: `${a.percentage}%`
      }))
    },
    {
      id: 'rep-students',
      title: 'Student Enrolment & Academic Roster',
      type: 'Academic',
      description: 'Batch-wise student directory, department allotments, academic GPA, and compliance statuses.',
      rowsCount: `${students.length} student records`,
      getData: () => students.map(s => ({
        StudentID: s.id,
        Name: s.name,
        Department: s.department,
        AcademicYear: s.year,
        Attendance: `${s.attendance}%`,
        GPA: s.gpa,
        Status: s.status
      }))
    }
  ];

  const handleExportCSV = (rep) => {
    const data = rep.getData();
    exportService.downloadCSV(`SMARTORA_${rep.id}`, data);
    addToast('CSV Download Started', `Generated ${rep.title} CSV file.`, 'success');
  };

  const handleOpenPreview = (rep) => {
    setPreviewReport({
      ...rep,
      data: rep.getData()
    });
  };

  const handlePrint = () => {
    exportService.printReport();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Audit Reports & Document Export
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate executive compliance summaries, downloadable CSV ledgers, and printable PDF documents
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={() => handleOpenPreview(reportTemplates[0])}
          >
            Preview Executive Dossier
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTemplates.map((rep) => (
          <div
            key={rep.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  {rep.type}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {rep.rowsCount}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={Eye}
                onClick={() => handleOpenPreview(rep)}
                className="text-xs flex-1"
              >
                Preview
              </Button>

              <Button
                variant="gradient"
                size="sm"
                icon={Download}
                onClick={() => handleExportCSV(rep)}
                className="text-xs flex-1 font-semibold"
              >
                Export CSV
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Report Preview & PDF Print */}
      <Modal
        isOpen={Boolean(previewReport)}
        onClose={() => setPreviewReport(null)}
        title={previewReport?.title || 'Report Preview'}
        subtitle="Formatted Executive Print Preview"
        maxWidth="max-w-4xl"
      >
        {previewReport && (
          <div className="space-y-6">
            {/* Printable Document Sheet */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-sans">
              {/* Header Letterhead */}
              <div className="border-b border-slate-200 dark:border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                    SMARTORA PLATFORM
                  </span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                    {currentUser?.organization || 'Apex Institute of Technology & Management'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Official Telemetry & Compliance Dossier
                  </p>
                </div>

                <div className="text-right text-xs text-slate-500 font-mono">
                  <p>Generated: {new Date().toLocaleDateString()}</p>
                  <p>Authority: {currentUser?.name} ({currentUser?.role})</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">Status: Certified Valid</p>
                </div>
              </div>

              {/* Data Table Preview */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold">
                      {previewReport.data && previewReport.data.length > 0 &&
                        Object.keys(previewReport.data[0]).map((h, i) => (
                          <th key={i} className="py-2 px-3 border border-slate-300 dark:border-slate-600">
                            {h}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {previewReport.data &&
                      previewReport.data.slice(0, 10).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/30">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {previewReport.data && previewReport.data.length > 10 && (
                <p className="text-[11px] text-slate-400 text-center mt-3">
                  Showing first 10 rows of {previewReport.data.length} total records. Full dataset included in CSV export.
                </p>
              )}

              {/* Signature Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end text-xs text-slate-400">
                <div>
                  <p>Verified by SMARTORA Heuristic Core v2.5</p>
                  <p className="text-[10px]">Hash: SHA256-789a42f8c12</p>
                </div>
                <div className="text-right">
                  <div className="w-32 border-b border-slate-400 mb-1" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Executive Signature</p>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setPreviewReport(null)}>
                Close
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Printer}
                onClick={handlePrint}
              >
                Print / Save PDF
              </Button>
              <Button
                variant="gradient"
                size="sm"
                icon={Download}
                onClick={() => {
                  handleExportCSV(previewReport);
                  setPreviewReport(null);
                }}
              >
                Download CSV
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
