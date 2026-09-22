// Data Context for SMARTORA
// Universal Multi-Tenant AI Business Management & Automation Platform Store

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storageService';
import {
  ROLES,
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_INVOICES,
  INITIAL_SUPPLIERS,
  INITIAL_PROJECTS,
  INITIAL_APPOINTMENTS,
  INITIAL_EXPENSES,
  INITIAL_AUTOMATION_RULES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PLATFORM_STATS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_AGENT_RUNS,
  INITIAL_PENDING_APPROVALS,
  INITIAL_VERIFICATION_REQUESTS,
  INITIAL_TRANSACTIONS
} from '../data/mockData';
import { ragService } from '../services/ai/ragService';
import {
  generateStaffId,
  generateAdminId,
  generateTempPassword,
  generateSalt,
  hashPasswordSync
} from '../services/cryptoService';
import {
  VERIFICATION_STATUS,
  MATCH_RESULT,
  getProviderForOrgType,
  compareFields,
  analyzeVerificationDocument,
  checkDuplicateOrganization
} from '../services/verificationService';
import { matchesTenant, attachTenantKeys } from '../utils/tenantUtils';
import { getPortalConfig, getTerminology, getEnabledModules, normalizeRole } from '../config/portalCategories';
import { apiService } from '../services/apiService';
import { generateIntelligentEmployeeId, generateIntelligentStudentId } from '../services/cryptoService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { currentUser } = useAuth();

  // Initialize initial seed data on startup
  useEffect(() => {
    storageService.initializeData();
    ragService.ensureInitialized();
  }, []);

  const keys = storageService.getKeys();

  // Multi-Tenant Organization State
  const [organizations, setOrganizations] = useState(() =>
    storageService.getItem(keys.ORGANIZATIONS, INITIAL_ORGANIZATIONS)
  );
  const [activeOrgId, setActiveOrgId] = useState(() =>
    storageService.getItem(keys.ACTIVE_ORG_ID, 'org-001')
  );

  // Sync activeOrgId when authenticated user changes
  useEffect(() => {
    if (currentUser?.organization_id) {
      setActiveOrgId(currentUser.organization_id);
      storageService.setItem(keys.ACTIVE_ORG_ID, currentUser.organization_id);
    } else if (currentUser?.companyId) {
      setActiveOrgId(currentUser.companyId);
      storageService.setItem(keys.ACTIVE_ORG_ID, currentUser.companyId);
    }
  }, [currentUser]);

  // Organization Verification System State
  const [verificationRequests, setVerificationRequests] = useState(() =>
    storageService.getItem(keys.VERIFICATION_REQUESTS, INITIAL_VERIFICATION_REQUESTS)
  );

  // Platform Level State
  const [auditLogs, setAuditLogs] = useState(() =>
    storageService.getItem(keys.AUDIT_LOGS, INITIAL_AUDIT_LOGS)
  );
  const [subscriptions, setSubscriptions] = useState(() =>
    storageService.getItem(keys.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS)
  );
  const [platformStats, setPlatformStats] = useState(() =>
    storageService.getItem(keys.PLATFORM_STATS, INITIAL_PLATFORM_STATS)
  );

  // Knowledge Base (RAG) & Agentic AI State
  const [knowledgeDocs, setKnowledgeDocs] = useState(() =>
    storageService.getItem(keys.KNOWLEDGE_BASE_DOCS, INITIAL_KNOWLEDGE_DOCS)
  );
  const [agentRuns, setAgentRuns] = useState(() =>
    storageService.getItem(keys.AGENT_RUNS, INITIAL_AGENT_RUNS)
  );
  const [pendingApprovals, setPendingApprovals] = useState(() =>
    storageService.getItem(keys.PENDING_APPROVALS, INITIAL_PENDING_APPROVALS)
  );

  // Entities State
  const [users, setUsers] = useState(() => storageService.getItem(keys.USERS, []));
  const [students, setStudents] = useState(() => storageService.getItem(keys.STUDENTS, []));
  const [customers, setCustomers] = useState(() => storageService.getItem(keys.CUSTOMERS, []));
  const [employees, setEmployees] = useState(() => storageService.getItem(keys.EMPLOYEES, []));
  const [departments, setDepartments] = useState(() => storageService.getItem(keys.DEPARTMENTS, []));
  const [tasks, setTasks] = useState(() => storageService.getItem(keys.TASKS, []));
  const [attendance, setAttendance] = useState(() => storageService.getItem(keys.ATTENDANCE, []));
  const [products, setProducts] = useState(() => storageService.getItem(keys.PRODUCTS, []));
  const [sales, setSales] = useState(() => storageService.getItem(keys.SALES, []));
  const [invoices, setInvoices] = useState(() => storageService.getItem(keys.INVOICES, INITIAL_INVOICES));
  const [suppliers, setSuppliers] = useState(() => storageService.getItem(keys.SUPPLIERS, INITIAL_SUPPLIERS));
  const [projects, setProjects] = useState(() => storageService.getItem(keys.PROJECTS, INITIAL_PROJECTS));
  const [appointments, setAppointments] = useState(() => storageService.getItem(keys.APPOINTMENTS, INITIAL_APPOINTMENTS));
  const [expenses, setExpenses] = useState(() => storageService.getItem(keys.EXPENSES, INITIAL_EXPENSES));
  const [transactions, setTransactions] = useState(() => storageService.getItem(keys.TRANSACTIONS, INITIAL_TRANSACTIONS));
  const [automationRules, setAutomationRules] = useState(() => storageService.getItem(keys.AUTOMATION_RULES, INITIAL_AUTOMATION_RULES));
  const [notifications, setNotifications] = useState(() => storageService.getItem(keys.NOTIFICATIONS, []));
  const [settings, setSettings] = useState(() => storageService.getItem(keys.SETTINGS, {}));
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(keys.MODE) || 'business'; // Default to modern business
  });

  // College Academic States
  const [courses, setCourses] = useState(() => storageService.getItem(keys.COURSES, [
    { id: 'CRS-CS-01', courseId: 'CRS-CS-01', organizationId: 'SMR-CMP-0003', name: 'B.Tech Computer Science & Engineering', code: 'CSE-UG', department: 'Computer Science & Engineering', program: 'Undergraduate', duration: '4 Years', semesters: 8, status: 'Active' },
    { id: 'CRS-IT-01', courseId: 'CRS-IT-01', organizationId: 'SMR-CMP-0003', name: 'B.Tech Information Technology', code: 'IT-UG', department: 'Information Technology', program: 'Undergraduate', duration: '4 Years', semesters: 8, status: 'Active' },
    { id: 'CRS-EC-01', courseId: 'CRS-EC-01', organizationId: 'SMR-CMP-0003', name: 'B.Tech Electronics & Communication', code: 'ECE-UG', department: 'Electronics & Communication', program: 'Undergraduate', duration: '4 Years', semesters: 8, status: 'Active' }
  ]));
  const [subjects, setSubjects] = useState(() => storageService.getItem(keys.SUBJECTS, [
    { id: 'SUB-CS-101', subjectCode: 'CS301', name: 'Design & Analysis of Algorithms', department: 'Computer Science & Engineering', semester: 'Semester 5', credits: 4, faculty: 'Dr. Priya Sharma', organizationId: 'SMR-CMP-0003' },
    { id: 'SUB-CS-102', subjectCode: 'CS302', name: 'Database Management Systems & NoSQL', department: 'Computer Science & Engineering', semester: 'Semester 5', credits: 4, faculty: 'Prof. Ramesh Rao', organizationId: 'SMR-CMP-0003' },
    { id: 'SUB-CS-103', subjectCode: 'CS303', name: 'Operating Systems & Distributed Architecture', department: 'Computer Science & Engineering', semester: 'Semester 5', credits: 3, faculty: 'Dr. Priya Sharma', organizationId: 'SMR-CMP-0003' },
    { id: 'SUB-IT-101', subjectCode: 'IT301', name: 'Cloud Computing & Microservices', department: 'Information Technology', semester: 'Semester 5', credits: 4, faculty: 'Prof. Ananya Sen', organizationId: 'SMR-CMP-0003' }
  ]));
  const [exams, setExams] = useState(() => storageService.getItem(keys.EXAMS, [
    { id: 'EXM-CS-01', examId: 'EXM-CS-01', title: 'Mid-Term Exam: Algorithms (CS301)', subjectCode: 'CS301', department: 'Computer Science & Engineering', semester: 'Semester 5', date: '2026-10-15', time: '10:00 AM - 01:00 PM', room: 'Hall B-201', maxMarks: 100, type: 'Internal', organizationId: 'SMR-CMP-0003' },
    { id: 'EXM-CS-02', examId: 'EXM-CS-02', title: 'Mid-Term Exam: DBMS (CS302)', subjectCode: 'CS302', department: 'Computer Science & Engineering', semester: 'Semester 5', date: '2026-10-18', time: '10:00 AM - 01:00 PM', room: 'Hall B-204', maxMarks: 100, type: 'Internal', organizationId: 'SMR-CMP-0003' }
  ]));
  const [examResults, setExamResults] = useState(() => storageService.getItem(keys.EXAM_RESULTS, [
    { id: 'RES-01', resultId: 'RES-01', studentId: 'ARUN-CS-2026-001', studentName: 'Arun Kumar', subjectCode: 'CS301', subjectName: 'Algorithms', marks: 88, maxMarks: 100, grade: 'A+', gpa: '9.2', status: 'Passed', semester: 'Semester 5', organizationId: 'SMR-CMP-0003' },
    { id: 'RES-02', resultId: 'RES-02', studentId: 'ARUN-CS-2026-001', studentName: 'Arun Kumar', subjectCode: 'CS302', subjectName: 'DBMS', marks: 84, maxMarks: 100, grade: 'A', gpa: '8.8', status: 'Passed', semester: 'Semester 5', organizationId: 'SMR-CMP-0003' },
    { id: 'RES-03', resultId: 'RES-03', studentId: 'DIVYA-CS-2026-002', studentName: 'Divya Nambiar', subjectCode: 'CS301', subjectName: 'Algorithms', marks: 94, maxMarks: 100, grade: 'O', gpa: '9.8', status: 'Passed', semester: 'Semester 5', organizationId: 'SMR-CMP-0003' }
  ]));
  const [notices, setNotices] = useState(() => storageService.getItem(keys.NOTICES, [
    { id: 'NTC-01', title: 'Semester 5 Examination Schedule & Hall Ticket Download', date: '2026-09-20', department: 'Academic Directorate', priority: 'High', organizationId: 'SMR-CMP-0003' },
    { id: 'NTC-02', title: 'Annual Smart India Hackathon internal campus trials', date: '2026-09-18', department: 'Computer Science & Engineering', priority: 'Medium', organizationId: 'SMR-CMP-0003' }
  ]));

  // Hotel / Resort States
  const [rooms, setRooms] = useState(() => storageService.getItem(keys.ROOMS, [
    { id: 'RM-101', roomNumber: '101', type: 'Deluxe Suite', floor: '1st Floor', capacity: 2, price: 4500, status: 'OCCUPIED', guestName: 'Vikramaditya Hegde', checkOut: '2026-09-24', amenities: ['King Bed', 'Balcony', 'High-Speed Wi-Fi', 'Mini Bar'], organizationId: 'SMR-CMP-0002' },
    { id: 'RM-102', roomNumber: '102', type: 'Deluxe Suite', floor: '1st Floor', capacity: 2, price: 4500, status: 'AVAILABLE', amenities: ['King Bed', 'Garden View', 'High-Speed Wi-Fi'], organizationId: 'SMR-CMP-0002' },
    { id: 'RM-103', roomNumber: '103', type: 'Standard Luxury', floor: '1st Floor', capacity: 2, price: 3200, status: 'CLEANING', amenities: ['Queen Bed', 'Smart TV', 'Work Desk'], organizationId: 'SMR-CMP-0002' },
    { id: 'RM-201', roomNumber: '201', type: 'Executive Villa', floor: '2nd Floor', capacity: 4, price: 8500, status: 'RESERVED', guestName: 'Sarah Jenkins', checkIn: '2026-09-23', amenities: ['Private Jacuzzi', 'Sunset View', 'Complimentary Breakfast'], organizationId: 'SMR-CMP-0002' },
    { id: 'RM-202', roomNumber: '202', type: 'Executive Villa', floor: '2nd Floor', capacity: 4, price: 8500, status: 'MAINTENANCE', maintenanceReason: 'AC Servicing in progress', organizationId: 'SMR-CMP-0002' },
    { id: 'RM-203', roomNumber: '203', type: 'Standard Luxury', floor: '2nd Floor', capacity: 2, price: 3200, status: 'AVAILABLE', amenities: ['Queen Bed', 'Pool View', 'Smart TV'], organizationId: 'SMR-CMP-0002' }
  ]));
  const [reservations, setReservations] = useState(() => storageService.getItem(keys.RESERVATIONS, [
    { id: 'RESV-801', guestName: 'Vikramaditya Hegde', guestPhone: '+91 97312 33456', roomNumber: '101', roomType: 'Deluxe Suite', checkIn: '2026-09-21', checkOut: '2026-09-24', guests: 2, total: 13500, paid: 13500, status: 'CHECKED_IN', paymentStatus: 'Paid', organizationId: 'SMR-CMP-0002' },
    { id: 'RESV-802', guestName: 'Sarah Jenkins', guestPhone: '+91 98450 67890', roomNumber: '201', roomType: 'Executive Villa', checkIn: '2026-09-23', checkOut: '2026-09-26', guests: 3, total: 25500, paid: 10000, status: 'CONFIRMED', paymentStatus: 'Partial', organizationId: 'SMR-CMP-0002' },
    { id: 'RESV-803', guestName: 'Karan Mehta', guestPhone: '+91 98200 45678', roomNumber: '102', roomType: 'Deluxe Suite', checkIn: '2026-09-25', checkOut: '2026-09-28', guests: 2, total: 13500, paid: 0, status: 'CONFIRMED', paymentStatus: 'Pending', organizationId: 'SMR-CMP-0002' }
  ]));
  const [guests, setGuests] = useState(() => storageService.getItem(keys.GUESTS, [
    { id: 'GST-01', name: 'Vikramaditya Hegde', phone: '+91 97312 33456', email: 'vikram@nexacorp.demo', city: 'Bengaluru', idProof: 'Aadhaar Verified', totalStays: 4, currentRoom: '101', organizationId: 'SMR-CMP-0002' },
    { id: 'GST-02', name: 'Sarah Jenkins', phone: '+91 98450 67890', email: 'sarah.j@globex.demo', city: 'London, UK', idProof: 'Passport Verified', totalStays: 2, currentRoom: 'Reserved (201)', organizationId: 'SMR-CMP-0002' }
  ]));
  const [housekeeping, setHousekeeping] = useState(() => storageService.getItem(keys.HOUSEKEEPING, [
    { id: 'HK-01', roomNumber: '103', type: 'Standard Luxury', state: 'DIRTY', priority: 'High', assignedStaff: 'Priya Sharma (PRIYA-HOUSEKEEPING-001)', notes: 'Full turnover after 3-day stay', organizationId: 'SMR-CMP-0002' },
    { id: 'HK-02', roomNumber: '202', type: 'Executive Villa', state: 'MAINTENANCE', priority: 'Urgent', assignedStaff: 'Maintenance Team', notes: 'AC Compressor repair', organizationId: 'SMR-CMP-0002' },
    { id: 'HK-03', roomNumber: '102', type: 'Deluxe Suite', state: 'CLEAN', priority: 'Normal', assignedStaff: 'Priya Sharma', notes: 'Turnover completed, ready for inspection', organizationId: 'SMR-CMP-0002' }
  ]));

  // Active Organization resolution
  const currentOrganization = useMemo(() => {
    // 1. If currentUser has an organization_id / companyId, prioritize finding that organization
    const targetOrgId = currentUser?.organization_id || currentUser?.companyId || activeOrgId;
    if (targetOrgId) {
      const normTarget = String(targetOrgId).trim().toLowerCase();
      const found = organizations.find(o =>
        String(o.id).toLowerCase() === normTarget ||
        String(o.companyId || '').toLowerCase() === normTarget ||
        String(o.organizationId || '').toLowerCase() === normTarget ||
        String(o.organization_id || '').toLowerCase() === normTarget
      );
      if (found) return found;
    }

    // 2. Fallback to activeOrgId
    const normActive = String(activeOrgId).trim().toLowerCase();
    const foundByActive = organizations.find(o =>
      String(o.id).toLowerCase() === normActive ||
      String(o.companyId || '').toLowerCase() === normActive ||
      String(o.organizationId || '').toLowerCase() === normActive ||
      String(o.organization_id || '').toLowerCase() === normActive
    );
    return foundByActive || organizations[0] || INITIAL_ORGANIZATIONS[0];
  }, [organizations, activeOrgId, currentUser]);

  // Switch Organization
  const switchOrganization = (orgId) => {
    const target = organizations.find(o =>
      o.id === orgId || o.companyId === orgId || o.organization_id === orgId
    );
    if (target) {
      setActiveOrgId(target.id);
      storageService.setItem(keys.ACTIVE_ORG_ID, target.id);
    }
  };

  // Audit Logging Utility
  const logAuditEvent = (eventData) => {
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      user_id: eventData.user_id || 'usr-current',
      userName: eventData.userName || 'Authenticated User',
      userRole: eventData.userRole || 'USER',
      organization_id: eventData.organization_id || currentOrganization?.id || 'system',
      department_id: eventData.department_id || null,
      action: eventData.action,
      module: eventData.module,
      details: eventData.details,
      status: eventData.status || 'Success',
      ipAddress: '192.168.1.' + Math.floor(10 + Math.random() * 80)
    };
    const nextLogs = [newLog, ...auditLogs];
    setAuditLogs(nextLogs);
    storageService.setItem(keys.AUDIT_LOGS, nextLogs);
    return newLog;
  };

  // Platform Owner: Create Company with Auto-Generated Credentials
  const createCompany = (companyData) => {
    const count = organizations.length + 1;
    const compCode = (companyData.companyCode || companyData.name.slice(0, 4)).toUpperCase().replace(/[^A-Z]/g, '');
    const compId = `SMR-CMP-000${count}`;
    const adminId = `ADM-CMP-000${count}`;
    const tempPassword = `Smart#${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrg = {
      id: `org-${Date.now().toString().slice(-4)}`,
      companyId: compId,
      adminId: adminId,
      tempPassword: tempPassword,
      companyCode: compCode,
      name: companyData.name,
      type: companyData.type || 'Company',
      industry: companyData.industry || 'General Business',
      tagline: companyData.tagline || 'Manage Smarter. Automate Faster.',
      email: companyData.email || `${compCode.toLowerCase()}@smartora.demo`,
      phone: companyData.phone || '+91 98000 00000',
      address: companyData.address || 'HQ Address',
      country: companyData.country || 'India',
      state: companyData.state || 'Karnataka',
      city: companyData.city || 'Bengaluru',
      website: companyData.website || `https://${compCode.toLowerCase()}.demo`,
      companySize: companyData.companySize || '10-50 Employees',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      currency: companyData.currency || 'INR (₹)',
      currencySymbol: companyData.currency?.includes('$') ? '$' : '₹',
      subscription: {
        plan: companyData.plan || 'Professional',
        status: 'Active',
        mrr: companyData.plan === 'Enterprise' ? '₹14,999/mo' : '₹6,999/mo',
        maxUsers: companyData.maxUsers || 50,
        billingCycle: 'Annual',
        renewalDate: '2027-03-31'
      },
      enabledModules: companyData.enabledModules || [
        'dashboard', 'sales', 'invoices', 'projects', 'tasks', 'employees', 'departments', 'expenses', 'customers', 'automation', 'ai-assistant', 'analytics', 'reports', 'settings'
      ],
      terminology: companyData.terminology || {
        customerTerm: 'Clients',
        employeeTerm: 'Employees',
        departmentTerm: 'Departments'
      },
      stats: {
        monthlyRevenue: '₹0',
        monthlyExpenses: '₹0',
        netMargin: '₹0',
        monthlyGrowth: 'New Workspace',
        todayFootfall: '0 Activity'
      }
    };

    // Create initial Company Admin user
    const adminSalt = generateSalt();
    const adminPasswordHash = hashPasswordSync(tempPassword, adminSalt);
    const newAdminUser = {
      id: `usr-admin-${count}`,
      adminId: adminId,
      organization_id: newOrg.id,
      department_id: null,
      name: companyData.adminName || `${companyData.name} Admin`,
      email: companyData.adminEmail || companyData.email,
      phone: companyData.phone || '+91 98000 00000',
      address: companyData.address || `${companyData.city || 'Bengaluru'}, India`,
      salt: adminSalt,
      passwordHash: adminPasswordHash,
      tempPassword: tempPassword,
      mustChangePassword: true,
      role: ROLES.COMPANY_ADMIN,
      designation: 'Managing Director & Company Admin',
      department: 'Executive Management',
      organization: newOrg.name,
      status: 'Active',
      lastActive: 'Just now',
      joinedDate: new Date().toISOString().split('T')[0],
      permissions: ['company.manage', 'departments.manage', 'staff.manage', 'finance.manage', 'audit.view']
    };

    const nextOrgs = [newOrg, ...organizations];
    setOrganizations(nextOrgs);
    storageService.setItem(keys.ORGANIZATIONS, nextOrgs);

    const nextUsers = [newAdminUser, ...users];
    setUsers(nextUsers);
    storageService.setItem(keys.USERS, nextUsers);

    // Add subscription entry
    const newSub = {
      id: `SUB-0${count}`,
      companyId: newOrg.id,
      companyName: newOrg.name,
      plan: newOrg.subscription.plan,
      mrr: newOrg.subscription.mrr,
      billingCycle: newOrg.subscription.billingCycle,
      status: 'Active',
      nextBilling: newOrg.subscription.renewalDate
    };
    const nextSubs = [newSub, ...subscriptions];
    setSubscriptions(nextSubs);
    storageService.setItem(keys.SUBSCRIPTIONS, nextSubs);

    // Update platform stats
    setPlatformStats(prev => ({
      ...prev,
      totalCompanies: prev.totalCompanies + 1,
      activeCompanies: prev.activeCompanies + 1,
      activeAdmins: prev.activeAdmins + 1
    }));

    // Log Audit event
    logAuditEvent({
      action: 'COMPANY_PROVISIONED',
      module: 'Platform Console',
      details: `Platform Owner created company "${newOrg.name}" [${compId}] with Admin [${adminId}]`,
      status: 'Success'
    });

    return {
      company: newOrg,
      adminId: adminId,
      tempPassword: tempPassword
    };
  };

  // Platform Owner: Update Company Details
  const updateCompany = (orgId, companyData) => {
    const nextOrgs = organizations.map(o => {
      if (o.id === orgId || o.companyId === orgId) {
        const merged = {
          ...o,
          ...companyData,
          updated_at: new Date().toISOString().split('T')[0]
        };
        return merged;
      }
      return o;
    });
    setOrganizations(nextOrgs);
    storageService.setItem(keys.ORGANIZATIONS, nextOrgs);

    logAuditEvent({
      action: 'COMPANY_UPDATED',
      module: 'Platform Console',
      details: `Platform Owner updated company details for "${companyData.name || orgId}"`,
      status: 'Success'
    });
  };

  // Platform Owner: Toggle Company Status
  const toggleCompanyStatus = (orgId) => {
    let targetName = 'Company';
    let targetNewStatus = 'Active';
    const nextOrgs = organizations.map(o => {
      if (o.id === orgId || o.companyId === orgId) {
        targetName = o.name;
        targetNewStatus = o.status === 'Active' ? 'Suspended' : 'Active';
        return { ...o, status: targetNewStatus };
      }
      return o;
    });
    setOrganizations(nextOrgs);
    storageService.setItem(keys.ORGANIZATIONS, nextOrgs);

    logAuditEvent({
      action: targetNewStatus === 'Active' ? 'COMPANY_ACTIVATED' : 'COMPANY_DEACTIVATED',
      module: 'Platform Console',
      details: `Platform Owner changed status of "${targetName}" to ${targetNewStatus}`,
      status: 'Success'
    });
  };

  // Platform Owner: Reset Company Admin Password
  const resetCompanyAdminPassword = (orgId) => {
    const org = organizations.find(o => o.id === orgId || o.companyId === orgId);
    if (!org) return null;

    const tempPassword = generateTempPassword();
    const salt = generateSalt();
    const passwordHash = hashPasswordSync(tempPassword, salt);

    // Locate and update admin user in users store
    let adminName = `${org.name} Admin`;
    let adminEmail = org.email || 'admin@smartora.demo';
    let adminId = org.adminId || 'ADM-001';

    const nextUsers = users.map(u => {
      if (u.organization_id === org.id && u.role === ROLES.COMPANY_ADMIN) {
        adminName = u.name;
        adminEmail = u.email;
        adminId = u.adminId || u.id;
        return {
          ...u,
          salt,
          passwordHash,
          tempPassword,
          mustChangePassword: true
        };
      }
      return u;
    });
    setUsers(nextUsers);
    storageService.setItem(keys.USERS, nextUsers);

    // Also update org reference
    const nextOrgs = organizations.map(o => (o.id === org.id ? { ...o, tempPassword, adminCredentialState: 'Temporary - Reset' } : o));
    setOrganizations(nextOrgs);
    storageService.setItem(keys.ORGANIZATIONS, nextOrgs);

    logAuditEvent({
      action: 'COMPANY_ADMIN_PASSWORD_RESET',
      module: 'Platform Console',
      details: `Platform Owner reset admin password for company "${org.name}" [${org.companyId || org.id}]`,
      status: 'Success'
    });

    return {
      tempPassword,
      adminName,
      adminEmail,
      adminId
    };
  };

  // Create & Register New Organization (From Registration Wizard)
  const createOrganization = (orgData) => {
    return createCompany(orgData).company;
  };

  // =========================================================================
  // ORGANIZATION VERIFICATION SYSTEM (INSTITUTIONAL ONBOARDING & AUDIT)
  // =========================================================================

  // Submit new verification application (From Onboarding / Registration)
  const submitVerificationRequest = (applicationData) => {
    const dupCheck = checkDuplicateOrganization(applicationData, organizations, verificationRequests);
    const count = verificationRequests.length + 1;
    const trackingId = `VER-2026-${String(count).padStart(3, '0')}`;

    // Perform background AI document analysis if documents were uploaded
    let aiAnalysisResult = null;
    if (applicationData.documents && applicationData.documents.length > 0) {
      aiAnalysisResult = analyzeVerificationDocument(applicationData.documents[0], applicationData);
    }

    const newRequest = {
      id: trackingId,
      name: applicationData.name,
      organizationType: applicationData.organizationType || applicationData.type || 'Company',
      type: applicationData.organizationType || applicationData.type || 'Company',
      industry: applicationData.industry || 'General Business / Enterprise',
      registrationNumber: applicationData.registrationNumber || 'REG-PENDING',
      country: applicationData.country || 'India',
      state: applicationData.state || 'Karnataka',
      city: applicationData.city || 'Bengaluru',
      address: applicationData.address || '',
      pinCode: applicationData.pinCode || '',
      contactEmail: applicationData.contactEmail || applicationData.email || '',
      contactPhone: applicationData.contactPhone || applicationData.phone || '',
      website: applicationData.website || '',
      submittedBy: applicationData.submittedBy || applicationData.fullName || 'Applicant Admin',
      submittedByEmail: applicationData.submittedByEmail || applicationData.email || '',
      submittedDate: new Date().toISOString(),
      verification_status: VERIFICATION_STATUS.PENDING,
      reviewer: null,
      reviewedDate: null,
      reviewNotes: '',
      officialCheck: null,
      duplicateRisk: dupCheck.hasDuplicateRisk ? dupCheck : null,
      documents: (applicationData.documents || []).map((d, idx) => ({
        id: d.id || `DOC-UPLOAD-${Date.now()}-${idx}`,
        documentType: d.documentType || d.type || 'STATUTORY_PROOF',
        documentName: d.documentName || d.name || 'Proof_Document.pdf',
        fileSize: d.fileSize || d.size || '1.5 MB',
        uploadedDate: new Date().toISOString(),
        uploadedBy: applicationData.submittedBy || 'Applicant',
        verificationStatus: 'PENDING',
        fileData: d.fileData || null
      })),
      aiAnalysis: aiAnalysisResult,
      verificationHistory: [
        {
          action: 'VERIFICATION_SUBMITTED',
          timestamp: new Date().toISOString(),
          actor: applicationData.submittedBy || 'Applicant Admin',
          notes: `Application filed for ${applicationData.name}. Proof documents attached: ${(applicationData.documents || []).length}.`
        }
      ]
    };

    const nextRequests = [newRequest, ...verificationRequests];
    setVerificationRequests(nextRequests);
    storageService.setItem(keys.VERIFICATION_REQUESTS, nextRequests);

    logAuditEvent({
      action: 'VERIFICATION_SUBMITTED',
      module: 'Organization Verification',
      details: `New verification application registered for "${newRequest.name}" [${newRequest.id}]`,
      status: 'Success'
    });

    return {
      success: true,
      trackingId,
      request: newRequest,
      duplicateRisk: dupCheck
    };
  };

  // Platform Owner starts review -> Status becomes UNDER_REVIEW
  const startVerificationReview = (requestId, reviewerUser) => {
    const nextRequests = verificationRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          verification_status: VERIFICATION_STATUS.UNDER_REVIEW,
          reviewer: reviewerUser?.name || 'Aarav Singhania (Platform Owner)',
          reviewedDate: new Date().toISOString(),
          verificationHistory: [
            ...req.verificationHistory,
            {
              action: 'VERIFICATION_STARTED',
              timestamp: new Date().toISOString(),
              actor: reviewerUser?.name || 'Platform Owner',
              notes: 'Verification dossier opened for review.'
            }
          ]
        };
      }
      return req;
    });

    setVerificationRequests(nextRequests);
    storageService.setItem(keys.VERIFICATION_REQUESTS, nextRequests);

    logAuditEvent({
      action: 'VERIFICATION_STARTED',
      module: 'Organization Verification',
      details: `Review started for verification dossier [${requestId}] by ${reviewerUser?.name || 'Platform Owner'}`,
      status: 'Success'
    });
  };

  // Run Official Registry Check using VerificationProvider
  const runOfficialVerification = async (requestId, reviewerUser) => {
    const target = verificationRequests.find(r => r.id === requestId);
    if (!target) return null;

    const provider = getProviderForOrgType(target.type);
    const checkResult = await provider.verify(target);
    const comparison = compareFields(target, checkResult.officialRecord);

    const mergedCheck = {
      ...checkResult,
      fieldComparison: comparison
    };

    const nextRequests = verificationRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          officialCheck: mergedCheck,
          verificationHistory: [
            ...req.verificationHistory,
            {
              action: 'OFFICIAL_SOURCE_CHECKED',
              timestamp: new Date().toISOString(),
              actor: reviewerUser?.name || 'Platform Owner',
              notes: `Query to ${checkResult.source} completed: ${checkResult.result}`
            }
          ]
        };
      }
      return req;
    });

    setVerificationRequests(nextRequests);
    storageService.setItem(keys.VERIFICATION_REQUESTS, nextRequests);

    logAuditEvent({
      action: 'OFFICIAL_SOURCE_CHECKED',
      module: 'Organization Verification',
      details: `Queried ${checkResult.source} for [${requestId}] — Outcome: ${checkResult.result}`,
      status: 'Success'
    });

    return mergedCheck;
  };

  // Approve Verification -> Activate Organization & Provision Company Admin
  const approveVerificationRequest = (requestId, reviewerUser, approvalNotes = '') => {
    const target = verificationRequests.find(r => r.id === requestId);
    if (!target) return { success: false, message: 'Request not found' };

    // 1. Check if organization exists in organizations store
    let matchedOrg = organizations.find(o => o.name.toLowerCase() === target.name.toLowerCase() || o.id === target.organizationId);

    let companyId = matchedOrg?.companyId || `SMR-CMP-000${organizations.length + 1}`;
    let companyCode = matchedOrg?.companyCode || target.name.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase();
    let adminId = matchedOrg?.adminId || `ADM-${companyCode}-001`;
    let tempPassword = generateTempPassword();
    let salt = generateSalt();
    let passwordHash = hashPasswordSync(tempPassword, salt);

    if (!matchedOrg) {
      // Create new active organization
      const newOrg = {
        id: `org-00${organizations.length + 1}`,
        companyId,
        adminId,
        companyCode,
        verification_status: VERIFICATION_STATUS.VERIFIED,
        status: 'Active',
        name: target.name,
        type: target.type,
        industry: target.industry,
        tagline: `Smart Automation for ${target.name}`,
        currency: 'INR (₹)',
        currencySymbol: '₹',
        terminology: {
          customerTerm: target.type.includes('College') ? 'Students' : (target.type.includes('Clinic') ? 'Patients' : 'Clients'),
          employeeTerm: target.type.includes('College') ? 'Faculty' : 'Staff',
          departmentTerm: 'Departments'
        },
        location: {
          country: target.country || 'India',
          state: target.state || 'Karnataka',
          city: target.city || 'Bengaluru',
          address: target.address || 'Registered Office Address',
          pinCode: target.pinCode || '560001'
        },
        details: {
          gstin: target.registrationNumber,
          operatingModel: 'Hybrid (Onsite + Cloud)'
        },
        subscription: {
          plan: 'Professional',
          status: 'Active',
          mrr: '₹6,999/mo',
          maxUsers: 50,
          billingCycle: 'Annual',
          renewalDate: '2027-04-01'
        },
        enabledModules: [
          'dashboard', 'sales', 'invoices', 'inventory', 'expenses',
          'customers', 'employees', 'departments', 'tasks', 'automation',
          'ai-assistant', 'analytics', 'reports', 'notifications', 'settings'
        ],
        createdDate: new Date().toISOString().split('T')[0],
        adminName: target.submittedBy,
        email: target.contactEmail,
        tempPassword
      };

      // Create Admin User Account
      const newAdminUser = {
        id: adminId,
        adminId,
        name: target.submittedBy,
        email: target.contactEmail,
        phone: target.contactPhone,
        address: target.address,
        organization_id: newOrg.id,
        organization: newOrg.name,
        salt,
        passwordHash,
        tempPassword,
        mustChangePassword: true,
        role: ROLES.COMPANY_ADMIN,
        designation: 'Managing Director & Organization Administrator',
        department: 'Executive Management',
        status: 'Active',
        lastActive: 'Just now',
        joinedDate: new Date().toISOString().split('T')[0],
        permissions: ['company.manage', 'departments.manage', 'staff.manage', 'finance.manage', 'audit.view']
      };

      const nextOrgs = [newOrg, ...organizations];
      setOrganizations(nextOrgs);
      storageService.setItem(keys.ORGANIZATIONS, nextOrgs);

      const nextUsers = [newAdminUser, ...users];
      setUsers(nextUsers);
      storageService.setItem(keys.USERS, nextUsers);
      matchedOrg = newOrg;
    } else {
      // Activate existing organization
      const nextOrgs = organizations.map(o => {
        if (o.id === matchedOrg.id) {
          return {
            ...o,
            verification_status: VERIFICATION_STATUS.VERIFIED,
            status: 'Active'
          };
        }
        return o;
      });
      setOrganizations(nextOrgs);
      storageService.setItem(keys.ORGANIZATIONS, nextOrgs);

      // Activate users of this organization
      const nextUsers = users.map(u => {
        if (u.organization_id === matchedOrg.id) {
          return { ...u, status: 'Active' };
        }
        return u;
      });
      setUsers(nextUsers);
      storageService.setItem(keys.USERS, nextUsers);
    }

    // 2. Update verification request record
    const nextRequests = verificationRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          verification_status: VERIFICATION_STATUS.VERIFIED,
          reviewedDate: new Date().toISOString(),
          reviewer: reviewerUser?.name || 'Aarav Singhania (Platform Owner)',
          reviewNotes: approvalNotes || 'Application officially verified and cleared for tenant activation.',
          verificationHistory: [
            ...req.verificationHistory,
            {
              action: 'VERIFICATION_APPROVED',
              timestamp: new Date().toISOString(),
              actor: reviewerUser?.name || 'Platform Owner',
              notes: approvalNotes || 'Verification approved. Organization status set to VERIFIED.'
            },
            {
              action: 'ORGANIZATION_ACTIVATED',
              timestamp: new Date().toISOString(),
              actor: 'System Automation',
              notes: `Tenant workspace activated for ${target.name}. Admin login enabled.`
            }
          ]
        };
      }
      return req;
    });

    setVerificationRequests(nextRequests);
    storageService.setItem(keys.VERIFICATION_REQUESTS, nextRequests);

    logAuditEvent({
      action: 'VERIFICATION_APPROVED',
      module: 'Organization Verification',
      details: `Approved verification request for "${target.name}" [${requestId}]. Organization and admin account activated.`,
      status: 'Success'
    });

    return {
      success: true,
      trackingId: requestId,
      company: matchedOrg,
      adminId,
      tempPassword
    };
  };

  // Reject Verification Application (Requires mandatory reason)
  const rejectVerificationRequest = (requestId, reviewerUser, rejectionReason) => {
    if (!rejectionReason || !rejectionReason.trim()) {
      return { success: false, message: 'Rejection reason is required.' };
    }

    const nextRequests = verificationRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          verification_status: VERIFICATION_STATUS.REJECTED,
          rejectionReason: rejectionReason.trim(),
          reviewedDate: new Date().toISOString(),
          reviewer: reviewerUser?.name || 'Aarav Singhania (Platform Owner)',
          verificationHistory: [
            ...req.verificationHistory,
            {
              action: 'VERIFICATION_REJECTED',
              timestamp: new Date().toISOString(),
              actor: reviewerUser?.name || 'Platform Owner',
              notes: `Application rejected. Reason: ${rejectionReason.trim()}`
            }
          ]
        };
      }
      return req;
    });

    setVerificationRequests(nextRequests);
    storageService.setItem(keys.VERIFICATION_REQUESTS, nextRequests);

    logAuditEvent({
      action: 'VERIFICATION_REJECTED',
      module: 'Organization Verification',
      details: `Rejected verification request [${requestId}]. Reason: ${rejectionReason}`,
      status: 'Success'
    });

    return { success: true };
  };

  // Request More Information from Applicant
  const requestMoreInformation = (requestId, reviewerUser, notes) => {
    if (!notes || !notes.trim()) {
      return { success: false, message: 'Review notes explaining requested information are required.' };
    }

    const nextRequests = verificationRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          verification_status: VERIFICATION_STATUS.NEEDS_MORE_INFORMATION,
          reviewNotes: notes.trim(),
          reviewedDate: new Date().toISOString(),
          reviewer: reviewerUser?.name || 'Aarav Singhania (Platform Owner)',
          verificationHistory: [
            ...req.verificationHistory,
            {
              action: 'VERIFICATION_MORE_INFO_REQUESTED',
              timestamp: new Date().toISOString(),
              actor: reviewerUser?.name || 'Platform Owner',
              notes: notes.trim()
            }
          ]
        };
      }
      return req;
    });

    setVerificationRequests(nextRequests);
    storageService.setItem(keys.VERIFICATION_REQUESTS, nextRequests);

    logAuditEvent({
      action: 'VERIFICATION_MORE_INFO_REQUESTED',
      module: 'Organization Verification',
      details: `Additional information requested for [${requestId}]: "${notes}"`,
      status: 'Success'
    });

    return { success: true };
  };

  // Resubmit Verification Application (With new documents or updated info, preserving history)
  const resubmitVerification = (requestId, updatedData, newDocuments = []) => {
    const nextRequests = verificationRequests.map(req => {
      if (req.id === requestId) {
        const mergedDocs = [
          ...req.documents,
          ...newDocuments.map((d, i) => ({
            id: d.id || `DOC-RESUB-${Date.now()}-${i}`,
            documentType: d.documentType || d.type || 'SUPPLEMENTAL_PROOF',
            documentName: d.documentName || d.name || 'Supplemental_Document.pdf',
            fileSize: d.fileSize || d.size || '1.8 MB',
            uploadedDate: new Date().toISOString(),
            uploadedBy: updatedData?.submittedBy || req.submittedBy,
            verificationStatus: 'PENDING'
          }))
        ];

        return {
          ...req,
          ...updatedData,
          documents: mergedDocs,
          verification_status: VERIFICATION_STATUS.PENDING,
          verificationHistory: [
            ...req.verificationHistory,
            {
              action: 'VERIFICATION_RESUBMITTED',
              timestamp: new Date().toISOString(),
              actor: updatedData?.submittedBy || req.submittedBy,
              notes: `Applicant resubmitted verification packet with ${newDocuments.length} additional document(s).`
            }
          ]
        };
      }
      return req;
    });

    setVerificationRequests(nextRequests);
    storageService.setItem(keys.VERIFICATION_REQUESTS, nextRequests);

    logAuditEvent({
      action: 'VERIFICATION_RESUBMITTED',
      module: 'Organization Verification',
      details: `Verification request [${requestId}] was resubmitted by applicant with updated documents.`,
      status: 'Success'
    });

    return { success: true };
  };

  // Suspend Organization (Revokes active status and login)
  const suspendOrganization = (orgId, reviewerUser, reason = 'Administrative Suspension') => {
    const nextOrgs = organizations.map(o => {
      if (o.id === orgId || o.companyId === orgId) {
        return {
          ...o,
          verification_status: VERIFICATION_STATUS.SUSPENDED,
          status: 'Inactive'
        };
      }
      return o;
    });
    setOrganizations(nextOrgs);
    storageService.setItem(keys.ORGANIZATIONS, nextOrgs);

    // Deactivate users in that org
    const nextUsers = users.map(u => {
      if (u.organization_id === orgId) {
        return { ...u, status: 'Inactive' };
      }
      return u;
    });
    setUsers(nextUsers);
    storageService.setItem(keys.USERS, nextUsers);

    // Also update matching verification request if present
    const nextRequests = verificationRequests.map(r => {
      if (r.organizationId === orgId || r.name.toLowerCase() === (organizations.find(o => o.id === orgId)?.name || '').toLowerCase()) {
        return {
          ...r,
          verification_status: VERIFICATION_STATUS.SUSPENDED,
          reviewNotes: reason,
          verificationHistory: [
            ...r.verificationHistory,
            {
              action: 'ORGANIZATION_SUSPENDED',
              timestamp: new Date().toISOString(),
              actor: reviewerUser?.name || 'Platform Owner',
              notes: reason
            }
          ]
        };
      }
      return r;
    });
    setVerificationRequests(nextRequests);
    storageService.setItem(keys.VERIFICATION_REQUESTS, nextRequests);

    logAuditEvent({
      action: 'ORGANIZATION_SUSPENDED',
      module: 'Platform Console',
      details: `Organization [${orgId}] suspended by ${reviewerUser?.name || 'Platform Owner'}. Reason: ${reason}`,
      status: 'Warning'
    });
  };

  // Secure Document Retrieval with RBAC enforcement
  const getSecureDocument = (docId, requestingUser) => {
    if (!requestingUser || (requestingUser.role !== ROLES.PLATFORM_OWNER && requestingUser.role !== ROLES.COMPANY_ADMIN)) {
      throw new Error('ACCESS DENIED: Verification documents are confidential and accessible only to Platform Reviewers.');
    }

    let foundDoc = null;
    verificationRequests.forEach(req => {
      const match = (req.documents || []).find(d => d.id === docId);
      if (match) foundDoc = match;
    });

    if (foundDoc) {
      logAuditEvent({
        action: 'DOCUMENT_VIEWED',
        module: 'Organization Verification',
        details: `User ${requestingUser.name} (${requestingUser.role}) viewed verification proof document [${docId}]`,
        status: 'Success'
      });
    }

    return foundDoc;
  };

  // Toggle or switch view mode
  const toggleViewMode = (mode) => {
    const next = mode || (viewMode === 'institution' ? 'business' : 'institution');
    setViewMode(next);
    localStorage.setItem(keys.MODE, next);
  };

  // --- CRUD: USERS ---
  const addUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      lastActive: 'Just now',
      status: 'Active',
      avatar: `https://images.unsplash.com/photo-${1535713875000 + Math.floor(Math.random() * 500)}?w=150`,
      ...userData
    };
    const next = [newUser, ...users];
    setUsers(next);
    storageService.setItem(keys.USERS, next);
    return newUser;
  };

  const updateUser = (id, updatedFields) => {
    const next = users.map(u => (u.id === id ? { ...u, ...updatedFields } : u));
    setUsers(next);
    storageService.setItem(keys.USERS, next);
  };

  const deleteUser = (id) => {
    const next = users.filter(u => u.id !== id);
    setUsers(next);
    storageService.setItem(keys.USERS, next);
  };

  const toggleUserStatus = (id) => {
    const next = users.map(u => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    setUsers(next);
    storageService.setItem(keys.USERS, next);
  };

  // --- CRUD: STUDENTS ---
  const addStudent = (studentData) => {
    const orgId = currentOrganization?.id || 'org-001';
    const dept = studentData.department || studentData.course || 'CS';
    const year = studentData.admissionYear || 2026;
    const studentId = studentData.studentId || generateIntelligentStudentId(studentData.name || 'STUDENT', dept, year, students);

    const tempPassword = generateTempPassword();
    const salt = generateSalt();
    const passwordHash = hashPasswordSync(tempPassword, salt);

    const baseStudent = {
      id: studentId,
      studentId: studentId,
      attendance: 92,
      status: 'Active',
      gpa: studentData.gpa || '8.5',
      semester: studentData.semester || 'Semester 1',
      rollNumber: studentId,
      ...studentData
    };
    const newStudent = attachTenantKeys(baseStudent, currentOrganization);

    // Create student user account for login
    const newStudentUser = attachTenantKeys({
      id: studentId,
      userId: studentId,
      studentId,
      name: studentData.name,
      email: studentData.email || `${studentId.toLowerCase()}@smartora.demo`,
      phone: studentData.phone || '+91 98000 00000',
      salt,
      passwordHash,
      tempPassword,
      mustChangePassword: true,
      role: ROLES.END_USER,
      designation: 'Student Scholar',
      department: studentData.department || 'Computer Science & Engineering',
      status: 'Active',
      lastActive: 'Just now',
      joinedDate: new Date().toISOString().split('T')[0],
      permissions: ['academics.view', 'attendance.view', 'results.view', 'timetable.view']
    }, currentOrganization);

    const next = [newStudent, ...students];
    setStudents(next);
    storageService.setItem(keys.STUDENTS, next);

    const nextUsers = [newStudentUser, ...users];
    setUsers(nextUsers);
    storageService.setItem(keys.USERS, nextUsers);

    // Asynchronously enroll in backend
    apiService.enrollStudent({
      ...newStudent,
      tempPassword
    }).catch(err => {
      console.warn('[DataContext] Backend student sync notice:', err);
    });

    logAuditEvent({
      action: 'STUDENT_ENROLLED',
      module: 'Academic Management',
      details: `Enrolled student "${newStudent.name}" [${studentId}] in ${newStudent.department || newStudent.course}`
    });

    return {
      student: newStudent,
      user: newStudentUser,
      studentId,
      tempPassword
    };
  };

  const updateStudent = (id, updatedFields) => {
    const next = students.map(s => (s.id === id || s.studentId === id ? { ...s, ...updatedFields } : s));
    setStudents(next);
    storageService.setItem(keys.STUDENTS, next);
  };

  const deleteStudent = (id) => {
    const next = students.filter(s => s.id !== id && s.studentId !== id);
    setStudents(next);
    storageService.setItem(keys.STUDENTS, next);
  };

  // --- CRUD: CUSTOMERS ---
  const addCustomer = (custData) => {
    const newCust = {
      id: `CUST-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      orders: 1,
      totalSpent: 0,
      status: 'Regular',
      joinedDate: new Date().toISOString().split('T')[0],
      ...custData
    };
    const next = [newCust, ...customers];
    setCustomers(next);
    storageService.setItem(keys.CUSTOMERS, next);
    return newCust;
  };

  const updateCustomer = (id, updatedFields) => {
    const next = customers.map(c => (c.id === id ? { ...c, ...updatedFields } : c));
    setCustomers(next);
    storageService.setItem(keys.CUSTOMERS, next);
  };

  const deleteCustomer = (id) => {
    const next = customers.filter(c => c.id !== id);
    setCustomers(next);
    storageService.setItem(keys.CUSTOMERS, next);
  };

  // --- CRUD: EMPLOYEES ---
  const addEmployee = (empData) => {
    const newEmp = {
      id: `EMP-${Date.now().toString().slice(-2)}`,
      orgId: currentOrganization?.id || 'org-001',
      attendance: 95,
      tasks: 0,
      performance: 'Good',
      status: 'Active',
      joined: new Date().toISOString().split('T')[0],
      ...empData
    };
    const next = [newEmp, ...employees];
    setEmployees(next);
    storageService.setItem(keys.EMPLOYEES, next);
    return newEmp;
  };

  const updateEmployee = (id, updatedFields) => {
    const next = employees.map(e => (e.id === id ? { ...e, ...updatedFields } : e));
    setEmployees(next);
    storageService.setItem(keys.EMPLOYEES, next);
  };

  const deleteEmployee = async (id, permanent = false) => {
    if (!id) return { success: false, message: 'Missing employee ID' };
    if (id === 'kruthikpranavtr') {
      return { success: false, message: 'Platform Owner cannot be deleted.' };
    }

    try {
      await apiService.deleteEmployee(id, permanent);
    } catch (err) {
      console.warn('[DataContext] Backend employee deletion notice:', err);
    }

    if (permanent) {
      const nextEmps = employees.filter(e => e.id !== id && e.userId !== id && e.staffId !== id && e.employeeId !== id);
      setEmployees(nextEmps);
      storageService.setItem(keys.EMPLOYEES, nextEmps);

      const nextUsers = users.filter(u => u.id !== id && u.userId !== id && u.staffId !== id && u.employeeId !== id);
      setUsers(nextUsers);
      storageService.setItem(keys.USERS, nextUsers);
    } else {
      const nextEmps = employees.map(e => (e.id === id || e.userId === id || e.staffId === id || e.employeeId === id) ? { ...e, status: 'Deactivated' } : e);
      setEmployees(nextEmps);
      storageService.setItem(keys.EMPLOYEES, nextEmps);

      const nextUsers = users.map(u => (u.id === id || u.userId === id || u.staffId === id || u.employeeId === id) ? { ...u, status: 'Deactivated' } : u);
      setUsers(nextUsers);
      storageService.setItem(keys.USERS, nextUsers);
    }

    logAuditEvent({
      action: permanent ? 'EMPLOYEE_DELETED_PERMANENT' : 'EMPLOYEE_DEACTIVATED',
      module: 'Workforce',
      details: `${permanent ? 'Permanently deleted' : 'Deactivated'} account [${id}]`
    });

    return { success: true };
  };

  // --- CRUD: DEPARTMENTS ---
  const addDepartment = (deptData) => {
    const newDept = {
      id: `DEP-${Date.now().toString().slice(-2)}`,
      performance: 90,
      staffCount: 1,
      studentCount: 0,
      ...deptData
    };
    const next = [...departments, newDept];
    setDepartments(next);
    storageService.setItem(keys.DEPARTMENTS, next);
    return newDept;
  };

  const updateDepartment = (id, updatedFields) => {
    const next = departments.map(d => (d.id === id ? { ...d, ...updatedFields } : d));
    setDepartments(next);
    storageService.setItem(keys.DEPARTMENTS, next);
  };

  // --- CRUD: TASKS ---
  const addTask = (taskData) => {
    const newTask = {
      id: `TSK-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      progress: 0,
      status: 'Pending',
      ...taskData
    };
    const next = [newTask, ...tasks];
    setTasks(next);
    storageService.setItem(keys.TASKS, next);
    return newTask;
  };

  const updateTask = (id, updatedFields) => {
    const next = tasks.map(t => (t.id === id ? { ...t, ...updatedFields } : t));
    setTasks(next);
    storageService.setItem(keys.TASKS, next);
  };

  const deleteTask = (id) => {
    const next = tasks.filter(t => t.id !== id);
    setTasks(next);
    storageService.setItem(keys.TASKS, next);
  };

  const toggleTaskStatus = (id) => {
    const next = tasks.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...t, status: newStatus, progress: newStatus === 'Completed' ? 100 : 50 };
      }
      return t;
    });
    setTasks(next);
    storageService.setItem(keys.TASKS, next);
  };

  // --- CRUD: ATTENDANCE ---
  const addAttendanceRecord = (record) => {
    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      ...record
    };
    const next = [newRecord, ...attendance];
    setAttendance(next);
    storageService.setItem(keys.ATTENDANCE, next);
    return newRecord;
  };

  // --- CRUD: PRODUCTS ---
  const addProduct = (prodData) => {
    const stock = Number(prodData.stock) || 0;
    const minStock = Number(prodData.minStock) || 5;
    let status = 'Healthy';
    if (stock === 0) status = 'Out of Stock';
    else if (stock <= minStock) status = 'Low Stock';

    const newProd = {
      id: `PRD-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      status,
      ...prodData,
      stock,
      minStock,
      price: Number(prodData.price) || 0
    };
    const next = [newProd, ...products];
    setProducts(next);
    storageService.setItem(keys.PRODUCTS, next);

    // Auto-Trigger Low Stock Notification if applicable
    if (status === 'Low Stock' || status === 'Out of Stock') {
      const alertNotif = {
        id: `NOTIF-${Date.now().toString().slice(-3)}`,
        orgId: currentOrganization?.id || 'org-001',
        type: 'Inventory Alert',
        title: `Low Stock: ${newProd.name}`,
        message: `${newProd.name} stock level is currently ${newProd.stock} (below minimum buffer ${newProd.minStock}).`,
        time: 'Just now',
        read: false,
        severity: status === 'Out of Stock' ? 'danger' : 'warning',
        targetPage: 'inventory'
      };
      setNotifications(prev => [alertNotif, ...prev]);
    }

    return newProd;
  };

  const updateProduct = (id, updatedFields) => {
    const next = products.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updatedFields };
        const stock = Number(merged.stock);
        const minStock = Number(merged.minStock);
        if (stock === 0) merged.status = 'Out of Stock';
        else if (stock <= minStock) merged.status = 'Low Stock';
        else merged.status = 'Healthy';
        return merged;
      }
      return p;
    });
    setProducts(next);
    storageService.setItem(keys.PRODUCTS, next);
  };

  const deleteProduct = (id) => {
    const next = products.filter(p => p.id !== id);
    setProducts(next);
    storageService.setItem(keys.PRODUCTS, next);
  };

  // --- CRUD: SALES ---
  const addSale = (saleData) => {
    const newSale = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      orgId: currentOrganization?.id || 'org-001',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      ...saleData,
      amount: Number(saleData.amount) || 0
    };
    const next = [newSale, ...sales];
    setSales(next);
    storageService.setItem(keys.SALES, next);

    // If sale amount is >= 15000, trigger High-Value Sale Notification (Simulates Automation Rule RUL-004)
    if (newSale.amount >= 15000) {
      const highValNotif = {
        id: `NOTIF-${Date.now().toString().slice(-3)}`,
        orgId: currentOrganization?.id || 'org-001',
        type: 'Sales Alert',
        title: 'High-Value Sale Recorded',
        message: `Sale #${newSale.id} for ₹${newSale.amount.toLocaleString()} completed by ${newSale.customer}.`,
        time: 'Just now',
        read: false,
        severity: 'success',
        targetPage: 'sales'
      };
      setNotifications(prev => [highValNotif, ...prev]);
    }

    return newSale;
  };

  const updateSaleStatus = (id, status) => {
    const next = sales.map(s => (s.id === id ? { ...s, status } : s));
    setSales(next);
    storageService.setItem(keys.SALES, next);
  };

  // --- CRUD: INVOICES ---
  const addInvoice = (invoiceData) => {
    const subtotal = Number(invoiceData.subtotal) || 0;
    const tax = Number(invoiceData.tax) || Math.round(subtotal * 0.18);
    const total = Number(invoiceData.total) || (subtotal + tax);

    const newInv = {
      id: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
      date: invoiceData.date || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: invoiceData.status || 'Pending',
      paymentMethod: invoiceData.paymentMethod || 'Net Banking / UPI',
      subtotal,
      tax,
      total,
      items: invoiceData.items || [],
      customer: invoiceData.customer || 'Walk-in Customer',
      customerEmail: invoiceData.customerEmail || '',
      customerAddress: invoiceData.customerAddress || '',
      notes: invoiceData.notes || 'Thank you for your business!'
    };

    const next = [newInv, ...invoices];
    setInvoices(next);
    storageService.setItem(keys.INVOICES, next);
    return newInv;
  };

  const updateInvoice = (id, updatedFields) => {
    const next = invoices.map(inv => (inv.id === id ? { ...inv, ...updatedFields } : inv));
    setInvoices(next);
    storageService.setItem(keys.INVOICES, next);
  };

  const updateInvoiceStatus = (id, status) => {
    const next = invoices.map(inv => (inv.id === id ? { ...inv, status } : inv));
    setInvoices(next);
    storageService.setItem(keys.INVOICES, next);
  };

  const deleteInvoice = (id) => {
    const next = invoices.filter(inv => inv.id !== id);
    setInvoices(next);
    storageService.setItem(keys.INVOICES, next);
  };

  // --- CRUD: SUPPLIERS ---
  const addSupplier = (supData) => {
    const newSup = {
      id: `SUP-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      rating: 4.8,
      leadTimeDays: 2,
      pendingAmount: 0,
      paymentStatus: 'Cleared',
      ...supData
    };
    const next = [newSup, ...suppliers];
    setSuppliers(next);
    storageService.setItem(keys.SUPPLIERS, next);
    return newSup;
  };

  const updateSupplier = (id, updatedFields) => {
    const next = suppliers.map(s => (s.id === id ? { ...s, ...updatedFields } : s));
    setSuppliers(next);
    storageService.setItem(keys.SUPPLIERS, next);
  };

  const deleteSupplier = (id) => {
    const next = suppliers.filter(s => s.id !== id);
    setSuppliers(next);
    storageService.setItem(keys.SUPPLIERS, next);
  };

  // --- CRUD: PROJECTS ---
  const addProject = (prjData) => {
    const newPrj = {
      id: `PRJ-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      progress: 0,
      spent: 0,
      status: 'Active',
      team: [],
      ...prjData,
      budget: Number(prjData.budget) || 0
    };
    const next = [newPrj, ...projects];
    setProjects(next);
    storageService.setItem(keys.PROJECTS, next);
    return newPrj;
  };

  const updateProject = (id, updatedFields) => {
    const next = projects.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
    setProjects(next);
    storageService.setItem(keys.PROJECTS, next);
  };

  const deleteProject = (id) => {
    const next = projects.filter(p => p.id !== id);
    setProjects(next);
    storageService.setItem(keys.PROJECTS, next);
  };

  // --- CRUD: APPOINTMENTS ---
  const addAppointment = (aptData) => {
    const newApt = {
      id: `APT-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      status: 'Confirmed',
      ...aptData
    };
    const next = [newApt, ...appointments];
    setAppointments(next);
    storageService.setItem(keys.APPOINTMENTS, next);
    return newApt;
  };

  const updateAppointment = (id, updatedFields) => {
    const next = appointments.map(a => (a.id === id ? { ...a, ...updatedFields } : a));
    setAppointments(next);
    storageService.setItem(keys.APPOINTMENTS, next);
  };

  const cancelAppointment = (id) => {
    const next = appointments.map(a => (a.id === id ? { ...a, status: 'Cancelled' } : a));
    setAppointments(next);
    storageService.setItem(keys.APPOINTMENTS, next);
  };

  // --- CRUD: EXPENSES ---
  const addExpense = (expenseData) => {
    const newExp = {
      id: `EXP-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      paymentRef: `PAY-${Date.now().toString().slice(-4)}`,
      ...expenseData,
      amount: Number(expenseData.amount) || 0
    };
    const next = [newExp, ...expenses];
    setExpenses(next);
    storageService.setItem(keys.EXPENSES, next);
    return newExp;
  };

  const deleteExpense = (id) => {
    const next = expenses.filter(e => e.id !== id);
    setExpenses(next);
    storageService.setItem(keys.EXPENSES, next);
  };

  // --- AUTOMATION RULES ---
  const toggleAutomationRule = (ruleId) => {
    const next = automationRules.map(r =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    );
    setAutomationRules(next);
    storageService.setItem(keys.AUTOMATION_RULES, next);
  };

  const addAutomationRule = (ruleData) => {
    const newRule = {
      id: `RUL-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      enabled: true,
      lastRun: 'Just now',
      executionCount: 1,
      ...ruleData
    };
    const next = [newRule, ...automationRules];
    setAutomationRules(next);
    storageService.setItem(keys.AUTOMATION_RULES, next);
    return newRule;
  };

  const runAutomationRuleManually = (ruleId) => {
    const target = automationRules.find(r => r.id === ruleId);
    if (!target) return;

    // Simulate execution & log alert
    const next = automationRules.map(r =>
      r.id === ruleId ? { ...r, executionCount: r.executionCount + 1, lastRun: 'Just now' } : r
    );
    setAutomationRules(next);
    storageService.setItem(keys.AUTOMATION_RULES, next);

    const runAlert = {
      id: `NOTIF-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      type: 'Automation Alert',
      title: `Automation Executed: ${target.name}`,
      message: `Triggered by user manual execution. Action dispatched: "${target.action}"`,
      time: 'Just now',
      read: false,
      severity: 'info',
      targetPage: 'automation'
    };
    setNotifications(prev => [runAlert, ...prev]);
  };

  // --- NOTIFICATIONS ---
  const markNotificationRead = (id) => {
    const next = notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    setNotifications(next);
    storageService.setItem(keys.NOTIFICATIONS, next);
  };

  const markAllNotificationsRead = () => {
    const next = notifications.map(n => ({ ...n, read: true }));
    setNotifications(next);
    storageService.setItem(keys.NOTIFICATIONS, next);
  };

  const deleteNotification = (id) => {
    const next = notifications.filter(n => n.id !== id);
    setNotifications(next);
    storageService.setItem(keys.NOTIFICATIONS, next);
  };

  // --- SETTINGS ---
  const updateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    storageService.setItem(keys.SETTINGS, merged);
  };

  // --- RESET ALL DATA ---
  const resetDemoData = () => {
    storageService.resetAllData();
    setOrganizations(storageService.getItem(keys.ORGANIZATIONS, INITIAL_ORGANIZATIONS));
    setActiveOrgId('org-001');
    setUsers(storageService.getItem(keys.USERS, []));
    setStudents(storageService.getItem(keys.STUDENTS, []));
    setCustomers(storageService.getItem(keys.CUSTOMERS, []));
    setEmployees(storageService.getItem(keys.EMPLOYEES, []));
    setDepartments(storageService.getItem(keys.DEPARTMENTS, []));
    setTasks(storageService.getItem(keys.TASKS, []));
    setAttendance(storageService.getItem(keys.ATTENDANCE, []));
    setProducts(storageService.getItem(keys.PRODUCTS, []));
    setSales(storageService.getItem(keys.SALES, []));
    setInvoices(storageService.getItem(keys.INVOICES, INITIAL_INVOICES));
    setSuppliers(storageService.getItem(keys.SUPPLIERS, INITIAL_SUPPLIERS));
    setProjects(storageService.getItem(keys.PROJECTS, INITIAL_PROJECTS));
    setAppointments(storageService.getItem(keys.APPOINTMENTS, INITIAL_APPOINTMENTS));
    setExpenses(storageService.getItem(keys.EXPENSES, []));
    setTransactions(storageService.getItem(keys.TRANSACTIONS, INITIAL_TRANSACTIONS));
    setAutomationRules(storageService.getItem(keys.AUTOMATION_RULES, INITIAL_AUTOMATION_RULES));
    setNotifications(storageService.getItem(keys.NOTIFICATIONS, []));
    setVerificationRequests(storageService.getItem(keys.VERIFICATION_REQUESTS, INITIAL_VERIFICATION_REQUESTS));
  };

  // --- DELETE DEPARTMENT ---
  const deleteDepartment = (id) => {
    const dept = departments.find(d => d.id === id);
    const next = departments.filter(d => d.id !== id);
    setDepartments(next);
    storageService.setItem(keys.DEPARTMENTS, next);
    logAuditEvent({
      action: 'DEPARTMENT_DELETED',
      module: 'Departments',
      details: `Deleted department "${dept?.name || id}" from ${currentOrganization?.name}`
    });
  };

  // --- CREATE STAFF / WORKFORCE MEMBER ---
  const createStaff = (staffData) => {
    const orgId = currentOrganization?.id || currentOrganization?.companyId || 'org-001';
    const orgType = currentOrganization?.type || 'COMPANY';

    // Intelligent ID generation based on Name + Department (e.g. ARUN-SALES-001 or PRIYA-HR-001)
    const staffId = staffData.staffId && staffData.staffId.includes('-')
      ? staffData.staffId.trim().toUpperCase()
      : generateIntelligentEmployeeId(staffData.name, staffData.department, employees);

    const tempPassword = staffData.tempPassword || generateTempPassword();
    const salt = generateSalt();
    const passwordHash = hashPasswordSync(tempPassword, salt);

    const newStaffUser = {
      id: staffId,
      userId: staffId,
      staffId: staffId,
      employeeId: staffId,
      organizationId: orgId,
      organization_id: orgId,
      orgId: orgId,
      organizationType: orgType,
      department_id: staffData.department_id || null,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone || '+91 98000 00000',
      address: staffData.address || currentOrganization?.location?.address || 'Bengaluru, India',
      salt,
      passwordHash,
      tempPassword,
      mustChangePassword: true,
      role: staffData.role || ROLES.STAFF,
      designation: staffData.designation || (staffData.role === ROLES.DEPARTMENT_MANAGER ? 'Department Lead' : 'Staff Associate'),
      department: staffData.department || 'Operations',
      status: 'Active',
      lastActive: 'Just now',
      joinedDate: new Date().toISOString().split('T')[0],
      permissions: staffData.permissions || ['tasks.view', 'attendance.view'],
      avatar: staffData.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000000)}?w=150`
    };

    const nextUsers = [newStaffUser, ...users];
    setUsers(nextUsers);
    storageService.setItem(keys.USERS, nextUsers);

    // Also add to employees roster with matching tenant keys
    const newEmp = {
      id: staffId,
      userId: staffId,
      employeeId: staffId,
      orgId: orgId,
      organizationId: orgId,
      organization_id: orgId,
      organizationType: orgType,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone || '+91 98000 00000',
      department: staffData.department || 'Operations',
      role: staffData.role || ROLES.STAFF,
      designation: staffData.designation || (staffData.role === ROLES.DEPARTMENT_MANAGER ? 'Department Lead' : 'Staff Associate'),
      attendance: 98,
      tasks: 0,
      performance: 'Good',
      status: 'Active',
      salary: staffData.salary || '₹40,000/mo',
      joined: new Date().toISOString().split('T')[0]
    };
    const nextEmps = [newEmp, ...employees];
    setEmployees(nextEmps);
    storageService.setItem(keys.EMPLOYEES, nextEmps);

    // Persist permanently to Express/MongoDB backend asynchronously
    apiService.createEmployee({
      employeeId: staffId,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      department: staffData.department,
      role: staffData.role,
      designation: staffData.designation,
      salary: staffData.salary,
      tempPassword,
      organizationId: orgId
    }).catch(err => {
      console.warn('[DataContext] Backend employee sync notice (local backup active):', err);
    });

    logAuditEvent({
      action: 'STAFF_CREATED',
      module: 'Workforce',
      details: `Created staff account for "${newStaffUser.name}" [${staffId}] (${newStaffUser.role}) in ${newStaffUser.department}`
    });

    return {
      user: newStaffUser,
      employee: newEmp,
      tempPassword,
      staffId,
      userId: staffId
    };
  };

  const updateStaff = (staffId, updatedFields) => {
    const nextUsers = users.map(u => (u.id === staffId || u.staffId === staffId ? { ...u, ...updatedFields } : u));
    setUsers(nextUsers);
    storageService.setItem(keys.USERS, nextUsers);

    const nextEmps = employees.map(e => (e.id === staffId ? { ...e, ...updatedFields } : e));
    setEmployees(nextEmps);
    storageService.setItem(keys.EMPLOYEES, nextEmps);

    logAuditEvent({
      action: 'STAFF_UPDATED',
      module: 'Workforce',
      details: `Updated staff details for "${updatedFields.name || staffId}"`
    });
  };

  const toggleStaffStatus = async (staffId) => {
    let newStatus = 'Active';
    const target = users.find(u => u.id === staffId || u.staffId === staffId || u.employeeId === staffId) ||
                   employees.find(e => e.id === staffId || e.staffId === staffId || e.employeeId === staffId);
    if (target) {
      newStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    }

    const nextUsers = users.map(u => {
      if (u.id === staffId || u.staffId === staffId || u.employeeId === staffId) {
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsers(nextUsers);
    storageService.setItem(keys.USERS, nextUsers);

    const nextEmps = employees.map(e => {
      if (e.id === staffId || e.staffId === staffId || e.employeeId === staffId) {
        return { ...e, status: newStatus };
      }
      return e;
    });
    setEmployees(nextEmps);
    storageService.setItem(keys.EMPLOYEES, nextEmps);

    try {
      await apiService.updateEmployeeStatus(staffId, newStatus);
    } catch (err) {
      console.warn('[DataContext] Backend employee status sync notice:', err);
    }

    logAuditEvent({
      action: newStatus === 'Active' ? 'STAFF_ACTIVATED' : 'STAFF_DEACTIVATED',
      module: 'Workforce',
      details: `Staff member [${staffId}] status changed to ${newStatus}`
    });
  };

  const resetStaffPassword = (staffId) => {
    const targetUser = users.find(u => u.id === staffId || u.staffId === staffId);
    if (!targetUser) return null;

    const tempPassword = generateTempPassword();
    const salt = generateSalt();
    const passwordHash = hashPasswordSync(tempPassword, salt);

    const nextUsers = users.map(u => {
      if (u.id === staffId || u.staffId === staffId) {
        return {
          ...u,
          salt,
          passwordHash,
          tempPassword,
          mustChangePassword: true
        };
      }
      return u;
    });
    setUsers(nextUsers);
    storageService.setItem(keys.USERS, nextUsers);

    logAuditEvent({
      action: 'STAFF_PASSWORD_RESET',
      module: 'Workforce',
      details: `Reset password for staff member "${targetUser.name}" [${staffId}]`
    });

    return {
      success: true,
      tempPassword,
      staffId: targetUser.staffId || targetUser.id,
      staffName: targetUser.name
    };
  };

  // --- HOSPITALITY / HOTEL HANDLERS ---
  const updateRoomStatus = (roomId, newStatus, extra = {}) => {
    const next = rooms.map(r => (r.id === roomId || r.roomNumber === roomId ? { ...r, status: newStatus, ...extra } : r));
    setRooms(next);
    storageService.setItem(keys.ROOMS, next);

    // Sync to backend asynchronously
    apiService.updateHotelRoomStatus(roomId, newStatus).catch(err => {
      console.warn('[DataContext] Backend room status sync notice:', err);
    });

    logAuditEvent({
      action: 'ROOM_STATUS_UPDATED',
      module: 'Hospitality Management',
      details: `Room [${roomId}] status changed to ${newStatus}`
    });
  };

  const addRoom = (roomData) => {
    const newRoom = attachTenantKeys({
      id: `RM-${roomData.roomNumber || Date.now().toString().slice(-3)}`,
      status: 'AVAILABLE',
      capacity: 2,
      price: 3500,
      amenities: ['High-Speed Wi-Fi', 'Smart TV'],
      ...roomData
    }, currentOrganization);

    const next = [...rooms, newRoom];
    setRooms(next);
    storageService.setItem(keys.ROOMS, next);
    return newRoom;
  };

  const addReservation = (resvData) => {
    const newResv = attachTenantKeys({
      id: `RESV-${Math.floor(100 + Math.random() * 900)}`,
      status: 'CONFIRMED',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
      ...resvData
    }, currentOrganization);

    const next = [newResv, ...reservations];
    setReservations(next);
    storageService.setItem(keys.RESERVATIONS, next);

    // Update room status to RESERVED if applicable
    if (resvData.roomNumber) {
      updateRoomStatus(resvData.roomNumber, 'RESERVED', { guestName: resvData.guestName, checkIn: resvData.checkIn });
    }

    logAuditEvent({
      action: 'RESERVATION_CREATED',
      module: 'Hospitality Management',
      details: `Reservation created for ${newResv.guestName} in Room ${newResv.roomNumber}`
    });

    return newResv;
  };

  const updateReservationStatus = (resvId, status) => {
    const next = reservations.map(r => (r.id === resvId ? { ...r, status } : r));
    setReservations(next);
    storageService.setItem(keys.RESERVATIONS, next);
  };

  const updateHousekeepingTask = (hkId, status, assignedStaff = null) => {
    const next = housekeeping.map(h => (h.id === hkId ? { ...h, state: status, ...(assignedStaff ? { assignedStaff } : {}) } : h));
    setHousekeeping(next);
    storageService.setItem(keys.HOUSEKEEPING, next);
  };

  // --- ACADEMIC / COLLEGE HANDLERS ---
  const addCourse = (courseData) => {
    const newCourse = attachTenantKeys({
      id: `CRS-${Date.now().toString().slice(-3)}`,
      courseId: `CRS-${Date.now().toString().slice(-3)}`,
      status: 'Active',
      ...courseData
    }, currentOrganization);

    const next = [...courses, newCourse];
    setCourses(next);
    storageService.setItem(keys.COURSES, next);
    return newCourse;
  };

  const addSubject = (subjectData) => {
    const newSub = attachTenantKeys({
      id: `SUB-${Date.now().toString().slice(-3)}`,
      ...subjectData
    }, currentOrganization);

    const next = [...subjects, newSub];
    setSubjects(next);
    storageService.setItem(keys.SUBJECTS, next);
    return newSub;
  };

  const addExam = (examData) => {
    const newExam = attachTenantKeys({
      id: `EXM-${Date.now().toString().slice(-3)}`,
      examId: `EXM-${Date.now().toString().slice(-3)}`,
      type: 'Internal',
      maxMarks: 100,
      ...examData
    }, currentOrganization);

    const next = [...exams, newExam];
    setExams(next);
    storageService.setItem(keys.EXAMS, next);
    return newExam;
  };

  const addExamResult = (resData) => {
    const newRes = attachTenantKeys({
      id: `RES-${Date.now().toString().slice(-3)}`,
      resultId: `RES-${Date.now().toString().slice(-3)}`,
      status: Number(resData.marks) >= 40 ? 'Passed' : 'Failed',
      ...resData
    }, currentOrganization);

    const next = [newRes, ...examResults];
    setExamResults(next);
    storageService.setItem(keys.EXAM_RESULTS, next);
    return newRes;
  };

  // --- FINANCIAL TRANSACTIONS & P&L ACTIONS ---
  const addTransaction = async (txnData) => {
    const orgId = currentOrganization?.companyId || currentOrganization?.id || 'org-001';
    const orgType = currentOrganization?.type || 'COMPANY';
    const txnId = `TXN-${Date.now().toString().slice(-4)}`;
    const newTxn = {
      transactionId: txnId,
      id: txnId,
      organizationId: orgId,
      orgId: currentOrganization?.id || 'org-001',
      organizationType: orgType,
      transactionType: txnData.transactionType || 'EXPENSE',
      amount: Number(txnData.amount) || 0,
      category: txnData.category || 'General',
      subcategory: txnData.subcategory || '',
      transactionDate: txnData.transactionDate || new Date().toISOString().split('T')[0],
      department: txnData.department || 'General / Corporate',
      description: txnData.description || 'Financial transaction',
      paymentMethod: txnData.paymentMethod || 'Bank Transfer',
      referenceNumber: txnData.referenceNumber || '',
      notes: txnData.notes || '',
      status: 'COMPLETED',
      createdBy: currentOrganization?.adminId || 'ADM-001',
      createdAt: new Date().toISOString()
    };

    const next = [newTxn, ...transactions];
    setTransactions(next);
    storageService.setItem(keys.TRANSACTIONS, next);

    try {
      await apiService.createTransaction(newTxn);
    } catch (err) {
      console.warn('[DataContext] Backend transaction sync notice:', err);
    }

    logAuditEvent({
      action: 'TRANSACTION_RECORDED',
      module: 'Finance',
      details: `Recorded ${newTxn.transactionType} of ₹${newTxn.amount.toLocaleString()} [${newTxn.category}] in ${newTxn.department}`
    });

    return newTxn;
  };

  const updateTransactionStatus = async (transactionId, status, notes = '') => {
    const next = transactions.map(t => {
      if (t.transactionId === transactionId || t.id === transactionId) {
        return {
          ...t,
          status,
          notes: notes ? (t.notes ? `${t.notes} | ${notes}` : notes) : t.notes
        };
      }
      return t;
    });
    setTransactions(next);
    storageService.setItem(keys.TRANSACTIONS, next);

    try {
      await apiService.updateTransactionStatus(transactionId, status, notes);
    } catch (err) {
      console.warn('[DataContext] Backend transaction status update notice:', err);
    }

    logAuditEvent({
      action: `TRANSACTION_${status}`,
      module: 'Finance',
      details: `Transaction [${transactionId}] status updated to ${status}`
    });
  };

  // Sync live backend transactions on mount and tenant change
  useEffect(() => {
    const fetchBackendTransactions = async () => {
      try {
        const res = await apiService.getTransactions();
        if (res && res.success && Array.isArray(res.transactions) && res.transactions.length > 0) {
          setTransactions(prev => {
            const existingIds = new Set(prev.map(t => t.transactionId || t.id));
            const merged = [...prev];
            res.transactions.forEach(t => {
              if (!existingIds.has(t.transactionId)) {
                merged.push(t);
              }
            });
            storageService.setItem(keys.TRANSACTIONS, merged);
            return merged;
          });
        }
      } catch (e) {
        // Local state fallback
      }
    };
    fetchBackendTransactions();
  }, [currentOrganization]);

  // --- KNOWLEDGE BASE (RAG) METHODS ---
  const addKnowledgeDoc = (docData) => {
    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      organization_id: currentOrganization?.id || 'org-001',
      title: docData.title,
      filename: docData.filename || `${docData.title.replace(/\s+/g, '_')}.pdf`,
      category: docData.category || 'General',
      department_id: docData.department_id || null,
      permissions: docData.permissions || 'All Employees',
      uploadedBy: docData.uploadedBy || 'Company Admin',
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: docData.fileSize || `${Math.floor(200 + Math.random() * 500)} KB`,
      chunksCount: 0,
      status: 'Indexing...',
      content: docData.content || ''
    };

    // Index into vector store via RAG service
    const chunks = ragService.indexDocument(newDoc);
    newDoc.chunksCount = chunks.length;
    newDoc.status = 'Indexed';

    const nextDocs = [newDoc, ...knowledgeDocs];
    setKnowledgeDocs(nextDocs);
    storageService.setItem(keys.KNOWLEDGE_BASE_DOCS, nextDocs);

    logAuditEvent({
      action: 'KNOWLEDGE_DOC_UPLOADED',
      module: 'Knowledge Base (RAG)',
      details: `Uploaded & vectorized "${newDoc.title}" (${newDoc.chunksCount} chunks) for ${currentOrganization?.name}`
    });

    return newDoc;
  };

  const deleteKnowledgeDoc = (docId) => {
    const doc = knowledgeDocs.find(d => d.id === docId);
    const nextDocs = knowledgeDocs.filter(d => d.id !== docId);
    setKnowledgeDocs(nextDocs);
    storageService.setItem(keys.KNOWLEDGE_BASE_DOCS, nextDocs);

    logAuditEvent({
      action: 'KNOWLEDGE_DOC_DELETED',
      module: 'Knowledge Base (RAG)',
      details: `Removed document "${doc?.title || docId}" from knowledge base`
    });
  };

  // --- AGENTIC AI APPROVAL ACTIONS ---
  const approveAgentAction = (approvalId) => {
    const target = pendingApprovals.find(a => a.id === approvalId);
    if (!target) return;

    const nextApprovals = pendingApprovals.map(a =>
      a.id === approvalId ? { ...a, status: 'Approved', approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : a
    );
    setPendingApprovals(nextApprovals);
    storageService.setItem(keys.PENDING_APPROVALS, nextApprovals);

    if (target.runId) {
      const nextRuns = agentRuns.map(r =>
        r.id === target.runId ? { ...r, approvalStatus: 'Approved', status: 'Completed' } : r
      );
      setAgentRuns(nextRuns);
      storageService.setItem(keys.AGENT_RUNS, nextRuns);
    }

    logAuditEvent({
      action: 'AGENT_ACTION_APPROVED',
      module: 'Agentic AI',
      details: `Executive approved high-risk proposal: ${target.title}`
    });

    const approvalNotif = {
      id: `NOTIF-${Date.now().toString().slice(-3)}`,
      orgId: currentOrganization?.id || 'org-001',
      type: 'Agent Approval',
      title: 'Action Approved & Executed',
      message: `Proposal "${target.title}" authorized and committed.`,
      time: 'Just now',
      read: false,
      severity: 'success'
    };
    setNotifications(prev => [approvalNotif, ...prev]);
  };

  const rejectAgentAction = (approvalId, reason = 'Rejected by executive') => {
    const target = pendingApprovals.find(a => a.id === approvalId);
    if (!target) return;

    const nextApprovals = pendingApprovals.map(a =>
      a.id === approvalId ? { ...a, status: 'Rejected', rejectionReason: reason } : a
    );
    setPendingApprovals(nextApprovals);
    storageService.setItem(keys.PENDING_APPROVALS, nextApprovals);

    if (target.runId) {
      const nextRuns = agentRuns.map(r =>
        r.id === target.runId ? { ...r, approvalStatus: 'Rejected', status: 'Canceled' } : r
      );
      setAgentRuns(nextRuns);
      storageService.setItem(keys.AGENT_RUNS, nextRuns);
    }

    logAuditEvent({
      action: 'AGENT_ACTION_REJECTED',
      module: 'Agentic AI',
      details: `Executive rejected proposal: ${target.title} (Reason: ${reason})`
    });
  };

  // --- STRICT MULTI-TENANT ISOLATION (ZERO CROSS-TENANT DATA LEAKAGE) ---
  const tenantSales = useMemo(() => {
    return sales.filter(s => matchesTenant(s, currentOrganization));
  }, [sales, currentOrganization]);

  const tenantInvoices = useMemo(() => {
    return invoices.filter(inv => matchesTenant(inv, currentOrganization));
  }, [invoices, currentOrganization]);

  const tenantCustomers = useMemo(() => {
    return customers.filter(c => matchesTenant(c, currentOrganization));
  }, [customers, currentOrganization]);

  const tenantEmployees = useMemo(() => {
    return employees.filter(e => matchesTenant(e, currentOrganization));
  }, [employees, currentOrganization]);

  const tenantDepartments = useMemo(() => {
    return departments.filter(d => matchesTenant(d, currentOrganization));
  }, [departments, currentOrganization]);

  const tenantTasks = useMemo(() => {
    return tasks.filter(t => matchesTenant(t, currentOrganization));
  }, [tasks, currentOrganization]);

  const tenantProjects = useMemo(() => {
    return projects.filter(p => matchesTenant(p, currentOrganization));
  }, [projects, currentOrganization]);

  const tenantAppointments = useMemo(() => {
    return appointments.filter(a => matchesTenant(a, currentOrganization));
  }, [appointments, currentOrganization]);

  const tenantSuppliers = useMemo(() => {
    return suppliers.filter(s => matchesTenant(s, currentOrganization));
  }, [suppliers, currentOrganization]);

  const tenantProducts = useMemo(() => {
    return products.filter(p => matchesTenant(p, currentOrganization));
  }, [products, currentOrganization]);

  const tenantExpenses = useMemo(() => {
    const list = Array.isArray(expenses) ? expenses : [];
    return list.filter(e => matchesTenant(e, currentOrganization));
  }, [expenses, currentOrganization]);

  const tenantTransactions = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : [];
    return list.filter(t => matchesTenant(t, currentOrganization));
  }, [transactions, currentOrganization]);

  const tenantAuditLogs = useMemo(() => {
    return auditLogs.filter(a => a.organization_id === 'system' || matchesTenant(a, currentOrganization));
  }, [auditLogs, currentOrganization]);

  const tenantKnowledgeDocs = useMemo(() => {
    return knowledgeDocs.filter(d => matchesTenant(d, currentOrganization));
  }, [knowledgeDocs, currentOrganization]);

  const tenantAgentRuns = useMemo(() => {
    return agentRuns.filter(r => matchesTenant(r, currentOrganization));
  }, [agentRuns, currentOrganization]);

  const tenantPendingApprovals = useMemo(() => {
    return pendingApprovals.filter(a => matchesTenant(a, currentOrganization));
  }, [pendingApprovals, currentOrganization]);

  const tenantUsers = useMemo(() => {
    return users.filter(u => matchesTenant(u, currentOrganization));
  }, [users, currentOrganization]);

  const tenantStudents = useMemo(() => {
    return students.filter(s => matchesTenant(s, currentOrganization));
  }, [students, currentOrganization]);

  const tenantCourses = useMemo(() => {
    return courses.filter(c => matchesTenant(c, currentOrganization));
  }, [courses, currentOrganization]);

  const tenantSubjects = useMemo(() => {
    return subjects.filter(s => matchesTenant(s, currentOrganization));
  }, [subjects, currentOrganization]);

  const tenantExams = useMemo(() => {
    return exams.filter(e => matchesTenant(e, currentOrganization));
  }, [exams, currentOrganization]);

  const tenantExamResults = useMemo(() => {
    return examResults.filter(r => matchesTenant(r, currentOrganization));
  }, [examResults, currentOrganization]);

  const tenantNotices = useMemo(() => {
    return notices.filter(n => matchesTenant(n, currentOrganization));
  }, [notices, currentOrganization]);

  const tenantRooms = useMemo(() => {
    return rooms.filter(r => matchesTenant(r, currentOrganization));
  }, [rooms, currentOrganization]);

  const tenantReservations = useMemo(() => {
    return reservations.filter(r => matchesTenant(r, currentOrganization));
  }, [reservations, currentOrganization]);

  const tenantGuests = useMemo(() => {
    return guests.filter(g => matchesTenant(g, currentOrganization));
  }, [guests, currentOrganization]);

  const tenantHousekeeping = useMemo(() => {
    return housekeeping.filter(h => matchesTenant(h, currentOrganization));
  }, [housekeeping, currentOrganization]);

  // --- DYNAMIC LIVE ACCOUNT COUNTS CALCULATOR ---
  const getOrganizationAccountSummary = (orgId) => {
    const targetOrgId = orgId || currentOrganization?.id;
    const org = organizations.find(o => o.id === targetOrgId || o.companyId === targetOrgId);
    const orgKey = org?.id || targetOrgId;

    const orgUsers = users.filter(u => u.organization_id === orgKey);
    const orgDepts = departments.filter(d => d.organization_id === orgKey || d.orgId === orgKey);
    const orgEmps = employees.filter(e => e.orgId === orgKey || e.organization_id === orgKey);

    const activeUsers = orgUsers.filter(u => u.status === 'Active');
    const activeAdmins = activeUsers.filter(u => u.role === ROLES.COMPANY_ADMIN);
    const activeManagers = activeUsers.filter(u => u.role === ROLES.DEPARTMENT_MANAGER);
    const activeStaff = activeUsers.filter(u => u.role === ROLES.STAFF);
    const activeEndUsers = activeUsers.filter(u => u.role === ROLES.END_USER);

    // If org has adminId or adminName, ensure admin count is at least 1
    const adminCount = activeAdmins.length > 0 ? activeAdmins.length : 1;
    const managerCount = activeManagers.length;
    const staffCount = activeStaff.length > 0 ? activeStaff.length : orgEmps.filter(e => e.status === 'Active').length;
    const endUserCount = activeEndUsers.length;
    const totalCount = adminCount + managerCount + staffCount + endUserCount;

    return {
      company_admin_count: adminCount,
      department_manager_count: managerCount,
      staff_count: staffCount,
      employee_count: orgEmps.filter(e => e.status === 'Active').length || staffCount,
      end_user_count: endUserCount,
      total_user_count: totalCount,
      department_count: orgDepts.length,
      // References
      adminUser: orgUsers.find(u => u.role === ROLES.COMPANY_ADMIN) || {
        name: org?.adminName || `${org?.name} Admin`,
        email: org?.email || 'admin@smartora.demo',
        adminId: org?.adminId || 'ADM-001'
      },
      admins: orgUsers.filter(u => u.role === ROLES.COMPANY_ADMIN),
      managers: orgUsers.filter(u => u.role === ROLES.DEPARTMENT_MANAGER),
      staff: orgUsers.filter(u => u.role === ROLES.STAFF),
      endUsers: orgUsers.filter(u => u.role === ROLES.END_USER),
      departments: orgDepts,
      employees: orgEmps
    };
  };

  // --- COMPUTED VERIFICATION STATS ---
  const verificationStats = useMemo(() => {
    const list = verificationRequests || [];
    const pendingCount = list.filter(r => r.verification_status === VERIFICATION_STATUS.PENDING).length;
    const underReviewCount = list.filter(r => r.verification_status === VERIFICATION_STATUS.UNDER_REVIEW).length;
    const verifiedCount = list.filter(r => r.verification_status === VERIFICATION_STATUS.VERIFIED).length;
    const rejectedCount = list.filter(r => r.verification_status === VERIFICATION_STATUS.REJECTED).length;
    const needsInfoCount = list.filter(r => r.verification_status === VERIFICATION_STATUS.NEEDS_MORE_INFORMATION).length;
    const suspendedCount = list.filter(r => r.verification_status === VERIFICATION_STATUS.SUSPENDED).length;

    return {
      pendingCount,
      underReviewCount,
      verifiedCount,
      rejectedCount,
      needsInfoCount,
      suspendedCount,
      totalCount: list.length,
      recentSubmissions: list.slice(0, 5),
      avgProcessingTimeHours: '3.6 hrs'
    };
  }, [verificationRequests]);

  // --- COMPUTED AGGREGATE METRICS ---
  const stats = useMemo(() => {
    const activeUsersCount = tenantUsers.filter(u => u.status === 'Active').length;
    const pendingTasksCount = tenantTasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
    const overdueTasksCount = tenantTasks.filter(t => t.status === 'Overdue').length;
    const completedTasksCount = tenantTasks.filter(t => t.status === 'Completed').length;

    const totalSalesRevenue = tenantSales.reduce((acc, s) => acc + (s.status === 'Completed' ? s.amount : 0), 0);
    const totalInvoicesRevenue = tenantInvoices.reduce((acc, inv) => acc + (inv.status === 'Paid' ? inv.total : 0), 0);
    const pendingInvoicesTotal = tenantInvoices.reduce((acc, inv) => acc + (inv.status === 'Pending' || inv.status === 'Overdue' ? inv.total : 0), 0);
    const totalRevenue = totalSalesRevenue > 0 ? totalSalesRevenue : totalInvoicesRevenue;

    const totalExpenses = tenantExpenses.reduce((acc, e) => acc + e.amount, 0);

    const lowStockCount = tenantProducts.filter(p => p.status === 'Low Stock').length;
    const outOfStockCount = tenantProducts.filter(p => p.status === 'Out of Stock').length;
    const inventoryValuation = tenantProducts.reduce((acc, p) => acc + p.price * p.stock, 0);

    const unreadAlertsCount = notifications.filter(n => !n.read).length;

    const activeProjectsCount = tenantProjects.filter(p => p.status === 'Active' || p.status === 'In Progress').length;
    const upcomingAppointmentsCount = tenantAppointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length;
    const activeRulesCount = automationRules.filter(r => r.enabled).length;

    return {
      totalUsers: activeUsersCount || tenantUsers.length,
      actualUsersCount: tenantUsers.length,
      activeUsers: activeUsersCount,
      activeUsersLive: activeUsersCount,
      pendingTasks: pendingTasksCount,
      pendingTasksLive: pendingTasksCount,
      overdueTasksLive: overdueTasksCount,
      completedTasksLive: completedTasksCount,
      revenue: totalRevenue,
      revenueLive: totalRevenue,
      pendingInvoicesTotal,
      expenses: totalExpenses,
      expensesLive: totalExpenses,
      alerts: unreadAlertsCount,
      unreadAlertsLive: unreadAlertsCount,
      overallAttendance: 94,
      presentAttendance: 96,
      absentAttendance: 4,
      belowThresholdCount: 1,
      totalProducts: tenantProducts.length,
      lowStockCount,
      outOfStockCount,
      inventoryValuation,
      totalCustomers: tenantCustomers.length,
      totalSuppliers: tenantSuppliers.length,
      totalDepartments: tenantDepartments.length,
      activeProjectsCount,
      upcomingAppointmentsCount,
      activeRulesCount,
      currencySymbol: currentOrganization?.currencySymbol || '₹'
    };
  }, [tenantUsers, tenantTasks, tenantSales, tenantInvoices, tenantExpenses, tenantProducts, notifications, tenantProjects, tenantAppointments, automationRules, currentOrganization, tenantCustomers, tenantSuppliers, tenantDepartments]);

  return (
    <DataContext.Provider
      value={{
        // Multi-Tenant Org
        organizations,
        allOrganizations: organizations,
        currentOrganization,
        activeOrgId,
        switchOrganization,
        createOrganization,

        // Platform Owner Operations
        createCompany,
        updateCompany,
        toggleCompanyStatus,
        resetCompanyAdminPassword,
        getOrganizationAccountSummary,
        logAuditEvent,
        auditLogs: tenantAuditLogs,
        allAuditLogs: auditLogs,
        subscriptions,
        platformStats,

        // Organization Verification System
        verificationRequests,
        verificationStats,
        submitVerificationRequest,
        startVerificationReview,
        runOfficialVerification,
        approveVerificationRequest,
        rejectVerificationRequest,
        requestMoreInformation,
        resubmitVerification,
        suspendOrganization,
        getSecureDocument,

        // Tenant-Scoped Entities
        users: tenantUsers,
        allUsers: users,
        students: tenantStudents,
        allStudents: students,
        courses: tenantCourses,
        allCourses: courses,
        subjects: tenantSubjects,
        allSubjects: subjects,
        exams: tenantExams,
        allExams: exams,
        examResults: tenantExamResults,
        allExamResults: examResults,
        notices: tenantNotices,
        allNotices: notices,
        rooms: tenantRooms,
        allRooms: rooms,
        reservations: tenantReservations,
        allReservations: reservations,
        guests: tenantGuests,
        allGuests: guests,
        housekeeping: tenantHousekeeping,
        allHousekeeping: housekeeping,
        customers: tenantCustomers,
        allCustomers: customers,
        employees: tenantEmployees,
        allEmployees: employees,
        departments: tenantDepartments,
        allDepartments: departments,
        tasks: tenantTasks,
        allTasks: tasks,
        attendance,
        products: tenantProducts,
        allProducts: products,
        sales: tenantSales,
        allSales: sales,
        invoices: tenantInvoices,
        allInvoices: invoices,
        suppliers: tenantSuppliers,
        allSuppliers: suppliers,
        projects: tenantProjects,
        allProjects: projects,
        appointments: tenantAppointments,
        allAppointments: appointments,
        expenses: tenantExpenses,
        allExpenses: expenses,
        transactions: tenantTransactions,
        allTransactions: transactions,
        automationRules,
        notifications,
        settings,
        stats,
        viewMode,
        toggleViewMode,

        // Knowledge Base (RAG) & Agentic AI
        knowledgeDocs: tenantKnowledgeDocs,
        allKnowledgeDocs: knowledgeDocs,
        agentRuns: tenantAgentRuns,
        allAgentRuns: agentRuns,
        pendingApprovals: tenantPendingApprovals,
        allPendingApprovals: pendingApprovals,
        addKnowledgeDoc,
        deleteKnowledgeDoc,
        approveAgentAction,
        rejectAgentAction,

        // CRUD
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        createStaff,
        updateStaff,
        toggleStaffStatus,
        resetStaffPassword,
        addStudent,
        updateStudent,
        deleteStudent,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        addAttendanceRecord,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        updateSaleStatus,
        addInvoice,
        updateInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addProject,
        updateProject,
        deleteProject,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        addExpense,
        deleteExpense,
        addTransaction,
        updateTransactionStatus,
        toggleAutomationRule,
        addAutomationRule,
        runAutomationRuleManually,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        updateSettings,
        resetDemoData,

        // Hospitality & Academic Actions
        updateRoomStatus,
        addRoom,
        addReservation,
        updateReservationStatus,
        updateHousekeepingTask,
        addCourse,
        addSubject,
        addExam,
        addExamResult
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}
