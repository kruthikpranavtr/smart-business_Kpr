// Intelligent & Meaningful Multi-Tenant ID Generator for SMARTORA
// Generates standardized, human-readable, unique IDs scoped by organization

const DEPT_MAP = {
  // Office / Company
  'sales': 'SALES',
  'enterprise sales': 'SALES',
  'enterprise sales & accounts': 'SALES',
  'human resources': 'HR',
  'hr': 'HR',
  'finance': 'FINANCE',
  'finance & accounts': 'FINANCE',
  'accounts': 'FINANCE',
  'engineering': 'ENG',
  'engineering & technology': 'ENG',
  'it': 'IT',
  'information technology': 'IT',
  'operations': 'OPS',
  'operations & logistics': 'OPS',
  'marketing': 'MARKETING',
  'customer support': 'SUPPORT',
  'support': 'SUPPORT',

  // College / Academic
  'computer science': 'CS',
  'computer science & engineering': 'CS',
  'electronics': 'EC',
  'electronics & communication': 'EC',
  'mechanical': 'MECH',
  'mechanical engineering': 'MECH',
  'civil': 'CIVIL',
  'civil engineering': 'CIVIL',
  'commerce': 'COMMERCE',
  'management': 'MGMT',
  'science': 'SCI',

  // Hotel / Hospitality
  'front desk': 'FRONTDESK',
  'front desk & guest services': 'FRONTDESK',
  'housekeeping': 'HOUSEKEEPING',
  'housekeeping & rooms inspection': 'HOUSEKEEPING',
  'food & beverage': 'FB',
  'kitchen': 'KITCHEN',
  'maintenance': 'MAINT',
  'spa': 'SPA',
  'activities': 'ACTIVITIES',
  'security': 'SECURITY'
};

/**
 * Normalizes full name to a clean, uppercase prefix (e.g. "Arun Kumar" -> "ARUN")
 */
export function normalizeNamePrefix(fullName = '') {
  const clean = String(fullName).trim().replace(/^(dr\.|mr\.|mrs\.|ms\.|prof\.)\s+/i, '');
  const firstWord = clean.split(/[\s_-]+/)[0] || 'USER';
  const alphanumeric = firstWord.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return alphanumeric.slice(0, 8) || 'USER';
}

/**
 * Normalizes department name to uppercase code (e.g. "Sales" -> "SALES", "Computer Science" -> "CS")
 */
export function normalizeDeptCode(deptName = '') {
  if (!deptName) return 'GEN';
  const clean = String(deptName).trim().toLowerCase();
  if (DEPT_MAP[clean]) return DEPT_MAP[clean];

  for (const [key, code] of Object.entries(DEPT_MAP)) {
    if (clean.includes(key)) return code;
  }

  // Dynamic fallback: first 5 uppercase alphanumeric chars
  const fallback = clean.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return fallback.slice(0, 6) || 'DEPT';
}

/**
 * Generates an intelligent, organization-scoped employee ID
 * Format: FIRSTNAME-DEPT-SEQ (e.g. ARUN-SALES-001)
 */
export function generateEmployeeId(fullName, deptName, existingEmployees = [], category = 'COMPANY') {
  const namePrefix = normalizeNamePrefix(fullName);
  const deptCode = normalizeDeptCode(deptName);
  const basePrefix = `${namePrefix}-${deptCode}-`;

  // Find highest existing sequence for this prefix
  let maxSeq = 0;
  for (const emp of existingEmployees) {
    const id = String(emp.employeeId || emp.userId || emp.id || '').toUpperCase();
    if (id.startsWith(basePrefix)) {
      const remainder = id.slice(basePrefix.length);
      const parsed = parseInt(remainder, 10);
      if (!isNaN(parsed) && parsed > maxSeq) {
        maxSeq = parsed;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `${basePrefix}${nextSeq}`;
}

/**
 * Generates an intelligent College Student ID
 * Format: FIRSTNAME-DEPT-YEAR-SEQ (e.g. ARUN-CS-2026-001)
 */
export function generateStudentId(fullName, deptName, batchYear = new Date().getFullYear(), existingStudents = []) {
  const namePrefix = normalizeNamePrefix(fullName);
  const deptCode = normalizeDeptCode(deptName);
  const basePrefix = `${namePrefix}-${deptCode}-${batchYear}-`;

  let maxSeq = 0;
  for (const s of existingStudents) {
    const id = String(s.studentId || s.userId || s.id || '').toUpperCase();
    if (id.startsWith(basePrefix)) {
      const remainder = id.slice(basePrefix.length);
      const parsed = parseInt(remainder, 10);
      if (!isNaN(parsed) && parsed > maxSeq) {
        maxSeq = parsed;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `${basePrefix}${nextSeq}`;
}
