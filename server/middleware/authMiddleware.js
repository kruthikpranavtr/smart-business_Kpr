import { UserModel } from '../models/User.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers['x-smartora-auth'];
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No session token provided.'
      });
    }

    // Token format: Bearer smartora_<userId>_<timestamp> or Bearer <userId> or <userId>
    let userId = null;
    let tokenStr = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
    if (tokenStr.startsWith('smartora_')) {
      const remainder = tokenStr.slice(9);
      const lastUnderscore = remainder.lastIndexOf('_');
      userId = lastUnderscore > 0 ? remainder.slice(0, lastUnderscore) : remainder;
    } else if (tokenStr.includes(':')) {
      userId = tokenStr.split(':')[0];
    } else {
      userId = tokenStr;
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid authentication credential format.' });
    }

    const user = await UserModel.findByUserId(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authenticated user account does not exist or was removed.' });
    }

    // Account Status Guard
    if (user.status && user.status.toLowerCase() !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Your account is currently ${user.status}. Please contact the SMARTORA platform administrator.`
      });
    }

    // Attach authenticated context strictly from database record
    req.user = UserModel.toSafeUser(user);
    req.rawUser = user;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    return res.status(500).json({ success: false, message: 'Internal server error validating session.' });
  }
}

// RBAC Role-Gate Guard
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role "${req.user.role}" does not have authorization for this resource.`
      });
    }
    next();
  };
}
