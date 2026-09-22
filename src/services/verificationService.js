// Organization Verification Service for SMARTORA
// Multi-Tenant Institutional Verification Engine, Official Provider Abstractions & AI Document Analysis

export const VERIFICATION_STATUS = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  NEEDS_MORE_INFORMATION: 'NEEDS_MORE_INFORMATION',
  SUSPENDED: 'SUSPENDED'
};

export const MATCH_RESULT = {
  MATCH: 'MATCH',
  MISMATCH: 'MISMATCH',
  PARTIAL_MATCH: 'PARTIAL_MATCH',
  UNAVAILABLE: 'UNAVAILABLE'
};

// Dynamic Document Requirements Matrix by Organization Type
export const ORG_DOCUMENT_REQUIREMENTS = {
  'Company': [
    {
      id: 'DOC-INC-CERT',
      type: 'INCORPORATION_CERTIFICATE',
      name: 'Certificate of Incorporation / CIN',
      description: 'Official Ministry of Corporate Affairs or Registrar Certificate of Incorporation.',
      required: true
    },
    {
      id: 'DOC-TAX-GST',
      type: 'TAX_REGISTRATION',
      name: 'GSTIN / Commercial Tax Certificate',
      description: 'Official Goods & Services Tax Identification Number or Tax Clearance document.',
      required: true
    },
    {
      id: 'DOC-MOA-AOA',
      type: 'MEMORANDUM_OF_ASSOCIATION',
      name: 'Memorandum & Articles of Association (MoA / AoA)',
      description: 'Charter document defining corporate scope and authorized signatory.',
      required: false
    }
  ],
  'College': [
    {
      id: 'DOC-EDU-UGC',
      type: 'UNIVERSITY_RECOGNITION',
      name: 'UGC / AICTE Recognition Letter',
      description: 'Official central or statutory council institutional recognition decree.',
      required: true
    },
    {
      id: 'DOC-UNIV-AFFIL',
      type: 'AFFILIATION_ORDER',
      name: 'University Affiliation Certificate & AISHE Code',
      description: 'Current academic year university affiliation order with valid AISHE identification.',
      required: true
    },
    {
      id: 'DOC-TRUST-DEED',
      type: 'EDUCATIONAL_TRUST_DEED',
      name: 'Educational Trust / Society Deed',
      description: 'Registered public charitable trust or society deed governing the campus.',
      required: false
    }
  ],
  'School': [
    {
      id: 'DOC-SCH-DEPT',
      type: 'STATE_EDU_DEPT_NOC',
      name: 'State Education Department Recognition / NOC',
      description: 'State primary/secondary education board recognition or No Objection Certificate.',
      required: true
    },
    {
      id: 'DOC-SCH-BOARD',
      type: 'BOARD_AFFILIATION',
      name: 'CBSE / ICSE / State Board Affiliation Proof',
      description: 'Valid affiliation certificate with school affiliation code number.',
      required: true
    },
    {
      id: 'DOC-SCH-SAFETY',
      type: 'BUILDING_FIRE_SAFETY',
      name: 'Campus Building & Fire Safety Certificate',
      description: 'Municipal engineering and fire department occupancy clearance.',
      required: false
    }
  ],
  'Clinic': [
    {
      id: 'DOC-MED-EST',
      type: 'CLINICAL_ESTABLISHMENT_LICENSE',
      name: 'Clinical Establishments Act Registration',
      description: 'State Directorate of Health Services clinical premises operating license.',
      required: true
    },
    {
      id: 'DOC-MED-COUNCIL',
      type: 'MEDICAL_COUNCIL_REG',
      name: 'Medical Director Council Registration',
      description: 'State Medical Council / National Medical Commission permanent registration.',
      required: true
    },
    {
      id: 'DOC-BIO-WASTE',
      type: 'BIOMEDICAL_WASTE_NOC',
      name: 'Pollution Board Bio-Medical Waste Authorization',
      description: 'State pollution control board biomedical waste handling certificate.',
      required: false
    }
  ],
  'NGO': [
    {
      id: 'DOC-NGO-DARPAN',
      type: 'NITI_AAYOG_DARPAN',
      name: 'NITI Aayog NGO-Darpan Registration Certificate',
      description: 'Government NGO-Darpan portal unique identification certificate.',
      required: true
    },
    {
      id: 'DOC-NGO-12A-80G',
      type: 'TAX_EXEMPTION_12A_80G',
      name: '12A & 80G Tax Exemption Registration',
      description: 'Income Tax Department registration under Section 12AB and 80G.',
      required: true
    },
    {
      id: 'DOC-SOC-REG',
      type: 'SOCIETIES_REGISTRATION',
      name: 'Societies Registration Act / Trust Deed',
      description: 'Certified copy of society registration certificate or public trust deed.',
      required: true
    }
  ],
  'Manufacturing': [
    {
      id: 'DOC-MFG-FACTORY',
      type: 'FACTORIES_ACT_LICENSE',
      name: 'Chief Inspector of Factories License',
      description: 'Valid operating license issued under the Factories Act.',
      required: true
    },
    {
      id: 'DOC-MFG-POLLUTION',
      type: 'POLLUTION_CONTROL_NOC',
      name: 'State Pollution Control Board Consent to Operate (CTO)',
      description: 'Consent to Operate under Air and Water Prevention & Control of Pollution Acts.',
      required: true
    },
    {
      id: 'DOC-MFG-MSME',
      type: 'UDYAM_MSME_REGISTRATION',
      name: 'Udyam / MSME Registration Certificate',
      description: 'Ministry of Micro, Small and Medium Enterprises Udyam Certificate.',
      required: false
    }
  ],
  'Training Institute': [
    {
      id: 'DOC-TRN-ACCRED',
      type: 'SKILL_DEVELOPMENT_ACCRED',
      name: 'National Skill Development (NSDC) / Board Accreditation',
      description: 'Official council training partner accreditation or state vocational council affiliation.',
      required: true
    },
    {
      id: 'DOC-TRN-COMMERCIAL',
      type: 'COMMERCIAL_REGISTRATION',
      name: 'Commercial Establishment Registration / GST',
      description: 'Registered business establishment proof or Ministry of Corporate Affairs filing.',
      required: true
    }
  ],
  'Agency': [
    {
      id: 'DOC-AGN-TRADE',
      type: 'TRADE_LICENSE',
      name: 'Municipal Trade License / Shops & Establishment Certificate',
      description: 'Municipal corporation trade license or State Shops & Commercial Establishments Act license.',
      required: true
    },
    {
      id: 'DOC-AGN-TAX',
      type: 'TAX_REGISTRATION',
      name: 'GSTIN Registration Certificate',
      description: 'Goods and Services Tax Identification Number certificate.',
      required: true
    }
  ],
  'Service Business': [
    {
      id: 'DOC-SRV-EST',
      type: 'SHOPS_AND_ESTABLISHMENT',
      name: 'Shops & Commercial Establishments Act Registration',
      description: 'Official Department of Labour commercial establishment registration certificate.',
      required: true
    },
    {
      id: 'DOC-SRV-TAX',
      type: 'TAX_REGISTRATION',
      name: 'GSTIN / Professional Tax Registration',
      description: 'Commercial tax registration certificate.',
      required: true
    }
  ],
  'Other': [
    {
      id: 'DOC-OTH-LEGAL',
      type: 'GOVERNMENT_REGISTRATION',
      name: 'Government Statutory Registration Proof',
      description: 'Official government-issued operational certificate or statutory charter.',
      required: true
    },
    {
      id: 'DOC-OTH-ID',
      type: 'SIGNATORY_AUTHORITY',
      name: 'Authorized Signatory Identity & Resolution',
      description: 'Letter of authorization or governing body resolution.',
      required: false
    }
  ]
};

