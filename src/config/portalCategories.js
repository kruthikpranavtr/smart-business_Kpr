// Centralized Portal Category Configuration for SMARTORA
// Drives Role Hierarchy, Navigation, Module Whitelisting, Terminology, Dashboard Widgets,
// Account Creation Rules, and Permissions across all Organization Categories

export const CATEGORY_TYPES = {
  COMPANY: 'COMPANY',
  COLLEGE: 'COLLEGE',
  HOTEL: 'HOTEL',
  RESTAURANT: 'RESTAURANT',
  CLINIC: 'CLINIC',
  CUSTOM: 'CUSTOM'
};

export const CATEGORY_CONFIG = {
  COMPANY: {
    portalName: 'Enterprise Business Portal',
    portalType: 'company',
    categoryKey: 'COMPANY',
    roles: [
      { key: 'COMPANY_ADMIN', label: 'Company Admin', tier: 'ORG_ADMIN' },
      { key: 'DEPARTMENT_MANAGER', label: 'Department Manager', tier: 'DEPT_MANAGER' },
      { key: 'STAFF', label: 'Employee / Staff', tier: 'STAFF' },
      { key: 'END_USER', label: 'Client / Customer', tier: 'END_USER' }
    ],
    accountHierarchy: {
      COMPANY_ADMIN: ['DEPARTMENT_MANAGER', 'STAFF', 'END_USER'],
      DEPARTMENT_MANAGER: ['STAFF'],
      STAFF: [],
      END_USER: []
    },
    terminology: {
      customerTerm: 'Clients / Customers',
      customerSingle: 'Client',
      employeeTerm: 'Employees',
      employeeSingle: 'Employee',
      departmentTerm: 'Departments',
      departmentSingle: 'Department',
      managerTerm: 'Managers',
      managerSingle: 'Manager',
      assetTerm: 'Projects',
      productTerm: 'Products / SKUs'
    },
    defaultDepartments: [
      { name: 'Enterprise Sales & Accounts', code: 'SALES' },
      { name: 'Finance & Accounts', code: 'FINANCE' },
      { name: 'Human Resources', code: 'HR' },
      { name: 'Engineering & Technology', code: 'ENG' },
      { name: 'Operations & Logistics', code: 'OPS' },
      { name: 'Customer Support', code: 'SUPPORT' }
    ],
    modules: [
      'dashboard', 'company', 'departments', 'employees', 'managers', 'customers',
      'projects', 'tasks', 'sales', 'products', 'inventory', 'purchases',
      'suppliers', 'invoices', 'payments', 'expenses', 'attendance', 'documents',
      'reports', 'analytics', 'notifications', 'ai-assistant', 'automations',
      'settings', 'audit-logs'
    ],
    roleModuleMap: {
      COMPANY_ADMIN: [
        'dashboard', 'company', 'departments', 'employees', 'managers', 'customers',
        'projects', 'tasks', 'sales', 'products', 'inventory', 'purchases',
        'suppliers', 'invoices', 'payments', 'expenses', 'attendance', 'documents',
        'reports', 'analytics', 'notifications', 'ai-assistant', 'automations',
        'settings', 'profile'
      ],
      DEPARTMENT_MANAGER: [
        'department-dashboard', 'departments', 'employees', 'tasks', 'projects',
        'attendance', 'documents', 'reports', 'analytics', 'notifications',
        'ai-assistant', 'profile'
      ],
      STAFF: [
        'staff-dashboard', 'tasks', 'projects', 'attendance', 'documents',
        'notifications', 'ai-assistant', 'profile'
      ],
      END_USER: [
        'user-dashboard', 'invoices', 'notifications', 'profile'
      ]
    },
    dashboardWidgets: [
      'monthly_revenue', 'active_projects', 'pending_tasks', 'total_employees',
      'sales_trend', 'invoices_due', 'inventory_status', 'ai_insights'
    ],
    reports: [
      'Employee Report', 'Department Report', 'Attendance Report', 'Sales Report',
      'Customer Report', 'Project Report', 'Task Report', 'Invoice Report',
      'Payment Report', 'Expense Report', 'Purchase Report', 'Inventory Report',
      'Financial Summary'
    ]
  },

  COLLEGE: {
    portalName: 'Campus Academic & Directorate Portal',
    portalType: 'college',
    categoryKey: 'COLLEGE',
    roles: [
      { key: 'COLLEGE_ADMIN', label: 'College Admin / Principal', tier: 'ORG_ADMIN' },
      { key: 'HOD', label: 'Head of Department (HOD)', tier: 'DEPT_MANAGER' },
      { key: 'FACULTY', label: 'Faculty / Professor', tier: 'STAFF' },
      { key: 'STUDENT', label: 'Student', tier: 'END_USER' }
    ],
    accountHierarchy: {
      COLLEGE_ADMIN: ['HOD', 'FACULTY', 'STUDENT'],
      HOD: ['FACULTY', 'STUDENT'],
      FACULTY: [],
      STUDENT: []
    },
    terminology: {
      customerTerm: 'Students',
      customerSingle: 'Student',
      employeeTerm: 'Faculty & Staff',
      employeeSingle: 'Faculty',
      departmentTerm: 'Academic Departments',
      departmentSingle: 'Department',
      managerTerm: 'Heads of Department (HODs)',
      managerSingle: 'HOD',
      assetTerm: 'Courses',
      productTerm: 'Subjects'
    },
    defaultDepartments: [
      { name: 'Computer Science & Engineering', code: 'CS' },
      { name: 'Information Technology', code: 'IT' },
      { name: 'Electronics & Communication', code: 'EC' },
      { name: 'Mechanical Engineering', code: 'MECH' },
      { name: 'Civil Engineering', code: 'CIVIL' },
      { name: 'Commerce & Management Studies', code: 'MGMT' }
    ],
    modules: [
      'dashboard', 'college-profile', 'departments', 'hods', 'faculty', 'students',
      'courses', 'subjects', 'academic', 'attendance', 'timetable', 'exams',
      'results', 'fees', 'events', 'notices', 'documents', 'reports', 'analytics',
      'notifications', 'ai-assistant', 'automations', 'settings', 'audit-logs'
    ],
    roleModuleMap: {
      COLLEGE_ADMIN: [
        'dashboard', 'college-profile', 'departments', 'hods', 'faculty', 'students',
        'courses', 'subjects', 'academic', 'attendance', 'timetable', 'exams',
        'results', 'fees', 'events', 'notices', 'documents', 'reports', 'analytics',
        'notifications', 'ai-assistant', 'automations', 'settings', 'profile'
      ],
      HOD: [
        'hod-dashboard', 'departments', 'faculty', 'students', 'courses', 'subjects',
        'academic', 'attendance', 'timetable', 'exams', 'results', 'assignments',
        'tasks', 'documents', 'notices', 'reports', 'analytics', 'notifications',
        'ai-assistant', 'profile'
      ],
      FACULTY: [
        'faculty-dashboard', 'my-classes', 'subjects', 'students', 'attendance',
        'assignments', 'exams', 'results', 'timetable', 'documents', 'notifications',
        'ai-assistant', 'profile'
      ],
      STUDENT: [
        'student-dashboard', 'my-courses', 'subjects', 'attendance', 'timetable',
        'assignments', 'exams', 'results', 'fees', 'documents', 'notices',
        'events', 'notifications', 'ai-assistant', 'profile'
      ]
    },
    dashboardWidgets: [
      'total_students', 'total_faculty', 'academic_departments', 'today_attendance',
      'upcoming_exams', 'published_results', 'pending_fees', 'college_notices', 'ai_insights'
    ],
    reports: [
      'Department Student Report', 'Faculty Workload Report', 'Attendance Report',
      'Subject Report', 'Course Report', 'Exam Report', 'Result Report',
      'Student Performance Report', 'At-Risk Student Report', 'Department Activity Report'
    ]
  },

  HOTEL: {
    portalName: 'Hospitality & Resort Management Suite',
    portalType: 'hotel',
    categoryKey: 'HOTEL',
    roles: [
      { key: 'HOTEL_ADMIN', label: 'Property / Resort Admin', tier: 'ORG_ADMIN' },
      { key: 'DEPARTMENT_MANAGER', label: 'Department Manager', tier: 'DEPT_MANAGER' },
      { key: 'STAFF', label: 'Hospitality Staff', tier: 'STAFF' },
      { key: 'END_USER', label: 'Guest', tier: 'END_USER' }
    ],
    accountHierarchy: {
      HOTEL_ADMIN: ['DEPARTMENT_MANAGER', 'STAFF', 'END_USER'],
      DEPARTMENT_MANAGER: ['STAFF'],
      STAFF: [],
      END_USER: []
    },
    terminology: {
      customerTerm: 'Guests',
      customerSingle: 'Guest',
      employeeTerm: 'Staff & Associates',
      employeeSingle: 'Staff Associate',
      departmentTerm: 'Property Divisions',
      departmentSingle: 'Division',
      managerTerm: 'Division Managers',
      managerSingle: 'Manager',
      assetTerm: 'Rooms & Suites',
      productTerm: 'Amenities & Services'
    },
    defaultDepartments: [
      { name: 'Front Desk & Guest Services', code: 'FRONTDESK' },
      { name: 'Housekeeping & Rooms Inspection', code: 'HOUSEKEEPING' },
      { name: 'Food & Beverage', code: 'FB' },
      { name: 'Maintenance & Engineering', code: 'MAINT' },
      { name: 'Security & Safety', code: 'SECURITY' },
      { name: 'Spa & Wellness', code: 'SPA' },
      { name: 'Activities & Guest Excursions', code: 'ACTIVITIES' }
    ],
    modules: [
      'dashboard', 'property', 'rooms', 'room-types', 'reservations', 'guests',
      'front-desk', 'housekeeping', 'staff', 'departments', 'payments', 'expenses',
      'reports', 'analytics', 'notifications', 'ai-assistant', 'settings'
    ],
    optionalModules: [
      'restaurant', 'menu', 'kitchen', 'food-orders', 'room-service',
      'spa', 'activities', 'events', 'banquet', 'maintenance'
    ],
    roleModuleMap: {
      HOTEL_ADMIN: [
        'dashboard', 'property', 'rooms', 'room-types', 'reservations', 'guests',
        'front-desk', 'housekeeping', 'staff', 'departments', 'payments', 'expenses',
        'reports', 'analytics', 'notifications', 'ai-assistant', 'settings', 'profile'
      ],
      DEPARTMENT_MANAGER: [
        'department-dashboard', 'front-desk', 'housekeeping', 'rooms', 'staff',
        'tasks', 'reports', 'analytics', 'notifications', 'ai-assistant', 'profile'
      ],
      STAFF: [
        'staff-dashboard', 'front-desk', 'housekeeping', 'tasks', 'attendance',
        'notifications', 'ai-assistant', 'profile'
      ],
      END_USER: [
        'user-dashboard', 'reservations', 'notifications', 'profile'
      ]
    },
    dashboardWidgets: [
      'total_rooms', 'available_rooms', 'occupied_rooms', 'rooms_cleaning',
      'today_checkins', 'today_checkouts', 'current_guests', 'room_revenue',
      'housekeeping_alerts', 'ai_insights'
    ],
    reports: [
      'Occupancy Report', 'Reservation Report', 'Guest Report', 'Check-In Report',
      'Check-Out Report', 'Room Revenue Report', 'Payment Report', 'Expense Report',
      'Housekeeping Report', 'Maintenance Report', 'Division Performance'
    ]
  }
};

