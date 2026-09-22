// Centralized Backend Portal Category Configuration for SMARTORA
// Controls Backend Route Guards, Role Hierarchy Validation, and Tenant Boundaries

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
    categoryKey: 'COMPANY',
    roles: ['COMPANY_ADMIN', 'DEPARTMENT_MANAGER', 'STAFF', 'END_USER'],
    accountHierarchy: {
      COMPANY_ADMIN: ['DEPARTMENT_MANAGER', 'STAFF', 'END_USER'],
      DEPARTMENT_MANAGER: ['STAFF'],
      STAFF: [],
      END_USER: []
    }
  },
  COLLEGE: {
    categoryKey: 'COLLEGE',
    roles: ['COLLEGE_ADMIN', 'HOD', 'FACULTY', 'STUDENT'],
    accountHierarchy: {
      COLLEGE_ADMIN: ['HOD', 'FACULTY', 'STUDENT'],
      HOD: ['FACULTY', 'STUDENT'],
      FACULTY: [],
      STUDENT: []
    }
  },
  HOTEL: {
    categoryKey: 'HOTEL',
    roles: ['HOTEL_ADMIN', 'DEPARTMENT_MANAGER', 'STAFF', 'END_USER'],
    accountHierarchy: {
      HOTEL_ADMIN: ['DEPARTMENT_MANAGER', 'STAFF', 'END_USER'],
      DEPARTMENT_MANAGER: ['STAFF'],
      STAFF: [],
      END_USER: []
    }
  }
};

export function getPortalConfig(orgType = '') {
  const normalized = String(orgType || '').toLowerCase();
  if (normalized.includes('college') || normalized.includes('education') || normalized.includes('school') || normalized.includes('university')) {
    return CATEGORY_CONFIG.COLLEGE;
  }
  if (normalized.includes('hotel') || normalized.includes('resort') || normalized.includes('hospitality') || normalized.includes('villa')) {
    return CATEGORY_CONFIG.HOTEL;
  }
  return CATEGORY_CONFIG.COMPANY;
}

export function normalizeRole(role = '', categoryKey = 'COMPANY') {
  const r = String(role || '').toUpperCase();
  if (r === 'PLATFORM_OWNER') return 'PLATFORM_OWNER';

  if (categoryKey === 'COLLEGE') {
    if (r === 'COLLEGE_ADMIN' || r === 'COMPANY_ADMIN' || r.includes('PRINCIPAL')) return 'COLLEGE_ADMIN';
    if (r === 'HOD' || r === 'DEPARTMENT_MANAGER') return 'HOD';
    if (r === 'FACULTY' || r === 'STAFF') return 'FACULTY';
    if (r === 'STUDENT' || r === 'END_USER') return 'STUDENT';
    return 'FACULTY';
  }

  if (categoryKey === 'HOTEL') {
    if (r === 'HOTEL_ADMIN' || r === 'COMPANY_ADMIN' || r.includes('RESORT_ADMIN')) return 'HOTEL_ADMIN';
    if (r === 'DEPARTMENT_MANAGER' || r.includes('MANAGER')) return 'DEPARTMENT_MANAGER';
    if (r === 'STAFF') return 'STAFF';
    if (r === 'END_USER' || r === 'GUEST') return 'END_USER';
    return 'STAFF';
  }

  if (r === 'COMPANY_ADMIN' || r === 'COLLEGE_ADMIN' || r === 'HOTEL_ADMIN') return 'COMPANY_ADMIN';
  if (r === 'DEPARTMENT_MANAGER' || r === 'HOD') return 'DEPARTMENT_MANAGER';
  if (r === 'STAFF' || r === 'FACULTY') return 'STAFF';
  if (r === 'END_USER' || r === 'STUDENT' || r === 'GUEST') return 'END_USER';
  return 'STAFF';
}

export function canCreateRole(creatorRole, targetRole, orgType = '') {
  if (creatorRole === 'PLATFORM_OWNER') return true;
  const config = getPortalConfig(orgType);
  const normalizedCreator = normalizeRole(creatorRole, config.categoryKey);
  const normalizedTarget = normalizeRole(targetRole, config.categoryKey);
  const allowed = config.accountHierarchy[normalizedCreator] || [];
  return allowed.includes(normalizedTarget);
}