// Map generic business types to requirement keys
export function getRequirementsForType(orgType) {
  const typeKey = (orgType || '').trim();
  if (ORG_DOCUMENT_REQUIREMENTS[typeKey]) {
    return ORG_DOCUMENT_REQUIREMENTS[typeKey];
  }
  // Fallbacks by partial keywords
  const lower = typeKey.toLowerCase();
  if (lower.includes('college') || lower.includes('university')) return ORG_DOCUMENT_REQUIREMENTS['College'];
  if (lower.includes('school')) return ORG_DOCUMENT_REQUIREMENTS['School'];
  if (lower.includes('clinic') || lower.includes('hospital') || lower.includes('health')) return ORG_DOCUMENT_REQUIREMENTS['Clinic'];
  if (lower.includes('ngo') || lower.includes('trust') || lower.includes('non-profit')) return ORG_DOCUMENT_REQUIREMENTS['NGO'];
  if (lower.includes('manufacturing') || lower.includes('plant')) return ORG_DOCUMENT_REQUIREMENTS['Manufacturing'];
  if (lower.includes('train') || lower.includes('institute')) return ORG_DOCUMENT_REQUIREMENTS['Training Institute'];
  if (lower.includes('agency')) return ORG_DOCUMENT_REQUIREMENTS['Agency'];
  if (lower.includes('service') || lower.includes('consult')) return ORG_DOCUMENT_REQUIREMENTS['Service Business'];
  if (lower.includes('company') || lower.includes('startup') || lower.includes('retail') || lower.includes('supermarket') || lower.includes('restaurant')) return ORG_DOCUMENT_REQUIREMENTS['Company'];
  return ORG_DOCUMENT_REQUIREMENTS['Other'];
}

