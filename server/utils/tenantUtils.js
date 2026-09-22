// Server-Side Multi-Tenant Isolation Utility for SMARTORA
// Strictly enforces organizational data partition across all queries, models, and mutators

export function matchesTenant(record, orgOrId) {
  if (!record || !orgOrId) return false;

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

  const candidateKeys = [
    record.organizationId,
    record.organization_id,
    record.orgId,
    record.companyId
  ]
    .filter(Boolean)
    .map(k => String(k).trim().toLowerCase());

  if (candidateKeys.length === 0) return false;

  return candidateKeys.some(candidate => targetKeys.includes(candidate));
}

export function buildTenantQuery(userOrgId) {
  if (!userOrgId) return { organizationId: '__DENIED__' };
  const normalized = String(userOrgId).trim();
  return {
    $or: [
      { organizationId: normalized },
      { organization_id: normalized },
      { orgId: normalized },
      { companyId: normalized }
    ]
  };
}

export function attachTenantKeys(record, orgId, orgType = 'COMPANY') {
  const canonicalId = String(orgId || '').trim();
  return {
    ...record,
    organizationId: canonicalId,
    organization_id: canonicalId,
    orgId: canonicalId,
    organizationType: orgType
  };
}