/**
 * Resolves category configuration given an organization's type string
 * @param {string} orgType e.g. "Company / Startup", "College / Educational Institution", "Resort / Hotel"
 * @returns {object} Category configuration object
 */
export function getPortalConfig(orgType = '') {
  const normalized = String(orgType || '').toLowerCase();
  if (normalized.includes('college') || normalized.includes('education') || normalized.includes('school') || normalized.includes('institution') || normalized.includes('university')) {
    return CATEGORY_CONFIG.COLLEGE;
  }
  if (normalized.includes('hotel') || normalized.includes('resort') || normalized.includes('hospitality') || normalized.includes('lodge') || normalized.includes('villa')) {
    return CATEGORY_CONFIG.HOTEL;
  }
  return CATEGORY_CONFIG.COMPANY;
}

/**
 * Gets whitelist of modules for an organization and user role
 */
export function getEnabledModules(org = {}, role = 'COMPANY_ADMIN') {
  const config = getPortalConfig(org.type);
  const normalizedRole = normalizeRole(role, config.categoryKey);
  const roleModules = config.roleModuleMap[normalizedRole] || config.roleModuleMap.STAFF || [];
  
  // For HOTEL: check optional modules
  if (config.categoryKey === 'HOTEL') {
    const isRestaurantEnabled = org.enabledModules?.includes('restaurant') || org.enabledServices?.includes('restaurant');
    if (!isRestaurantEnabled) {
      return roleModules.filter(m => !['restaurant', 'menu', 'kitchen', 'food-orders', 'room-service'].includes(m));
    }
  }
  
  return roleModules;
}