// -------------------------------------------------------------
// VERIFICATION PROVIDER ABSTRACTION & CONCRETE IMPLEMENTATIONS
// -------------------------------------------------------------

/**
 * Base abstract class for official registries
 */
export class VerificationProvider {
  constructor(name, providerType, source) {
    this.name = name;
    this.providerType = providerType;
    this.source = source;
  }

  async verify(registrationData) {
    throw new Error('Method verify() must be implemented by concrete provider');
  }
}

/**
 * Government Corporate / Tax Registry Provider (MCA, GSTIN, MSME)
 */
export class GovernmentRegistryProvider extends VerificationProvider {
  constructor() {
    super('Ministry of Corporate Affairs & GSTIN Registry', 'GOVERNMENT_REGISTRY', 'National Commercial Database (MCA21 / GSTN)');
  }

  async verify(registrationData) {
    const regNum = (registrationData.registrationNumber || '').toUpperCase().trim();
    const orgName = (registrationData.name || '').trim();
    const state = (registrationData.state || '').trim();

    // Simulated official registry query
    const isValidFormat = /^[A-Z0-9-]{6,21}$/.test(regNum);
    if (!isValidFormat || !regNum) {
      return {
        source: this.source,
        method: 'API_DIRECT_REGISTRY_QUERY',
        result: MATCH_RESULT.UNAVAILABLE,
        checkedAt: new Date().toISOString(),
        details: 'Invalid or missing official registration number format. Registry query could not resolve entity.',
        officialRecord: null
      };
    }

    // Mock official record retrieved from government source
    const officialRecord = {
      officialEntityName: orgName.length > 4 ? orgName : `${orgName} Private Limited`,
      officialRegNumber: regNum,
      registeredState: state || 'Karnataka',
      incorporationDate: '2021-04-14',
      entityStatus: 'ACTIVE_IN_GOOD_STANDING',
      filingCompliance: 'UP_TO_DATE',
      authorizedCapital: '₹10,00,000'
    };

    const nameMatches = orgName.toLowerCase().includes(officialRecord.officialEntityName.toLowerCase().slice(0, 5));
    const regMatches = regNum === officialRecord.officialRegNumber;

    let result = MATCH_RESULT.MATCH;
    if (!regMatches) result = MATCH_RESULT.MISMATCH;
    else if (!nameMatches) result = MATCH_RESULT.PARTIAL_MATCH;

    return {
      source: this.source,
      method: 'API_DIRECT_REGISTRY_QUERY',
      result,
      checkedAt: new Date().toISOString(),
      details: result === MATCH_RESULT.MATCH
        ? `Official record verified against MCA21 master database. Entity is Active in Good Standing.`
        : `Record retrieved with minor discrepancy. Reviewer verification recommended.`,
      officialRecord
    };
  }
}

