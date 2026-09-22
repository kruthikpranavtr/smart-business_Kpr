import express from 'express';
import { EmployeeModel } from '../models/Employee.js';
import { UserModel } from '../models/User.js';
import { AuditModel } from '../models/AuditLog.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { generateEmployeeId } from '../utils/idGenerator.js';
import { hashPassword, generateSalt } from '../utils/crypto.js';
import { canCreateRole } from '../config/portalCategories.js';

const router = express.Router();

/**
 * GET /api/employees
 * Scoped strictly by authenticated user's organizationId
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const isOwner = req.user.role === 'PLATFORM_OWNER';
    const targetOrgId = isOwner && req.query.organizationId ? req.query.organizationId : req.user.organization_id;

    if (!isOwner && !targetOrgId) {
      return res.status(403).json({ success: false, message: 'No organization attached to session.' });
    }

    const employees = await EmployeeModel.getAll(targetOrgId);
    return res.json({ success: true, employees, count: employees.length });
  } catch (err) {
    console.error('[Employee Routes] GET / error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving employee roster.' });
  }
});

/**
 * POST /api/employees
 * Creates new employee with intelligent ID + dual record creation (Employee + User) in MongoDB
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, email, phone, department, role, designation, salary, attendance, performance } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const targetOrgId = req.user.role === 'PLATFORM_OWNER' && req.body.organizationId
      ? req.body.organizationId
      : req.user.organization_id;

    if (!targetOrgId) {
      return res.status(403).json({ success: false, message: 'Unauthorized. Missing tenant organization.' });
    }

    const targetRole = role || 'STAFF';

    // RBAC: Verify account creation hierarchy
    const isAllowed = canCreateRole(req.user.role, targetRole, req.user.organizationType);
    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role "${req.user.role}" cannot provision a "${targetRole}" account.`
      });
    }

    // Fetch existing employees in this organization to guarantee unique intelligent sequence
    const existingEmployees = await EmployeeModel.getAll(targetOrgId);

    // Generate intelligent ID (e.g. ARUN-SALES-001 or PRIYA-HR-001)
    const employeeId = req.body.employeeId && req.body.employeeId.includes('-')
      ? req.body.employeeId.trim().toUpperCase()
      : generateEmployeeId(name, department, existingEmployees, req.user.organizationType);

    // Check collision in this organization
    const existing = await EmployeeModel.findByEmployeeId(employeeId, targetOrgId);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Employee ID "${employeeId}" already exists in this organization.`
      });
    }

    // Temporary password & salted SHA-256 hash
    const tempPassword = req.body.tempPassword || `Smart#${Math.floor(1000 + Math.random() * 9000)}`;
    const salt = generateSalt();
    const passwordHash = hashPassword(tempPassword, salt);

    // 1. Create Employee Record
    const newEmployee = await EmployeeModel.create({
      employeeId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '+91 98000 00000',
      department: department || 'Operations',
      role: targetRole,
      designation: designation || 'Staff Associate',
      organizationId: targetOrgId,
      organizationType: req.user.organizationType || 'COMPANY',
      attendance: Number(attendance) || 95,
      performance: performance || 'Good',
      salary: salary || '₹40,000/mo'
    });

    // 2. Create User Authentication Record with EXACT SAME USER ID
    const newUser = await UserModel.saveUser({
      userId: employeeId,
      id: employeeId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '+91 98000 00000',
      role: targetRole,
      organization_id: targetOrgId,
      companyId: targetOrgId,
      organizationType: req.user.organizationType || 'COMPANY',
      department: department || 'Operations',
      designation: designation || 'Staff Associate',
      status: 'Active',
      passwordHash,
      salt,
      mustChangePassword: true,
      permissions: targetRole === 'DEPARTMENT_MANAGER'
        ? ['sales.view', 'sales.create', 'tasks.manage', 'staff.manage']
        : ['tasks.view', 'attendance.view']
    });

    // 3. Log Audit Trail
    await AuditModel.log({
      actorUserId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      organizationId: targetOrgId,
      action: 'EMPLOYEE_PROVISIONED',
      module: 'Workforce',
      details: `Created ${targetRole} "${name}" with permanent ID [${employeeId}] in ${department}`,
      status: 'Success'
    });

    return res.status(201).json({
      success: true,
      message: `Employee "${name}" provisioned successfully with User ID "${employeeId}".`,
      employee: newEmployee,
      user: newUser,
      employeeId,
      tempPassword
    });
  } catch (err) {
    console.error('[Employee Routes] POST / error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create employee.' });
  }
});

/**
 * PUT /api/employees/:employeeId
 */