/**
 * Normalizes role string to canonical tier role within the category
 */
export function normalizeRole(role = '', categoryKey = 'COMPANY') {
  const r = String(role || '').toUpperCase();
  if (r === 'PLATFORM_OWNER') return 'PLATFORM_OWNER';

  if (categoryKey === 'COLLEGE') {
    if (r === 'COLLEGE_ADMIN' || r === 'COMPANY_ADMIN' || r.includes('PRINCIPAL') || r.includes('DEAN')) return 'COLLEGE_ADMIN';
    if (r === 'HOD' || r === 'DEPARTMENT_MANAGER' || r.includes('HEAD')) return 'HOD';
    if (r === 'FACULTY' || r === 'STAFF' || r.includes('PROFESSOR') || r.includes('TEACHER')) return 'FACULTY';
    if (r === 'STUDENT' || r === 'END_USER') return 'STUDENT';
    return 'FACULTY';
  }

  if (categoryKey === 'HOTEL') {
    if (r === 'HOTEL_ADMIN' || r === 'COMPANY_ADMIN' || r.includes('RESORT_ADMIN') || r.includes('GM')) return 'HOTEL_ADMIN';
    if (r === 'DEPARTMENT_MANAGER' || r.includes('MANAGER')) return 'DEPARTMENT_MANAGER';
    if (r === 'STAFF' || r.includes('HOUSEKEEPING') || r.includes('FRONTDESK') || r.includes('KITCHEN')) return 'STAFF';
    if (r === 'END_USER' || r === 'GUEST') return 'END_USER';
    return 'STAFF';
  }

  // COMPANY default
  if (r === 'COMPANY_ADMIN' || r === 'COLLEGE_ADMIN' || r === 'HOTEL_ADMIN') return 'COMPANY_ADMIN';
  if (r === 'DEPARTMENT_MANAGER' || r === 'HOD') return 'DEPARTMENT_MANAGER';
  if (r === 'STAFF' || r === 'FACULTY') return 'STAFF';
  if (r === 'END_USER' || r === 'STUDENT' || r === 'GUEST') return 'END_USER';
  return 'STAFF';
}