/**
 * Education Authority Provider (AISHE / UGC / State Directorate)
 */
export class EducationAuthorityProvider extends VerificationProvider {
  constructor() {
    super('National Higher Education & AISHE Registry', 'EDUCATION_AUTHORITY', 'All India Survey on Higher Education (AISHE / UGC Portal)');
  }

  async verify(registrationData) {
    const regNum = (registrationData.registrationNumber || '').toUpperCase().trim();
    const orgName = (registrationData.name || '').trim();
    const state = (registrationData.state || '').trim();

    const isAisheCode = /^C-[0-9]{4,6}$|^U-[0-9]{4,6}$/.test(regNum) || regNum.includes('EDU') || regNum.length > 5;
    if (!regNum || !isAisheCode) {
      return {
        source: this.source,
        method: 'AISHE_NATIONAL_PORTAL_LOOKUP',
        result: MATCH_RESULT.UNAVAILABLE,
        checkedAt: new Date().toISOString(),
        details: 'Institutional code format could not be verified against the AISHE / UGC central directory.',
        officialRecord: null
      };
    }

    const officialRecord = {
      officialEntityName: orgName,
      officialRegNumber: regNum,
      institutionCategory: 'Higher Educational Institution',
      statutoryApproval: 'UGC Section 2(f) & 12(B) Recognized',
      accreditationStatus: 'NAAC A+ Accredited',
      registeredState: state || 'Tamil Nadu',
      academicAffiliation: 'Affiliated State Technical University'
    };

    return {
      source: this.source,
      method: 'AISHE_NATIONAL_PORTAL_LOOKUP',
      result: MATCH_RESULT.MATCH,
      checkedAt: new Date().toISOString(),
      details: 'Institution verified on AISHE central education registry. Affiliation valid for current academic period.',
      officialRecord
    };
  }
}

/**
 * Healthcare Registry Provider (State Medical Council & Clinical Establishments)
 */
export class HealthcareRegistryProvider extends VerificationProvider {
  constructor() {
    super('Clinical Establishments & Medical Directorate', 'HEALTHCARE_REGISTRY', 'National Health Authority & State Clinical Registry');
  }

  async verify(registrationData) {
    const regNum = (registrationData.registrationNumber || '').toUpperCase().trim();
    const orgName = (registrationData.name || '').trim();

    if (!regNum) {
      return {
        source: this.source,
        method: 'STATE_HEALTH_DIRECTORATE_QUERY',
        result: MATCH_RESULT.UNAVAILABLE,
        checkedAt: new Date().toISOString(),
        details: 'Clinical Establishment license number missing or unformatted.',
        officialRecord: null
      };
    }

    const officialRecord = {
      officialEntityName: orgName,
      officialRegNumber: regNum,
      facilityType: 'Multi-Specialty Clinic & Daycare',
      licenseValidUntil: '2028-12-31',
      directorDoctorName: 'Dr. R. Venkatraman, MD',
      medicalCouncilRegNumber: 'TN-MC-48912',
      inspectionStatus: 'Satisfactory Compliance'
    };

    return {
      source: this.source,
      method: 'STATE_HEALTH_DIRECTORATE_QUERY',
      result: MATCH_RESULT.MATCH,
      checkedAt: new Date().toISOString(),
      details: 'Facility license active under Clinical Establishments Directorate. Medical Officer credentials confirmed.',
      officialRecord
    };
  }
}

/**
 * Non-Profit Registry Provider (NITI Aayog NGO Darpan / Charities)
 */