router.put('/:employeeId', authenticate, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const targetOrgId = req.user.role === 'PLATFORM_OWNER' ? null : req.user.organization_id;

    const updated = await EmployeeModel.update(employeeId, req.body, targetOrgId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Employee not found or access denied.' });
    }

    // Also sync user profile updates
    await UserModel.updateProfile(employeeId, {
      name: req.body.name,
      phone: req.body.phone,
      department: req.body.department,
      designation: req.body.designation,
      status: req.body.status
    });

    return res.json({ success: true, employee: updated });
  } catch (err) {
    console.error('[Employee Routes] PUT error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update employee.' });
  }
});

/**
 * PUT /api/employees/:employeeId/status
 * Activate, Deactivate, or Suspend an employee/user account
 */
router.put('/:employeeId/status', authenticate, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.body;
    const cleanId = String(employeeId).trim().toLowerCase();

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    if (cleanId === 'kruthikpranavtr') {
      return res.status(403).json({ success: false, message: 'Platform Owner status cannot be modified.' });
    }

    const isOwner = req.user.role === 'PLATFORM_OWNER';
    const targetOrgId = isOwner ? null : req.user.organization_id;

    // Verify target exists
    const targetEmployee = await EmployeeModel.findByEmployeeId(cleanId, targetOrgId);
    const targetUser = await UserModel.findByUserId(cleanId);

    if (!targetEmployee && !targetUser) {
      return res.status(404).json({ success: false, message: 'Account not found or access denied.' });
    }

    // Organization boundary check
    const targetOrg = targetEmployee?.organizationId || targetUser?.organization_id || targetUser?.companyId;
    if (!isOwner && targetOrg !== req.user.organization_id) {
      return res.status(403).json({ success: false, message: 'Permission denied. Target account belongs to another organization.' });
    }

    // Role hierarchy check
    const targetRole = targetUser?.role || targetEmployee?.role || 'STAFF';
    if (req.user.role === 'STAFF') {
      return res.status(403).json({ success: false, message: 'Permission denied. Staff members cannot modify account status.' });
    }
    if ((req.user.role === 'HOD' || req.user.role === 'DEPARTMENT_MANAGER') && (targetRole === 'COMPANY_ADMIN' || targetRole === 'PLATFORM_OWNER')) {
      return res.status(403).json({ success: false, message: 'Permission denied. Cannot modify administrator status.' });
    }

    // Update Employee record
    const updatedEmp = await EmployeeModel.update(cleanId, { status }, targetOrgId);
    // Update User auth record
    const updatedUser = await UserModel.updateStatus(cleanId, status, targetOrgId);

    await AuditModel.log({
      actorUserId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      organizationId: req.user.organization_id || targetOrg,
      action: status === 'Active' ? 'ACCOUNT_REACTIVATED' : 'ACCOUNT_DEACTIVATED',
      module: 'Workforce',
      details: `Account [${cleanId}] (${targetUser?.name || targetEmployee?.name}) set to "${status}". Login access is ${status === 'Active' ? 'restored' : 'revoked'}.`,
      status: 'Success'
    });

    return res.json({
      success: true,
      message: `Account [${cleanId}] status changed to ${status}. Login access is ${status === 'Active' ? 'active' : 'revoked'}.`,
      status,
      employee: updatedEmp,
      user: updatedUser
    });
  } catch (err) {
    console.error('[Employee Routes] PUT /status error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to update account status.' });
  }
});

