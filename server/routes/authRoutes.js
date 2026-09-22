import express from 'express';
import { UserModel } from '../models/User.js';
import { AuditModel } from '../models/AuditLog.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { verifyPassword, hashPassword, generateSalt } from '../utils/crypto.js';

const router = express.Router();

/**
 * Universal Login Endpoint
 * Primary Identifier: User ID (e.g. kruthikpranavtr, ADM-CMP-0001, etc.)
 * Fallback: Email / Phone
 */
router.post('/login', async (req, res) => {
  try {
    const { userId, email, password } = req.body;
    const identifier = String(userId || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'User ID and password are required.'
      });
    }

    // 1. Find user in persistent database
    const user = await UserModel.findByUserId(identifier);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `No account found matching User ID "${identifier}".`
      });
    }

    // 2. Check Account Status
    if (user.status && user.status.toLowerCase() !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Your account is ${user.status}. Please contact the platform administrator.`
      });
    }

    // 3. Verify Password against stored hash & salt
    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Authentication failed.'
      });
    }

    // 4. Generate persistent session token
    const token = `smartora_${user.userId}_${Date.now()}`;

    // 5. Log audit event
    await AuditModel.log({
      actorUserId: user.userId,
      userName: user.name,
      userRole: user.role,
      organizationId: user.organization_id || 'SMARTORA_PLATFORM',
      action: 'LOGIN',
      module: 'Authentication & Session',
      details: `User "${user.name}" [${user.userId}] authenticated via User ID`,
      status: 'Success',
      ipAddress: req.ip || '127.0.0.1'
    });

    const safeUser = UserModel.toSafeUser(user);

    return res.json({
      success: true,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
});

/**
 * Get Authenticated User Profile (Session Restoration)
 */
router.get('/me', authenticate, async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

/**
 * Logout
 */
router.post('/logout', authenticate, async (req, res) => {
  await AuditModel.log({
    actorUserId: req.user.userId,
    userName: req.user.name,
    userRole: req.user.role,
    organizationId: req.user.organization_id || 'SMARTORA_PLATFORM',
    action: 'LOGOUT',
    module: 'Authentication & Session',
    details: `User "${req.user.name}" [${req.user.userId}] ended session`,
    status: 'Success',
    ipAddress: req.ip || '127.0.0.1'
  });

  return res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * Change Password
 */
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }
    if (newPassword.length < 5) {
      return res.status(400).json({ success: false, message: 'New password must be at least 5 characters long.' });
    }

    const isMatch = verifyPassword(currentPassword, req.rawUser.passwordHash, req.rawUser.salt);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password incorrect.' });
    }

    const newSalt = generateSalt();
    const newHash = hashPassword(newPassword, newSalt);

    await UserModel.updatePassword(req.user.userId, newHash, newSalt);

    await AuditModel.log({
      actorUserId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      organizationId: req.user.organization_id || 'SMARTORA_PLATFORM',
      action: 'PASSWORD_CHANGED',
      module: 'Security & Auth',
      details: `User "${req.user.name}" [${req.user.userId}] updated their password hash`,
      status: 'Success'
    });

    return res.json({ success: true, message: 'Password changed successfully and securely hashed.' });
  } catch (err) {
    console.error('[Change Password Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

export default router;