export class NonProfitRegistryProvider extends VerificationProvider {
  constructor() {
    super('NITI Aayog NGO-Darpan Portal', 'NGO_REGISTRY', 'National NGO-Darpan Portal & Central Board of Direct Taxes');
  }

  async verify(registrationData) {
    const regNum = (registrationData.registrationNumber || '').toUpperCase().trim();
    const orgName = (registrationData.name || '').trim();

    if (!regNum || regNum.length < 4) {
      return {
        source: this.source,
        method: 'DARPAN_CENTRAL_LOOKUP',
        result: MATCH_RESULT.UNAVAILABLE,
        checkedAt: new Date().toISOString(),
        details: 'NGO Darpan ID or 12A registration missing.',
        officialRecord: null
      };
    }

    const officialRecord = {
      officialEntityName: orgName,
      officialRegNumber: regNum,
      panNumber: 'AAATB4912D',
      fcraStatus: 'Registered / Eligible',
      sec12aRegistration: '12AB Valid',
      sec80gExemption: '80G Exemption in force'
    };

    return {
      source: this.source,
      method: 'DARPAN_CENTRAL_LOOKUP',
      result: MATCH_RESULT.MATCH,
      checkedAt: new Date().toISOString(),
      details: 'NGO identity and tax-exempt status verified via NITI Aayog portal record.',
      officialRecord
    };
  }
}

/**
 * Manual Inspector Verification Provider
 */
export class ManualVerificationProvider extends VerificationProvider {
  constructor() {
    super('SMARTORA Institutional Review Desk', 'MANUAL_DESK', 'Internal Compliance & Verification Officer Audit');
  }

  async verify(registrationData) {
    return {
      source: this.source,
      method: 'HUMAN_AUDITOR_CHECKLIST',
      result: MATCH_RESULT.PARTIAL_MATCH,
      checkedAt: new Date().toISOString(),
      details: 'Awaiting human auditor physical document comparison and cross-verification.',
      officialRecord: null
    };
  }
}

// Factory to resolve appropriate provider
export function getProviderForOrgType(orgType) {
  const lower = (orgType || '').toLowerCase();
  if (lower.includes('college') || lower.includes('school') || lower.includes('university') || lower.includes('education')) {
    return new EducationAuthorityProvider();
  }
  if (lower.includes('clinic') || lower.includes('hospital') || lower.includes('health')) {
    return new HealthcareRegistryProvider();
  }
  if (lower.includes('ngo') || lower.includes('trust') || lower.includes('non-profit')) {
    return new NonProfitRegistryProvider();
  }
  if (lower.includes('company') || lower.includes('manufacturing') || lower.includes('agency') || lower.includes('service')) {
    return new GovernmentRegistryProvider();
  }
  return new ManualVerificationProvider();
}

// -------------------------------------------------------------
// FIELD COMPARISON & MATCHING ENGINE
// -------------------------------------------------------------

/**
 * Compares applicant-submitted data against official source data
 * Returns itemized field match results
 */
