import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { UserModel } from '../models/User.js';
import { AuditModel } from '../models/AuditLog.js';
import { authenticate } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads', 'profiles');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanUserId = (req.user?.userId || 'user').replace(/[^a-zA-Z0-9_-]/g, '');
    const uniqueKey = `photo-${cleanUserId}-${Date.now()}${ext}`;
    cb(null, uniqueKey);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, JPEG, WebP, GIF) are allowed.'));
    }
  }
});

const router = express.Router();

/**
 * Get Current User Profile
 */
router.get('/', authenticate, async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

/**
 * Update Profile Details
 * Secure: Identifies user strictly from session; immutability enforced on security fields
 */
router.put('/', authenticate, async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'phone', 'address', 'avatar'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.name && !updates.name.trim()) {
      return res.status(400).json({ success: false, message: 'Name cannot be blank.' });
    }

    const updatedUser = await UserModel.updateProfile(req.user.userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    await AuditModel.log({
      actorUserId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      organizationId: req.user.organization_id || 'SMARTORA_PLATFORM',
      action: 'PROFILE_UPDATED',
      module: 'Identity & Access',
      details: `User "${updatedUser.name}" [${updatedUser.userId}] updated profile credentials`,
      status: 'Success'
    });

    return res.json({
      success: true,
      message: 'Profile updated and permanently saved to database.',
      user: updatedUser
    });
  } catch (err) {
    console.error('[Profile Update Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

/**
 * Upload & Persist Profile Photo
 * Stores permanently to disk/GridFS, updates MongoDB metadata, and returns clean URL
 */
router.post('/photo', authenticate, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      // Also accept base64 string in req.body.photoData if sent via JSON
      if (req.body.photoData && req.body.photoData.startsWith('data:image/')) {
        const matches = req.body.photoData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const ext = mimeType.split('/')[1] || 'jpg';
          const buffer = Buffer.from(matches[2], 'base64');
          const cleanUserId = (req.user?.userId || 'user').replace(/[^a-zA-Z0-9_-]/g, '');
          const storageKey = `photo-${cleanUserId}-${Date.now()}.${ext}`;
          const filePath = path.join(UPLOADS_DIR, storageKey);
          fs.writeFileSync(filePath, buffer);

          const photoMetadata = {
            storageKey,
            fileName: req.body.fileName || 'profile.jpg',
            mimeType,
            url: `/uploads/profiles/${storageKey}`,
            updatedAt: new Date().toISOString()
          };

          const updatedUser = await UserModel.updateProfile(req.user.userId, {
            profilePhoto: photoMetadata,
            avatar: photoMetadata.url
          });

          await AuditModel.log({
            actorUserId: req.user.userId,
            userName: req.user.name,
            userRole: req.user.role,
            organizationId: req.user.organization_id || 'SMARTORA_PLATFORM',
            action: 'PROFILE_PHOTO_UPDATED',
            module: 'Identity & Access',
            details: `User "${req.user.name}" [${req.user.userId}] uploaded new profile portrait (${storageKey})`,
            status: 'Success'
          });

          return res.json({
            success: true,
            message: 'Profile photo uploaded and permanently persisted to MongoDB.',
            user: updatedUser,
            photo: photoMetadata,
            profilePhoto: photoMetadata
          });
        }
      }
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const { filename, originalname, mimetype } = req.file;
    const photoUrl = `/uploads/profiles/${filename}`;

    const photoMetadata = {
      storageKey: filename,
      fileName: originalname,
      mimeType: mimetype,
      url: photoUrl,
      updatedAt: new Date().toISOString()
    };

    // Safely remove previous local file if it was a custom upload
    if (req.rawUser?.profilePhoto?.storageKey && req.rawUser.profilePhoto.storageKey !== filename) {
      const oldPath = path.join(UPLOADS_DIR, req.rawUser.profilePhoto.storageKey);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { /* ignore cleanup error */ }
      }
    }

    const updatedUser = await UserModel.updateProfile(req.user.userId, {
      profilePhoto: photoMetadata,
      avatar: photoUrl
    });

    await AuditModel.log({
      actorUserId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      organizationId: req.user.organization_id || 'SMARTORA_PLATFORM',
      action: 'PROFILE_PHOTO_UPDATED',
      module: 'Identity & Access',
      details: `User "${req.user.name}" [${req.user.userId}] uploaded new profile portrait (${filename})`,
      status: 'Success'
    });

    return res.json({
      success: true,
      message: 'Profile photo uploaded and permanently persisted to MongoDB.',
      user: updatedUser,
      photo: photoMetadata,
      profilePhoto: photoMetadata
    });
  } catch (err) {
    console.error('[Photo Upload Error]:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to save profile photo.' });
  }
});

export default router;
