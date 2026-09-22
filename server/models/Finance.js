import mongoose from 'mongoose';
import { diskStore } from '../config/db.js';
import { matchesTenant } from '../utils/tenantUtils.js';

const financialTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true, index: true },
  organizationId: { type: String, required: true, index: true },
  organizationType: { type: String, default: 'COMPANY' },
  transactionType: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  transactionDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  departmentId: { type: String, default: null },
  department: { type: String, default: 'General / Corporate' },
  description: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Cash', 'UPI', 'Credit Card', 'Debit Card', 'Cheque', 'Other'],
    default: 'Bank Transfer'
  },
  referenceNumber: { type: String, default: '' },
  notes: { type: String, default: '' },
  attachmentUrl: { type: String, default: '' },
  attachmentId: { type: String, default: null },
  status: {
    type: String,
    enum: ['COMPLETED', 'PENDING', 'VOID', 'REVERSED', 'CANCELLED'],
    default: 'COMPLETED'
  },
  relatedEntityType: { type: String, default: null },
  relatedEntityId: { type: String, default: null },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, default: null }
}, {
  timestamps: true
});

const MongooseFinance = mongoose.models.FinancialTransaction ||
  mongoose.model('FinancialTransaction', financialTransactionSchema);

// Initial real transactions seed for tenant organizations
const INITIAL_TRANSACTIONS = [
  // Tech Nova (SMR-CMP-0001) Initial Income & Expense
  {
    transactionId: 'TXN-1001',
    organizationId: 'SMR-CMP-0001',
    organizationType: 'COMPANY',
    transactionType: 'INCOME',
    amount: 350000,
    category: 'Service Revenue',
    subcategory: 'Enterprise Cloud Architecture',
    transactionDate: '2026-09-01',
    department: 'Enterprise Sales & Accounts',
    description: 'Quarterly enterprise cloud retainer payment from NexaCorp',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'NEFT-NEXA-8812',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    transactionId: 'TXN-1002',
    organizationId: 'SMR-CMP-0001',
    organizationType: 'COMPANY',
    transactionType: 'INCOME',
    amount: 150000,
    category: 'Consulting',
    subcategory: 'AI Strategy Deployment',
    transactionDate: '2026-09-05',
    department: 'Engineering',
    description: 'AI model fine-tuning milestone payment',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'RTGS-AI-9021',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-05T14:30:00.000Z'
  },
  {
    transactionId: 'TXN-1003',
    organizationId: 'SMR-CMP-0001',
    organizationType: 'COMPANY',
    transactionType: 'EXPENSE',
    amount: 120000,
    category: 'Salary',
    subcategory: 'Engineering Payroll',
    transactionDate: '2026-09-07',
    department: 'Engineering',
    description: 'Monthly payroll disbursement for cloud engineering staff',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'PAY-ENG-0926',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-07T09:00:00.000Z'
  },
  {
    transactionId: 'TXN-1004',
    organizationId: 'SMR-CMP-0001',
    organizationType: 'COMPANY',
    transactionType: 'EXPENSE',
    amount: 55000,
    category: 'Software',
    subcategory: 'Cloud Infrastructure & Tooling',
    transactionDate: '2026-09-10',
    department: 'Operations',
    description: 'AWS cluster hosting & Kubernetes developer licenses',
    paymentMethod: 'Credit Card',
    referenceNumber: 'CC-AWS-8421',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-10T11:15:00.000Z'
  },
  {
    transactionId: 'TXN-1005',
    organizationId: 'SMR-CMP-0001',
    organizationType: 'COMPANY',
    transactionType: 'EXPENSE',
    amount: 35000,
    category: 'Rent',
    subcategory: 'Office Facilities',
    transactionDate: '2026-09-12',
    department: 'Operations',
    description: 'Outer Ring Road tech hub workspace maintenance & rent',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'RENT-ORR-2026',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-12T16:45:00.000Z'
  },

  // Grand Mirage Resort (SMR-CMP-0002) Initial Transactions
  {
    transactionId: 'TXN-2001',
    organizationId: 'SMR-CMP-0002',
    organizationType: 'HOTEL',
    transactionType: 'INCOME',
    amount: 250000,
    category: 'Room Revenue',
    subcategory: 'Executive Villas & Luxury Suites',
    transactionDate: '2026-09-15',
    department: 'Front Desk & Guest Services',
    description: 'Weekend resort accommodations & luxury suite bookings',
    paymentMethod: 'Credit Card',
    referenceNumber: 'CC-RES-7721',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0002',
    createdAt: '2026-09-15T18:00:00.000Z'
  },
  {
    transactionId: 'TXN-2002',
    organizationId: 'SMR-CMP-0002',
    organizationType: 'HOTEL',
    transactionType: 'EXPENSE',
    amount: 120000,
    category: 'Housekeeping',
    subcategory: 'Linen & Cleaning Consumables',
    transactionDate: '2026-09-16',
    department: 'Housekeeping & Maintenance',
    description: 'Bulk eco-certified hospitality supplies & linen laundry',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'EXP-HK-9921',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0002',
    createdAt: '2026-09-16T11:00:00.000Z'
  },

  // BrightFuture College (SMR-CMP-0003) Initial Transactions
  {
    transactionId: 'TXN-3001',
    organizationId: 'SMR-CMP-0003',
    organizationType: 'COLLEGE',
    transactionType: 'INCOME',
    amount: 780000,
    category: 'Student Fees',
    subcategory: 'Semester 5 Tuition',
    transactionDate: '2026-09-02',
    department: 'Computer Science & Engineering',
    description: 'Semester 5 B.Tech tuition fee collection batch',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'FEE-BTECH-09',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0003',
    createdAt: '2026-09-02T10:30:00.000Z'
  },
  {
    transactionId: 'TXN-3002',
    organizationId: 'SMR-CMP-0003',
    organizationType: 'COLLEGE',
    transactionType: 'EXPENSE',
    amount: 430000,
    category: 'Faculty Salary',
    subcategory: 'CSE Faculty Monthly Payroll',
    transactionDate: '2026-09-05',
    department: 'Computer Science & Engineering',
    description: 'Faculty professors and teaching assistants monthly compensation',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'PAY-FAC-0926',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0003',
    createdAt: '2026-09-05T12:00:00.000Z'
  }
];

