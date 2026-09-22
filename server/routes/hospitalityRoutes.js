import express from 'express';
import { HospitalityModel } from '../models/Hospitality.js';
import { AuditModel } from '../models/AuditLog.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/hospitality/rooms
 */
router.get('/rooms', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  const rooms = await HospitalityModel.getRooms(orgId);
  res.json({ success: true, rooms });
});

/**
 * PUT /api/hospitality/rooms/:roomId/status
 */
router.put('/rooms/:roomId/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const orgId = req.user.role === 'PLATFORM_OWNER' ? null : req.user.organization_id;
    const updated = await HospitalityModel.updateRoomStatus(req.params.roomId, status, orgId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Room not found or access denied.' });
    }

    await AuditModel.log({
      actorUserId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      organizationId: req.user.organization_id,
      action: 'ROOM_STATUS_CHANGED',
      module: 'Hospitality',
      details: `Updated Room ${req.params.roomId} status to "${status}"`,
      status: 'Success'
    });

    return res.json({ success: true, room: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update room status.' });
  }
});

/**
 * GET /api/hospitality/reservations
 */
router.get('/reservations', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  const reservations = await HospitalityModel.getReservations(orgId);
  res.json({ success: true, reservations });
});

/**
 * GET /api/hospitality/guests
 */
router.get('/guests', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  const guests = await HospitalityModel.getGuests(orgId);
  res.json({ success: true, guests });
});

/**
 * GET /api/hospitality/housekeeping
 */
router.get('/housekeeping', authenticate, async (req, res) => {
  const orgId = req.user.role === 'PLATFORM_OWNER' ? req.query.organizationId : req.user.organization_id;
  const housekeeping = await HospitalityModel.getHousekeeping(orgId);
  res.json({ success: true, housekeeping });
});

export default router;
