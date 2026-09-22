import mongoose from 'mongoose';
import { diskStore } from '../config/db.js';
import { matchesTenant } from '../utils/tenantUtils.js';

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, index: true },
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, default: 'STAFF' },
  designation: { type: String, default: 'Staff Associate' },
  department: { type: String, default: 'Operations' },
  departmentId: { type: String, default: null },
  organizationId: { type: String, required: true, index: true },
  organization_id: { type: String, default: null },
  orgId: { type: String, default: null },
  organizationType: { type: String, default: 'COMPANY' },
  attendance: { type: Number, default: 95 },
  tasks: { type: Number, default: 0 },
  performance: { type: String, default: 'Good' },
  status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
  salary: { type: String, default: '₹40,000/mo' },
  joined: { type: String, default: () => new Date().toISOString().split('T')[0] },
  avatar: { type: String, default: '' }
}, {
  timestamps: true
});

const MongooseEmployee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export const EmployeeModel = {
  getAll: async (orgId = null) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const query = orgId ? {
          $or: [
            { organizationId: orgId },
            { organization_id: orgId },
            { orgId: orgId },
            { companyId: orgId }
          ]
        } : {};
        const emps = await MongooseEmployee.find(query).lean();
        if (emps.length > 0) return emps;
      }
    } catch (e) {
      console.error('[Employee Model] MongoDB query error:', e.message);
    }

    const allEmps = diskStore.readCollection('employees', []);
    if (!orgId) return allEmps;
    return allEmps.filter(e => matchesTenant(e, orgId));
  },

  findByEmployeeId: async (employeeId, orgId = null) => {
    const norm = String(employeeId).trim().toLowerCase();
    try {
      if (mongoose.connection.readyState === 1) {
        const query = {
          $or: [
            { employeeId: { $regex: new RegExp(`^${norm}$`, 'i') } },
            { userId: { $regex: new RegExp(`^${norm}$`, 'i') } },
            { id: { $regex: new RegExp(`^${norm}$`, 'i') } }
          ]
        };
        const emp = await MongooseEmployee.findOne(query).lean();
        if (emp) {
          if (orgId && !matchesTenant(emp, orgId)) return null;
          return emp;
        }
      }
    } catch (e) {
      console.error('[Employee Model] findByEmployeeId error:', e.message);
    }

    const allEmps = diskStore.readCollection('employees', []);
    return allEmps.find(e => {
      const matchId = (e.employeeId && e.employeeId.toLowerCase() === norm) ||
                      (e.userId && e.userId.toLowerCase() === norm) ||
                      (e.id && e.id.toLowerCase() === norm);
      if (!matchId) return false;
      if (orgId && !matchesTenant(e, orgId)) return false;
      return true;
    }) || null;
  },

  create: async (data) => {
    const record = {
      ...data,
      employeeId: data.employeeId,
      id: data.employeeId,
      userId: data.employeeId,
      organizationId: data.organizationId,
      organization_id: data.organizationId,
      orgId: data.organizationId,
      status: data.status || 'Active',
      joined: data.joined || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allEmps = diskStore.readCollection('employees', []);
    allEmps.push(record);
    diskStore.writeCollection('employees', allEmps);

    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseEmployee.findOneAndUpdate(
          { employeeId: record.employeeId },
          record,
          { upsert: true, new: true }
        );
      }
    } catch (e) {
      console.error('[Employee Model] MongoDB create error:', e.message);
    }

    return record;
  },

  update: async (employeeId, updates, orgId = null) => {
    const allEmps = diskStore.readCollection('employees', []);
    const norm = String(employeeId).trim().toLowerCase();
    const idx = allEmps.findIndex(e => {
      const match = (e.employeeId && e.employeeId.toLowerCase() === norm) ||
                    (e.userId && e.userId.toLowerCase() === norm) ||
                    (e.id && e.id.toLowerCase() === norm);
      if (!match) return false;
      if (orgId && !matchesTenant(e, orgId)) return false;
      return true;
    });

    if (idx === -1) return null;

    // Security guard: immutable fields
    const sanitized = { ...updates };
    delete sanitized.employeeId;
    delete sanitized.userId;
    delete sanitized.id;
    delete sanitized.organizationId;
    delete sanitized.organization_id;
    delete sanitized.orgId;

    allEmps[idx] = { ...allEmps[idx], ...sanitized, updatedAt: new Date().toISOString() };
    diskStore.writeCollection('employees', allEmps);

    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseEmployee.findOneAndUpdate(
          { employeeId: allEmps[idx].employeeId },
          { $set: sanitized }
        );
      }
    } catch (e) {
      console.error('[Employee Model] MongoDB update error:', e.message);
    }

    return allEmps[idx];
  },

  delete: async (employeeId, orgId = null) => {
    const allEmps = diskStore.readCollection('employees', []);
    const norm = String(employeeId).trim().toLowerCase();
    const filtered = allEmps.filter(e => {
      const match = (e.employeeId && e.employeeId.toLowerCase() === norm) ||
                    (e.userId && e.userId.toLowerCase() === norm) ||
                    (e.id && e.id.toLowerCase() === norm);
      if (match) {
        if (orgId && !matchesTenant(e, orgId)) return true; // keep if belongs to another org
        return false; // remove
      }
      return true;
    });

    diskStore.writeCollection('employees', filtered);

    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseEmployee.findOneAndDelete({ employeeId: { $regex: new RegExp(`^${norm}$`, 'i') } });
      }
    } catch (e) {
      console.error('[Employee Model] MongoDB delete error:', e.message);
    }

    return true;
  }
};
