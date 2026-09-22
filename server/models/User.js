import mongoose from 'mongoose';
import { diskStore } from '../config/db.js';
import { matchesTenant } from '../utils/tenantUtils.js';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  role: {
    type: String,
    enum: ['PLATFORM_OWNER', 'COMPANY_ADMIN', 'DEPARTMENT_MANAGER', 'STAFF', 'END_USER'],
    required: true
  },
  organizationType: { type: String, default: 'SMARTORA_PLATFORM' },
  organization_id: { type: String, default: null },
  department_id: { type: String, default: null },
  department: { type: String, default: '' },
  designation: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive', 'Suspended', 'Pending'], default: 'Active' },
  profilePhoto: {
    storageKey: { type: String, default: null },
    fileName: { type: String, default: null },
    mimeType: { type: String, default: null },
    url: { type: String, default: null },
    updatedAt: { type: Date, default: null }
  },
  avatar: { type: String, default: '' },
  passwordHash: { type: String, required: true, select: false },
  salt: { type: String, required: true, select: false },
  permissions: [{ type: String }],
  mustChangePassword: { type: Boolean, default: false }
}, {
  timestamps: true
});

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

// Initial Seed for Permanent Platform Owner and Legitimate Company Admins
const INITIAL_USERS = [
  {
    userId: 'kruthikpranavtr',
    id: 'kruthikpranavtr',
    name: 'Kruthik Pranav',
    email: 'kruthikpranavtr@smartora.com',
    phone: '+91 99000 00001',
    address: 'SMARTORA Global SaaS HQ, Outer Ring Road, Bengaluru',
    role: 'PLATFORM_OWNER',
    organizationType: 'SMARTORA_PLATFORM',
    organization_id: null,
    department_id: null,
    department: 'SMARTORA Global HQ',
    designation: 'SMARTORA Platform Owner & Chief Architect',
    status: 'Active',
    profilePhoto: {
      storageKey: 'default_owner_avatar',
      fileName: 'owner_portrait.jpg',
      mimeType: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      updatedAt: new Date().toISOString()
    },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    salt: 'smartora_demo_salt_2026',
    passwordHash: '8b7f730c4e1cfa282dcf7a58a6234f9a4fa4aaec091390f772e0e85ff7eeef94',
    permissions: ['*'],
    mustChangePassword: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'ADM-CMP-0001',
    id: 'ADM-CMP-0001',
    adminId: 'ADM-CMP-0001',
    name: 'Krithika Sharma',
    email: 'admin@techsolutions.demo',
    phone: '+91 98450 98765',
    address: '102 Tech Park Boulevard, Whitefield, Bengaluru',
    role: 'COMPANY_ADMIN',
    organizationType: 'Company / Startup',
    organization_id: 'SMR-CMP-0001',
    companyId: 'SMR-CMP-0001',
    department_id: null,
    department: 'Executive Leadership',
    designation: 'Managing Director & CEO',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    salt: 'smartora_demo_salt_2026',
    passwordHash: '8b7f730c4e1cfa282dcf7a58a6234f9a4fa4aaec091390f772e0e85ff7eeef94',
    permissions: ['company.manage', 'departments.manage', 'staff.manage', 'finance.manage', 'audit.view'],
    mustChangePassword: false,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'ADM-CMP-0002',
    id: 'ADM-CMP-0002',
    adminId: 'ADM-CMP-0002',
    name: 'Chef Sanjeev Kapoor',
    email: 'admin@greenleaf.demo',
    phone: '+91 98200 11223',
    address: '14 Linking Road, Bandra West, Mumbai',
    role: 'COMPANY_ADMIN',
    organizationType: 'Restaurant / Cafe',
    organization_id: 'SMR-CMP-0002',
    companyId: 'SMR-CMP-0002',
    department_id: null,
    department: 'Hospitality Management',
    designation: 'Managing Partner & Executive Chef',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    salt: 'smartora_demo_salt_2026',
    passwordHash: '8b7f730c4e1cfa282dcf7a58a6234f9a4fa4aaec091390f772e0e85ff7eeef94',
    permissions: ['company.manage', 'departments.manage', 'staff.manage', 'finance.manage'],
    mustChangePassword: false,
    createdAt: '2026-04-10T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'ADM-CMP-0003',
    id: 'ADM-CMP-0003',
    adminId: 'ADM-CMP-0003',
    name: 'Dr. Meenakshi Sundaram',
    email: 'principal@brightfuture.demo',
    phone: '+91 94432 10987',
    address: 'Campus Block A, HSR Layout, Bengaluru',
    role: 'COMPANY_ADMIN',
    organizationType: 'College / Educational Institution',
    organization_id: 'SMR-CMP-0003',
    companyId: 'SMR-CMP-0003',
    department_id: null,
    department: 'Academic Directorate',
    designation: 'Campus Dean & Principal',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    salt: 'smartora_demo_salt_2026',
    passwordHash: '8b7f730c4e1cfa282dcf7a58a6234f9a4fa4aaec091390f772e0e85ff7eeef94',
    permissions: ['company.manage', 'departments.manage', 'staff.manage', 'academics.manage'],
    mustChangePassword: false,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'MGR-TECH-01',
    id: 'MGR-TECH-01',
    name: 'Rahul Verma',
    email: 'sales.manager@techsolutions.demo',
    phone: '+91 98450 12345',
    address: '44 Residency Road, Bengaluru',
    role: 'DEPARTMENT_MANAGER',
    organizationType: 'Company / Startup',
    organization_id: 'SMR-CMP-0001',
    companyId: 'SMR-CMP-0001',
    department_id: 'DEP-TECH-01',
    department: 'Enterprise Sales & Accounts',
    designation: 'Head of Enterprise Sales & Accounts',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    salt: 'smartora_demo_salt_2026',
    passwordHash: '8b7f730c4e1cfa282dcf7a58a6234f9a4fa4aaec091390f772e0e85ff7eeef94',
    permissions: ['sales.view', 'sales.create', 'sales.edit', 'tasks.manage', 'staff.manage', 'customers.view', 'invoices.view'],
    mustChangePassword: false,
    createdAt: '2026-05-10T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'STF-001',
    id: 'STF-001',
    name: 'Rohan Mehta',
    email: 'staff@techsolutions.demo',
    phone: '+91 98450 54321',
    address: '12 Indiranagar 100ft Road, Bengaluru',
    role: 'STAFF',
    organizationType: 'Company / Startup',
    organization_id: 'SMR-CMP-0001',
    companyId: 'SMR-CMP-0001',
    department_id: 'DEP-TECH-01',
    department: 'Enterprise Sales & Accounts',
    designation: 'Senior Enterprise Sales Associate',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    salt: 'smartora_demo_salt_2026',
    passwordHash: '8b7f730c4e1cfa282dcf7a58a6234f9a4fa4aaec091390f772e0e85ff7eeef94',
    permissions: ['sales.view', 'sales.create', 'tasks.view', 'customers.view'],
    mustChangePassword: false,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'usr-client-001',
    id: 'usr-client-001',
    name: 'Vikramaditya Hegde',
    email: 'customer@techsolutions.demo',
    phone: '+91 97312 33456',
    address: 'Embassy Golf Links Business Park, Bengaluru',
    role: 'END_USER',
    organizationType: 'Company / Startup',
    organization_id: 'SMR-CMP-0001',
    companyId: 'SMR-CMP-0001',
    department_id: null,
    department: 'Client Portfolio',
    designation: 'Chief Technology Officer @ NexaCorp',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    salt: 'smartora_demo_salt_2026',
    passwordHash: '8b7f730c4e1cfa282dcf7a58a6234f9a4fa4aaec091390f772e0e85ff7eeef94',
    permissions: ['portal.view', 'invoices.view', 'appointments.book', 'support.create'],
    mustChangePassword: false,
    createdAt: '2026-02-22T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

export const UserModel = {
  // Strips passwords, hashes, and secrets from user objects
  toSafeUser: (user) => {
    if (!user) return null;
    const safe = { ...user };
    delete safe.passwordHash;
    delete safe.salt;
    delete safe.__v;
    delete safe._id;
    return safe;
  },

  getAll: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        const users = await MongooseUser.find().lean();
        if (users.length > 0) return users;
      }
    } catch (e) {
      console.error('[User Model] MongoDB query error:', e.message);
    }
    return diskStore.readCollection('users', INITIAL_USERS);
  },

  findByUserId: async (userId) => {
    if (!userId) return null;
    const normalizedId = String(userId).trim().toLowerCase();

    // 1. Check MongoDB if connected
    try {
      if (mongoose.connection.readyState === 1) {
        const user = await MongooseUser.findOne({
          $or: [
            { userId: { $regex: new RegExp(`^${normalizedId}$`, 'i') } },
            { id: { $regex: new RegExp(`^${normalizedId}$`, 'i') } },
            { email: { $regex: new RegExp(`^${normalizedId}$`, 'i') } }
          ]
        }).select('+passwordHash +salt').lean();
        if (user) return user;
      }
    } catch (e) {
      console.error('[User Model] MongoDB findByUserId error:', e.message);
    }

    // 2. Query persistent host storage
    const users = diskStore.readCollection('users', INITIAL_USERS);
    return users.find(u =>
      (u.userId && u.userId.toLowerCase() === normalizedId) ||
      (u.id && u.id.toLowerCase() === normalizedId) ||
      (u.adminId && u.adminId.toLowerCase() === normalizedId) ||
      (u.staffId && u.staffId.toLowerCase() === normalizedId) ||
      (u.email && u.email.toLowerCase() === normalizedId) ||
      // Aliases:
      (normalizedId === 'adm-cmp-0001' && (u.userId === 'usr-admin-001' || u.adminId === 'ADM-CMP-0001' || u.organization_id === 'SMR-CMP-0001' || u.organization_id === 'org-001')) ||
      (normalizedId === 'adm-cmp-0002' && (u.userId === 'usr-admin-002' || u.adminId === 'ADM-CMP-0002' || u.organization_id === 'SMR-CMP-0002' || u.organization_id === 'org-002')) ||
      (normalizedId === 'mgr-tech-01' && (u.userId === 'usr-deptmgr-001' || u.department_id === 'DEP-TECH-01')) ||
      (normalizedId === 'mgr-001' && (u.userId === 'MGR-TECH-01' || u.userId === 'usr-deptmgr-001')) ||
      (normalizedId === 'stf-001' && (u.userId === 'usr-staff-001' || u.role === 'STAFF')) ||
      (normalizedId === 'usr-001' && (u.userId === 'usr-client-001' || u.role === 'END_USER'))
    ) || null;
  },

  updateProfile: async (userId, allowedUpdates) => {
    const normalizedId = String(userId).trim().toLowerCase();
    const users = diskStore.readCollection('users', INITIAL_USERS);
    const index = users.findIndex(u =>
      (u.userId && u.userId.toLowerCase() === normalizedId) ||
      (u.id && u.id.toLowerCase() === normalizedId)
    );

    if (index === -1) return null;

    const current = users[index];
    // Strict Guard: Never allow altering permanent security identifiers
    const sanitized = { ...allowedUpdates };
    delete sanitized.userId;
    delete sanitized.id;
    delete sanitized.role;
    delete sanitized.organizationType;
    delete sanitized.organization_id;
    delete sanitized.department_id;
    delete sanitized.permissions;
    delete sanitized.passwordHash;
    delete sanitized.salt;

    const updatedUser = {
      ...current,
      ...sanitized,
      updatedAt: new Date().toISOString()
    };

    users[index] = updatedUser;
    diskStore.writeCollection('users', users);

    // Sync with MongoDB if connected
    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseUser.findOneAndUpdate(
          { userId: current.userId },
          { $set: sanitized },
          { new: true, upsert: true }
        );
      }
    } catch (e) {
      console.error('[User Model] MongoDB updateProfile error:', e.message);
    }

    return UserModel.toSafeUser(updatedUser);
  },

  updatePassword: async (userId, newHash, newSalt) => {
    const normalizedId = String(userId).trim().toLowerCase();
    const users = diskStore.readCollection('users', INITIAL_USERS);
    const index = users.findIndex(u =>
      (u.userId && u.userId.toLowerCase() === normalizedId) ||
      (u.id && u.id.toLowerCase() === normalizedId)
    );

    if (index === -1) return false;

    users[index].passwordHash = newHash;
    users[index].salt = newSalt;
    users[index].mustChangePassword = false;
    users[index].updatedAt = new Date().toISOString();

    diskStore.writeCollection('users', users);

    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseUser.findOneAndUpdate(
          { userId: users[index].userId },
          { $set: { passwordHash: newHash, salt: newSalt, mustChangePassword: false } }
        );
      }
    } catch (e) {
      console.error('[User Model] MongoDB updatePassword error:', e.message);
    }

    return true;
  },

  saveUser: async (userData) => {
    const users = diskStore.readCollection('users', INITIAL_USERS);
    const existingIndex = users.findIndex(u => u.userId === userData.userId);
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userData, updatedAt: new Date().toISOString() };
    } else {
      users.push({ ...userData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    diskStore.writeCollection('users', users);

    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseUser.findOneAndUpdate({ userId: userData.userId }, userData, { upsert: true, new: true });
      }
    } catch (e) {
      console.error('[User Model] MongoDB saveUser error:', e.message);
    }

    return UserModel.toSafeUser(userData);
  },

  deleteUser: async (userId, orgId = null) => {
    const normalizedId = String(userId).trim().toLowerCase();
    if (normalizedId === 'kruthikpranavtr') {
      throw new Error('Permanent Platform Owner cannot be deleted.');
    }

    const users = diskStore.readCollection('users', INITIAL_USERS);
    const filtered = users.filter(u => {
      const match = (u.userId && u.userId.toLowerCase() === normalizedId) ||
                    (u.id && u.id.toLowerCase() === normalizedId);
      if (match) {
        if (orgId && !matchesTenant(u, orgId)) return true;
        return false;
      }
      return true;
    });

    diskStore.writeCollection('users', filtered);

    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseUser.findOneAndDelete({ userId: { $regex: new RegExp(`^${normalizedId}$`, 'i') } });
      }
    } catch (e) {
      console.error('[User Model] MongoDB deleteUser error:', e.message);
    }

    return true;
  },

  updateStatus: async (userId, status, orgId = null) => {
    const normalizedId = String(userId).trim().toLowerCase();
    if (normalizedId === 'kruthikpranavtr') {
      throw new Error('Platform Owner status cannot be modified.');
    }

    const users = diskStore.readCollection('users', INITIAL_USERS);
    const index = users.findIndex(u => {
      const match = (u.userId && u.userId.toLowerCase() === normalizedId) ||
                    (u.id && u.id.toLowerCase() === normalizedId);
      if (!match) return false;
      if (orgId && !matchesTenant(u, orgId)) return false;
      return true;
    });

    if (index === -1) return null;

    users[index].status = status;
    users[index].updatedAt = new Date().toISOString();
    diskStore.writeCollection('users', users);

    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseUser.findOneAndUpdate(
          { userId: users[index].userId },
          { $set: { status } }
        );
      }
    } catch (e) {
      console.error('[User Model] MongoDB updateStatus error:', e.message);
    }

    return UserModel.toSafeUser(users[index]);
  }
};
