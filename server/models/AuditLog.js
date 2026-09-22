import mongoose from 'mongoose';
import { diskStore } from '../config/db.js';

const auditSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: String, required: true },
  actorUserId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  organizationId: { type: String, default: 'SMARTORA_PLATFORM' },
  targetUserId: { type: String, default: null },
  action: { type: String, required: true },
  module: { type: String, required: true },
  details: { type: String, required: true },
  status: { type: String, default: 'Success' },
  ipAddress: { type: String, default: '127.0.0.1' }
}, {
  timestamps: true
});

const MongooseAudit = mongoose.models.AuditLog || mongoose.model('AuditLog', auditSchema);

export const AuditModel = {
  log: async (eventData) => {
    const logItem = {
      id: `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      actorUserId: eventData.actorUserId || 'system',
      userName: eventData.userName || 'System Actor',
      userRole: eventData.userRole || 'USER',
      organizationId: eventData.organizationId || 'SMARTORA_PLATFORM',
      targetUserId: eventData.targetUserId || null,
      action: eventData.action,
      module: eventData.module || 'Identity & Access',
      details: eventData.details,
      status: eventData.status || 'Success',
      ipAddress: eventData.ipAddress || '127.0.0.1'
    };

    const logs = diskStore.readCollection('audit_logs', []);
    logs.unshift(logItem);
    diskStore.writeCollection('audit_logs', logs.slice(0, 500)); // Cap to 500 records

    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseAudit.create(logItem);
      }
    } catch (e) {
      console.error('[Audit Model] MongoDB error:', e.message);
    }

    return logItem;
  },

  getAll: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        const mongoLogs = await MongooseAudit.find().sort({ createdAt: -1 }).limit(100).lean();
        if (mongoLogs.length > 0) return mongoLogs;
      }
    } catch (e) {
      console.error('[Audit Model] MongoDB read error:', e.message);
    }
    return diskStore.readCollection('audit_logs', []);
  }
};
