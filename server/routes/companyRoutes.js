import express from 'express';
import { OrganizationModel } from '../models/Organization.js';
import { AuditModel } from '../models/AuditLog.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get All Companies
router.get('/', authenticate, async (req, res) => {
  // Platform Owner sees all; Company Admins only see their own
  const orgs = await OrganizationModel.getAll();
  if (req.user.role === 'PLATFORM_OWNER') {
    return res.json({ success: true, companies: orgs });
  }
  const filtered = orgs.filter(o => o.id === req.user.organization_id || o.companyId === req.user.organization_id);
  return res.json({ success: true, companies: filtered });
});

// Update Company Details
router.put('/:id', authenticate, async (req, res) => {
  const targetId = req.params.id;

  // Strict Tenant Guard
  if (req.user.role !== 'PLATFORM_OWNER') {
    if (req.user.organization_id !== targetId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Cannot edit other company organizations.' });
    }
  }

  const updated = await OrganizationModel.updateCompany(targetId, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Company record not found.' });
  }

  await AuditModel.log({
    actorUserId: req.user.userId,
    userName: req.user.name,
    userRole: req.user.role,
    organizationId: updated.id,
    action: 'COMPANY_UPDATED',
    module: 'Company Management',
    details: `Company profile "${updated.name}" [${updated.companyId}] updated. Company ID preserved.`,
    status: 'Success'
  });

  return res.json({
    success: true,
    message: 'Company details permanently persisted.',
    company: updated
  });
});

export default router;