export function compareFields(submitted, official) {
  if (!official) {
    return {
      overallResult: MATCH_RESULT.UNAVAILABLE,
      fields: {
        name: { submitted: submitted.name, official: null, status: MATCH_RESULT.UNAVAILABLE },
        regNumber: { submitted: submitted.registrationNumber, official: null, status: MATCH_RESULT.UNAVAILABLE },
        address: { submitted: submitted.address, official: null, status: MATCH_RESULT.UNAVAILABLE },
        orgType: { submitted: submitted.type, official: null, status: MATCH_RESULT.UNAVAILABLE }
      }
    };
  }

  const subName = (submitted.name || '').toLowerCase().trim();
  const offName = (official.officialEntityName || '').toLowerCase().trim();
  const nameMatch = subName === offName ? MATCH_RESULT.MATCH : (
    offName.includes(subName) || subName.includes(offName) ? MATCH_RESULT.PARTIAL_MATCH : MATCH_RESULT.MISMATCH
  );

  const subReg = (submitted.registrationNumber || '').toUpperCase().trim();
  const offReg = (official.officialRegNumber || '').toUpperCase().trim();
  const regMatch = subReg === offReg ? MATCH_RESULT.MATCH : MATCH_RESULT.MISMATCH;

  const subState = (submitted.state || submitted.country || '').toLowerCase();
  const offState = (official.registeredState || '').toLowerCase();
  const addressMatch = offState && subState.includes(offState) ? MATCH_RESULT.MATCH : (
    offState ? MATCH_RESULT.PARTIAL_MATCH : MATCH_RESULT.UNAVAILABLE
  );

  const orgTypeMatch = MATCH_RESULT.MATCH;

  // Compute aggregate result
  let overallResult = MATCH_RESULT.MATCH;
  if (regMatch === MATCH_RESULT.MISMATCH || nameMatch === MATCH_RESULT.MISMATCH) {
    overallResult = MATCH_RESULT.MISMATCH;
  } else if (nameMatch === MATCH_RESULT.PARTIAL_MATCH || addressMatch === MATCH_RESULT.PARTIAL_MATCH) {
    overallResult = MATCH_RESULT.PARTIAL_MATCH;
  }

  return {
    overallResult,
    fields: {
      name: { submitted: submitted.name, official: official.officialEntityName, status: nameMatch },
      regNumber: { submitted: submitted.registrationNumber, official: official.officialRegNumber, status: regMatch },
      address: { submitted: `${submitted.address || ''}, ${submitted.state || ''}`, official: official.registeredState, status: addressMatch },
      orgType: { submitted: submitted.type, official: official.facilityType || official.institutionCategory || 'Commercial Entity', status: orgTypeMatch }
    }
  };
}

// -------------------------------------------------------------
// AI DOCUMENT EXTRACTION & OCR ASSISTANT
// -------------------------------------------------------------

/**
 * Simulated Document OCR / AI Extraction Assistant
 * NOTE: As per system requirements, AI assists human review only and is NOT proof of authenticity.
 */
export function analyzeVerificationDocument(document, orgData) {
  const docName = document.name || document.documentName || 'Document';
  const orgName = orgData.name || 'Applicant Organization';
  const regNumber = orgData.registrationNumber || 'REG-PENDING';
  const state = orgData.state || 'Karnataka';

  const issueYear = 2023 + (document.id ? (document.id.charCodeAt(0) % 3) : 1);
  const issueDate = `${issueYear}-05-18`;
  const expiryDate = `${issueYear + 5}-05-17`;

  // Simulated extracted entities from document OCR
  const extractedData = {
    extractedOrgName: orgName,
    extractedRegNumber: regNumber,
    extractedAddress: `${orgData.address || 'Registered Office Address'}, ${state}`,
    issueDate,
    expiryDate,
    issuingAuthority: getIssuingAuthorityForType(orgData.type),
    documentClarityScore: '96% (High Fidelity / Clean Scan)',
    detectedWatermark: 'Official Emblem & Security Micro-print Present',
    tamperRiskAssessment: 'Low Risk — No digital manipulation artifacts detected'
  };

  const nameDiscrepancy = false;
  const regDiscrepancy = false;

  return {
    documentId: document.id,
    documentName: docName,
    analyzedAt: new Date().toISOString(),
    extractedData,
    discrepancies: nameDiscrepancy || regDiscrepancy ? ['Minor spelling variant detected'] : [],
    summary: `AI OCR successfully extracted official seal, entity designation "${extractedData.extractedOrgName}", and certificate number "${extractedData.extractedRegNumber}". Dates align with statutory period.`,
    isAuthenticityProof: false, // STRICT GOVERNANCE RULE: AI output is NEVER proof of authenticity!
    disclaimer: 'CRITICAL AUDIT NOTICE: AI OCR extraction is an assistive convenience tool and does NOT constitute official certification or legal proof of authenticity. Final approval strictly requires human reviewer validation.'
  };
}

