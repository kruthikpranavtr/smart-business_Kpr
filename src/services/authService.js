// Authentication Service for SMARTORA
// Handles session management, demo logins, registration, password hashing, and role checks
// Integrates with Express + MongoDB backend (apiService) with seamless offline resilience

import { storageService } from './storageService';
import { ROLES, INITIAL_USERS, INITIAL_ORGANIZATIONS } from '../data/mockData';
import {
  hashPasswordSync,
  verifyPassword,
  generateSalt,
  generateTempPassword
} from './cryptoService';
import { apiService } from './apiService';

const DEMO_SALT = 'smartora_demo_salt_2026';
const DEMO_HASH = hashPasswordSync('admin', DEMO_SALT);

export const DEMO_USERS = {
  owner: {
    id: 'kruthikpranavtr',
    userId: 'kruthikpranavtr',
    organization_id: null,
    department_id: null,
    organizationType: 'SMARTORA_PLATFORM',
    name: 'Kruthik Pranav',
    email: 'kruthikpranavtr@smartora.com',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: ROLES.PLATFORM_OWNER,
    designation: 'SMARTORA Platform Owner & Chief Architect',
    department: 'SMARTORA Global HQ',
    organization: 'SMARTORA Platform',
    phone: '+91 99000 00001',
    address: 'SMARTORA Tower, Outer Ring Road, Bengaluru',
    joinedDate: '2022-01-01',
    status: 'Active',
    permissions: ['*'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  admin_tech: {
    id: 'ADM-CMP-0001',
    userId: 'ADM-CMP-0001',
    organization_id: 'SMR-CMP-0001',
    companyId: 'SMR-CMP-0001',
    department_id: null,
    name: 'Krithika Sharma',
    email: 'admin@techsolutions.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: ROLES.COMPANY_ADMIN,
    designation: 'Managing Director & CEO',
    department: 'Executive Leadership',
    organization: 'SMARTORA Tech Solutions',
    phone: '+91 98450 98765',
    address: '102 Tech Park Boulevard, Whitefield, Bengaluru',
    joinedDate: '2023-01-15',
    status: 'Active',
    permissions: ['company.manage', 'departments.manage', 'staff.manage', 'finance.manage', 'audit.view'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  admin_greenleaf: {
    id: 'ADM-CMP-0002',
    userId: 'ADM-CMP-0002',
    organization_id: 'SMR-CMP-0002',
    companyId: 'SMR-CMP-0002',
    department_id: null,
    name: 'Chef Sanjeev Kapoor',
    email: 'admin@greenleaf.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: ROLES.COMPANY_ADMIN,
    designation: 'Managing Partner & Executive Chef',
    department: 'Hospitality Management',
    organization: 'GreenLeaf Restaurant & Cafe',
    phone: '+91 98200 11223',
    address: '14 Linking Road, Bandra West, Mumbai',
    joinedDate: '2023-04-10',
    status: 'Active',
    permissions: ['company.manage', 'departments.manage', 'staff.manage', 'finance.manage'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  dept_manager: {
    id: 'MGR-TECH-01',
    userId: 'MGR-TECH-01',
    organization_id: 'SMR-CMP-0001',
    companyId: 'SMR-CMP-0001',
    department_id: 'DEP-TECH-01',
    name: 'Rahul Verma',
    email: 'sales.manager@techsolutions.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: ROLES.DEPARTMENT_MANAGER,
    designation: 'Head of Enterprise Sales & Accounts',
    department: 'Enterprise Sales & Accounts',
    organization: 'SMARTORA Tech Solutions',
    phone: '+91 98450 12345',
    address: '44 Residency Road, Bengaluru',
    joinedDate: '2023-05-10',
    status: 'Active',
    permissions: ['sales.view', 'sales.create', 'sales.edit', 'tasks.manage', 'staff.manage', 'customers.view', 'invoices.view'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  staff: {
    id: 'STF-001',
    userId: 'STF-001',
    organization_id: 'SMR-CMP-0001',
    companyId: 'SMR-CMP-0001',
    department_id: 'DEP-TECH-01',
    name: 'Rohan Mehta',
    email: 'staff@techsolutions.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: ROLES.STAFF,
    designation: 'Senior Enterprise Sales Associate',
    department: 'Enterprise Sales & Accounts',
    organization: 'SMARTORA Tech Solutions',
    phone: '+91 98450 54321',
    address: '12 Indiranagar 100ft Road, Bengaluru',
    joinedDate: '2024-02-01',
    status: 'Active',
    permissions: ['sales.view', 'sales.create', 'tasks.view', 'customers.view'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  },
  end_user: {
    id: 'usr-client-001',
    userId: 'usr-client-001',
    organization_id: 'SMR-CMP-0001',
    companyId: 'SMR-CMP-0001',
    department_id: null,
    name: 'Vikramaditya Hegde',
    email: 'customer@techsolutions.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: ROLES.END_USER,
    designation: 'Chief Technology Officer @ NexaCorp',
    department: 'Client Portfolio',
    organization: 'SMARTORA Tech Solutions',
    phone: '+91 97312 33456',
    address: 'Embassy Golf Links Business Park, Bengaluru',
    joinedDate: '2025-02-22',
    status: 'Active',
    permissions: ['portal.view', 'invoices.view', 'appointments.book', 'support.create'],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  college_admin: {
    id: 'ADM-CMP-0003',
    userId: 'ADM-CMP-0003',
    organization_id: 'SMR-CMP-0003',
    companyId: 'SMR-CMP-0003',
    name: 'Dr. Meenakshi Sundaram',
    email: 'principal@brightfuture.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: ROLES.COMPANY_ADMIN,
    designation: 'Campus Dean & Principal',
    department: 'Academic Directorate',
    organization: 'BrightFuture University & Engineering College',
    phone: '+91 94432 10987',
    status: 'Active',
    permissions: ['company.manage', 'departments.manage', 'staff.manage', 'academics.manage'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  college_hod: {
    id: 'PRIYA-CS-001',
    userId: 'PRIYA-CS-001',
    staffId: 'PRIYA-CS-001',
    organization_id: 'SMR-CMP-0003',
    companyId: 'SMR-CMP-0003',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@brightfuture.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: 'HOD',
    designation: 'Head of Department (HOD) & Professor',
    department: 'Computer Science & Engineering',
    organization: 'BrightFuture University & Engineering College',
    phone: '+91 98450 67123',
    status: 'Active',
    permissions: ['department.manage', 'faculty.manage', 'students.manage', 'curriculum.manage'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  college_faculty: {
    id: 'RAMESH-CS-001',
    userId: 'RAMESH-CS-001',
    staffId: 'RAMESH-CS-001',
    organization_id: 'SMR-CMP-0003',
    companyId: 'SMR-CMP-0003',
    name: 'Prof. Ramesh Rao',
    email: 'ramesh.rao@brightfuture.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: 'FACULTY',
    designation: 'Associate Professor & DBMS Lead',
    department: 'Computer Science & Engineering',
    organization: 'BrightFuture University & Engineering College',
    phone: '+91 98450 78234',
    status: 'Active',
    permissions: ['subjects.view', 'attendance.manage', 'grades.manage'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  college_student: {
    id: 'ARUN-CS-2026-001',
    userId: 'ARUN-CS-2026-001',
    studentId: 'ARUN-CS-2026-001',
    organization_id: 'SMR-CMP-0003',
    companyId: 'SMR-CMP-0003',
    name: 'Arun Kumar',
    email: 'arun.cs@brightfuture.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: 'STUDENT',
    designation: 'Scholar • B.Tech CSE Semester 5',
    department: 'Computer Science & Engineering',
    organization: 'BrightFuture University & Engineering College',
    phone: '+91 97412 34567',
    status: 'Active',
    permissions: ['portal.view', 'results.view', 'attendance.view'],
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
  },
  hotel_frontdesk: {
    id: 'ARUN-FRONTDESK-001',
    userId: 'ARUN-FRONTDESK-001',
    staffId: 'ARUN-FRONTDESK-001',
    organization_id: 'SMR-CMP-0002',
    companyId: 'SMR-CMP-0002',
    name: 'Arun Kumar',
    email: 'arun.frontdesk@mirage.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: ROLES.STAFF,
    designation: 'Lead Front Desk Receptionist',
    department: 'Front Desk & Guest Services',
    organization: 'Grand Mirage Resort & Luxury Suites',
    phone: '+91 98450 99881',
    status: 'Active',
    permissions: ['frontdesk.manage', 'rooms.view', 'reservations.manage'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  hotel_housekeeping: {
    id: 'PRIYA-HOUSEKEEPING-001',
    userId: 'PRIYA-HOUSEKEEPING-001',
    staffId: 'PRIYA-HOUSEKEEPING-001',
    organization_id: 'SMR-CMP-0002',
    companyId: 'SMR-CMP-0002',
    name: 'Priya Sharma',
    email: 'priya.housekeeping@mirage.demo',
    salt: DEMO_SALT,
    passwordHash: DEMO_HASH,
    role: ROLES.STAFF,
    designation: 'Housekeeping Floor Supervisor',
    department: 'Housekeeping & Rooms Inspection',
    organization: 'Grand Mirage Resort & Luxury Suites',
    phone: '+91 98450 99882',
    status: 'Active',
    permissions: ['housekeeping.manage', 'rooms.status'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  }
};

export const authService = {
  getCurrentUser: () => {
    const keys = storageService.getKeys();
    const saved = storageService.getItem(keys.AUTH, null);
    if (saved) {
      // Automatic migration: If saved session is old owner 'usr-owner-001', migrate to permanent 'kruthikpranavtr'
      if (
        saved.id === 'usr-owner-001' ||
        saved.email === 'owner@smartora.com' ||
        (saved.role === ROLES.PLATFORM_OWNER && saved.userId !== 'kruthikpranavtr')
      ) {
        const updated = {
          ...saved,
          ...DEMO_USERS.owner
        };
        storageService.setItem(keys.AUTH, updated);
        return updated;
      }
      return saved;
    }
    return DEMO_USERS.owner;
  },

  setCurrentUser: (user) => {
    const keys = storageService.getKeys();
    storageService.setItem(keys.AUTH, user);
  },

  /**
   * Universal Login by User ID + Password
   * Connects to Express + MongoDB backend, with local client resilience
   */
  login: async (userIdOrEmail, password, remember = true) => {
    const keys = storageService.getKeys();
    const cleanInput = (userIdOrEmail || '').trim();

    // 1. Try real Express / MongoDB backend login first
    try {
      const backendRes = await apiService.login(cleanInput, password);
      if (backendRes.success && backendRes.user) {
        const user = backendRes.user;
        storageService.setItem(keys.AUTH, user);
        if (user.organization_id) {
          storageService.setItem(keys.ACTIVE_ORG_ID, user.organization_id);
        }
        return { success: true, user };
      } else if (
        backendRes.message &&
        backendRes.message !== 'Could not connect to authentication server.'
      ) {
        // Backend actively returned an error (e.g., bad credentials or inactive account)
        return backendRes;
      }
    } catch (apiErr) {
      console.warn('[AuthService] Backend login call exception, proceeding to local store:', apiErr);
    }

    // 2. Local Fallback validation if backend is not reachable
    const cleanLower = cleanInput.toLowerCase();

    // Check against DEMO_USERS presets
    const demoMatch = Object.values(DEMO_USERS).find(
      u =>
        (u.userId && u.userId.toLowerCase() === cleanLower) ||
        (u.id && u.id.toLowerCase() === cleanLower) ||
        (u.email && u.email.toLowerCase() === cleanLower)
    );

    if (demoMatch) {
      if (demoMatch.status === 'Inactive') {
        return { success: false, message: 'Your account has been deactivated. Please contact your administrator.' };
      }
      // Check Organization Verification & Status
      if (demoMatch.organization_id) {
        const orgs = storageService.getItem(keys.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
        const userOrg = orgs.find(o => o.id === demoMatch.organization_id || o.companyId === demoMatch.organization_id);
        if (userOrg) {
          if (userOrg.verification_status && userOrg.verification_status !== 'VERIFIED') {
            return {
              success: false,
              message: `Organization access restricted. Your organization verification status is "${userOrg.verification_status}". Official approval is pending from the Platform Owner.`
            };
          }
          if (userOrg.status === 'Inactive' || userOrg.status === 'Suspended') {
            return {
              success: false,
              message: 'Your organization account has been suspended or deactivated. Please contact the platform administrator.'
            };
          }
        }
      }

      const isValid = verifyPassword(password, demoMatch.passwordHash || 'admin', demoMatch.salt);
      if (isValid) {
        storageService.setItem(keys.AUTH, demoMatch);
        if (demoMatch.organization_id) {
          storageService.setItem(keys.ACTIVE_ORG_ID, demoMatch.organization_id);
        }
        return { success: true, user: demoMatch };
      }
    }

    // Check registered users in storage
    const registeredUsers = storageService.getItem(keys.USERS, INITIAL_USERS);
    const userMatch = registeredUsers.find(
      u =>
        (u.userId && u.userId.toLowerCase() === cleanLower) ||
        (u.id && u.id.toLowerCase() === cleanLower) ||
        (u.staffId && u.staffId.toLowerCase() === cleanLower) ||
        (u.adminId && u.adminId.toLowerCase() === cleanLower) ||
        (u.email && u.email.toLowerCase() === cleanLower)
    );

    if (userMatch) {
      if (userMatch.status === 'Inactive') {
        return { success: false, message: 'Your account has been deactivated. Please contact your company administrator.' };
      }
      if (userMatch.organization_id) {
        const orgs = storageService.getItem(keys.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
        const userOrg = orgs.find(o => o.id === userMatch.organization_id || o.companyId === userMatch.organization_id);
        if (userOrg) {
          if (userOrg.verification_status && userOrg.verification_status !== 'VERIFIED') {
            return {
              success: false,
              message: `Organization access restricted. Your organization verification status is "${userOrg.verification_status}". Official approval is pending from the Platform Owner.`
            };
          }
          if (userOrg.status === 'Inactive' || userOrg.status === 'Suspended') {
            return {
              success: false,
              message: 'Your organization account has been suspended or deactivated. Please contact the platform administrator.'
            };
          }
        }
      }
      const targetHash = userMatch.passwordHash || userMatch.password || 'admin';
      const targetSalt = userMatch.salt || DEMO_SALT;
      const isValid = verifyPassword(password, targetHash, targetSalt);

      if (isValid) {
        const authUser = {
          ...userMatch,
          userId: userMatch.userId || userMatch.id,
          role: userMatch.role || ROLES.COMPANY_ADMIN,
          organization: userMatch.organization || 'SMARTORA Tech Solutions',
          joinedDate: userMatch.joinedDate || '2024-01-01',
          status: userMatch.status || 'Active'
        };
        delete authUser.password;
        storageService.setItem(keys.AUTH, authUser);
        if (authUser.organization_id) {
          storageService.setItem(keys.ACTIVE_ORG_ID, authUser.organization_id);
        }
        return { success: true, user: authUser };
      }
      return { success: false, message: 'Invalid password. Please check credentials.' };
    }

    return { success: false, message: 'Invalid User ID or password.' };
  },

  loginDemo: (roleType = 'owner') => {
    const user = DEMO_USERS[roleType] || DEMO_USERS.admin_tech || DEMO_USERS.owner;
    const keys = storageService.getKeys();
    storageService.setItem(keys.AUTH, user);
    if (user.organization_id) {
      storageService.setItem(keys.ACTIVE_ORG_ID, user.organization_id);
    }
    // Also set token if demo login
    apiService.setToken(`smartora_${user.userId || user.id}_${Date.now()}`);
    return user;
  },

  register: (userData) => {
    const keys = storageService.getKeys();
    const users = storageService.getItem(keys.USERS, INITIAL_USERS);

    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const salt = generateSalt();
    const passwordHash = hashPasswordSync(userData.password || 'admin', salt);

    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      userId: `usr-${Date.now().toString().slice(-4)}`,
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address || 'India',
      salt,
      passwordHash,
      role: ROLES.COMPANY_ADMIN,
      department: 'Executive Management',
      organization: userData.organizationName || 'New Enterprise',
      orgType: userData.organizationType || 'Business',
      status: 'Active',
      lastActive: 'Just now',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-${1535713875000 + Math.floor(Math.random() * 500)}?w=150`
    };

    users.unshift(newUser);
    storageService.setItem(keys.USERS, users);
    return { success: true, user: newUser };
  },

  logout: async () => {
    try {
      await apiService.logout();
    } catch (e) {
      // ignore
    }
    const keys = storageService.getKeys();
    localStorage.removeItem(keys.AUTH);
  },

  /**
   * Updates profile information in session, database, and employees roster.
   * Strips restricted fields if the user is not an administrator.
   * Enforces permanent immutability of User ID and Company ID.
   */
  updateProfile: async (updatedData, actorRole = null) => {
    const keys = storageService.getKeys();
    const current = authService.getCurrentUser();
    if (!current) return null;

    const isPlatformOwner = current.role === ROLES.PLATFORM_OWNER || actorRole === ROLES.PLATFORM_OWNER;
    const isCompanyAdmin = current.role === ROLES.COMPANY_ADMIN || actorRole === ROLES.COMPANY_ADMIN;

    const sanitized = { ...updatedData };

    // Strict RBAC: normal users cannot change security/immutable identifiers
    if (!isPlatformOwner && !isCompanyAdmin) {
      delete sanitized.id;
      delete sanitized.userId;
      delete sanitized.organization_id;
      delete sanitized.role;
      delete sanitized.department;
      delete sanitized.department_id;
      delete sanitized.permissions;
      delete sanitized.companyId;
      delete sanitized.status;
      delete sanitized.passwordHash;
      delete sanitized.salt;
    }

    // User ID is PERMANENT and IMMUTABLE for all roles (especially kruthikpranavtr and CMP IDs)
    delete sanitized.userId;
    delete sanitized.id;

    // Call backend API for permanent MongoDB and disk persistence
    try {
      await apiService.updateProfile(sanitized);
    } catch (e) {
      console.warn('[AuthService] Backend profile update failed, updating local storage:', e);
    }

    const merged = { ...current, ...sanitized };
    storageService.setItem(keys.AUTH, merged);

    // Synchronize to users store
    const users = storageService.getItem(keys.USERS, INITIAL_USERS);
    const updatedUsers = users.map(u =>
      (u.id === merged.id || u.userId === merged.userId) ? { ...u, ...sanitized } : u
    );
    storageService.setItem(keys.USERS, updatedUsers);

    // Synchronize to employees store if corresponding record exists
    const employees = storageService.getItem(keys.EMPLOYEES, []);
    const updatedEmployees = employees.map(emp => {
      if (
        emp.id === merged.id ||
        emp.userId === merged.userId ||
        (emp.name === current.name && emp.orgId === current.organization_id)
      ) {
        return {
          ...emp,
          name: sanitized.name || emp.name,
          phone: sanitized.phone || emp.phone,
          avatar: sanitized.avatar || emp.avatar,
          address: sanitized.address || emp.address
        };
      }
      return emp;
    });
    storageService.setItem(keys.EMPLOYEES, updatedEmployees);

    return merged;
  },

  /**
   * Self-service password change with old password verification and secure salted hashing
   */
  changePassword: async (userId, oldPassword, newPassword) => {
    // 1. Try backend API first
    try {
      const res = await apiService.changePassword(oldPassword, newPassword);
      if (res.success) {
        const current = authService.getCurrentUser();
        const newSalt = generateSalt();
        const newHash = hashPasswordSync(newPassword, newSalt);
        const updatedUser = { ...current, salt: newSalt, passwordHash: newHash, mustChangePassword: false };
        delete updatedUser.password;
        authService.setCurrentUser(updatedUser);
        return { success: true, message: 'Password has been updated and persisted securely.' };
      } else if (res.message && res.message !== 'Could not connect to authentication server.') {
        return res;
      }
    } catch (e) {
      console.warn('[AuthService] Backend password change call failed, using local update:', e);
    }

    // 2. Local fallback
    const keys = storageService.getKeys();
    const current = authService.getCurrentUser();
    const users = storageService.getItem(keys.USERS, INITIAL_USERS);

    const userIndex = users.findIndex(u => u.id === userId || u.userId === userId);
    const targetUser = userIndex >= 0 ? users[userIndex] : current;

    if (!targetUser) {
      return { success: false, message: 'User account not found.' };
    }

    const salt = targetUser.salt || DEMO_SALT;
    const storedHash = targetUser.passwordHash || targetUser.password || 'admin';
    const isValid = verifyPassword(oldPassword, storedHash, salt);

    if (!isValid) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    if (!newPassword || newPassword.length < 5) {
      return { success: false, message: 'New password must be at least 5 characters long.' };
    }

    const newSalt = generateSalt();
    const newHash = hashPasswordSync(newPassword, newSalt);

    const updatedUser = {
      ...targetUser,
      salt: newSalt,
      passwordHash: newHash,
      mustChangePassword: false
    };
    delete updatedUser.password;
    delete updatedUser.tempPassword;

    if (userIndex >= 0) {
      users[userIndex] = updatedUser;
      storageService.setItem(keys.USERS, users);
    }

    if (current && (current.id === userId || current.userId === userId)) {
      const updatedAuth = {
        ...current,
        salt: newSalt,
        passwordHash: newHash,
        mustChangePassword: false
      };
      delete updatedAuth.password;
      delete updatedAuth.tempPassword;
      storageService.setItem(keys.AUTH, updatedAuth);
    }

    return { success: true, message: 'Password has been updated successfully.' };
  },

  /**
   * Admin-initiated password reset with temporary credential generation
   */
  resetUserPassword: (userId, actorRole = null) => {
    const keys = storageService.getKeys();
    const users = storageService.getItem(keys.USERS, INITIAL_USERS);
    const userIndex = users.findIndex(u => u.id === userId || u.userId === userId);

    if (userIndex < 0) {
      return { success: false, message: 'User account not found.' };
    }

    const targetUser = users[userIndex];
    const tempPassword = generateTempPassword();
    const salt = generateSalt();
    const passwordHash = hashPasswordSync(tempPassword, salt);

    const updatedUser = {
      ...targetUser,
      salt,
      passwordHash,
      tempPassword,
      mustChangePassword: true
    };
    delete updatedUser.password;

    users[userIndex] = updatedUser;
    storageService.setItem(keys.USERS, users);

    return {
      success: true,
      tempPassword,
      user: updatedUser,
      message: `Temporary password generated for ${targetUser.name}.`
    };
  }
};