/**
 * DELETE /api/employees/:employeeId
 * Safe deletion / deactivation of employee and user account
 */
router.delete('/:employeeId', authenticate, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const cleanId = String(employeeId).trim().toLowerCase();
    const isOwner = req.user.role === 'PLATFORM_OWNER';

    // 1. Permanent Platform Owner Protection
    if (cleanId === 'kruthikpranavtr') {
      return res.status(403).json({
        success: false,
        message: 'Security Boundary Enforced: The permanent Platform Owner account cannot be deleted.'
      });
    }

    // 2. Find target in database
    const targetEmployee = await EmployeeModel.findByEmployeeId(cleanId);
    const targetUser = await UserModel.findByUserId(cleanId);

    if (!targetEmployee && !targetUser) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    // 3. Organization Isolation Guard (Company A cannot delete Company B employee)
    const targetOrg = targetEmployee?.organizationId || targetUser?.organization_id || targetUser?.companyId;
    if (!isOwner && targetOrg !== req.user.organization_id) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied. Target account belongs to another organization.'
      });
    }

    // 4. Role Hierarchy Guard
    const targetRole = targetUser?.role || targetEmployee?.role || 'STAFF';
    if (targetRole === 'PLATFORM_OWNER') {
      return res.status(403).json({ success: false, message: 'Cannot delete Platform Owner.' });
    }

    if (req.user.role === 'STAFF') {
      return res.status(403).json({ success: false, message: 'Permission denied. Staff cannot delete accounts.' });
    }

    if (req.user.role === 'HOD' || req.user.role === 'DEPARTMENT_MANAGER') {
      if (targetRole === 'COMPANY_ADMIN' || targetRole === 'HOD' || targetRole === 'PLATFORM_OWNER') {
        return res.status(403).json({
          success: false,
          message: 'Permission denied. Managers cannot delete company administrators or department heads.'
        });
      }
    }

    // 5. Prevent deleting self through this endpoint
    if (cleanId === String(req.user.userId).toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own active administrator account.'
      });
    }

    const isPermanent = req.query.permanent === 'true';
    const targetName = targetUser?.name || targetEmployee?.name || cleanId;

    if (isPermanent) {
      // Hard delete
      await EmployeeModel.delete(cleanId, targetOrg);
      await UserModel.deleteUser(cleanId, targetOrg);

      await AuditModel.log({
        actorUserId: req.user.userId,
        userName: req.user.name,
        userRole: req.user.role,
        organizationId: req.user.organization_id || targetOrg,
        action: 'ACCOUNT_DELETED',
        module: 'Workforce',
        details: `Permanently removed employee account [${cleanId}] (${targetName})`,
        status: 'Success'
      });

      return res.json({
        success: true,
        message: `Account [${cleanId}] (${targetName}) permanently deleted and access revoked.`,
        deletedId: cleanId,
        action: 'DELETED'
      });
    } else {
      // Safe lifecycle: Deactivate account to preserve historical business records
      await EmployeeModel.update(cleanId, { status: 'Deactivated' }, targetOrg);
      await UserModel.updateStatus(cleanId, 'Deactivated', targetOrg);

      await AuditModel.log({
        actorUserId: req.user.userId,
        userName: req.user.name,
        userRole: req.user.role,
        organizationId: req.user.organization_id || targetOrg,
        action: 'ACCOUNT_DEACTIVATED',
        module: 'Workforce',
        details: `Deactivated account [${cleanId}] (${targetName}) to preserve historical records. Login access revoked.`,
        status: 'Success'
      });

      return res.json({
        success: true,
        message: `Account [${cleanId}] (${targetName}) has been deactivated and login access revoked. Historical records remain preserved.`,
        deactivatedId: cleanId,
        action: 'DEACTIVATED'
      });
    }
  } catch (err) {
    console.error('[Employee Routes] DELETE error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to delete account.' });
  }
});

export default router;