function getIssuingAuthorityForType(type) {
  const lower = (type || '').toLowerCase();
  if (lower.includes('college') || lower.includes('university')) return 'University Grants Commission (UGC) & Affiliated University';
  if (lower.includes('school')) return 'Department of School Education & Affiliation Board';
  if (lower.includes('clinic')) return 'State Directorate of Health Services & Clinical Establishments Council';
  if (lower.includes('ngo')) return 'NITI Aayog & Registrar of Public Societies / Trusts';
  if (lower.includes('manufacturing')) return 'Inspectorate of Factories & State Pollution Control Board';
  return 'Registrar of Companies (RoC), Ministry of Corporate Affairs';
}

// -------------------------------------------------------------
// DUPLICATE ORGANIZATION DETECTOR
// -------------------------------------------------------------

/**
 * Checks for potential duplicate organizations
 * Compares registration number (exact) and name similarity
 */
export function checkDuplicateOrganization(candidate, existingOrganizations = [], existingApplications = []) {
  const candName = (candidate.name || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const candReg = (candidate.registrationNumber || '').toUpperCase().trim();
  const candCountry = (candidate.country || '').toLowerCase().trim();
  const candState = (candidate.state || '').toLowerCase().trim();

  const flaggedMatches = [];

  // Check against active tenant organizations
  existingOrganizations.forEach(org => {
    if (candidate.id && org.id === candidate.id) return;

    const orgName = (org.name || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const orgReg = (org.details?.gstin || org.registrationNumber || org.companyId || '').toUpperCase().trim();

    // 1. Exact registration number match (high duplicate risk)
    if (candReg && orgReg && candReg === orgReg) {
      flaggedMatches.push({
        type: 'ACTIVE_TENANT',
        id: org.id,
        name: org.name,
        matchType: 'EXACT_REGISTRATION_NUMBER',
        severity: 'high',
        reason: `Registration Number "${candReg}" matches active tenant ${org.name} (${org.id}).`
      });
    }
    // 2. Strong name similarity within same region
    else if (candName && orgName && (candName === orgName || orgName.includes(candName) || candName.includes(orgName))) {
      const orgState = (org.location?.state || '').toLowerCase().trim();
      const orgCountry = (org.location?.country || '').toLowerCase().trim();
      const sameRegion = (candState && orgState && candState === orgState) || (candCountry && orgCountry && candCountry === orgCountry);

      flaggedMatches.push({
        type: 'ACTIVE_TENANT',
        id: org.id,
        name: org.name,
        matchType: 'NAME_SIMILARITY',
        severity: sameRegion ? 'medium' : 'low',
        reason: `Organization name is highly similar to existing active tenant "${org.name}".`
      });
    }
  });

  // Check against pending applications
  existingApplications.forEach(app => {
    if (candidate.id && app.id === candidate.id) return;
    const appReg = (app.registrationNumber || '').toUpperCase().trim();
    if (candReg && appReg && candReg === appReg) {
      flaggedMatches.push({
        type: 'PENDING_APPLICATION',
        id: app.id,
        name: app.name,
        matchType: 'DUPLICATE_APPLICATION_REGISTRATION',
        severity: 'high',
        reason: `Registration Number is already submitted in pending application ${app.id}.`
      });
    }
  });

  return {
    hasDuplicateRisk: flaggedMatches.length > 0,
    matches: flaggedMatches,
    topRisk: flaggedMatches.find(m => m.severity === 'high') || flaggedMatches[0] || null
  };
}

// -------------------------------------------------------------
// DOCUMENT FILE VALIDATOR
// -------------------------------------------------------------

export function validateDocumentFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file format ".${ext}". SMARTORA only supports PDF, JPG, JPEG, and PNG proof documents.`
    };
  }

  // Max 10MB
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed upload size (10 MB).`
    };
  }

  return { valid: true, error: null };
}

// Format file size nicely
export function formatBytes(bytes, decimals = 1) {
  if (!bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
