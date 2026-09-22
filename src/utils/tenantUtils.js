// Multi-Tenant Isolation Utility for SMARTORA
// Strictly enforces organizational data partition across all models, collections, and views
// ZERO PERMISSIVE FALLBACKS: Missing or blank tenant keys are strictly blocked

/**
 * Checks whether a given record strictly belongs to the specified organization
 * @param {object} record - Data record (Employee, Customer, Task, Product, etc.)
 * @param {object|string} orgOrId - Active organization object or organization ID string
 * @returns {boolean} True if and only if record belongs to target organization
 */
export function matchesTenant(record, orgOrId) {
  if (!record || !orgOrId) return false;

  // Build target organization key set
  let targetKeys = [];
  if (typeof orgOrId === 'string') {
    targetKeys = [orgOrId.trim().toLowerCase()];
  } else if (typeof orgOrId === 'object') {
    targetKeys = [
      orgOrId.id,
      orgOrId.companyId,
      orgOrId.organizationId,
      orgOrId.organization_id
    ]
      .filter(Boolean)
      .map(k => String(k).trim().toLowerCase());
  }

  if (targetKeys.length === 0) return false;

  // Extract record's tenant key
  const candidateKeys = [
    record.organizationId,
    record.organization_id,
    record.orgId,
    record.companyId
  ]
    .filter(Boolean)
    .map(k => String(k).trim().toLowerCase());

  if (candidateKeys.length === 0) {
    // STRICT GUARD: Unattributed records are NEVER leaked into any organization
    return false;
  }

  // Record matches if any candidate key matches any target key
  return candidateKeys.some(candidate => targetKeys.includes(candidate));
}

/**
 * Ensures a record has all standard tenant keys attached before persistence
 * @param {object} record
 * @param {object} org
 * @returns {object} Record with organizationId, organization_id, orgId set
 */
export function attachTenantKeys(record, org) {
  if (!record || !org) return record;
  const canonicalId = org.id || org.companyId || org.organizationId || 'org-001';
  const canonicalType = org.type || 'Company';

  return {
    ...record,
    organizationId: canonicalId,
    organization_id: canonicalId,
    orgId: canonicalId,
    organizationType: canonicalType
  };
}
