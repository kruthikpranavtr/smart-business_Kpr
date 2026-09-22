import express from 'express';
import { FinanceModel } from '../models/Finance.js';
import { AuditModel } from '../models/AuditLog.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Standard category presets by organization type
 */
const CATEGORY_PRESETS = {
  COMPANY: {
    income: ['Sales', 'Service Revenue', 'Consulting', 'Subscription', 'Customer Payment', 'Other Income'],
    expense: ['Salary', 'Rent', 'Electricity', 'Water', 'Internet', 'Software', 'Equipment', 'Maintenance', 'Travel', 'Marketing', 'Transport', 'Stationery', 'Utilities', 'Other Expense']
  },
  COLLEGE: {
    income: ['Student Fees', 'Admission Fees', 'Exam Fees', 'Hostel Fees', 'Transport Fees', 'Donations', 'Government Grants', 'Other Income'],
    expense: ['Faculty Salary', 'Staff Salary', 'Electricity', 'Water', 'Internet', 'Laboratory', 'Library', 'Stationery', 'Maintenance', 'Transport', 'Events', 'Infrastructure', 'Other Expense']
  },
  HOTEL: {
    income: ['Room Revenue', 'Food Revenue', 'Room Service', 'Spa & Wellness', 'Event Bookings', 'Airport Transfer', 'Other Service Revenue'],
    expense: ['Salary', 'Utilities', 'Maintenance', 'Housekeeping', 'Food Purchases', 'Laundry', 'Transport', 'Marketing', 'Suppliers', 'Other Expense']
  }
};

/**
 * GET /api/finance/categories
 */
router.get('/categories', authenticate, (req, res) => {
  const orgType = (req.user.organizationType || 'COMPANY').toUpperCase();
  const categoryKey = orgType.includes('COLLEGE') || orgType.includes('EDUCATION')
    ? 'COLLEGE'
    : orgType.includes('HOTEL') || orgType.includes('RESORT')
      ? 'HOTEL'
      : 'COMPANY';

  res.json({
    success: true,
    organizationType: categoryKey,
    categories: CATEGORY_PRESETS[categoryKey]
  });
});

/**
 * GET /api/finance/transactions
 * Scoped strictly to authenticated user's organizationId
 */
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const isOwner = req.user.role === 'PLATFORM_OWNER';
    const targetOrgId = isOwner && req.query.organizationId ? req.query.organizationId : req.user.organization_id;

    if (!isOwner && !targetOrgId) {
      return res.status(403).json({ success: false, message: 'No organization attached to session.' });
    }

    const filters = {
      transactionType: req.query.type,
      category: req.query.category,
      department: req.query.department,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    // If HOD or Department Manager without global company permissions, restrict to their department
    if (req.user.role === 'HOD' || req.user.role === 'DEPARTMENT_MANAGER') {
      if (req.user.department) {
        filters.department = req.user.department;
      }
    }

    const transactions = await FinanceModel.getAll(targetOrgId, filters);
    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (err) {
    console.error('[Finance Routes] GET /transactions error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve transactions.' });
  }
});

/**
 * GET /api/finance/summary
 * Real-time calculation of Income, Expense, Net Profit / Loss
 */