/**
 * Gets role tier level (ORG_ADMIN | DEPT_MANAGER | STAFF | END_USER)
 */
export function getRoleTier(role = '') {
  const r = String(role || '').toUpperCase();
  if (r === 'PLATFORM_OWNER') return 'PLATFORM_OWNER';
  if (['COMPANY_ADMIN', 'COLLEGE_ADMIN', 'HOTEL_ADMIN', 'RESORT_ADMIN'].includes(r)) return 'ORG_ADMIN';
  if (['DEPARTMENT_MANAGER', 'HOD', 'GENERAL_MANAGER'].includes(r)) return 'DEPT_MANAGER';
  if (['STAFF', 'EMPLOYEE', 'FACULTY', 'HOTEL_STAFF'].includes(r)) return 'STAFF';
  if (['END_USER', 'STUDENT', 'GUEST', 'CUSTOMER', 'CLIENT'].includes(r)) return 'END_USER';
  return 'STAFF';
}

/**
 * Gets category-specific terminology
 */
export function getTerminology(orgType = '') {
  return getPortalConfig(orgType).terminology;
}

/**
 * Checks whether user has permission to create target role
 */
export function canCreateRole(creatorRole, targetRole, orgType = '') {
  const config = getPortalConfig(orgType);
  const normalizedCreator = normalizeRole(creatorRole, config.categoryKey);
  const normalizedTarget = normalizeRole(targetRole, config.categoryKey);
  const allowed = config.accountHierarchy[normalizedCreator] || [];
  return allowed.includes(normalizedTarget);
}
