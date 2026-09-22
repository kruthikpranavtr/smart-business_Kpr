// Storage Service for SMARTORA
// Handles localStorage persistence, automatic seeding, and multi-tenant store reset

import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_CUSTOMERS,
  INITIAL_EMPLOYEES,
  INITIAL_DEPARTMENTS,
  INITIAL_TASKS,
  INITIAL_ATTENDANCE_LOGS,
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_INVOICES,
  INITIAL_SUPPLIERS,
  INITIAL_PROJECTS,
  INITIAL_APPOINTMENTS,
  INITIAL_EXPENSES,
  INITIAL_AUTOMATION_RULES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PLATFORM_STATS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_AGENT_RUNS,
  INITIAL_PENDING_APPROVALS,
  INITIAL_VERIFICATION_REQUESTS,
  INITIAL_TRANSACTIONS
} from '../data/mockData';

const STORAGE_KEYS = {
  ORGANIZATIONS: 'smartora_organizations',
  ACTIVE_ORG_ID: 'smartora_active_org_id',
  VERIFICATION_REQUESTS: 'smartora_verification_requests',
  TRANSACTIONS: 'smartora_financial_transactions',
  USERS: 'smartora_users',
  STUDENTS: 'smartora_students',
  CUSTOMERS: 'smartora_customers',
  EMPLOYEES: 'smartora_employees',
  DEPARTMENTS: 'smartora_departments',
  TASKS: 'smartora_tasks',
  ATTENDANCE: 'smartora_attendance',
  PRODUCTS: 'smartora_products',
  SALES: 'smartora_sales',
  INVOICES: 'smartora_invoices',
  SUPPLIERS: 'smartora_suppliers',
  PROJECTS: 'smartora_projects',
  APPOINTMENTS: 'smartora_appointments',
  EXPENSES: 'smartora_expenses',
  AUTOMATION_RULES: 'smartora_automation_rules',
  NOTIFICATIONS: 'smartora_notifications',
  AUDIT_LOGS: 'smartora_audit_logs',
  SUBSCRIPTIONS: 'smartora_subscriptions',
  PLATFORM_STATS: 'smartora_platform_stats',
  KNOWLEDGE_BASE_DOCS: 'smartora_knowledge_base_docs',
  AGENT_RUNS: 'smartora_agent_runs',
  PENDING_APPROVALS: 'smartora_pending_approvals',
  SETTINGS: 'smartora_settings',
  AUTH: 'smartora_auth',
  MODE: 'smartora_view_mode', // 'institution' | 'business'
  COURSES: 'smartora_academic_courses',
  SUBJECTS: 'smartora_academic_subjects',
  EXAMS: 'smartora_academic_exams',
  EXAM_RESULTS: 'smartora_academic_results',
  NOTICES: 'smartora_academic_notices',
  ROOMS: 'smartora_hotel_rooms',
  RESERVATIONS: 'smartora_hotel_reservations',
  GUESTS: 'smartora_hotel_guests',
  HOUSEKEEPING: 'smartora_hotel_housekeeping'
};

export const storageService = {
  getKeys: () => STORAGE_KEYS,

  getItem: (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return fallback;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage`, e);
    }
  },

  // Initialize seed data if not already present or if new tenant data is needed
  initializeData: () => {
    // Check organizations
    if (!localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS)) {
      storageService.setItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_ORG_ID)) {
      storageService.setItem(STORAGE_KEYS.ACTIVE_ORG_ID, 'org-001'); // Default to ABC Retail Store
    }

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      storageService.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      storageService.setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      storageService.setItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      storageService.setItem(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
      storageService.setItem(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      storageService.setItem(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      storageService.setItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      storageService.setItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
      storageService.setItem(STORAGE_KEYS.SALES, INITIAL_SALES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      storageService.setItem(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
      storageService.setItem(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      storageService.setItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      storageService.setItem(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      storageService.setItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      storageService.setItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUTOMATION_RULES)) {
      storageService.setItem(STORAGE_KEYS.AUTOMATION_RULES, INITIAL_AUTOMATION_RULES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      storageService.setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
      storageService.setItem(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLATFORM_STATS)) {
      storageService.setItem(STORAGE_KEYS.PLATFORM_STATS, INITIAL_PLATFORM_STATS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASE_DOCS)) {
      storageService.setItem(STORAGE_KEYS.KNOWLEDGE_BASE_DOCS, INITIAL_KNOWLEDGE_DOCS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AGENT_RUNS)) {
      storageService.setItem(STORAGE_KEYS.AGENT_RUNS, INITIAL_AGENT_RUNS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PENDING_APPROVALS)) {
      storageService.setItem(STORAGE_KEYS.PENDING_APPROVALS, INITIAL_PENDING_APPROVALS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VERIFICATION_REQUESTS)) {
      storageService.setItem(STORAGE_KEYS.VERIFICATION_REQUESTS, INITIAL_VERIFICATION_REQUESTS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      storageService.setItem(STORAGE_KEYS.SETTINGS, {
        orgName: 'SMARTORA Tech Solutions',
        orgType: 'Company / Startup',
        timezone: 'Asia/Kolkata (IST)',
        currency: 'INR (₹)',
        currencySymbol: '₹',
        attendanceThreshold: 75,
        notifications: {
          email: true,
          taskAlerts: true,
          inventoryAlerts: true,
          attendanceAlerts: true,
          invoiceAlerts: true
        },
        security: {
          twoFactor: false,
          sessionTimeout: '60 minutes'
        },
        ai: {
          autoInsights: true,
          model: 'SMARTORA Heuristic Neural v2.5 (Fast Local)',
          confidenceThreshold: 85
        }
      });
    }
  },

  // Reset demo data back to default initial state
  resetAllData: () => {
    storageService.setItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    storageService.setItem(STORAGE_KEYS.ACTIVE_ORG_ID, 'org-001');
    storageService.setItem(STORAGE_KEYS.VERIFICATION_REQUESTS, INITIAL_VERIFICATION_REQUESTS);
    storageService.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    storageService.setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    storageService.setItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    storageService.setItem(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    storageService.setItem(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    storageService.setItem(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    storageService.setItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE_LOGS);
    storageService.setItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    storageService.setItem(STORAGE_KEYS.SALES, INITIAL_SALES);
    storageService.setItem(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    storageService.setItem(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    storageService.setItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    storageService.setItem(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    storageService.setItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    storageService.setItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    storageService.setItem(STORAGE_KEYS.AUTOMATION_RULES, INITIAL_AUTOMATION_RULES);
    storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    storageService.setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    storageService.setItem(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    storageService.setItem(STORAGE_KEYS.PLATFORM_STATS, INITIAL_PLATFORM_STATS);
    storageService.setItem(STORAGE_KEYS.KNOWLEDGE_BASE_DOCS, INITIAL_KNOWLEDGE_DOCS);
    storageService.setItem(STORAGE_KEYS.AGENT_RUNS, INITIAL_AGENT_RUNS);
    storageService.setItem(STORAGE_KEYS.PENDING_APPROVALS, INITIAL_PENDING_APPROVALS);
  }
};