export const FinanceModel = {
  /**
   * Get all transactions strictly matching tenant organization
   */
  getAll: async (orgId, filters = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const query = {
          $or: [
            { organizationId: orgId },
            { organization_id: orgId }
          ]
        };

        if (filters.transactionType && filters.transactionType !== 'ALL') {
          query.transactionType = filters.transactionType.toUpperCase();
        }
        if (filters.category && filters.category !== 'ALL') {
          query.category = filters.category;
        }
        if (filters.department && filters.department !== 'ALL') {
          query.department = filters.department;
        }
        if (filters.status && filters.status !== 'ALL') {
          query.status = filters.status.toUpperCase();
        }
        if (filters.startDate && filters.endDate) {
          query.transactionDate = { $gte: filters.startDate, $lte: filters.endDate };
        }

        const list = await MongooseFinance.find(query).sort({ transactionDate: -1, createdAt: -1 }).lean();
        if (list.length > 0) return list;
      }
    } catch (e) {
      console.error('[Finance Model] MongoDB getAll error:', e.message);
    }

    // Disk Store fallback
    let allTxns = diskStore.readCollection('financial_transactions', INITIAL_TRANSACTIONS);
    let tenantTxns = allTxns.filter(t => matchesTenant(t, orgId));

    if (filters.transactionType && filters.transactionType !== 'ALL') {
      tenantTxns = tenantTxns.filter(t => t.transactionType === filters.transactionType.toUpperCase());
    }
    if (filters.category && filters.category !== 'ALL') {
      tenantTxns = tenantTxns.filter(t => t.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.department && filters.department !== 'ALL') {
      tenantTxns = tenantTxns.filter(t => t.department?.toLowerCase().includes(filters.department.toLowerCase()));
    }
    if (filters.status && filters.status !== 'ALL') {
      tenantTxns = tenantTxns.filter(t => t.status === filters.status.toUpperCase());
    }
    if (filters.startDate && filters.endDate) {
      tenantTxns = tenantTxns.filter(t => t.transactionDate >= filters.startDate && t.transactionDate <= filters.endDate);
    }

    return tenantTxns.sort((a, b) => new Date(b.transactionDate || b.createdAt) - new Date(a.transactionDate || a.createdAt));
  },

  /**
   * Create a new transaction in MongoDB / DiskStore
   */
  create: async (data) => {
    const transactionId = data.transactionId || `TXN-${Date.now().toString().slice(-6)}`;
    const newTxn = {
      ...data,
      transactionId,
      amount: Number(data.amount) || 0,
      transactionType: data.transactionType.toUpperCase(),
      status: data.status || 'COMPLETED',
      transactionDate: data.transactionDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const created = await MongooseFinance.create(newTxn);
        return created.toObject();
      }
    } catch (e) {
      console.error('[Finance Model] MongoDB create error:', e.message);
    }

    const allTxns = diskStore.readCollection('financial_transactions', INITIAL_TRANSACTIONS);
    const updated = [newTxn, ...allTxns];
    diskStore.writeCollection('financial_transactions', updated);
    return newTxn;
  },

  /**
   * Update transaction status (e.g. VOID, REVERSED, CANCELLED)
   */
  updateStatus: async (transactionId, status, actorUserId, notes = '', orgId = null) => {
    const validStatuses = ['COMPLETED', 'PENDING', 'VOID', 'REVERSED', 'CANCELLED'];
    const normStatus = status.toUpperCase();
    if (!validStatuses.includes(normStatus)) {
      throw new Error(`Invalid transaction status: ${status}`);
    }

    try {
      if (mongoose.connection.readyState === 1) {
        const query = { transactionId };
        if (orgId) {
          query.$or = [{ organizationId: orgId }, { organization_id: orgId }];
        }
        const updated = await MongooseFinance.findOneAndUpdate(
          query,
          {
            $set: {
              status: normStatus,
              updatedBy: actorUserId,
              notes: notes ? notes : undefined
            }
          },
          { new: true }
        ).lean();
        if (updated) return updated;
      }
    } catch (e) {
      console.error('[Finance Model] MongoDB updateStatus error:', e.message);
    }

    const allTxns = diskStore.readCollection('financial_transactions', INITIAL_TRANSACTIONS);
    const idx = allTxns.findIndex(t => t.transactionId === transactionId && (orgId ? matchesTenant(t, orgId) : true));
    if (idx === -1) return null;

    allTxns[idx].status = normStatus;
    allTxns[idx].updatedBy = actorUserId;
    if (notes) allTxns[idx].notes = notes;
    allTxns[idx].updatedAt = new Date().toISOString();

    diskStore.writeCollection('financial_transactions', allTxns);
    return allTxns[idx];
  },

  /**
   * Calculate live financial KPIs: Income, Expense, Net Profit / Loss, Category Breakdown
   */
  getSummary: async (orgId, filters = {}) => {
    const txns = await FinanceModel.getAll(orgId, filters);
    // Exclude voided, reversed, cancelled transactions from active P&L calculations
    const activeTxns = txns.filter(t => t.status === 'COMPLETED' || t.status === 'PENDING');

    let totalIncome = 0;
    let totalExpense = 0;
    const incomeCategories = {};
    const expenseCategories = {};
    const monthlyMap = {};

    activeTxns.forEach(t => {
      const amt = Number(t.amount) || 0;
      const mKey = (t.transactionDate || '').slice(0, 7) || '2026-09';

      if (!monthlyMap[mKey]) {
        monthlyMap[mKey] = { month: mKey, income: 0, expense: 0, net: 0 };
      }

      if (t.transactionType === 'INCOME') {
        totalIncome += amt;
        incomeCategories[t.category] = (incomeCategories[t.category] || 0) + amt;
        monthlyMap[mKey].income += amt;
      } else if (t.transactionType === 'EXPENSE') {
        totalExpense += amt;
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + amt;
        monthlyMap[mKey].expense += amt;
      }
    });

    Object.values(monthlyMap).forEach(m => {
      m.net = m.income - m.expense;
    });

    const netProfitLoss = totalIncome - totalExpense;
    const isProfit = netProfitLoss >= 0;

    return {
      totalIncome,
      totalExpense,
      netProfitLoss,
      netProfit: netProfitLoss,
      netMarginPercentage: totalIncome > 0 ? ((netProfitLoss / totalIncome) * 100).toFixed(1) : '0.0',
      isProfit,
      totalTransactions: txns.length,
      activeTransactionsCount: activeTxns.length,
      voidedCount: txns.filter(t => t.status === 'VOID' || t.status === 'REVERSED').length,
      categoryBreakdown: {
        income: incomeCategories,
        expense: expenseCategories
      },
      monthlyTrends: Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month))
    };
  }
};