router.get('/summary', authenticate, async (req, res) => {
  try {
    const isOwner = req.user.role === 'PLATFORM_OWNER';
    const targetOrgId = isOwner && req.query.organizationId ? req.query.organizationId : req.user.organization_id;

    if (!isOwner && !targetOrgId) {
      return res.status(403).json({ success: false, message: 'No organization attached to session.' });
    }

    const filters = {
      department: req.query.department,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    if ((req.user.role === 'HOD' || req.user.role === 'DEPARTMENT_MANAGER') && req.user.department) {
      filters.department = req.user.department;
    }

    const summary = await FinanceModel.getSummary(targetOrgId, filters);
    res.json({
      success: true,
      summary
    });
  } catch (err) {
    console.error('[Finance Routes] GET /summary error:', err);
    res.status(500).json({ success: false, message: 'Failed to compute financial summary.' });
  }
});

/**
 * POST /api/finance/transactions
 * Record new Income or Expense transaction
 */
router.post('/transactions', authenticate, async (req, res) => {
  try {
    const {
      transactionType,
      amount,
      category,
      subcategory,
      transactionDate,
      department,
      description,
      paymentMethod,
      referenceNumber,
      notes,
      attachmentUrl
    } = req.body;

    if (!transactionType || !amount || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Transaction type, amount, category, and description are required.'
      });
    }

    const isOwner = req.user.role === 'PLATFORM_OWNER';
    const targetOrgId = isOwner && req.body.organizationId ? req.body.organizationId : req.user.organization_id;

    if (!targetOrgId) {
      return res.status(403).json({ success: false, message: 'Cannot record transaction without organization scope.' });
    }

    // Role check: Staff cannot record arbitrary financial transactions without explicit permission
    if (req.user.role === 'STAFF' && !req.user.permissions?.includes('finance.transaction.create')) {
      return res.status(403).json({ success: false, message: 'Unauthorized. Staff role cannot record financial transactions.' });
    }

    const transaction = await FinanceModel.create({
      organizationId: targetOrgId,
      organizationType: req.user.organizationType || 'COMPANY',
      transactionType: transactionType.toUpperCase(),
      amount: Number(amount),
      category: category.trim(),
      subcategory: subcategory ? subcategory.trim() : '',
      transactionDate: transactionDate || new Date().toISOString().split('T')[0],
      department: department || req.user.department || 'Operations',
      description: description.trim(),
      paymentMethod: paymentMethod || 'Bank Transfer',
      referenceNumber: referenceNumber ? referenceNumber.trim() : '',
      notes: notes ? notes.trim() : '',
      attachmentUrl: attachmentUrl || '',
      status: 'COMPLETED',
      createdBy: req.user.userId
    });

    // Write audit log
    await AuditModel.log({
      actorUserId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      organizationId: targetOrgId,
      action: 'FINANCE_TRANSACTION_CREATED',
      module: 'Finance',
      details: `Recorded ${transaction.transactionType} of ₹${transaction.amount.toLocaleString('en-IN')} [${transaction.transactionId}] under ${transaction.category}`,
      status: 'Success'
    });

    res.status(201).json({
      success: true,
      message: `${transaction.transactionType === 'INCOME' ? 'Income' : 'Expense'} of ₹${transaction.amount.toLocaleString('en-IN')} recorded successfully.`,
      transaction
    });
  } catch (err) {
    console.error('[Finance Routes] POST /transactions error:', err);
    res.status(500).json({ success: false, message: 'Failed to record transaction.' });
  }
});

/**
 * PUT /api/finance/transactions/:transactionId/status
 * Void or Reverse a financial transaction
 */
router.put('/transactions/:transactionId/status', authenticate, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const isOwner = req.user.role === 'PLATFORM_OWNER';
    const targetOrgId = isOwner ? null : req.user.organization_id;

    // RBAC: Only authorized roles can void/reverse transactions
    const isAuthorized = req.user.role === 'COMPANY_ADMIN' ||
      req.user.role === 'PLATFORM_OWNER' ||
      req.user.permissions?.includes('finance.transaction.void');

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Permission denied. Only Administrators can void or reverse financial transactions.' });
    }

    const updated = await FinanceModel.updateStatus(transactionId, status, req.user.userId, notes, targetOrgId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Transaction not found or access denied.' });
    }

    await AuditModel.log({
      actorUserId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      organizationId: req.user.organization_id || targetOrgId,
      action: `FINANCE_TRANSACTION_${status.toUpperCase()}`,
      module: 'Finance',
      details: `Transaction [${transactionId}] marked as ${status}. Reason: ${notes || 'Administrative adjustment'}`,
      status: 'Success'
    });

    res.json({
      success: true,
      message: `Transaction ${transactionId} updated to ${status}.`,
      transaction: updated
    });
  } catch (err) {
    console.error('[Finance Routes] PUT /status error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update transaction status.' });
  }
});

export default router;
