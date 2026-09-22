// Realistic Mock Dataset for SMARTORA Platform
// Universal AI-Powered Multi-Tenant Business & Institution Management Platform
// Strict 5-Tier Architecture: Platform Owner -> Company Admin -> Department Manager -> Staff -> End User

export const ROLES = {
  PLATFORM_OWNER: 'PLATFORM_OWNER',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  DEPARTMENT_MANAGER: 'DEPARTMENT_MANAGER',
  STAFF: 'STAFF',
  END_USER: 'END_USER'
};

export const INITIAL_ORGANIZATIONS = [
  {
    id: 'org-001',
    companyId: 'SMR-CMP-0001',
    adminId: 'ADM-CMP-0001',
    companyCode: 'TECH-SOL',
    verification_status: 'VERIFIED',
    name: 'SMARTORA Tech Solutions',
    type: 'Company / Startup',
    industry: 'Information Technology & Cloud Software',
    tagline: 'Enterprise Cloud Architecture & AI Automation',
    currency: 'INR (₹)',
    currencySymbol: '₹',
    terminology: {
      customerTerm: 'Clients',
      employeeTerm: 'Engineers & Staff',
      departmentTerm: 'Departments'
    },
    location: {
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      address: 'Tower 4, Outer Ring Road Tech Hub',
      pinCode: '560103'
    },
    details: {
      teamSize: '45 Engineers & PMs',
      operatingModel: 'Hybrid (Onsite + Cloud)',
      billingCounters: 'N/A',
      gstin: '29AABCT1234K1Z8'
    },
    subscription: {
      plan: 'Enterprise Plus',
      status: 'Active',
      mrr: '₹14,999/mo',
      maxUsers: 150,
      billingCycle: 'Annual',
      renewalDate: '2027-01-15'
    },
    enabledModules: [
      'dashboard',
      'sales',
      'invoices',
      'projects',
      'tasks',
      'employees',
      'departments',
      'expenses',
      'customers',
      'suppliers',
      'automation',
      'ai-assistant',
      'analytics',
      'reports',
      'notifications',
      'settings'
    ],
    stats: {
      monthlyRevenue: '₹5,00,000',
      monthlyExpenses: '₹2,10,000',
      netMargin: '₹2,90,000',
      monthlyGrowth: '+22.4%',
      todayFootfall: '14 Active Client Contracts'
    }
  },
  {
    id: 'org-002',
    companyId: 'SMR-CMP-0002',
    adminId: 'ADM-CMP-0002',
    companyCode: 'GRN-LEAF',
    verification_status: 'VERIFIED',
    name: 'GreenLeaf Restaurant & Cafe',
    type: 'Restaurant / Cafe',
    industry: 'Hospitality & Dining',
    tagline: 'Artisanal Organic Dining & Specialty Roastery',
    currency: 'INR (₹)',
    currencySymbol: '₹',
    terminology: {
      customerTerm: 'Customers',
      employeeTerm: 'Kitchen & Floor Staff',
      departmentTerm: 'Sections'
    },
    location: {
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      address: '14 Bandra West, Linking Road',
      pinCode: '400050'
    },
    details: {
      seatingCapacity: '28 Tables (85 Seats)',
      kdsActive: 'Active (Kitchen Display 2.0)',
      takeawayEnabled: 'Dine-in, Takeaway & Delivery',
      gstin: '27AABCR9876E1Z4'
    },
    subscription: {
      plan: 'Growth Tier',
      status: 'Active',
      mrr: '₹4,999/mo',
      maxUsers: 40,
      billingCycle: 'Monthly',
      renewalDate: '2026-10-10'
    },
    enabledModules: [
      'dashboard',
      'sales',
      'invoices',
      'inventory',
      'expenses',
      'employees',
      'departments',
      'suppliers',
      'appointments',
      'tasks',
      'automation',
      'ai-assistant',
      'analytics',
      'reports',
      'notifications',
      'settings'
    ],
    stats: {
      monthlyRevenue: '₹2,50,000',
      monthlyExpenses: '₹1,20,000',
      netMargin: '₹1,30,000',
      monthlyGrowth: '+14.2%',
      todayFootfall: '96 Tables Served'
    }
  },
  {
    id: 'org-003',
    companyId: 'SMR-CMP-0003',
    adminId: 'ADM-CMP-0003',
    companyCode: 'BRT-EDU',
    verification_status: 'VERIFIED',
    name: 'BrightFuture Institute of Technology',
    type: 'College / Educational Institution',
    industry: 'Higher Education & Research',
    tagline: 'Empowering Next-Gen Technologists & Leaders',
    currency: 'INR (₹)',
    currencySymbol: '₹',
    terminology: {
      customerTerm: 'Students',
      employeeTerm: 'Faculty & Professors',
      departmentTerm: 'Academic Departments'
    },
    location: {
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      address: 'Sector 4, HSR Campus Knowledge Park',
      pinCode: '560102'
    },
    details: {
      campusType: 'Autonomous Engineering Institute',
      studentCapacity: '2,400 Students',
      departmentCount: '6 Academic Departments',
      accreditation: 'NAAC A++ Grade, NBA'
    },
    subscription: {
      plan: 'Campus Enterprise',
      status: 'Active',
      mrr: '₹24,999/mo',
      maxUsers: 500,
      billingCycle: 'Annual',
      renewalDate: '2027-04-01'
    },
    enabledModules: [
      'dashboard',
      'students',
      'employees',
      'departments',
      'attendance',
      'tasks',
      'expenses',
      'automation',
      'ai-assistant',
      'analytics',
      'reports',
      'notifications',
      'settings'
    ],
    stats: {
      monthlyRevenue: '₹7,80,000',
      monthlyExpenses: '₹4,30,000',
      netMargin: '₹3,50,000',
      monthlyGrowth: '+8.6%',
      todayFootfall: '1,680 Students & Faculty Onsite'
    }
  },
  {
    id: 'org-004',
    companyId: 'SMR-CMP-0004',
    adminId: 'ADM-CMP-0004',
    companyCode: 'ABC-RTL',
    verification_status: 'VERIFIED',
    name: 'ABC Retail Store',
    type: 'Retail Shop',
    industry: 'Retail & Supermarket FMCG',
    tagline: 'Fresh Groceries, FMCG & Daily Essentials',
    currency: 'INR (₹)',
    currencySymbol: '₹',
    terminology: {
      customerTerm: 'Customers',
      employeeTerm: 'Store Associates',
      departmentTerm: 'Sections'
    },
    location: {
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      address: '42 Commercial Street, Indiranagar',
      pinCode: '560038'
    },
    details: {
      storeSize: '2,400 sq ft',
      billingCounters: '3 POS Counters',
      barcodeScanner: 'Yes (Zebra 2D)',
      returnWindow: '7 Days Return Policy',
      gstin: '29AABCA1234F1Z8'
    },
    subscription: {
      plan: 'Professional',
      status: 'Active',
      mrr: '₹6,999/mo',
      maxUsers: 50,
      billingCycle: 'Annual',
      renewalDate: '2026-11-20'
    },
    enabledModules: [
      'dashboard',
      'sales',
      'invoices',
      'inventory',
      'expenses',
      'customers',
      'employees',
      'suppliers',
      'tasks',
      'automation',
      'ai-assistant',
      'analytics',
      'reports',
      'notifications',
      'settings'
    ],
    stats: {
      monthlyRevenue: '₹8,45,000',
      monthlyExpenses: '₹3,90,000',
      netMargin: '₹4,55,000',
      monthlyGrowth: '+18.4%',
      todayFootfall: '142 Customers'
    }
  },
  {
    id: 'org-005',
    companyId: 'SMR-CMP-0005',
    adminId: 'ADM-CMP-0005',
    companyCode: 'LIF-CLN',
    verification_status: 'VERIFIED',
    name: 'LifeCare Multi-Speciality Clinic',
    type: 'Clinic / Healthcare',
    industry: 'Healthcare & Diagnostics',
    tagline: 'Advanced Diagnostics & Family Healthcare',
    currency: 'INR (₹)',
    currencySymbol: '₹',
    terminology: {
      customerTerm: 'Patients',
      employeeTerm: 'Doctors & Medical Staff',
      departmentTerm: 'Clinical Specialties'
    },
    location: {
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Chennai',
      address: '88 Anna Salai, T. Nagar',
      pinCode: '600017'
    },
    details: {
      consultationRooms: '6 Suites',
      doctorCount: '8 Physicians',
      emergencyServices: 'Minor Emergencies & Pharmacy',
      gstin: '33AABCL4433P1Z9'
    },
    subscription: {
      plan: 'Professional',
      status: 'Active',
      mrr: '₹8,499/mo',
      maxUsers: 60,
      billingCycle: 'Annual',
      renewalDate: '2027-02-14'
    },
    enabledModules: [
      'dashboard',
      'appointments',
      'customers',
      'invoices',
      'inventory',
      'expenses',
      'employees',
      'tasks',
      'automation',
      'ai-assistant',
      'analytics',
      'reports',
      'notifications',
      'settings'
    ],
    stats: {
      monthlyRevenue: '₹9,60,000',
      monthlyExpenses: '₹4,80,000',
      netMargin: '₹4,80,000',
      monthlyGrowth: '+9.8%',
      todayFootfall: '38 Appointments Booked'
    }
  }
];

export const INITIAL_VERIFICATION_REQUESTS = [
  {
    id: 'VER-2026-001',
    name: 'Zenith BioTech Research Labs',
    organizationType: 'Company',
    type: 'Company',
    industry: 'Biotechnology & Pharmaceuticals',
    registrationNumber: 'U73100KA2022PTC158912',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    address: 'Helix Bio-Science Corridor, Electronic City Phase 1',
    pinCode: '560100',
    contactEmail: 'regulatory@zenithbiotech.demo',
    contactPhone: '+91 98450 67890',
    website: 'https://zenithbiotech.demo',
    submittedBy: 'Dr. Ananya Roy',
    submittedByEmail: 'ananya.roy@zenithbiotech.demo',
    submittedDate: '2026-09-21T09:30:00Z',
    verification_status: 'PENDING',
    reviewer: null,
    reviewedDate: null,
    reviewNotes: '',
    officialCheck: null,
    documents: [
      {
        id: 'DOC-ZNT-01',
        documentType: 'INCORPORATION_CERTIFICATE',
        documentName: 'Certificate_of_Incorporation_Zenith.pdf',
        fileSize: '2.4 MB',
        uploadedDate: '2026-09-21T09:30:00Z',
        uploadedBy: 'Dr. Ananya Roy',
        verificationStatus: 'PENDING'
      },
      {
        id: 'DOC-ZNT-02',
        documentType: 'TAX_REGISTRATION',
        documentName: 'GSTIN_Registration_29AAACZ4812P1Z5.pdf',
        fileSize: '1.1 MB',
        uploadedDate: '2026-09-21T09:32:00Z',
        uploadedBy: 'Dr. Ananya Roy',
        verificationStatus: 'PENDING'
      }
    ],
    aiAnalysis: {
      extractedOrgName: 'Zenith BioTech Research Labs Private Limited',
      extractedRegNumber: 'U73100KA2022PTC158912',
      extractedAddress: 'Helix Bio-Science Corridor, Electronic City Phase 1, Bengaluru, Karnataka',
      issuingAuthority: 'Registrar of Companies (RoC), Karnataka',
      issueDate: '2022-04-12',
      expiryDate: 'Permanent (Perpetual Succession)',
      clarityScore: '98% (High Resolution Scan)',
      tamperRiskAssessment: 'Low Risk — Digital Signature Valid',
      summary: 'Official Certificate of Incorporation matches submitted company legal name and corporate identification number (CIN). Formed under Companies Act 2013.',
      isAuthenticityProof: false,
      disclaimer: 'CRITICAL AUDIT NOTICE: AI OCR extraction is an assistive convenience tool and does NOT constitute official certification or legal proof of authenticity. Final approval strictly requires human reviewer validation.'
    },
    verificationHistory: [
      {
        action: 'VERIFICATION_SUBMITTED',
        timestamp: '2026-09-21T09:32:00Z',
        actor: 'Dr. Ananya Roy',
        notes: 'Initial institutional application and incorporation certificates submitted.'
      }
    ]
  },
  {
    id: 'VER-2026-002',
    name: 'Horizon Global Institute of Technology',
    organizationType: 'College',
    type: 'College',
    industry: 'Higher Education & Autonomous Engineering',
    registrationNumber: 'C-48921-KA',
    country: 'India',
    state: 'Karnataka',
    city: 'Mysuru',
    address: 'Campus Boulevard, Outer Ring Road, Hebbal Industrial Area',
    pinCode: '570018',
    contactEmail: 'director@horizonglobal.demo',
    contactPhone: '+91 94480 34567',
    website: 'https://horizonglobal.demo',
    submittedBy: 'Prof. S. R. Narasimhan',
    submittedByEmail: 'sr.narasimhan@horizonglobal.demo',
    submittedDate: '2026-09-20T14:15:00Z',
    verification_status: 'UNDER_REVIEW',
    reviewer: 'Aarav Singhania',
    reviewedDate: '2026-09-21T10:00:00Z',
    reviewNotes: 'AISHE code validated on central higher education registry. Reviewing curriculum autonomy certificate.',
    officialCheck: {
      source: 'All India Survey on Higher Education (AISHE / UGC Portal)',
      method: 'AISHE_NATIONAL_PORTAL_LOOKUP',
      result: 'MATCH',
      checkedAt: '2026-09-21T10:05:00Z',
      details: 'Institution code C-48921-KA verified on AISHE central education directory. NAAC A+ accreditation status confirmed.',
      officialRecord: {
        officialEntityName: 'Horizon Global Institute of Technology',
        officialRegNumber: 'C-48921-KA',
        institutionCategory: 'Higher Educational Institution',
        statutoryApproval: 'UGC Section 2(f) & 12(B) Recognized',
        accreditationStatus: 'NAAC A+ Accredited',
        registeredState: 'Karnataka'
      }
    },
    documents: [
      {
        id: 'DOC-HRZ-01',
        documentType: 'UNIVERSITY_RECOGNITION',
        documentName: 'UGC_Autonomous_Recognition_Order.pdf',
        fileSize: '3.8 MB',
        uploadedDate: '2026-09-20T14:15:00Z',
        uploadedBy: 'Prof. S. R. Narasimhan',
        verificationStatus: 'PENDING'
      },
      {
        id: 'DOC-HRZ-02',
        documentType: 'AFFILIATION_ORDER',
        documentName: 'University_Affiliation_2026_AISHE.pdf',
        fileSize: '1.9 MB',
        uploadedDate: '2026-09-20T14:16:00Z',
        uploadedBy: 'Prof. S. R. Narasimhan',
        verificationStatus: 'PENDING'
      }
    ],
    aiAnalysis: {
      extractedOrgName: 'Horizon Global Institute of Technology',
      extractedRegNumber: 'C-48921-KA',
      extractedAddress: 'Campus Boulevard, Outer Ring Road, Mysuru, Karnataka',
      issuingAuthority: 'University Grants Commission (UGC) & Affiliated University',
      issueDate: '2021-06-15',
      expiryDate: '2027-06-14',
      clarityScore: '95% (High Resolution PDF Scan)',
      tamperRiskAssessment: 'Low Risk — Official Gazetted Letterhead',
      summary: 'Autonomous status recognition order extracted successfully. Affiliation code matches AISHE directory standard.',
      isAuthenticityProof: false,
      disclaimer: 'CRITICAL AUDIT NOTICE: AI OCR extraction is an assistive convenience tool and does NOT constitute official certification or legal proof of authenticity. Final approval strictly requires human reviewer validation.'
    },
    verificationHistory: [
      {
        action: 'VERIFICATION_SUBMITTED',
        timestamp: '2026-09-20T14:16:00Z',
        actor: 'Prof. S. R. Narasimhan',
        notes: 'Institutional application submitted with UGC recognition orders.'
      },
      {
        action: 'VERIFICATION_STARTED',
        timestamp: '2026-09-21T10:00:00Z',
        actor: 'Aarav Singhania (Platform Owner)',
        notes: 'Review started. AISHE portal check triggered.'
      },
      {
        action: 'OFFICIAL_SOURCE_CHECKED',
        timestamp: '2026-09-21T10:05:00Z',
        actor: 'Aarav Singhania (Platform Owner)',
        notes: 'AISHE portal verification succeeded with MATCH.'
      }
    ]
  },
  {
    id: 'VER-2026-003',
    name: 'CarePoint Multi-Specialty Clinic',
    organizationType: 'Clinic',
    type: 'Clinic',
    industry: 'Healthcare & Specialized Diagnostics',
    registrationNumber: 'CE-TN-48192',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: '104 Avinashi Road, Peelamedu',
    pinCode: '641004',
    contactEmail: 'admin@carepointclinic.demo',
    contactPhone: '+91 94430 89012',
    website: 'https://carepointclinic.demo',
    submittedBy: 'Dr. Vigneshwaran K.',
    submittedByEmail: 'vignesh@carepointclinic.demo',
    submittedDate: '2026-09-19T11:20:00Z',
    verification_status: 'NEEDS_MORE_INFORMATION',
    reviewer: 'Aarav Singhania',
    reviewedDate: '2026-09-20T16:00:00Z',
    reviewNotes: 'Clinical Premises Registration is valid, but biomedical waste authorization certificate from the State Pollution Control Board is missing or outdated. Please upload current authorization.',
    officialCheck: {
      source: 'National Health Authority & State Clinical Registry',
      method: 'STATE_HEALTH_DIRECTORATE_QUERY',
      result: 'PARTIAL_MATCH',
      checkedAt: '2026-09-20T15:55:00Z',
      details: 'Premises license CE-TN-48192 active. Auxiliary biomedical disposal renewal pending on state portal.',
      officialRecord: {
        officialEntityName: 'CarePoint Multi-Specialty Clinic',
        officialRegNumber: 'CE-TN-48192',
        facilityType: 'Multi-Specialty Daycare & Diagnostics',
        registeredState: 'Tamil Nadu'
      }
    },
    documents: [
      {
        id: 'DOC-CPT-01',
        documentType: 'CLINICAL_ESTABLISHMENT_LICENSE',
        documentName: 'TN_Clinical_Establishment_License_2025.pdf',
        fileSize: '2.1 MB',
        uploadedDate: '2026-09-19T11:20:00Z',
        uploadedBy: 'Dr. Vigneshwaran K.',
        verificationStatus: 'VERIFIED'
      }
    ],
    aiAnalysis: {
      extractedOrgName: 'CarePoint Multi-Specialty Clinic',
      extractedRegNumber: 'CE-TN-48192',
      extractedAddress: '104 Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu',
      issuingAuthority: 'State Directorate of Health Services & Clinical Establishments Council',
      issueDate: '2023-01-10',
      expiryDate: '2026-01-09',
      clarityScore: '92% (Clear Scan)',
      tamperRiskAssessment: 'Low Risk — Government Seal Detected',
      summary: 'License extracted. Note: License expiration is approaching and biomedical waste clearance is not attached.',
      isAuthenticityProof: false,
      disclaimer: 'CRITICAL AUDIT NOTICE: AI OCR extraction is an assistive convenience tool and does NOT constitute official certification or legal proof of authenticity. Final approval strictly requires human reviewer validation.'
    },
    verificationHistory: [
      {
        action: 'VERIFICATION_SUBMITTED',
        timestamp: '2026-09-19T11:20:00Z',
        actor: 'Dr. Vigneshwaran K.',
        notes: 'Application submitted with single license attachment.'
      },
      {
        action: 'VERIFICATION_MORE_INFO_REQUESTED',
        timestamp: '2026-09-20T16:00:00Z',
        actor: 'Aarav Singhania (Platform Owner)',
        notes: 'Requested updated biomedical waste clearance NOC.'
      }
    ]
  },
  {
    id: 'VER-2026-004',
    name: 'Starlight Digital Media & Studios',
    organizationType: 'Agency',
    type: 'Agency',
    industry: 'Digital Marketing & Content Production',
    registrationNumber: 'U99999MH2023PTC999999',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: '88 Link Road, Andheri West',
    pinCode: '400053',
    contactEmail: 'legal@starlightmedia.demo',
    contactPhone: '+91 98200 45678',
    website: 'https://starlightmedia.demo',
    submittedBy: 'Kunal Kapoor',
    submittedByEmail: 'kunal@starlightmedia.demo',
    submittedDate: '2026-09-18T16:45:00Z',
    verification_status: 'REJECTED',
    reviewer: 'Aarav Singhania',
    reviewedDate: '2026-09-19T12:30:00Z',
    rejectionReason: 'The submitted CIN (U99999MH2023PTC999999) does not exist in the Ministry of Corporate Affairs (MCA21) database, and the uploaded incorporation scan shows digital font inconsistencies.',
    officialCheck: {
      source: 'National Commercial Database (MCA21 / GSTN)',
      method: 'API_DIRECT_REGISTRY_QUERY',
      result: 'MISMATCH',
      checkedAt: '2026-09-19T12:25:00Z',
      details: 'Registration number not found in MCA master index. Entity verification failed.',
      officialRecord: null
    },
    documents: [
      {
        id: 'DOC-STR-01',
        documentType: 'INCORPORATION_CERTIFICATE',
        documentName: 'Certificate_Scan_Starlight.pdf',
        fileSize: '840 KB',
        uploadedDate: '2026-09-18T16:45:00Z',
        uploadedBy: 'Kunal Kapoor',
        verificationStatus: 'REJECTED'
      }
    ],
    aiAnalysis: {
      extractedOrgName: 'Starlight Digital Media Studios',
      extractedRegNumber: 'U99999MH2023PTC999999',
      extractedAddress: '88 Link Road, Andheri West, Mumbai',
      issuingAuthority: 'Registrar of Companies',
      issueDate: '2023-08-10',
      expiryDate: 'Permanent',
      clarityScore: '74% (Compressed Scan)',
      tamperRiskAssessment: 'Medium-High Risk — Discrepancies detected in font alignment around CIN and date stamp',
      summary: 'Scan analysis detected digital overlay artifacts around corporate ID. Official registry check returns zero matches.',
      isAuthenticityProof: false,
      disclaimer: 'CRITICAL AUDIT NOTICE: AI OCR extraction is an assistive convenience tool and does NOT constitute official certification or legal proof of authenticity. Final approval strictly requires human reviewer validation.'
    },
    verificationHistory: [
      {
        action: 'VERIFICATION_SUBMITTED',
        timestamp: '2026-09-18T16:45:00Z',
        actor: 'Kunal Kapoor',
        notes: 'Initial application submitted.'
      },
      {
        action: 'OFFICIAL_SOURCE_CHECKED',
        timestamp: '2026-09-19T12:25:00Z',
        actor: 'Aarav Singhania (Platform Owner)',
        notes: 'Government registry returned MISMATCH.'
      },
      {
        action: 'VERIFICATION_REJECTED',
        timestamp: '2026-09-19T12:30:00Z',
        actor: 'Aarav Singhania (Platform Owner)',
        notes: 'Application rejected due to invalid statutory credentials.'
      }
    ]
  },
  {
    id: 'VER-2026-005',
    name: 'Asha Gramin Development Foundation',
    organizationType: 'NGO',
    type: 'NGO',
    industry: 'Rural Healthcare & Women Empowerment',
    registrationNumber: 'KA/2020/0254189',
    country: 'India',
    state: 'Karnataka',
    city: 'Dharwad',
    address: 'Near Old Bus Stand, PB Road',
    pinCode: '580001',
    contactEmail: 'contact@ashafoundation.demo',
    contactPhone: '+91 94800 23456',
    website: 'https://ashafoundation.demo',
    submittedBy: 'Shanti Hegde',
    submittedByEmail: 'shanti@ashafoundation.demo',
    submittedDate: '2026-09-17T10:00:00Z',
    verification_status: 'VERIFIED',
    reviewer: 'Aarav Singhania',
    reviewedDate: '2026-09-18T11:00:00Z',
    reviewNotes: 'NITI Aayog NGO-Darpan ID validated. 12A and 80G tax exemption certificates verified in order.',
    officialCheck: {
      source: 'National NGO-Darpan Portal & Central Board of Direct Taxes',
      method: 'DARPAN_CENTRAL_LOOKUP',
      result: 'MATCH',
      checkedAt: '2026-09-18T10:45:00Z',
      details: 'NGO identity and tax-exempt status verified via NITI Aayog portal record.',
      officialRecord: {
        officialEntityName: 'Asha Gramin Development Foundation',
        officialRegNumber: 'KA/2020/0254189',
        panNumber: 'AAATA4891K',
        sec12aRegistration: '12AB Valid',
        sec80gExemption: '80G Exemption in force'
      }
    },
    documents: [
      {
        id: 'DOC-ASH-01',
        documentType: 'NITI_AAYOG_DARPAN',
        documentName: 'NGO_Darpan_Registration_Cert.pdf',
        fileSize: '1.4 MB',
        uploadedDate: '2026-09-17T10:00:00Z',
        uploadedBy: 'Shanti Hegde',
        verificationStatus: 'VERIFIED'
      },
      {
        id: 'DOC-ASH-02',
        documentType: 'TAX_EXEMPTION_12A_80G',
        documentName: '12A_80G_CBDT_Order.pdf',
        fileSize: '1.7 MB',
        uploadedDate: '2026-09-17T10:02:00Z',
        uploadedBy: 'Shanti Hegde',
        verificationStatus: 'VERIFIED'
      }
    ],
    aiAnalysis: {
      extractedOrgName: 'Asha Gramin Development Foundation',
      extractedRegNumber: 'KA/2020/0254189',
      extractedAddress: 'Near Old Bus Stand, PB Road, Dharwad, Karnataka',
      issuingAuthority: 'NITI Aayog & Registrar of Public Societies',
      issueDate: '2020-08-20',
      expiryDate: '2028-08-19',
      clarityScore: '96% (Official Certificate)',
      tamperRiskAssessment: 'Low Risk — Government QR Code verified',
      summary: 'NITI Aayog Darpan unique ID and public trust deed verified. Exemption certificates valid.',
      isAuthenticityProof: false,
      disclaimer: 'CRITICAL AUDIT NOTICE: AI OCR extraction is an assistive convenience tool and does NOT constitute official certification or legal proof of authenticity. Final approval strictly requires human reviewer validation.'
    },
    verificationHistory: [
      {
        action: 'VERIFICATION_SUBMITTED',
        timestamp: '2026-09-17T10:02:00Z',
        actor: 'Shanti Hegde',
        notes: 'NGO application submitted with Darpan and 12A proof.'
      },
      {
        action: 'OFFICIAL_SOURCE_CHECKED',
        timestamp: '2026-09-18T10:45:00Z',
        actor: 'Aarav Singhania (Platform Owner)',
        notes: 'Darpan portal returned MATCH.'
      },
      {
        action: 'VERIFICATION_APPROVED',
        timestamp: '2026-09-18T11:00:00Z',
        actor: 'Aarav Singhania (Platform Owner)',
        notes: 'Approved and tenant workspace provisioned.'
      },
      {
        action: 'ORGANIZATION_ACTIVATED',
        timestamp: '2026-09-18T11:00:00Z',
        actor: 'System Automation',
        notes: 'Tenant workspace activated. Admin account credentials issued.'
      }
    ]
  },
  {
    id: 'VER-2026-006',
    name: 'Apex Heavy Engineering Works',
    organizationType: 'Manufacturing',
    type: 'Manufacturing',
    industry: 'Industrial Fabrications & Heavy Machinery',
    registrationNumber: 'FAC-KA-2018-4491',
    country: 'India',
    state: 'Karnataka',
    city: 'Peenya, Bengaluru',
    address: 'Plot 48, 2nd Stage, Peenya Industrial Area',
    pinCode: '560058',
    contactEmail: 'compliance@apexheavyengg.demo',
    contactPhone: '+91 98451 99887',
    website: 'https://apexheavyengg.demo',
    submittedBy: 'K. Balakrishna',
    submittedByEmail: 'balakrishna@apexheavyengg.demo',
    submittedDate: '2026-08-10T09:00:00Z',
    verification_status: 'SUSPENDED',
    reviewer: 'Aarav Singhania',
    reviewedDate: '2026-09-15T17:00:00Z',
    reviewNotes: 'Tenant suspended following notice from State Pollution Control Board regarding expired Consent to Operate (CTO). Organization access blocked until renewal.',
    officialCheck: {
      source: 'National Commercial Database (MCA21 / GSTN)',
      method: 'API_DIRECT_REGISTRY_QUERY',
      result: 'MISMATCH',
      checkedAt: '2026-09-15T16:50:00Z',
      details: 'Statutory factory compliance status flagged as Lapsed / Under Notice.',
      officialRecord: null
    },
    documents: [],
    aiAnalysis: null,
    verificationHistory: [
      {
        action: 'ORGANIZATION_SUSPENDED',
        timestamp: '2026-09-15T17:00:00Z',
        actor: 'Aarav Singhania (Platform Owner)',
        notes: 'Access suspended due to expired environmental consent.'
      }
    ]
  }
];

export const INITIAL_USERS = [
  // 1. PLATFORM OWNER (Global Operator)
  {
    id: 'kruthikpranavtr',
    userId: 'kruthikpranavtr',
    organization_id: null,
    department_id: null,
    name: 'Kruthik Pranav',
    email: 'owner@smartora.com',
    role: ROLES.PLATFORM_OWNER,
    organizationType: 'SMARTORA_PLATFORM',
    designation: 'SMARTORA Founder & Chief Platform Architect',
    department: 'Platform Operations HQ',
    status: 'Active',
    lastActive: 'Just now',
    permissions: ['*'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },

  // 2. COMPANY ADMINS (Tenant Level)
  {
    id: 'usr-admin-001',
    organization_id: 'org-001',
    department_id: null,
    name: 'Krithika Sharma',
    email: 'admin@techsolutions.demo',
    role: ROLES.COMPANY_ADMIN,
    designation: 'Managing Director & CEO',
    department: 'Executive Leadership',
    status: 'Active',
    lastActive: 'Just now',
    permissions: ['company.manage', 'departments.manage', 'staff.manage', 'finance.manage', 'audit.view', 'automations.manage'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'usr-admin-002',
    organization_id: 'org-002',
    department_id: null,
    name: 'Chef Sanjeev Kapoor',
    email: 'admin@greenleaf.demo',
    role: ROLES.COMPANY_ADMIN,
    designation: 'Managing Partner & Executive Chef',
    department: 'Hospitality Management',
    status: 'Active',
    lastActive: '10 mins ago',
    permissions: ['company.manage', 'departments.manage', 'staff.manage', 'finance.manage', 'inventory.manage'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'usr-admin-003',
    organization_id: 'org-003',
    department_id: null,
    name: 'Dr. Meenakshi Sundaram',
    email: 'principal@brightfuture.demo',
    role: ROLES.COMPANY_ADMIN,
    designation: 'Campus Dean & Principal',
    department: 'Academic Directorate',
    status: 'Active',
    lastActive: '1 hour ago',
    permissions: ['company.manage', 'departments.manage', 'staff.manage', 'academics.manage'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },

  // 3. DEPARTMENT MANAGERS (Scoped to single Department)
  {
    id: 'usr-deptmgr-001',
    organization_id: 'org-001',
    department_id: 'DEP-TECH-01',
    name: 'Rahul Verma',
    email: 'sales.manager@techsolutions.demo',
    role: ROLES.DEPARTMENT_MANAGER,
    designation: 'Head of Enterprise Sales & Accounts',
    department: 'Enterprise Sales & Accounts',
    status: 'Active',
    lastActive: 'Just now',
    permissions: ['sales.view', 'sales.create', 'sales.edit', 'tasks.manage', 'staff.manage', 'customers.view', 'invoices.view'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'usr-deptmgr-002',
    organization_id: 'org-001',
    department_id: 'DEP-TECH-02',
    name: 'Priya Sundaram',
    email: 'eng.lead@techsolutions.demo',
    role: ROLES.DEPARTMENT_MANAGER,
    designation: 'VP of Cloud Engineering',
    department: 'Cloud Engineering & DevOps',
    status: 'Active',
    lastActive: '25 mins ago',
    permissions: ['projects.manage', 'tasks.manage', 'staff.manage', 'inventory.view'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
  },
  {
    id: 'usr-deptmgr-003',
    organization_id: 'org-001',
    department_id: 'DEP-TECH-03',
    name: 'Ananya Deshmukh',
    email: 'hr.head@techsolutions.demo',
    role: ROLES.DEPARTMENT_MANAGER,
    designation: 'Director of People & Talent',
    department: 'Human Resources & Culture',
    status: 'Active',
    lastActive: '45 mins ago',
    permissions: ['employees.manage', 'attendance.manage', 'tasks.manage', 'staff.manage'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'
  },
  {
    id: 'usr-deptmgr-004',
    organization_id: 'org-002',
    department_id: 'DEP-REST-01',
    name: 'Ajay Chopra',
    email: 'kitchen.head@greenleaf.demo',
    role: ROLES.DEPARTMENT_MANAGER,
    designation: 'Executive Sous Chef & Kitchen Lead',
    department: 'Culinary Operations & Pantry',
    status: 'Active',
    lastActive: '15 mins ago',
    permissions: ['inventory.manage', 'suppliers.manage', 'tasks.manage'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },

  // 4. OPERATIONAL STAFF (Restricted to assigned tasks & basic records)
  {
    id: 'usr-staff-001',
    organization_id: 'org-001',
    department_id: 'DEP-TECH-01',
    name: 'Rohan Mehta',
    email: 'staff@techsolutions.demo',
    role: ROLES.STAFF,
    designation: 'Senior Enterprise Sales Associate',
    department: 'Enterprise Sales & Accounts',
    status: 'Active',
    lastActive: 'Just now',
    permissions: ['sales.view', 'sales.create', 'tasks.view', 'customers.view'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  },
  {
    id: 'usr-staff-002',
    organization_id: 'org-001',
    department_id: 'DEP-TECH-02',
    name: 'Vikram Sengupta',
    email: 'dev.vikram@techsolutions.demo',
    role: ROLES.STAFF,
    designation: 'Senior Cloud DevOps Engineer',
    department: 'Cloud Engineering & DevOps',
    status: 'Active',
    lastActive: '1 hour ago',
    permissions: ['projects.view', 'tasks.view', 'tasks.edit'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  {
    id: 'usr-staff-003',
    organization_id: 'org-002',
    department_id: 'DEP-REST-02',
    name: 'Sunil Gowda',
    email: 'cashier@greenleaf.demo',
    role: ROLES.STAFF,
    designation: 'Head Billing & POS Cashier',
    department: 'POS Cashiering & Billing',
    status: 'Active',
    lastActive: '2 hours ago',
    permissions: ['sales.create', 'invoices.create', 'tasks.view'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },

  // 5. END USERS / CLIENTS / CUSTOMERS
  {
    id: 'usr-client-001',
    organization_id: 'org-001',
    department_id: null,
    name: 'Vikramaditya Hegde',
    email: 'customer@techsolutions.demo',
    role: ROLES.END_USER,
    designation: 'Chief Technology Officer @ NexaCorp',
    department: 'Client Portfolio',
    status: 'Active',
    lastActive: 'Just now',
    permissions: ['portal.view', 'invoices.view', 'appointments.book', 'support.create'],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  {
    id: 'usr-client-002',
    organization_id: 'org-002',
    department_id: null,
    name: 'Pooja Hegde',
    email: 'pooja.guest@gmail.com',
    role: ROLES.END_USER,
    designation: 'VIP Dining Club Member',
    department: 'Guest Relations',
    status: 'Active',
    lastActive: '3 days ago',
    permissions: ['portal.view', 'appointments.book'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  {
    id: 'PRIYA-CS-001',
    userId: 'PRIYA-CS-001',
    staffId: 'PRIYA-CS-001',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@brightfuture.demo',
    phone: '+91 98450 67123',
    role: 'HOD',
    organizationType: 'College / Educational Institution',
    organization_id: 'org-003',
    companyId: 'SMR-CMP-0003',
    department_id: 'DEP-CS-01',
    department: 'Computer Science & Engineering',
    designation: 'Head of Department (HOD) & Professor',
    status: 'Active',
    lastActive: 'Just now',
    permissions: ['department.manage', 'faculty.manage', 'students.manage', 'curriculum.manage'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  {
    id: 'RAMESH-CS-001',
    userId: 'RAMESH-CS-001',
    staffId: 'RAMESH-CS-001',
    name: 'Prof. Ramesh Rao',
    email: 'ramesh.rao@brightfuture.demo',
    phone: '+91 98450 78234',
    role: 'FACULTY',
    organizationType: 'College / Educational Institution',
    organization_id: 'org-003',
    companyId: 'SMR-CMP-0003',
    department_id: 'DEP-CS-01',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor & DBMS Lead',
    status: 'Active',
    lastActive: '15 mins ago',
    permissions: ['subjects.view', 'attendance.manage', 'grades.manage'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'ARUN-CS-2026-001',
    userId: 'ARUN-CS-2026-001',
    studentId: 'ARUN-CS-2026-001',
    name: 'Arun Kumar',
    email: 'arun.cs@brightfuture.demo',
    phone: '+91 97412 34567',
    role: 'STUDENT',
    organizationType: 'College / Educational Institution',
    organization_id: 'org-003',
    companyId: 'SMR-CMP-0003',
    department_id: 'DEP-CS-01',
    department: 'Computer Science & Engineering',
    designation: 'Scholar • B.Tech CSE Semester 5',
    status: 'Active',
    lastActive: 'Just now',
    permissions: ['portal.view', 'results.view', 'attendance.view'],
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
  },
  {
    id: 'ARUN-FRONTDESK-001',
    userId: 'ARUN-FRONTDESK-001',
    staffId: 'ARUN-FRONTDESK-001',
    name: 'Arun Kumar',
    email: 'arun.frontdesk@mirage.demo',
    phone: '+91 98450 99881',
    role: ROLES.STAFF,
    organizationType: 'Hotel / Resort',
    organization_id: 'org-002',
    companyId: 'SMR-CMP-0002',
    department_id: 'DEP-FRONTDESK-01',
    department: 'Front Desk & Guest Services',
    designation: 'Lead Front Desk Receptionist',
    status: 'Active',
    lastActive: 'Just now',
    permissions: ['frontdesk.manage', 'rooms.view', 'reservations.manage'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'PRIYA-HOUSEKEEPING-001',
    userId: 'PRIYA-HOUSEKEEPING-001',
    staffId: 'PRIYA-HOUSEKEEPING-001',
    name: 'Priya Sharma',
    email: 'priya.housekeeping@mirage.demo',
    phone: '+91 98450 99882',
    role: ROLES.STAFF,
    organizationType: 'Hotel / Resort',
    organization_id: 'org-002',
    companyId: 'SMR-CMP-0002',
    department_id: 'DEP-HOUSEKEEPING-01',
    department: 'Housekeeping & Rooms Inspection',
    designation: 'Housekeeping Floor Supervisor',
    status: 'Active',
    lastActive: '10 mins ago',
    permissions: ['housekeeping.manage', 'rooms.status'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  }
];

export const INITIAL_CUSTOMERS = [
  { id: 'CUST-101', orgId: 'org-001', name: 'Apex Tech Solutions', contactPerson: 'Suresh Kumar', email: 'procure@apextech.in', phone: '+91 98450 11223', city: 'Bengaluru', orders: 18, totalSpent: 425000, status: 'VIP Enterprise', joinedDate: '2025-01-15' },
  { id: 'CUST-102', orgId: 'org-001', name: 'Nexus BioLabs', contactPerson: 'Dr. Anita Roy', email: 'accounts@nexusbio.com', phone: '+91 98860 44556', city: 'Bengaluru', orders: 12, totalSpent: 280000, status: 'Gold Member', joinedDate: '2025-02-10' },
  { id: 'CUST-103', orgId: 'org-001', name: 'Horizon Residency Residents Welfare', contactPerson: 'Col. Sanjeev Rao', email: 'rwa@horizonresidency.in', phone: '+91 99001 77889', city: 'Bengaluru', orders: 24, totalSpent: 640000, status: 'VIP Enterprise', joinedDate: '2024-11-20' },
  { id: 'CUST-104', orgId: 'org-001', name: 'Zenith Logistics Hub', contactPerson: 'Karan Malik', email: 'operations@zenithlog.com', phone: '+91 97411 33445', city: 'Bengaluru', orders: 9, totalSpent: 145000, status: 'Silver Member', joinedDate: '2025-03-05' },
  { id: 'CUST-105', orgId: 'org-001', name: 'CloudScale Co-Working Space', contactPerson: 'Pooja Hegde', email: 'facility@cloudscale.io', phone: '+91 96112 88990', city: 'Bengaluru', orders: 15, totalSpent: 390000, status: 'VIP Enterprise', joinedDate: '2025-01-28' },
  { id: 'CUST-106', orgId: 'org-001', name: 'Sterling Cafe & Bakery', contactPerson: 'Varun Grover', email: 'kitchen@sterlingcafe.in', phone: '+91 94480 22334', city: 'Bengaluru', orders: 8, totalSpent: 182000, status: 'Gold Member', joinedDate: '2025-04-12' },
  { id: 'CUST-107', orgId: 'org-001', name: 'Indus Creative Studio', contactPerson: 'Sneha Kapur', email: 'studio@indusart.com', phone: '+91 98220 55667', city: 'Bengaluru', orders: 7, totalSpent: 95000, status: 'Silver Member', joinedDate: '2025-05-18' },
  { id: 'CUST-108', orgId: 'org-001', name: 'PrimeCare Daycare & Clinic', contactPerson: 'Dr. Vivek Menon', email: 'admin@primecare.org', phone: '+91 99160 99881', city: 'Bengaluru', orders: 16, totalSpent: 510000, status: 'VIP Enterprise', joinedDate: '2024-10-15' },
  { id: 'CUST-109', orgId: 'org-001', name: 'Ramesh Patel', contactPerson: 'Ramesh Patel', email: 'ramesh.patel@gmail.com', phone: '+91 98234 11200', city: 'Bengaluru', orders: 32, totalSpent: 78500, status: 'Gold Member', joinedDate: '2024-09-01' },
  { id: 'CUST-110', orgId: 'org-001', name: 'Sunita & Deepak Verma', contactPerson: 'Sunita Verma', email: 'sunita.v@outlook.com', phone: '+91 98451 22345', city: 'Bengaluru', orders: 41, totalSpent: 112000, status: 'VIP Enterprise', joinedDate: '2024-08-14' },
  { id: 'CUST-111', orgId: 'org-001', name: 'Vikramaditya Hegde', contactPerson: 'Vikram Hegde', email: 'v.hegde@techcorp.in', phone: '+91 97312 33456', city: 'Bengaluru', orders: 19, totalSpent: 48000, status: 'Regular', joinedDate: '2025-02-22' },
  { id: 'CUST-112', orgId: 'org-001', name: 'Meera & Anand Sen', contactPerson: 'Meera Sen', email: 'meera.sen88@yahoo.com', phone: '+91 96200 44567', city: 'Bengaluru', orders: 27, totalSpent: 67500, status: 'Gold Member', joinedDate: '2024-12-05' },
  { id: 'CUST-113', orgId: 'org-001', name: 'Rajesh & Kavitha Kumar', contactPerson: 'Rajesh Kumar', email: 'rajesh.k@gmail.com', phone: '+91 98862 55678', city: 'Bengaluru', orders: 36, totalSpent: 94200, status: 'Gold Member', joinedDate: '2024-10-30' },
  { id: 'CUST-114', orgId: 'org-001', name: 'Priya Nambiar', contactPerson: 'Priya Nambiar', email: 'priya.nam@hotmail.com', phone: '+91 99003 66789', city: 'Bengaluru', orders: 14, totalSpent: 36800, status: 'Regular', joinedDate: '2025-03-14' },
  { id: 'CUST-115', orgId: 'org-001', name: 'Anand Joshi', contactPerson: 'Anand Joshi', email: 'anand.joshi@wipro.com', phone: '+91 98452 77890', city: 'Bengaluru', orders: 22, totalSpent: 59400, status: 'Silver Member', joinedDate: '2025-01-08' },
  { id: 'CUST-116', orgId: 'org-001', name: 'Divya & Karthik Balaji', contactPerson: 'Divya Balaji', email: 'divya.balaji@gmail.com', phone: '+91 97413 88901', city: 'Bengaluru', orders: 29, totalSpent: 81200, status: 'Gold Member', joinedDate: '2024-11-12' },
  { id: 'CUST-117', orgId: 'org-001', name: 'Sanjay Dutt Sharma', contactPerson: 'Sanjay Sharma', email: 'sanjaysharma@infosys.com', phone: '+91 96114 99012', city: 'Bengaluru', orders: 11, totalSpent: 29500, status: 'Regular', joinedDate: '2025-04-01' },
  { id: 'CUST-118', orgId: 'org-001', name: 'Swati & Nitin Joshi', contactPerson: 'Swati Joshi', email: 'swati.josh@rediffmail.com', phone: '+91 94482 10123', city: 'Bengaluru', orders: 25, totalSpent: 63000, status: 'Silver Member', joinedDate: '2025-01-19' },
  { id: 'CUST-119', orgId: 'org-001', name: 'Manish Chawla', contactPerson: 'Manish Chawla', email: 'manish.chawla@gmail.com', phone: '+91 98222 21234', city: 'Bengaluru', orders: 17, totalSpent: 44200, status: 'Regular', joinedDate: '2025-02-17' },
  { id: 'CUST-120', orgId: 'org-001', name: 'Shreya & Rohan Ghoshal', contactPerson: 'Shreya Ghoshal', email: 'shreya.g@soundart.in', phone: '+91 99162 32345', city: 'Bengaluru', orders: 30, totalSpent: 88900, status: 'Gold Member', joinedDate: '2024-09-18' },
  { id: 'CUST-121', orgId: 'org-001', name: 'Gautam Banerjee', contactPerson: 'Gautam Banerjee', email: 'gautam.b@tcs.com', phone: '+91 98453 43456', city: 'Bengaluru', orders: 13, totalSpent: 31500, status: 'Regular', joinedDate: '2025-03-29' },
  { id: 'CUST-122', orgId: 'org-001', name: 'Deepika Sen', contactPerson: 'Deepika Sen', email: 'deepika.sen@designhub.in', phone: '+91 98864 54567', city: 'Bengaluru', orders: 21, totalSpent: 52000, status: 'Silver Member', joinedDate: '2025-02-04' },
  { id: 'CUST-123', orgId: 'org-001', name: 'Tanmay & Rhea Bhat', contactPerson: 'Tanmay Bhat', email: 'tanmay.bhat@mediaworks.com', phone: '+91 99005 65678', city: 'Bengaluru', orders: 38, totalSpent: 104500, status: 'VIP Enterprise', joinedDate: '2024-08-25' },
  { id: 'CUST-124', orgId: 'org-001', name: 'Aditya & Neha Kulkarni', contactPerson: 'Aditya Kulkarni', email: 'aditya.k@gmail.com', phone: '+91 97314 76789', city: 'Bengaluru', orders: 16, totalSpent: 41200, status: 'Regular', joinedDate: '2025-04-10' },
  { id: 'CUST-125', orgId: 'org-001', name: 'Harish & Rekha Babu', contactPerson: 'Harish Babu', email: 'harishbabu@realestate.in', phone: '+91 96202 87890', city: 'Bengaluru', orders: 26, totalSpent: 73000, status: 'Gold Member', joinedDate: '2024-11-04' }
];

export const INITIAL_EMPLOYEES = [
  { id: 'EMP-01', orgId: 'org-001', name: 'Rajeshwari Iyer', department: 'Store Operations', role: 'General Store Manager', attendance: 98, tasks: 9, performance: 'Outstanding', status: 'Active', salary: '₹65,000/mo', joined: '2022-04-15' },
  { id: 'EMP-02', orgId: 'org-001', name: 'Manoj Pillai', department: 'Inventory & Stock', role: 'Inventory Controller', attendance: 94, tasks: 7, performance: 'Outstanding', status: 'Active', salary: '₹38,000/mo', joined: '2022-08-10' },
  { id: 'EMP-03', orgId: 'org-001', name: 'Sunil Gowda', department: 'Billing & Cash', role: 'Head Cashier (Counter 1)', attendance: 96, tasks: 4, performance: 'Good', status: 'Active', salary: '₹28,000/mo', joined: '2023-01-20' },
  { id: 'EMP-04', orgId: 'org-001', name: 'Kavita Chawla', department: 'Accounts & GST', role: 'Chief Accountant', attendance: 95, tasks: 11, performance: 'Outstanding', status: 'Active', salary: '₹48,000/mo', joined: '2022-11-01' },
  { id: 'EMP-05', orgId: 'org-001', name: 'Deepak Thadani', department: 'Store Operations', role: 'Floor Supervisor', attendance: 90, tasks: 12, performance: 'Good', status: 'Active', salary: '₹32,000/mo', joined: '2023-03-12' },
  { id: 'EMP-06', orgId: 'org-001', name: 'Meena Kumari', department: 'Billing & Cash', role: 'POS Cashier (Counter 2)', attendance: 92, tasks: 5, performance: 'Good', status: 'Active', salary: '₹24,000/mo', joined: '2023-06-05' },
  { id: 'EMP-07', orgId: 'org-001', name: 'Ravi Shankar', department: 'Inventory & Stock', role: 'Stock Assistant (Warehouse)', attendance: 88, tasks: 8, performance: 'Good', status: 'Active', salary: '₹22,000/mo', joined: '2023-09-18' },
  { id: 'EMP-08', orgId: 'org-001', name: 'Pooja Reddy', department: 'Sales & Customer Care', role: 'Customer Service Lead', attendance: 97, tasks: 6, performance: 'Outstanding', status: 'Active', salary: '₹26,000/mo', joined: '2023-02-14' },
  { id: 'EMP-09', orgId: 'org-001', name: 'Anand Prakash', department: 'Dispatch & Delivery', role: 'Delivery & Logistics Partner', attendance: 89, tasks: 14, performance: 'Good', status: 'Active', salary: '₹21,000/mo', joined: '2023-05-10' },
  { id: 'EMP-10', orgId: 'org-001', name: 'Divya Nambiar', department: 'Procurement', role: 'Vendor Relations Specialist', attendance: 95, tasks: 8, performance: 'Outstanding', status: 'Active', salary: '₹36,000/mo', joined: '2023-07-01' },
  { id: 'EMP-11', orgId: 'org-001', name: 'Siddharth Rao', department: 'IT & POS Systems', role: 'Systems & Network Admin', attendance: 93, tasks: 6, performance: 'Good', status: 'Active', salary: '₹34,000/mo', joined: '2023-10-01' },
  { id: 'EMP-12', orgId: 'org-001', name: 'Karthik Raja', department: 'Inventory & Stock', role: 'Replenishment Associate', attendance: 91, tasks: 7, performance: 'Good', status: 'Active', salary: '₹22,000/mo', joined: '2024-01-15' },
  { id: 'EMP-13', orgId: 'org-001', name: 'Naveen Kumar', department: 'Billing & Cash', role: 'POS Cashier (Counter 3)', attendance: 94, tasks: 5, performance: 'Good', status: 'Active', salary: '₹24,000/mo', joined: '2024-02-01' },
  { id: 'EMP-14', orgId: 'org-001', name: 'Lakshmi Devi', department: 'Facility & Hygiene', role: 'Store Hygiene & Sanitization', attendance: 96, tasks: 3, performance: 'Outstanding', status: 'Active', salary: '₹18,000/mo', joined: '2022-06-01' },
  { id: 'EMP-15', orgId: 'org-001', name: 'Harish Babu', department: 'Facility & Hygiene', role: 'Security & In-Store Loss Prevention', attendance: 94, tasks: 4, performance: 'Good', status: 'Active', salary: '₹20,000/mo', joined: '2023-04-10' }
];

export const INITIAL_PRODUCTS = [
  // Groceries & Staples
  { id: 'PRD-001', orgId: 'org-001', name: 'India Gate Basmati Rice 5kg', category: 'Groceries & Staples', sku: 'GRO-BAS-001', stock: 42, minStock: 15, price: 540, unit: '5kg Bag', status: 'Healthy', supplier: 'ITC Agribusiness Supply' },
  { id: 'PRD-002', orgId: 'org-001', name: 'Aashirvaad Shudh Chakki Atta 10kg', category: 'Groceries & Staples', sku: 'GRO-ATT-002', stock: 55, minStock: 20, price: 480, unit: '10kg Bag', status: 'Healthy', supplier: 'ITC Agribusiness Supply' },
  { id: 'PRD-003', orgId: 'org-001', name: 'Fortune Sunlite Refined Oil 5L', category: 'Groceries & Staples', sku: 'GRO-OIL-003', stock: 6, minStock: 12, price: 690, unit: '5L Can', status: 'Low Stock', supplier: 'Adani Wilmar Distributors' },
  { id: 'PRD-004', orgId: 'org-001', name: 'Tata Salt Vacuum Evaporated 1kg', category: 'Groceries & Staples', sku: 'GRO-SLT-004', stock: 85, minStock: 30, price: 28, unit: '1kg Pouch', status: 'Healthy', supplier: 'Tata Consumer Products' },
  { id: 'PRD-005', orgId: 'org-001', name: 'Organic Tattva Turmeric Powder 500g', category: 'Groceries & Staples', sku: 'GRO-SP-005', stock: 24, minStock: 10, price: 145, unit: '500g Pack', status: 'Healthy', supplier: 'Organic Organics Hub' },
  { id: 'PRD-006', orgId: 'org-001', name: 'Tata Sampann Unpolished Toor Dal 2kg', category: 'Groceries & Staples', sku: 'GRO-DAL-006', stock: 3, minStock: 10, price: 290, unit: '2kg Pouch', status: 'Low Stock', supplier: 'Tata Consumer Products' },
  { id: 'PRD-007', orgId: 'org-001', name: 'Amul Pure Cow Ghee 1L Tin', category: 'Dairy & Breakfast', sku: 'DAI-GHE-007', stock: 18, minStock: 8, price: 640, unit: '1L Tin', status: 'Healthy', supplier: 'Amul Dairy Cooperative' },
  { id: 'PRD-008', orgId: 'org-001', name: 'Dabur 100% Pure Honey 500g', category: 'Dairy & Breakfast', sku: 'DAI-HON-008', stock: 2, minStock: 8, price: 215, unit: '500g Squeezy', status: 'Low Stock', supplier: 'Dabur Regional Distributors' },
  { id: 'PRD-009', orgId: 'org-001', name: 'Kellogg\'s Real Almond Honey Corn Flakes 1kg', category: 'Dairy & Breakfast', sku: 'DAI-CRN-009', stock: 16, minStock: 6, price: 360, unit: '1kg Box', status: 'Healthy', supplier: 'Kellogg India Depot' },
  { id: 'PRD-010', orgId: 'org-001', name: 'Quaker Rolled Oats 1kg Pouch', category: 'Dairy & Breakfast', sku: 'DAI-OAT-010', stock: 22, minStock: 8, price: 190, unit: '1kg Pouch', status: 'Healthy', supplier: 'PepsiCo Food Logistics' },
  
  // Beverages & Snacks
  { id: 'PRD-011', orgId: 'org-001', name: 'Nescafe Classic Instant Coffee 200g Jar', category: 'Beverages & Snacks', sku: 'BEV-COF-011', stock: 14, minStock: 8, price: 395, unit: '200g Glass Jar', status: 'Healthy', supplier: 'Nestle Wholesale Hub' },
  { id: 'PRD-012', orgId: 'org-001', name: 'Tata Tea Gold Premium 1kg', category: 'Beverages & Snacks', sku: 'BEV-TEA-012', stock: 35, minStock: 12, price: 560, unit: '1kg Pack', status: 'Healthy', supplier: 'Tata Consumer Products' },
  { id: 'PRD-013', orgId: 'org-001', name: 'Cadbury Dairy Milk Silk Chocolate 150g', category: 'Beverages & Snacks', sku: 'SNA-CHO-013', stock: 48, minStock: 15, price: 175, unit: '150g Bar', status: 'Healthy', supplier: 'Mondelez India Wholesalers' },
  { id: 'PRD-014', orgId: 'org-001', name: 'Lay\'s Spanish Tomato Tango 50g (Pack of 5)', category: 'Beverages & Snacks', sku: 'SNA-CHP-014', stock: 0, minStock: 20, price: 100, unit: 'Pack of 5', status: 'Out of Stock', supplier: 'PepsiCo Food Logistics' },
  { id: 'PRD-015', orgId: 'org-001', name: 'Real Fruit Power Mixed Fruit Juice 1L', category: 'Beverages & Snacks', sku: 'BEV-JUC-015', stock: 26, minStock: 10, price: 130, unit: '1L Tetrapack', status: 'Healthy', supplier: 'Dabur Regional Distributors' },
  { id: 'PRD-016', orgId: 'org-001', name: 'Epigamia Greek Yogurt Natural 400g', category: 'Dairy & Breakfast', sku: 'DAI-YOG-016', stock: 5, minStock: 10, price: 180, unit: '400g Tub', status: 'Low Stock', supplier: 'Drums Food Wholesale' },

  // Personal Care & Hygiene
  { id: 'PRD-017', orgId: 'org-001', name: 'Dettol Antiseptic Liquid 550ml Bottle', category: 'Personal Care', sku: 'PER-DET-017', stock: 38, minStock: 12, price: 210, unit: '550ml Bottle', status: 'Healthy', supplier: 'Reckitt Benckiser Supply' },
  { id: 'PRD-018', orgId: 'org-001', name: 'Dove Cream Beauty Bathing Bar 4x100g', category: 'Personal Care', sku: 'PER-SOAP-018', stock: 28, minStock: 10, price: 240, unit: '4-Soap Multipack', status: 'Healthy', supplier: 'Hindustan FMCG Distributors' },
  { id: 'PRD-019', orgId: 'org-001', name: 'Colgate MaxFresh Spicy Fresh Toothpaste 150g', category: 'Personal Care', sku: 'PER-PST-019', stock: 45, minStock: 15, price: 115, unit: '150g Tube', status: 'Healthy', supplier: 'Colgate-Palmolive Supply' },
  { id: 'PRD-020', orgId: 'org-001', name: 'Head & Shoulders Cool Menthol Shampoo 650ml', category: 'Personal Care', sku: 'PER-SHM-020', stock: 1, minStock: 6, price: 520, unit: '650ml Pump Bottle', status: 'Low Stock', supplier: 'Procter & Gamble Depot' },
  { id: 'PRD-021', orgId: 'org-001', name: 'Nivea Soft Light Moisturizing Cream 200ml', category: 'Personal Care', sku: 'PER-CRM-021', stock: 19, minStock: 6, price: 280, unit: '200ml Tub', status: 'Healthy', supplier: 'Beiersdorf Logistics' },

  // Household & Cleaning
  { id: 'PRD-022', orgId: 'org-001', name: 'Surf Excel Matic Top Load Detergent 2kg', category: 'Household & Cleaning', sku: 'HOU-DET-022', stock: 31, minStock: 10, price: 450, unit: '2kg Box', status: 'Healthy', supplier: 'Hindustan FMCG Distributors' },
  { id: 'PRD-023', orgId: 'org-001', name: 'Vim Lemon Dishwash Liquid Gel 750ml', category: 'Household & Cleaning', sku: 'HOU-VIM-023', stock: 25, minStock: 12, price: 155, unit: '750ml Squeeze', status: 'Healthy', supplier: 'Hindustan FMCG Distributors' },
  { id: 'PRD-024', orgId: 'org-001', name: 'Harpic Power Plus Disinfectant Toilet Cleaner 1L', category: 'Household & Cleaning', sku: 'HOU-HRP-024', stock: 40, minStock: 15, price: 195, unit: '1L Bottle', status: 'Healthy', supplier: 'Reckitt Benckiser Supply' },
  { id: 'PRD-025', orgId: 'org-001', name: 'Good Knight Gold Flash Liquid Vaporizer Refill (Pack of 2)', category: 'Household & Cleaning', sku: 'HOU-MOS-025', stock: 0, minStock: 12, price: 170, unit: 'Twin Refill Pack', status: 'Out of Stock', supplier: 'Godrej Consumer Products' },
  { id: 'PRD-026', orgId: 'org-001', name: 'Scotch-Brite Cellulose Sponge Wipe (Pack of 3)', category: 'Household & Cleaning', sku: 'HOU-WIP-026', stock: 30, minStock: 10, price: 110, unit: 'Pack of 3', status: 'Healthy', supplier: '3M India Distributors' },

  // Electronics, Batteries & Utilities
  { id: 'PRD-027', orgId: 'org-001', name: 'Duracell Ultra Alkaline AA Batteries (Pack of 8)', category: 'Electronics & Utilities', sku: 'ELE-BAT-027', stock: 22, minStock: 8, price: 360, unit: 'Blister Pack of 8', status: 'Healthy', supplier: 'Syska Electronics Wholesalers' },
  { id: 'PRD-028', orgId: 'org-001', name: 'Portronics Konnect Pro Fast Type-C Cable 1.5m', category: 'Electronics & Utilities', sku: 'ELE-CBL-028', stock: 15, minStock: 5, price: 299, unit: 'Braided Cable', status: 'Healthy', supplier: 'Syska Electronics Wholesalers' },
  { id: 'PRD-029', orgId: 'org-001', name: 'boAt Bassheads 100 Wired Earphones with Mic', category: 'Electronics & Utilities', sku: 'ELE-AUD-029', stock: 4, minStock: 6, price: 399, unit: 'Unit with Pouch', status: 'Low Stock', supplier: 'Imagine Marketing Hub' },
  { id: 'PRD-030', orgId: 'org-001', name: 'SanDisk 64GB Ultra Dual USB 3.0 Pen Drive', category: 'Electronics & Utilities', sku: 'ELE-STR-030', stock: 12, minStock: 5, price: 499, unit: 'Unit', status: 'Healthy', supplier: 'Syska Electronics Wholesalers' },
  { id: 'PRD-031', orgId: 'org-001', name: 'Syska 9W Cool Daylight LED Bulbs (Pack of 4)', category: 'Electronics & Utilities', sku: 'ELE-BLB-031', stock: 28, minStock: 8, price: 320, unit: 'Pack of 4', status: 'Healthy', supplier: 'Syska Electronics Wholesalers' },
  { id: 'PRD-032', orgId: 'org-001', name: 'Saffola Gold Pro Healthy Lifestyle Edible Oil 2L', category: 'Groceries & Staples', sku: 'GRO-SAF-032', stock: 17, minStock: 8, price: 390, unit: '2L Bottle', status: 'Healthy', supplier: 'Marico Wholesale Partners' }
];

export const INITIAL_SALES = [
  // Company A (Tech Solutions - org-001): Exact ₹5,00,000 total revenue
  { id: 'ORD-TECH-01', orgId: 'org-001', customer: 'NexaCorp Global', product: 'Enterprise Cloud Migration SOW Phase 2', amount: 185000, date: '2026-09-20', status: 'Completed', paymentMethod: 'Corporate Wire' },
  { id: 'ORD-TECH-02', orgId: 'org-001', customer: 'Zenith Fintech Labs', product: 'AI Microservices & Kubernetes Architecture', amount: 145000, date: '2026-09-18', status: 'Completed', paymentMethod: 'Corporate Wire' },
  { id: 'ORD-TECH-03', orgId: 'org-001', customer: 'Horizon Data Systems', product: 'Q3 Dedicated DevOps Engineering Sprint', amount: 95000, date: '2026-09-15', status: 'Completed', paymentMethod: 'Net Banking' },
  { id: 'ORD-TECH-04', orgId: 'org-001', customer: 'CloudScale Co-Working', product: 'Enterprise Identity & SSO Security Audit', amount: 50000, date: '2026-09-12', status: 'Completed', paymentMethod: 'Corporate Card' },
  { id: 'ORD-TECH-05', orgId: 'org-001', customer: 'Indus Creative Studio', product: 'Cloud Storage Pipeline Optimization', amount: 25000, date: '2026-09-08', status: 'Completed', paymentMethod: 'UPI / Razorpay' },

  // Company B (GreenLeaf Restaurant - org-002): Exact ₹2,50,000 total revenue
  { id: 'ORD-REST-01', orgId: 'org-002', customer: 'Bandra Corporate Club', product: 'Annual Executive Dinner Banquet Catering (120 Pax)', amount: 95000, date: '2026-09-19', status: 'Completed', paymentMethod: 'Corporate Cheque' },
  { id: 'ORD-REST-02', orgId: 'org-002', customer: 'Artisan Roasters Guild', product: 'Weekend Coffee Festival & Specialty Tasting Pop-up', amount: 65000, date: '2026-09-17', status: 'Completed', paymentMethod: 'UPI / Razorpay' },
  { id: 'ORD-REST-03', orgId: 'org-002', customer: 'Swiggy / Zomato Online Kitchen', product: 'Weekly High-Volume Cloud Kitchen Gourmet Box Batch', amount: 45000, date: '2026-09-16', status: 'Completed', paymentMethod: 'Bank Settlement' },
  { id: 'ORD-REST-04', orgId: 'org-002', customer: 'Dr. Vivek & Anita Roy', product: 'Family Milestone Celebration Dinner & High Tea (35 Pax)', amount: 30000, date: '2026-09-14', status: 'Completed', paymentMethod: 'Credit Card' },
  { id: 'ORD-REST-05', orgId: 'org-002', customer: 'Daily In-House Dining POS', product: 'Walk-in Chef Tasting Menus & Table Service POS Aggregation', amount: 15000, date: '2026-09-12', status: 'Completed', paymentMethod: 'UPI / GPay' },

  // Company D (ABC Retail Store - org-004)
  { id: 'ORD-7001', orgId: 'org-004', customer: 'Apex Tech Solutions', product: 'Duracell AA Batteries x 40, Nescafe Coffee 200g x 15', amount: 20325, date: '2026-09-20', status: 'Completed', paymentMethod: 'Corporate Wire' },
  { id: 'ORD-7002', orgId: 'org-004', customer: 'Horizon Residency Residents Welfare', product: 'Surf Excel Matic 2kg x 25, Harpic 1L x 30', amount: 17100, date: '2026-09-20', status: 'Completed', paymentMethod: 'UPI / PhonePe' },
  { id: 'ORD-7003', orgId: 'org-004', customer: 'CloudScale Co-Working Space', product: 'Tata Tea Gold 1kg x 12, Nescafe Classic 200g x 10', amount: 10670, date: '2026-09-19', status: 'Completed', paymentMethod: 'Corporate Card' },
  { id: 'ORD-7004', orgId: 'org-004', customer: 'Sterling Cafe & Bakery', product: 'Fortune Refined Oil 5L x 8, Tata Salt 1kg x 40', amount: 6640, date: '2026-09-19', status: 'Completed', paymentMethod: 'UPI / Razorpay' },
  { id: 'ORD-7005', orgId: 'org-004', customer: 'PrimeCare Daycare & Clinic', product: 'Dettol 550ml x 20, Dove Soap 4-pack x 15', amount: 7800, date: '2026-09-18', status: 'Completed', paymentMethod: 'Corporate Wire' }
];

export const INITIAL_INVOICES = [
  {
    id: 'INV-2026-001',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-001',
    customer: 'Apex Tech Solutions',
    customerEmail: 'procure@apextech.in',
    customerAddress: 'Tower 4, Embassy Tech Village, Outer Ring Road, Bengaluru',
    date: '2026-09-20',
    dueDate: '2026-10-05',
    subtotal: 17224,
    tax: 3101, // 18% GST
    total: 20325,
    status: 'Paid',
    paymentMethod: 'Corporate Wire',
    items: [
      { description: 'Duracell Ultra Alkaline AA Batteries (Pack of 8)', quantity: 40, unitPrice: 360, total: 14400 },
      { description: 'Nescafe Classic Instant Coffee 200g Jar', quantity: 15, unitPrice: 395, total: 5925 }
    ],
    notes: 'Thank you for choosing ABC Retail Store. Bulk supply order for Office Cafeteria & Facilities.'
  },
  {
    id: 'INV-2026-002',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-002',
    customer: 'Horizon Residency Residents Welfare',
    customerEmail: 'rwa@horizonresidency.in',
    customerAddress: 'Clubhouse Office, Horizon Residency, Indiranagar, Bengaluru',
    date: '2026-09-20',
    dueDate: '2026-09-30',
    subtotal: 14491,
    tax: 2609,
    total: 17100,
    status: 'Paid',
    paymentMethod: 'UPI / PhonePe',
    items: [
      { description: 'Surf Excel Matic Top Load Detergent 2kg', quantity: 25, unitPrice: 450, total: 11250 },
      { description: 'Harpic Power Plus Disinfectant Toilet Cleaner 1L', quantity: 30, unitPrice: 195, total: 5850 }
    ],
    notes: 'Monthly bulk maintenance sanitation supplies.'
  },
  {
    id: 'INV-2026-003',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-003',
    customer: 'CloudScale Co-Working Space',
    customerEmail: 'facility@cloudscale.io',
    customerAddress: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    date: '2026-09-19',
    dueDate: '2026-10-04',
    subtotal: 9042,
    tax: 1628,
    total: 10670,
    status: 'Paid',
    paymentMethod: 'Corporate Card',
    items: [
      { description: 'Tata Tea Gold Premium 1kg', quantity: 12, unitPrice: 560, total: 6720 },
      { description: 'Nescafe Classic Instant Coffee 200g Jar', quantity: 10, unitPrice: 395, total: 3950 }
    ],
    notes: 'Pantry restocking supplies.'
  },
  {
    id: 'INV-2026-004',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-004',
    customer: 'Sterling Cafe & Bakery',
    customerEmail: 'kitchen@sterlingcafe.in',
    customerAddress: '12 Defence Colony Main Road, Indiranagar, Bengaluru',
    date: '2026-09-19',
    dueDate: '2026-09-29',
    subtotal: 5627,
    tax: 1013,
    total: 6640,
    status: 'Pending',
    paymentMethod: 'UPI / Net 15',
    items: [
      { description: 'Fortune Sunlite Refined Oil 5L Can', quantity: 8, unitPrice: 690, total: 5520 },
      { description: 'Tata Salt Vacuum Evaporated 1kg', quantity: 40, unitPrice: 28, total: 1120 }
    ],
    notes: 'Kitchen provisions order. Net 15 terms.'
  },
  {
    id: 'INV-2026-005',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-005',
    customer: 'PrimeCare Daycare & Clinic',
    customerEmail: 'admin@primecare.org',
    customerAddress: '18 CMH Road, Lakshmipuram, Indiranagar, Bengaluru',
    date: '2026-09-18',
    dueDate: '2026-10-02',
    subtotal: 6610,
    tax: 1190,
    total: 7800,
    status: 'Paid',
    paymentMethod: 'Corporate Wire',
    items: [
      { description: 'Dettol Antiseptic Liquid 550ml Bottle', quantity: 20, unitPrice: 210, total: 4200 },
      { description: 'Dove Cream Beauty Bathing Bar 4x100g', quantity: 15, unitPrice: 240, total: 3600 }
    ],
    notes: 'Hygiene & patient wellness supplies.'
  },
  {
    id: 'INV-2026-006',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-006',
    customer: 'Nexus BioLabs',
    customerEmail: 'accounts@nexusbio.com',
    customerAddress: 'Bio-Innovation Park, Phase 1, Electronic City, Bengaluru',
    date: '2026-09-17',
    dueDate: '2026-09-24',
    subtotal: 4739,
    tax: 853,
    total: 5592,
    status: 'Overdue',
    paymentMethod: 'Invoice Net 7',
    items: [
      { description: 'Syska 9W Cool Daylight LED Bulbs (Pack of 4)', quantity: 10, unitPrice: 320, total: 3200 },
      { description: 'Portronics Konnect Pro Fast Type-C Cable', quantity: 8, unitPrice: 299, total: 2392 }
    ],
    notes: 'Payment reminder sent. Due date was September 24.'
  },
  {
    id: 'INV-2026-007',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-007',
    customer: 'Zenith Logistics Hub',
    customerEmail: 'operations@zenithlog.com',
    customerAddress: 'Plot 55, Peenya Industrial Area 3rd Phase, Bengaluru',
    date: '2026-09-16',
    dueDate: '2026-09-30',
    subtotal: 5063,
    tax: 912,
    total: 5975,
    status: 'Pending',
    paymentMethod: 'UPI / GPay',
    items: [
      { description: 'Vim Lemon Dishwash Liquid Gel 750ml', quantity: 15, unitPrice: 155, total: 2325 },
      { description: 'Harpic Power Plus Toilet Cleaner 1L', quantity: 10, unitPrice: 195, total: 1950 },
      { description: 'Good Knight Gold Flash Liquid Vaporizer Twin', quantity: 10, unitPrice: 170, total: 1700 }
    ],
    notes: 'Warehouse hub housekeeping package.'
  },
  {
    id: 'INV-2026-008',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-008',
    customer: 'CloudScale Co-Working Space',
    customerEmail: 'facility@cloudscale.io',
    customerAddress: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    date: '2026-09-14',
    dueDate: '2026-09-28',
    subtotal: 5610,
    tax: 1010,
    total: 6620,
    status: 'Paid',
    paymentMethod: 'Corporate Card',
    items: [
      { description: 'Real Fruit Power Mixed Fruit Juice 1L', quantity: 24, unitPrice: 130, total: 3120 },
      { description: 'Cadbury Dairy Milk Silk Chocolate 150g', quantity: 20, unitPrice: 175, total: 3500 }
    ],
    notes: 'Member networking evening refreshment stock.'
  },
  {
    id: 'INV-2026-009',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-009',
    customer: 'Horizon Residency Residents Welfare',
    customerEmail: 'rwa@horizonresidency.in',
    customerAddress: 'Clubhouse Office, Horizon Residency, Indiranagar, Bengaluru',
    date: '2026-09-13',
    dueDate: '2026-09-20',
    subtotal: 7118,
    tax: 1282,
    total: 8400,
    status: 'Paid',
    paymentMethod: 'Cheque Clearance',
    items: [
      { description: 'Syska 9W Cool Daylight LED Bulbs (Pack of 4)', quantity: 15, unitPrice: 320, total: 4800 },
      { description: 'Duracell Ultra Alkaline AA Batteries (Pack of 8)', quantity: 10, unitPrice: 360, total: 3600 }
    ],
    notes: 'Common area lighting replenishment.'
  },
  {
    id: 'INV-2026-010',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-010',
    customer: 'Indus Creative Studio',
    customerEmail: 'studio@indusart.com',
    customerAddress: '45 Lavelle Road, Shanthala Nagar, Ashok Nagar, Bengaluru',
    date: '2026-09-12',
    dueDate: '2026-09-26',
    subtotal: 3381,
    tax: 609,
    total: 3990,
    status: 'Pending',
    paymentMethod: 'Net Banking',
    items: [
      { description: 'SanDisk 64GB Ultra Dual USB 3.0 Pen Drive', quantity: 5, unitPrice: 499, total: 2495 },
      { description: 'Portronics Konnect Pro Fast Type-C Cable', quantity: 5, unitPrice: 299, total: 1495 }
    ],
    notes: 'Studio media storage accessories.'
  },
  {
    id: 'INV-2026-011',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-011',
    customer: 'Sterling Cafe & Bakery',
    customerEmail: 'kitchen@sterlingcafe.in',
    customerAddress: '12 Defence Colony Main Road, Indiranagar, Bengaluru',
    date: '2026-09-11',
    dueDate: '2026-09-25',
    subtotal: 6203,
    tax: 1117,
    total: 7320,
    status: 'Paid',
    paymentMethod: 'UPI / Razorpay',
    items: [
      { description: 'Amul Pure Cow Ghee 1L Tin', quantity: 6, unitPrice: 640, total: 3840 },
      { description: 'Quaker Rolled Oats 1kg Pouch', quantity: 10, unitPrice: 190, total: 1900 },
      { description: 'Nescafe Classic Instant Coffee 200g Jar', quantity: 4, unitPrice: 395, total: 1580 }
    ],
    notes: 'Bakery ingredients & beverage inventory.'
  },
  {
    id: 'INV-2026-012',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-012',
    customer: 'Apex Tech Solutions',
    customerEmail: 'procure@apextech.in',
    customerAddress: 'Tower 4, Embassy Tech Village, Outer Ring Road, Bengaluru',
    date: '2026-09-09',
    dueDate: '2026-09-23',
    subtotal: 13708,
    tax: 2467,
    total: 16175,
    status: 'Paid',
    paymentMethod: 'Corporate Wire',
    items: [
      { description: 'Nescafe Classic Instant Coffee 200g Jar', quantity: 20, unitPrice: 395, total: 7900 },
      { description: 'Real Fruit Power Mixed Fruit Juice 1L', quantity: 30, unitPrice: 130, total: 3900 },
      { description: 'Cadbury Dairy Milk Silk 150g', quantity: 25, unitPrice: 175, total: 4375 }
    ],
    notes: 'All hands quarterly meeting pantry supply.'
  },
  {
    id: 'INV-2026-013',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-013',
    customer: 'PrimeCare Daycare & Clinic',
    customerEmail: 'admin@primecare.org',
    customerAddress: '18 CMH Road, Lakshmipuram, Indiranagar, Bengaluru',
    date: '2026-09-06',
    dueDate: '2026-09-20',
    subtotal: 7330,
    tax: 1320,
    total: 8650,
    status: 'Overdue',
    paymentMethod: 'Corporate Wire',
    items: [
      { description: 'Harpic Power Plus Disinfectant Toilet Cleaner 1L', quantity: 20, unitPrice: 195, total: 3900 },
      { description: 'Vim Lemon Dishwash Liquid Gel 750ml', quantity: 20, unitPrice: 155, total: 3100 },
      { description: 'Scotch-Brite Cellulose Sponge Wipe (Pack of 3)', quantity: 15, unitPrice: 110, total: 1650 }
    ],
    notes: 'Overdue by 1 day. Automated notification dispatched.'
  },
  {
    id: 'INV-2026-014',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-014',
    customer: 'Sunita & Deepak Verma',
    customerEmail: 'sunita.v@outlook.com',
    customerAddress: '78 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    date: '2026-09-18',
    dueDate: '2026-09-18',
    subtotal: 2585,
    tax: 465,
    total: 3050,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    items: [
      { description: 'India Gate Basmati Rice 5kg', quantity: 2, unitPrice: 540, total: 1080 },
      { description: 'Amul Pure Cow Ghee 1L Tin', quantity: 2, unitPrice: 640, total: 1280 },
      { description: 'Fortune Sunlite Refined Oil 5L', quantity: 1, unitPrice: 690, total: 690 }
    ],
    notes: 'Direct counter checkout POS-1.'
  },
  {
    id: 'INV-2026-015',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-015',
    customer: 'Tanmay & Rhea Bhat',
    customerEmail: 'tanmay.bhat@mediaworks.com',
    customerAddress: 'Penthouse B, Brigade Gateway, Malleshwaram, Bengaluru',
    date: '2026-09-16',
    dueDate: '2026-09-16',
    subtotal: 1267,
    tax: 228,
    total: 1495,
    status: 'Paid',
    paymentMethod: 'UPI / PhonePe',
    items: [
      { description: 'Kellogg\'s Corn Flakes 1kg', quantity: 2, unitPrice: 360, total: 720 },
      { description: 'Quaker Rolled Oats 1kg', quantity: 2, unitPrice: 190, total: 380 },
      { description: 'Nescafe Classic 200g Jar', quantity: 1, unitPrice: 395, total: 395 }
    ],
    notes: 'Counter POS-2 retail receipt.'
  },
  {
    id: 'INV-2026-016',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-016',
    customer: 'Shreya & Rohan Ghoshal',
    customerEmail: 'shreya.g@soundart.in',
    customerAddress: 'Villa 14, Palm Meadows, Whitefield, Bengaluru',
    date: '2026-09-10',
    dueDate: '2026-09-10',
    subtotal: 1386,
    tax: 249,
    total: 1635,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    items: [
      { description: 'Epigamia Greek Yogurt 400g', quantity: 4, unitPrice: 180, total: 720 },
      { description: 'Real Fruit Power Mixed Fruit Juice 1L', quantity: 3, unitPrice: 130, total: 390 },
      { description: 'Cadbury Dairy Milk Silk 150g', quantity: 3, unitPrice: 175, total: 525 }
    ],
    notes: 'Counter POS-1 weekend order.'
  },
  {
    id: 'INV-2026-017',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-017',
    customer: 'Ramesh Patel',
    customerEmail: 'ramesh.patel@gmail.com',
    customerAddress: '15 Old Madras Road, Ulsoor, Bengaluru',
    date: '2026-09-17',
    dueDate: '2026-09-17',
    subtotal: 636,
    tax: 115,
    total: 751,
    status: 'Paid',
    paymentMethod: 'Cash',
    items: [
      { description: 'Aashirvaad Shudh Chakki Atta 10kg', quantity: 1, unitPrice: 480, total: 480 },
      { description: 'Tata Salt 1kg', quantity: 2, unitPrice: 28, total: 56 },
      { description: 'Dabur 100% Pure Honey 500g', quantity: 1, unitPrice: 215, total: 215 }
    ],
    notes: 'Walk-in cash counter sale.'
  },
  {
    id: 'INV-2026-018',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-018',
    customer: 'Vikramaditya Hegde',
    customerEmail: 'v.hegde@techcorp.in',
    customerAddress: '55 100 Ft Road, Indiranagar, Bengaluru',
    date: '2026-09-15',
    dueDate: '2026-09-15',
    subtotal: 761,
    tax: 137,
    total: 898,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    items: [
      { description: 'boAt Bassheads 100 Wired Earphones', quantity: 1, unitPrice: 399, total: 399 },
      { description: 'SanDisk 64GB Ultra Dual USB Drive', quantity: 1, unitPrice: 499, total: 499 }
    ],
    notes: 'Accessories retail purchase.'
  },
  {
    id: 'INV-2026-019',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-019',
    customer: 'Divya & Karthik Balaji',
    customerEmail: 'divya.balaji@gmail.com',
    customerAddress: '88 Domlur Layout, Bengaluru',
    date: '2026-09-11',
    dueDate: '2026-09-11',
    subtotal: 1446,
    tax: 260,
    total: 1706,
    status: 'Paid',
    paymentMethod: 'Debit Card',
    items: [
      { description: 'Aashirvaad Atta 10kg', quantity: 2, unitPrice: 480, total: 960 },
      { description: 'Fortune Sunlite Refined Oil 5L', quantity: 1, unitPrice: 690, total: 690 },
      { description: 'Tata Salt 1kg', quantity: 2, unitPrice: 28, total: 56 }
    ],
    notes: 'Counter POS-3 home grocery checkout.'
  },
  {
    id: 'INV-2026-020',
    orgId: 'org-001',
    invoiceNumber: 'INV-2026-020',
    customer: 'Rajesh & Kavitha Kumar',
    customerEmail: 'rajesh.k@gmail.com',
    customerAddress: '23 Cambridge Layout, Halasuru, Bengaluru',
    date: '2026-09-14',
    dueDate: '2026-09-14',
    subtotal: 1042,
    tax: 188,
    total: 1230,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    items: [
      { description: 'India Gate Basmati Rice 5kg', quantity: 1, unitPrice: 540, total: 540 },
      { description: 'Aashirvaad Atta 10kg', quantity: 1, unitPrice: 480, total: 480 },
      { description: 'Dettol Antiseptic Liquid 550ml', quantity: 1, unitPrice: 210, total: 210 }
    ],
    notes: 'Customer rewards card credited 24 points.'
  }
];

export const INITIAL_SUPPLIERS = [
  { id: 'SUP-001', orgId: 'org-001', name: 'Hindustan FMCG Distributors', contactPerson: 'Suresh Menon', phone: '+91 98450 12001', email: 'orders@hindustanfmcg.in', category: 'Personal Care & Detergents', productsSupplied: 'Surf Excel, Dove, Vim, Lifebuoy', paymentStatus: 'Cleared', pendingAmount: 0, rating: 4.9, leadTimeDays: 2 },
  { id: 'SUP-002', orgId: 'org-001', name: 'ITC Agribusiness Supply', contactPerson: 'Rajeev Singhal', phone: '+91 98860 12002', email: 'sales@itcagri.com', category: 'Staples & Grains', productsSupplied: 'Aashirvaad Atta, Sunfeast, Bingo, Dark Fantasy', paymentStatus: 'Pending', pendingAmount: 34500, rating: 4.8, leadTimeDays: 3 },
  { id: 'SUP-003', orgId: 'org-001', name: 'Nestle Wholesale Hub', contactPerson: 'Anand Kulkarni', phone: '+91 99001 12003', email: 'wholesale@nestle.in', category: 'Beverages & Dairy', productsSupplied: 'Nescafe Classic, Maggi, KitKat, Everyday', paymentStatus: 'Cleared', pendingAmount: 0, rating: 4.9, leadTimeDays: 2 },
  { id: 'SUP-004', orgId: 'org-001', name: 'Amul Dairy Cooperative Logistics', contactPerson: 'Mahesh Patel', phone: '+91 97411 12004', email: 'bengaluru.depot@amul.coop', category: 'Dairy & Ghee', productsSupplied: 'Amul Ghee, Butter, Milk, Cheese, Paneer', paymentStatus: 'Due Soon', pendingAmount: 18200, rating: 4.9, leadTimeDays: 1 },
  { id: 'SUP-005', orgId: 'org-001', name: 'Tata Consumer Products Vendor', contactPerson: 'Sneha Deshpande', phone: '+91 96112 12005', email: 'orders@tataconsumer.com', category: 'Tea, Salt & Pulses', productsSupplied: 'Tata Tea Gold, Tata Salt, Sampann Toor Dal', paymentStatus: 'Cleared', pendingAmount: 0, rating: 4.8, leadTimeDays: 2 },
  { id: 'SUP-006', orgId: 'org-001', name: 'Adani Wilmar Distributors', contactPerson: 'Girish Shah', phone: '+91 94480 12006', email: 'distrib@adaniwilmar.in', category: 'Edible Oils & Soya', productsSupplied: 'Fortune Sunflower Oil, Fortune Mustard, Soya Chunks', paymentStatus: 'Pending', pendingAmount: 22400, rating: 4.7, leadTimeDays: 3 },
  { id: 'SUP-007', orgId: 'org-001', name: 'Dabur Regional Distributors', contactPerson: 'Vikas Sharma', phone: '+91 98220 12007', email: 'south.orders@dabur.com', category: 'Health & Juices', productsSupplied: 'Dabur Honey, Real Juice, Chyawanprash', paymentStatus: 'Cleared', pendingAmount: 0, rating: 4.7, leadTimeDays: 2 },
  { id: 'SUP-008', orgId: 'org-001', name: 'Syska Electronics Wholesalers', contactPerson: 'Nitin Agarwal', phone: '+91 99160 12008', email: 'wholesale@syskaelectro.in', category: 'Electronics & Lighting', productsSupplied: 'Syska LED Bulbs, Extension Boards, Duracell, Cables', paymentStatus: 'Cleared', pendingAmount: 0, rating: 4.6, leadTimeDays: 4 },
  { id: 'SUP-009', orgId: 'org-001', name: 'Reckitt Benckiser Supply', contactPerson: 'Pooja Nair', phone: '+91 98451 12009', email: 'india.orders@reckitt.com', category: 'Sanitization & Health', productsSupplied: 'Dettol, Harpic, Lizol, Mortein', paymentStatus: 'Due Soon', pendingAmount: 14800, rating: 4.8, leadTimeDays: 2 },
  { id: 'SUP-010', orgId: 'org-001', name: 'Godrej Consumer Products Hub', contactPerson: 'Farhan Merchant', phone: '+91 98861 12010', email: 'bengaluru@godrejcp.com', category: 'Household Insecticides', productsSupplied: 'Good Knight, Hit Sprays, Godrej No. 1 Soap', paymentStatus: 'Cleared', pendingAmount: 0, rating: 4.7, leadTimeDays: 3 },
  { id: 'SUP-011', orgId: 'org-001', name: 'PepsiCo Food Logistics', contactPerson: 'Ramanathan Iyer', phone: '+91 99002 12011', email: 'pepsifoods.blore@pepsico.com', category: 'Snacks & Oats', productsSupplied: 'Lay\'s, Kurkure, Quaker Rolled Oats, Doritos', paymentStatus: 'Pending', pendingAmount: 11900, rating: 4.6, leadTimeDays: 2 },
  { id: 'SUP-012', orgId: 'org-001', name: 'Mondelez India Wholesalers', contactPerson: 'Chetan Rao', phone: '+91 97412 12012', email: 'trade@mondelez.in', category: 'Chocolates & Biscuits', productsSupplied: 'Cadbury Silk, Oreo, Bournvita, 5-Star', paymentStatus: 'Cleared', pendingAmount: 0, rating: 4.9, leadTimeDays: 2 }
];

export const INITIAL_PROJECTS = [
  { id: 'PRJ-101', orgId: 'org-001', title: 'POS Barcode Scanner & Terminal Modernization', client: 'Internal Store Operations', budget: 140000, spent: 85000, progress: 75, deadline: '2026-09-30', status: 'Active', team: ['Siddharth Rao', 'Rajeshwari Iyer', 'Sunil Gowda'] },
  { id: 'PRJ-102', orgId: 'org-001', title: 'WhatsApp Quick-Order & Local Delivery Pipeline', client: 'Indiranagar Customers Club', budget: 210000, spent: 180000, progress: 90, deadline: '2026-10-05', status: 'Active', team: ['Pooja Reddy', 'Anand Prakash', 'Siddharth Rao'] },
  { id: 'PRJ-103', orgId: 'org-001', title: 'Commercial Cold Storage Walk-in Chiller Upgrade', client: 'Dairy & Fresh Produce Section', budget: 320000, spent: 290000, progress: 60, deadline: '2026-10-15', status: 'In Progress', team: ['Manoj Pillai', 'Deepak Thadani', 'Harish Babu'] },
  { id: 'PRJ-104', orgId: 'org-001', title: 'Store Loyalty Points & Smart SMS Receipts Rollout', client: 'Customer Retention Initiative', budget: 85000, spent: 85000, progress: 100, deadline: '2026-09-15', status: 'Completed', team: ['Kavita Chawla', 'Pooja Reddy'] },
  { id: 'PRJ-105', orgId: 'org-001', title: 'Electronic Shelf Labeling (ESL) Pilot Testing', client: 'Pricing Automation Initiative', budget: 180000, spent: 40000, progress: 30, deadline: '2026-11-01', status: 'Planning', team: ['Manoj Pillai', 'Siddharth Rao'] },
  { id: 'PRJ-106', orgId: 'org-001', title: 'New Express Kiosk Setup (Koramangala 4th Block)', client: 'Expansion Committee', budget: 650000, spent: 120000, progress: 20, deadline: '2026-12-10', status: 'Planning', team: ['Rajeshwari Iyer', 'Kavita Chawla'] }
];

export const INITIAL_APPOINTMENTS = [
  { id: 'APT-001', orgId: 'org-001', clientName: 'Apex Tech Solutions (Suresh Kumar)', service: 'Monthly Bulk Pantry Order Review', staff: 'Rajeshwari Iyer', date: '2026-09-22', time: '11:00 AM', status: 'Confirmed', notes: 'Reviewing Q4 corporate discount tier and scheduled deliveries.' },
  { id: 'APT-002', orgId: 'org-001', clientName: 'ITC Agribusiness Supply (Rajeev Singhal)', service: 'Quarterly Vendor Terms & Pricing Review', staff: 'Divya Nambiar', date: '2026-09-23', time: '02:30 PM', status: 'Confirmed', notes: 'Negotiating bulk margins on Aashirvaad Atta and Sunfeast lines.' },
  { id: 'APT-003', orgId: 'org-001', clientName: 'Horizon Residency RWA (Col. Sanjeev Rao)', service: 'Society Bulk Purchase Contract Renewal', staff: 'Pooja Reddy', date: '2026-09-24', time: '10:00 AM', status: 'Confirmed', notes: 'Contract renewal for 320 resident families.' },
  { id: 'APT-004', orgId: 'org-001', clientName: 'Syska Wholesalers (Nitin Agarwal)', service: 'Festive Season LED & Utility Display Setup', staff: 'Manoj Pillai', date: '2026-09-25', time: '04:00 PM', status: 'Pending', notes: 'Discussion on end-cap promotional placement in front aisle.' },
  { id: 'APT-005', orgId: 'org-001', clientName: 'Amul Logistics (Mahesh Patel)', service: 'Cold Chain Delivery Schedule Audit', staff: 'Deepak Thadani', date: '2026-09-21', time: '09:30 AM', status: 'Completed', notes: 'Morning dairy arrival schedule optimized to 6:30 AM.' },
  { id: 'APT-006', orgId: 'org-001', clientName: 'PrimeCare Daycare (Dr. Vivek Menon)', service: 'Sanitation Supplies Delivery Validation', staff: 'Divya Nambiar', date: '2026-09-20', time: '03:00 PM', status: 'Completed', notes: 'Reconciled September consignment and certified delivery.' }
];

export const INITIAL_TASKS = [
  { id: 'TSK-101', orgId: 'org-001', title: 'Complete Bi-Weekly Inventory Audit for Grocery Aisle 1 & 2', assignedTo: 'Manoj Pillai', department: 'Inventory & Stock', priority: 'High', deadline: '2026-09-23', status: 'In Progress', progress: 65 },
  { id: 'TSK-102', orgId: 'org-001', title: 'Restock Out-of-Stock Lay\'s Chips & Good Knight Twin Vaporizers', assignedTo: 'Ravi Shankar', department: 'Inventory & Stock', priority: 'High', deadline: '2026-09-22', status: 'Pending', progress: 20 },
  { id: 'TSK-103', orgId: 'org-001', title: 'Prepare GST GSTR-3B Filing for August-September Cycle', assignedTo: 'Kavita Chawla', department: 'Accounts & GST', priority: 'High', deadline: '2026-09-25', status: 'In Progress', progress: 80 },
  { id: 'TSK-104', orgId: 'org-001', title: 'Update Firmware & Test Zebra 2D Barcode Scanners on POS 1 & 2', assignedTo: 'Siddharth Rao', department: 'IT & POS Systems', priority: 'Medium', deadline: '2026-09-24', status: 'Pending', progress: 0 },
  { id: 'TSK-105', orgId: 'org-001', title: 'Call 5 VIP Corporate Accounts for Diwali Festive Gift Hamper Bookings', assignedTo: 'Pooja Reddy', department: 'Sales & Customer Care', priority: 'High', deadline: '2026-09-24', status: 'In Progress', progress: 50 },
  { id: 'TSK-106', orgId: 'org-001', title: 'Reconcile Supplier Credit Ledgers with ITC & Adani Wilmar', assignedTo: 'Kavita Chawla', department: 'Accounts & GST', priority: 'High', deadline: '2026-09-26', status: 'In Progress', progress: 40 },
  { id: 'TSK-107', orgId: 'org-001', title: 'Audit Fresh Dairy Expiry Dates in Chiller Display Section', assignedTo: 'Deepak Thadani', department: 'Store Operations', priority: 'High', deadline: '2026-09-21', status: 'Completed', progress: 100 },
  { id: 'TSK-108', orgId: 'org-001', title: 'Print Promotional Price Tags for Weekend FMCG Flash Sale', assignedTo: 'Sunil Gowda', department: 'Billing & Cash', priority: 'Low', deadline: '2026-09-26', status: 'Pending', progress: 0 },
  { id: 'TSK-109', orgId: 'org-001', title: 'Inspect Fire Extinguishers & Exit Doors for Annual Compliance', assignedTo: 'Harish Babu', department: 'Facility & Hygiene', priority: 'High', deadline: '2026-09-20', status: 'Overdue', progress: 30 },
  { id: 'TSK-110', orgId: 'org-001', title: 'Process Monthly Staff Payroll and PF/ESI Deductions', assignedTo: 'Rajeshwari Iyer', department: 'Store Operations', priority: 'High', deadline: '2026-09-28', status: 'In Progress', progress: 70 },
  { id: 'TSK-111', orgId: 'org-001', title: 'Verify Evening Cash Register Settlements & UPI Log Matches', assignedTo: 'Sunil Gowda', department: 'Billing & Cash', priority: 'High', deadline: '2026-09-21', status: 'Completed', progress: 100 },
  { id: 'TSK-112', orgId: 'org-001', title: 'Setup Aisle End-Cap Promotion for Organic Spices', assignedTo: 'Karthik Raja', department: 'Inventory & Stock', priority: 'Medium', deadline: '2026-09-27', status: 'Pending', progress: 15 },
  { id: 'TSK-113', orgId: 'org-001', title: 'Follow up on Overdue Invoice #INV-2026-006 with Nexus BioLabs', assignedTo: 'Kavita Chawla', department: 'Accounts & GST', priority: 'High', deadline: '2026-09-22', status: 'Pending', progress: 0 },
  { id: 'TSK-114', orgId: 'org-001', title: 'Deep Clean & Sanitize Bakery & Fresh Produce Bins', assignedTo: 'Lakshmi Devi', department: 'Facility & Hygiene', priority: 'Medium', deadline: '2026-09-22', status: 'In Progress', progress: 85 },
  { id: 'TSK-115', orgId: 'org-001', title: 'Review Customer Feedback from WhatsApp Feedback Bot', assignedTo: 'Pooja Reddy', department: 'Sales & Customer Care', priority: 'Low', deadline: '2026-09-27', status: 'Pending', progress: 0 }
];

export const INITIAL_EXPENSES = [
  { id: 'EXP-501', orgId: 'org-001', title: 'Commercial Store Lease Rent (Indiranagar Facility)', category: 'Rent', amount: 85000, date: '2026-09-01', status: 'Paid', paymentRef: 'RNT-BLR-0901' },
  { id: 'EXP-502', orgId: 'org-001', title: 'Store Staff & Management Monthly Salaries', category: 'Salary', amount: 145000, date: '2026-09-02', status: 'Paid', paymentRef: 'SAL-SEP-02' },
  { id: 'EXP-503', orgId: 'org-001', title: 'BESCOM Commercial Power & Cold Storage Chiller Electricity', category: 'Electricity', amount: 24500, date: '2026-09-05', status: 'Paid', paymentRef: 'EB-BESCOM-09' },
  { id: 'EXP-504', orgId: 'org-001', title: 'Local Social Media Ads & Weekend WhatsApp Promotional Broadcasts', category: 'Marketing', amount: 12400, date: '2026-09-08', status: 'Paid', paymentRef: 'MKT-META-901' },
  { id: 'EXP-505', orgId: 'org-001', title: 'Store Delivery Van Diesel & Logistics Fuel Expenses', category: 'Transport', amount: 8900, date: '2026-09-10', status: 'Paid', paymentRef: 'TRN-FUEL-10' },
  { id: 'EXP-506', orgId: 'org-001', title: 'Walk-in Chiller & Air Conditioning Unit Quarterly AMC', category: 'Maintenance', amount: 6800, date: '2026-09-12', status: 'Paid', paymentRef: 'MNT-HVAC-12' },
  { id: 'EXP-507', orgId: 'org-001', title: 'High-Speed ACT Fibernet Dual Leased Line (300 Mbps)', category: 'Other', amount: 3500, date: '2026-09-03', status: 'Paid', paymentRef: 'NET-ACT-03' },
  { id: 'EXP-508', orgId: 'org-001', title: 'Biodegradable Carry Bags & Packaging Paper Pouches', category: 'Maintenance', amount: 5200, date: '2026-09-14', status: 'Paid', paymentRef: 'PKG-BAGS-14' },
  { id: 'EXP-509', orgId: 'org-001', title: 'POS Thermal Receipt Rolls (Box of 100 Rolls)', category: 'Other', amount: 2400, date: '2026-09-15', status: 'Paid', paymentRef: 'POS-ROLLS-15' },
  { id: 'EXP-510', orgId: 'org-001', title: 'Print Newspaper Flyers for Indiranagar & Domlur Homes', category: 'Marketing', amount: 7600, date: '2026-09-16', status: 'Paid', paymentRef: 'PRT-FLY-16' },
  { id: 'EXP-511', orgId: 'org-001', title: 'Drinking Water Dispenser 20L Cans & Pantry Essentials', category: 'Maintenance', amount: 1800, date: '2026-09-17', status: 'Paid', paymentRef: 'MNT-WTR-17' },
  { id: 'EXP-512', orgId: 'org-001', title: 'Commercial Trade License & Municipal Tax Installment', category: 'Other', amount: 6500, date: '2026-09-18', status: 'Pending', paymentRef: 'GOV-BBMP-18' },
  { id: 'EXP-513', orgId: 'org-001', title: 'SMARTORA Enterprise Cloud SaaS Subscription', category: 'Other', amount: 4999, date: '2026-09-04', status: 'Paid', paymentRef: 'SFT-SMART-04' },
  { id: 'EXP-514', orgId: 'org-001', title: 'Emergency Electrician & Display Lighting Wiring Repair', category: 'Electricity', amount: 2800, date: '2026-09-19', status: 'Paid', paymentRef: 'ELC-RPR-19' },
  { id: 'EXP-515', orgId: 'org-001', title: 'Store Delivery Partner Incentive Allowances', category: 'Transport', amount: 4200, date: '2026-09-20', status: 'Paid', paymentRef: 'TRN-INC-20' },
  { id: 'EXP-516', orgId: 'org-001', title: 'CCTV Cloud Backup & Loss Prevention Security Subscription', category: 'Other', amount: 3200, date: '2026-09-05', status: 'Paid', paymentRef: 'SEC-CAM-05' }
];

export const INITIAL_AUTOMATION_RULES = [
  {
    id: 'RUL-001',
    orgId: 'org-001',
    name: 'Low Stock Auto-Alert & Restock Flag',
    trigger: 'Inventory Stock Update',
    condition: 'When product stock <= minStock',
    action: 'Generate high-urgency alert & create pending restock task',
    enabled: true,
    lastRun: '15 mins ago',
    executionCount: 142,
    category: 'Inventory'
  },
  {
    id: 'RUL-002',
    orgId: 'org-001',
    name: 'Overdue Invoice Escalation Notice',
    trigger: 'Daily Midnight Clock (00:00 IST)',
    condition: 'When invoice status == Pending and dueDate < today',
    action: 'Mark invoice Overdue, dispatch reminder email & notify Accounts',
    enabled: true,
    lastRun: '12 hours ago',
    executionCount: 28,
    category: 'Finance'
  },
  {
    id: 'RUL-003',
    orgId: 'org-001',
    name: 'VIP Customer Auto-Enrollment',
    trigger: 'Sales Order Completed',
    condition: 'When customer totalSpent > ₹50,000',
    action: 'Upgrade customer status to VIP Gold & issue 5% loyalty coupon',
    enabled: true,
    lastRun: '2 hours ago',
    executionCount: 54,
    category: 'CRM'
  },
  {
    id: 'RUL-004',
    orgId: 'org-001',
    name: 'High-Value Sale Notification to Store Owner',
    trigger: 'POS Checkout Order Created',
    condition: 'When order amount >= ₹15,000',
    action: 'Send instant Push Notification to Store Owner mobile app',
    enabled: true,
    lastRun: '1 day ago',
    executionCount: 89,
    category: 'Sales'
  },
  {
    id: 'RUL-005',
    orgId: 'org-001',
    name: 'Task Deadline Escalation to Supervisor',
    trigger: 'Every 6 Hours Evaluator',
    condition: 'When task deadline < today and status != Completed',
    action: 'Elevate task priority to Urgent and notify Floor Supervisor',
    enabled: true,
    lastRun: '4 hours ago',
    executionCount: 19,
    category: 'Tasks'
  },
  {
    id: 'RUL-006',
    orgId: 'org-001',
    name: 'Daily Expense Spike Warning',
    trigger: 'Expense Log Entry Added',
    condition: 'When single expense amount >= ₹20,000',
    action: 'Flag expense for Owner sign-off before financial clearance',
    enabled: true,
    lastRun: '3 days ago',
    executionCount: 12,
    category: 'Finance'
  },
  {
    id: 'RUL-007',
    orgId: 'org-001',
    name: 'End-of-Day POS Register Reconciliation Reminder',
    trigger: 'Daily 09:30 PM IST',
    condition: 'When store closing hour reached',
    action: 'Prompt POS cashiers to close register & tally UPI transactions',
    enabled: true,
    lastRun: 'Yesterday at 9:30 PM',
    executionCount: 210,
    category: 'Operations'
  },
  {
    id: 'RUL-008',
    orgId: 'org-001',
    name: 'Supplier Delivery SLA Breach Detector',
    trigger: 'Procurement Order Created',
    condition: 'When delivery date exceeds supplier leadTimeDays by > 2 days',
    action: 'Flag supplier performance rating and alert Procurement Manager',
    enabled: false,
    lastRun: 'Never',
    executionCount: 0,
    category: 'Procurement'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    orgId: 'org-001',
    type: 'Inventory Alert',
    title: 'Critical Out-of-Stock: Lay\'s & Good Knight',
    message: 'Lay\'s Spanish Tomato Tango (50g) and Good Knight Vaporizers reached 0 units. Automated reorder flagged.',
    time: '12 mins ago',
    read: false,
    severity: 'danger',
    targetPage: 'inventory'
  },
  {
    id: 'NOTIF-002',
    orgId: 'org-001',
    type: 'Payment Alert',
    title: 'Overdue Invoice #INV-2026-006 (Nexus BioLabs)',
    message: 'Invoice #INV-2026-006 for ₹5,592 is past its due date. Automated reminder dispatched.',
    time: '35 mins ago',
    read: false,
    severity: 'danger',
    targetPage: 'invoices'
  },
  {
    id: 'NOTIF-003',
    orgId: 'org-001',
    type: 'Inventory Alert',
    title: 'Low Stock Warning: Fortune Oil & Head & Shoulders',
    message: 'Fortune Sunlite 5L (6 units remaining) and Head & Shoulders 650ml (1 unit remaining) are below minimum threshold.',
    time: '1 hour ago',
    read: false,
    severity: 'warning',
    targetPage: 'inventory'
  },
  {
    id: 'NOTIF-004',
    orgId: 'org-001',
    type: 'Sales Alert',
    title: 'High-Value Corporate Order Received',
    message: 'Apex Tech Solutions placed Order #ORD-7001 for ₹20,325. Dispatched via Express logistics.',
    time: '2 hours ago',
    read: true,
    severity: 'success',
    targetPage: 'sales'
  },
  {
    id: 'NOTIF-005',
    orgId: 'org-001',
    type: 'Task Alert',
    title: 'Task Overdue: Fire Extinguisher Compliance',
    message: 'Task "Inspect Fire Extinguishers & Exit Doors" was due yesterday. Escalated to Floor Supervisor.',
    time: '4 hours ago',
    read: false,
    severity: 'danger',
    targetPage: 'tasks'
  },
  {
    id: 'NOTIF-006',
    orgId: 'org-001',
    type: 'Automation Alert',
    title: 'Automation Rule Executed: VIP Upgrade',
    message: 'Rule "VIP Customer Auto-Enrollment" upgraded Tanmay Bhat to VIP Enterprise after lifetime spend crossed ₹1,00,000.',
    time: '5 hours ago',
    read: true,
    severity: 'info',
    targetPage: 'automation'
  },
  {
    id: 'NOTIF-007',
    orgId: 'org-001',
    type: 'Payment Alert',
    title: 'Payment Cleared: Horizon Residency RWA',
    message: 'Received ₹17,100 via UPI for Invoice #INV-2026-002. Account balanced.',
    time: '6 hours ago',
    read: true,
    severity: 'success',
    targetPage: 'invoices'
  },
  {
    id: 'NOTIF-008',
    orgId: 'org-001',
    type: 'System Alert',
    title: 'Automated Cloud Database Snapshot',
    message: 'Encrypted daily backup snapshot completed (PostgreSQL 16, 2.4 GB) with 99.99% integrity score.',
    time: '12 hours ago',
    read: true,
    severity: 'info',
    targetPage: 'settings'
  },
  {
    id: 'NOTIF-009',
    orgId: 'org-001',
    type: 'Expense Alert',
    title: 'Monthly Rent Paid: Indiranagar Store',
    message: 'Store Lease payment of ₹85,000 logged and reconciled under Rent category.',
    time: '1 day ago',
    read: true,
    severity: 'info',
    targetPage: 'expenses'
  },
  {
    id: 'NOTIF-010',
    orgId: 'org-001',
    type: 'Procurement Alert',
    title: 'Supplier Consignment Due: ITC Agribusiness',
    message: 'Scheduled delivery of 55 sacks Aashirvaad Atta arriving tomorrow at 8:00 AM.',
    time: '1 day ago',
    read: true,
    severity: 'info',
    targetPage: 'suppliers'
  }
];

export const INITIAL_STUDENTS = [
  { id: 'STU-2024-001', name: 'Aarav Choudhury', email: 'aarav.c@campus.edu', department: 'Computer Science', year: '4th Year', attendance: 94, status: 'Regular', gpa: '3.9' },
  { id: 'STU-2024-002', name: 'Diya Raghavan', email: 'diya.r@campus.edu', department: 'Information Technology', year: '3rd Year', attendance: 68, status: 'At Risk', gpa: '2.8' },
  { id: 'STU-2024-003', name: 'Ishaan Gupta', email: 'ishaan.g@campus.edu', department: 'Mechanical Engineering', year: '2nd Year', attendance: 88, status: 'Regular', gpa: '3.4' },
  { id: 'STU-2024-004', name: 'Kavya Menon', email: 'kavya.m@campus.edu', department: 'Electronics & Comm.', year: '4th Year', attendance: 71, status: 'At Risk', gpa: '3.1' },
  { id: 'STU-2024-005', name: 'Rishi Varma', email: 'rishi.v@campus.edu', department: 'Computer Science', year: '1st Year', attendance: 96, status: 'Regular', gpa: '4.0' },
  { id: 'STU-2024-006', name: 'Ananya Sridhar', email: 'ananya.s@campus.edu', department: 'Business Admin', year: '3rd Year', attendance: 64, status: 'Critical Alert', gpa: '2.5' },
  { id: 'STU-2024-007', name: 'Tanmay Bhat', email: 'tanmay.b@campus.edu', department: 'Electrical Engg.', year: '2nd Year', attendance: 82, status: 'Regular', gpa: '3.2' },
  { id: 'STU-2024-008', name: 'Rhea Kapoor', email: 'rhea.k@campus.edu', department: 'Computer Science', year: '3rd Year', attendance: 91, status: 'Regular', gpa: '3.8' }
];

export const INITIAL_DEPARTMENTS = [
  // Company A (Tech Solutions - org-001)
  {
    id: 'DEP-TECH-01',
    organization_id: 'org-001',
    name: 'Enterprise Sales & Accounts',
    code: 'SLS',
    managerId: 'usr-deptmgr-001',
    managerName: 'Rahul Verma',
    staffCount: 8,
    budget: 450000,
    performance: 96,
    status: 'Active',
    allowedModules: ['sales', 'invoices', 'customers', 'tasks', 'ai-assistant', 'reports']
  },
  {
    id: 'DEP-TECH-02',
    organization_id: 'org-001',
    name: 'Cloud Engineering & DevOps',
    code: 'ENG',
    managerId: 'usr-deptmgr-002',
    managerName: 'Priya Sundaram',
    staffCount: 16,
    budget: 850000,
    performance: 98,
    status: 'Active',
    allowedModules: ['projects', 'tasks', 'inventory', 'ai-assistant']
  },
  {
    id: 'DEP-TECH-03',
    organization_id: 'org-001',
    name: 'Human Resources & Culture',
    code: 'HR',
    managerId: 'usr-deptmgr-003',
    managerName: 'Ananya Deshmukh',
    staffCount: 4,
    budget: 220000,
    performance: 94,
    status: 'Active',
    allowedModules: ['employees', 'attendance', 'tasks', 'ai-assistant']
  },
  {
    id: 'DEP-TECH-04',
    organization_id: 'org-001',
    name: 'Corporate Finance & Tax',
    code: 'FIN',
    managerId: 'usr-admin-001',
    managerName: 'Krithika Sharma',
    staffCount: 5,
    budget: 310000,
    performance: 97,
    status: 'Active',
    allowedModules: ['invoices', 'expenses', 'reports', 'ai-assistant']
  },

  // Company B (GreenLeaf Restaurant - org-002)
  {
    id: 'DEP-REST-01',
    organization_id: 'org-002',
    name: 'Culinary Operations & Pantry',
    code: 'KIT',
    managerId: 'usr-deptmgr-004',
    managerName: 'Ajay Chopra',
    staffCount: 12,
    budget: 380000,
    performance: 95,
    status: 'Active',
    allowedModules: ['inventory', 'suppliers', 'tasks']
  },
  {
    id: 'DEP-REST-02',
    organization_id: 'org-002',
    name: 'POS Cashiering & Billing',
    code: 'BIL',
    managerId: 'usr-staff-003',
    managerName: 'Sunil Gowda',
    staffCount: 4,
    budget: 140000,
    performance: 93,
    status: 'Active',
    allowedModules: ['sales', 'invoices', 'customers']
  },
  {
    id: 'DEP-REST-03',
    organization_id: 'org-002',
    name: 'Dining Floor & Guest Service',
    code: 'FLR',
    managerId: 'usr-admin-002',
    managerName: 'Chef Sanjeev Kapoor',
    staffCount: 10,
    budget: 210000,
    performance: 96,
    status: 'Active',
    allowedModules: ['appointments', 'tasks', 'customers']
  },

  // Company C (BrightFuture Institute - org-003)
  {
    id: 'DEP-EDU-01',
    organization_id: 'org-003',
    name: 'Academic Affairs & Curriculum',
    code: 'ACAD',
    managerId: 'usr-admin-003',
    managerName: 'Dr. Meenakshi Sundaram',
    staffCount: 35,
    budget: 1250000,
    performance: 95,
    status: 'Active',
    allowedModules: ['students', 'attendance', 'employees', 'tasks']
  },
  {
    id: 'DEP-EDU-02',
    organization_id: 'org-003',
    name: 'Student Admissions & Enrolment',
    code: 'ADM',
    managerId: 'usr-admin-003',
    managerName: 'Dr. Meenakshi Sundaram',
    staffCount: 6,
    budget: 280000,
    performance: 92,
    status: 'Active',
    allowedModules: ['students', 'invoices', 'reports']
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-9001',
    timestamp: '2026-09-21 13:45:12 IST',
    user_id: 'usr-owner-001',
    userName: 'Aarav Singhania',
    userRole: 'PLATFORM_OWNER',
    organization_id: 'system',
    department_id: null,
    action: 'COMPANY_PROVISIONED',
    module: 'Platform Console',
    details: 'Provisioned new tenant workspace "SMARTORA Tech Solutions" [SMR-CMP-0001]',
    status: 'Success',
    ipAddress: '10.0.4.12'
  },
  {
    id: 'AUD-9002',
    timestamp: '2026-09-21 13:30:05 IST',
    user_id: 'usr-admin-001',
    userName: 'Krithika Sharma',
    userRole: 'COMPANY_ADMIN',
    organization_id: 'org-001',
    department_id: 'DEP-TECH-01',
    action: 'DEPARTMENT_CREATED',
    module: 'Department Governance',
    details: 'Created department "Enterprise Sales & Accounts" [DEP-TECH-01] with Manager Rahul Verma',
    status: 'Success',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'AUD-9003',
    timestamp: '2026-09-21 13:15:22 IST',
    user_id: 'usr-admin-001',
    userName: 'Krithika Sharma',
    userRole: 'COMPANY_ADMIN',
    organization_id: 'org-001',
    department_id: null,
    action: 'CREDENTIALS_GENERATED',
    module: 'Security & Access',
    details: 'Generated temporary access credentials for Department Manager [ADM-DPT-001]',
    status: 'Success',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'AUD-9004',
    timestamp: '2026-09-21 12:40:18 IST',
    user_id: 'usr-deptmgr-001',
    userName: 'Rahul Verma',
    userRole: 'DEPARTMENT_MANAGER',
    organization_id: 'org-001',
    department_id: 'DEP-TECH-01',
    action: 'STAFF_ONBOARDED',
    module: 'Workforce',
    details: 'Created sales associate account for Rohan Mehta [EMP-SLS-01]',
    status: 'Success',
    ipAddress: '192.168.1.82'
  },
  {
    id: 'AUD-9005',
    timestamp: '2026-09-21 12:10:00 IST',
    user_id: 'usr-owner-001',
    userName: 'Aarav Singhania',
    userRole: 'PLATFORM_OWNER',
    organization_id: 'system',
    department_id: null,
    action: 'GLOBAL_RULE_COMPILED',
    module: 'AI Automation Engine',
    details: 'Compiled and synchronized platform-wide telemetry heuristics',
    status: 'Success',
    ipAddress: '10.0.4.12'
  },
  {
    id: 'AUD-9006',
    timestamp: '2026-09-21 11:45:33 IST',
    user_id: 'usr-admin-002',
    userName: 'Chef Sanjeev Kapoor',
    userRole: 'COMPANY_ADMIN',
    organization_id: 'org-002',
    department_id: 'DEP-REST-01',
    action: 'AUTOMATION_TRIGGERED',
    module: 'Automations',
    details: 'Inventory restock rule dispatched supplier requisition to Fresh Dairy Depot',
    status: 'Success',
    ipAddress: '172.16.0.14'
  }
];

export const INITIAL_PLATFORM_STATS = {
  totalCompanies: 5,
  activeCompanies: 5,
  inactiveCompanies: 0,
  totalUsers: 284,
  totalDepartments: 21,
  activeAdmins: 12,
  platformActivity: '99.98% SLA',
  monthlyPlatformRevenue: '₹60,495/mo',
  automationsRunning: 48,
  systemHealth: 'Optimal (All Pods Green)'
};

export const INITIAL_SUBSCRIPTIONS = [
  { id: 'SUB-01', companyId: 'org-001', companyName: 'SMARTORA Tech Solutions', plan: 'Enterprise Plus', mrr: '₹14,999/mo', billingCycle: 'Annual', status: 'Active', nextBilling: '2027-01-15' },
  { id: 'SUB-02', companyId: 'org-002', companyName: 'GreenLeaf Restaurant & Cafe', plan: 'Growth Tier', mrr: '₹4,999/mo', billingCycle: 'Monthly', status: 'Active', nextBilling: '2026-10-10' },
  { id: 'SUB-03', companyId: 'org-003', companyName: 'BrightFuture Institute', plan: 'Campus Enterprise', mrr: '₹24,999/mo', billingCycle: 'Annual', status: 'Active', nextBilling: '2027-04-01' },
  { id: 'SUB-04', companyId: 'org-004', companyName: 'ABC Retail Store', plan: 'Professional', mrr: '₹6,999/mo', billingCycle: 'Annual', status: 'Active', nextBilling: '2026-11-20' },
  { id: 'SUB-05', companyId: 'org-005', companyName: 'LifeCare Clinic', plan: 'Professional', mrr: '₹8,499/mo', billingCycle: 'Annual', status: 'Active', nextBilling: '2027-02-14' }
];

export const INITIAL_ATTENDANCE_LOGS = [
  { id: 'ATT-001', name: 'Rajeshwari Iyer', department: 'Store Operations', date: '2026-09-21', status: 'Present', percentage: 98 },
  { id: 'ATT-002', name: 'Manoj Pillai', department: 'Inventory & Stock', date: '2026-09-21', status: 'Present', percentage: 94 },
  { id: 'ATT-003', name: 'Sunil Gowda', department: 'Billing & Cash', date: '2026-09-21', status: 'Present', percentage: 96 },
  { id: 'ATT-004', name: 'Kavita Chawla', department: 'Accounts & GST', date: '2026-09-21', status: 'Present', percentage: 95 },
  { id: 'ATT-005', name: 'Deepak Thadani', department: 'Store Operations', date: '2026-09-21', status: 'Present', percentage: 90 },
  { id: 'ATT-006', name: 'Meena Kumari', department: 'Billing & Cash', date: '2026-09-21', status: 'Present', percentage: 92 },
  { id: 'ATT-007', name: 'Ravi Shankar', department: 'Inventory & Stock', date: '2026-09-21', status: 'Present', percentage: 88 },
  { id: 'ATT-008', name: 'Pooja Reddy', department: 'Sales & Customer Care', date: '2026-09-21', status: 'Present', percentage: 97 },
  { id: 'ATT-009', name: 'Anand Prakash', department: 'Dispatch & Delivery', date: '2026-09-21', status: 'Present', percentage: 89 },
  { id: 'ATT-010', name: 'Divya Nambiar', department: 'Procurement', date: '2026-09-21', status: 'Present', percentage: 95 },
  { id: 'ATT-011', name: 'Siddharth Rao', department: 'IT & POS Systems', date: '2026-09-21', status: 'Present', percentage: 93 },
  { id: 'ATT-012', name: 'Karthik Raja', department: 'Inventory & Stock', date: '2026-09-21', status: 'Present', percentage: 91 },
  { id: 'ATT-013', name: 'Naveen Kumar', department: 'Billing & Cash', date: '2026-09-21', status: 'Present', percentage: 94 },
  { id: 'ATT-014', name: 'Lakshmi Devi', department: 'Facility & Hygiene', date: '2026-09-21', status: 'Present', percentage: 96 },
  { id: 'ATT-015', name: 'Harish Babu', department: 'Facility & Hygiene', date: '2026-09-21', status: 'Present', percentage: 94 }
];

export const AI_SUGGESTED_PROMPTS = [
  "What is our total revenue and top-selling product this month?",
  "Which products are currently low in stock or out of stock?",
  "Are there any pending or overdue invoices requiring follow-up?",
  "What automation rules are currently active in our store?",
  "Show a breakdown of this month's operating expenses.",
  "Which suppliers have pending payment balances?",
  "Give me a quick operational health check of our business."
];

// --- RAG KNOWLEDGE BASE DOCUMENTS (Strict Multi-Tenant Partitioning) ---
export const INITIAL_KNOWLEDGE_DOCS = [
  // Company A (org-001: SMARTORA Tech Solutions)
  {
    id: 'DOC-TECH-01',
    organization_id: 'org-001',
    department_id: 'DEP-TECH-04',
    title: 'Employee Leave & Hybrid Work Policy 2025',
    filename: 'Employee_Leave_Hybrid_Policy_2025.pdf',
    category: 'HR',
    uploadedBy: 'Krithika Sharma (CEO)',
    uploadedAt: '2025-01-10',
    fileSize: '420 KB',
    chunksCount: 5,
    status: 'Indexed',
    permissions: 'All Employees',
    content: `SMARTORA TECH SOLUTIONS - EMPLOYEE LEAVE & HYBRID WORK POLICY 2025
1. Casual Leave (CL): Every full-time employee is entitled to 12 days of Casual Leave per calendar year. A maximum of 3 consecutive CL days may be availed with at least 48 hours prior notification to the Department Manager.
2. Sick Leave (SL): Employees are granted 10 days of paid Sick Leave annually. For absences exceeding 2 consecutive days, an authorized medical practitioner's certificate must be submitted to the HR portal upon resumption.
3. Earned / Privilege Leave (EL): 18 days credited quarterly (4.5 days/quarter). Earned leaves may be accumulated up to 45 days and are encashable at separation.
4. Maternity & Paternity: 26 weeks fully paid Maternity Leave for female employees. 2 weeks paid Paternity Leave for male employees.
5. Hybrid Working: Engineering and Sales personnel may work remotely up to 2 days per week (Tuesday & Thursday). Core collaboration hours are 10:00 AM - 5:00 PM IST with mandatory daily standup participation.`
  },
  {
    id: 'DOC-TECH-02',
    organization_id: 'org-001',
    department_id: 'DEP-TECH-02',
    title: 'Enterprise Cloud Architecture & SLA Response SOP',
    filename: 'Cloud_Architecture_SLA_SOP.pdf',
    category: 'Operations',
    uploadedBy: 'Rahul Verma (Sales Lead)',
    uploadedAt: '2025-01-15',
    fileSize: '680 KB',
    chunksCount: 6,
    status: 'Indexed',
    permissions: 'Engineering & Management',
    content: `SMARTORA TECH SOLUTIONS - STANDARD OPERATING PROCEDURE: CLOUD ARCHITECTURE & SLA
1. Incident Severity Levels:
- Severity 1 (P1 - Critical Outage): Service down or customer business stalled. Target Acknowledgment: 15 minutes. Resolution Target: 2 hours. Automated escalation to Chief Architect and CEO.
- Severity 2 (P2 - High Impact): Core module impaired with workaround available. Target Acknowledgment: 1 hour. Resolution Target: 8 hours.
- Severity 3 (P3 - Moderate): Minor system bug or UI degradation. Target Acknowledgment: 4 hours. Resolution Target: 48 hours or next scheduled release.
2. Maintenance Windows: Scheduled production deployments occur exclusively on Sundays between 01:00 AM and 04:00 AM IST with 72-hour prior written client broadcast.
3. Automated Backups: Database snapshots run every 6 hours with 30-day geo-redundant archival retention in compliance with ISO 27001.`
  },
  {
    id: 'DOC-TECH-03',
    organization_id: 'org-001',
    department_id: null,
    title: 'Information Security & Data Protection Guidelines',
    filename: 'InfoSec_Data_Protection_2025.pdf',
    category: 'General',
    uploadedBy: 'Krithika Sharma',
    uploadedAt: '2025-02-01',
    fileSize: '510 KB',
    chunksCount: 4,
    status: 'Indexed',
    permissions: 'All Staff',
    content: `SMARTORA TECH SOLUTIONS - INFORMATION SECURITY & DATA GOVERNANCE
1. Multi-Tenant Logical Partitioning: Developers and staff must never execute cross-tenant queries without verified session tenant authorization. All SQL and NoSQL queries must append WHERE organization_id = active_tenant.
2. Credential Security: Multi-Factor Authentication (MFA) is compulsory for all corporate email accounts, Git repos, and AWS/Azure consoles. Passwords must be at least 14 characters.
3. Client Data Retention: Confidential client records are encrypted at rest using AES-256 and in transit via TLS 1.3. Any data export requires dual Department Manager authorization.`
  },

  // Company B (org-002: GreenLeaf Restaurant & Cafe)
  {
    id: 'DOC-REST-01',
    organization_id: 'org-002',
    department_id: 'DEP-REST-01',
    title: 'Commercial Kitchen Hygiene & Food Safety SOP',
    filename: 'Kitchen_Hygiene_Safety_SOP.pdf',
    category: 'Operations',
    uploadedBy: 'Chef Sanjeev Kapoor',
    uploadedAt: '2025-02-05',
    fileSize: '390 KB',
    chunksCount: 5,
    status: 'Indexed',
    permissions: 'Kitchen Staff & Managers',
    content: `GREENLEAF RESTAURANT & CAFE - FOOD SAFETY & HYGIENE STANDARD OPERATING PROCEDURE
1. Chiller Temperature Bounds: Walk-in dairy and produce chillers must be monitored at 2°C to 4°C at all times. Deep freezers must hold -18°C. Digital temperature logs are recorded at 08:00 AM, 02:00 PM, and 10:00 PM daily.
2. Raw Material FIFO Rotation: All incoming dairy, meat, and fresh organic herbs must receive color-coded date tags. First In, First Out (FIFO) discipline is audited weekly.
3. Sanitization Protocol: Kitchen surfaces, cutting stations, and ventilation hoods must undergo hot steam sanitation twice daily. Floor staff must wash hands before every order prep.`
  },
  {
    id: 'DOC-REST-02',
    organization_id: 'org-002',
    department_id: 'DEP-REST-02',
    title: 'Staff Tip Distribution & Shift Policy',
    filename: 'Staff_Tip_Distribution_Policy.pdf',
    category: 'HR',
    uploadedBy: 'Chef Sanjeev Kapoor',
    uploadedAt: '2025-02-12',
    fileSize: '280 KB',
    chunksCount: 4,
    status: 'Indexed',
    permissions: 'All Floor & Kitchen Staff',
    content: `GREENLEAF RESTAURANT & CAFE - TIP POOL & SHIFT ALLOCATION POLICY
1. Gratuity Distribution: All electronic card tips and service fees are pooled weekly. 60% is distributed equally among front-of-house service staff based on recorded hours worked. 40% is allocated to back-of-house kitchen and stewarding crew.
2. Payout Schedule: Gratuities are credited alongside bi-weekly payroll reconciliations on Monday afternoon.
3. Shift Swapping: Shift trades must be logged in SMARTORA Staff portal at least 24 hours in advance and approved by the shift floor supervisor.`
  }
];

// --- AGENTIC AI EXECUTION RUNS (Telemetry & Audit) ---
export const INITIAL_AGENT_RUNS = [
  {
    id: 'RUN-1042',
    organization_id: 'org-001',
    user_id: 'usr-admin-001',
    userName: 'Krithika Sharma (CEO)',
    request: 'Find low-stock products and create tasks for the inventory team.',
    plan: [
      '1. Verify user RBAC permissions for Inventory and Tasks.',
      '2. Query SMARTORA inventory API to find SKUs below minimum stock threshold.',
      '3. Formulate draft task assignments for authorized warehouse team.',
      '4. Create SMARTORA system notification for inventory leads.',
      '5. Record execution in immutable audit log.'
    ],
    toolsUsed: ['getInventory', 'createTask', 'createNotification', 'logAuditEvent'],
    actions: [
      'Identified 2 critical low-stock items in catalog.',
      'Created Task TSK-892: Restock High-Performance Cloud SSD Blades (Priority: High).',
      'Dispatched notification to Inventory Lead.'
    ],
    approvalStatus: 'Autonomous',
    riskLevel: 'Low',
    status: 'Completed',
    timestamp: '2025-02-21 11:34 AM IST',
    resultSummary: '2 replenishment tasks drafted and scheduled for inventory operations.'
  },
  {
    id: 'RUN-1041',
    organization_id: 'org-001',
    user_id: 'usr-deptmgr-001',
    userName: 'Rahul Verma (Sales Head)',
    request: 'Analyze overdue invoices and dispatch automated reminder alerts.',
    plan: [
      '1. Check department scope and financial permissions.',
      '2. Query SMARTORA Invoices API for status = Overdue.',
      '3. Calculate total outstanding balance.',
      '4. Generate follow-up reminders in notification queue.',
      '5. Log audit trail.'
    ],
    toolsUsed: ['getInvoices', 'createNotification', 'logAuditEvent'],
    actions: [
      'Found 2 overdue client invoices totaling ₹75,000.',
      'Scheduled polite payment reminder notifications to accounts receivable.'
    ],
    approvalStatus: 'Autonomous',
    riskLevel: 'Low',
    status: 'Completed',
    timestamp: '2025-02-20 04:15 PM IST',
    resultSummary: '2 overdue invoices flagged and reminders scheduled.'
  },
  {
    id: 'RUN-1039',
    organization_id: 'org-001',
    user_id: 'usr-admin-001',
    userName: 'Krithika Sharma',
    request: 'Prepare Purchase Order draft for ₹48,500 server buffer components.',
    plan: [
      '1. Assess supplier quotation and catalog requirements.',
      '2. Check risk level: High-risk financial transaction exceeding ₹25,000 threshold.',
      '3. Generate Human Approval Card before purchase execution.',
      '4. Wait for executive authorization.'
    ],
    toolsUsed: ['createPurchaseOrderDraft', 'requestHumanApproval'],
    actions: [
      'Drafted Purchase Order PO-2025-08 for Amul & Tech Supplies.',
      'Submitted to Human Executive Approval Queue.'
    ],
    approvalStatus: 'Approved',
    approvedBy: 'Krithika Sharma (CEO)',
    riskLevel: 'High',
    status: 'Completed',
    timestamp: '2025-02-19 02:40 PM IST',
    resultSummary: 'Purchase Order PO-2025-08 approved and recorded in financial audit log.'
  }
];

// --- PENDING HUMAN APPROVALS QUEUE ---
export const INITIAL_PENDING_APPROVALS = [
  {
    id: 'APV-901',
    runId: 'RUN-1044',
    organization_id: 'org-001',
    title: 'Purchase Order Draft Authorization: ₹48,500 for Dell Enterprise Server Components',
    category: 'Financial / Procurement',
    riskLevel: 'High',
    requestedBy: 'SMARTORA Autonomous Agent',
    requestedAt: '2025-02-21 14:10 IST',
    details: {
      supplier: 'Dell Enterprise India Ltd',
      amount: 48500,
      currency: '₹',
      items: [
        { name: 'NVMe Gen4 2TB Server Storage Array', qty: 2, unitPrice: 18500 },
        { name: 'DDR5 ECC 64GB Server RAM', qty: 1, unitPrice: 11500 }
      ],
      justification: 'Automated buffer replenishment triggered by low stock alert RUL-001.'
    },
    status: 'Pending' // 'Pending' | 'Approved' | 'Rejected'
  }
];

// --- INITIAL FINANCIAL TRANSACTIONS SEED ---
export const INITIAL_TRANSACTIONS = [
  // Tech Nova / SMARTORA Tech Solutions (SMR-CMP-0001 / org-001)
  {
    transactionId: 'TXN-1001',
    organizationId: 'SMR-CMP-0001',
    orgId: 'org-001',
    organizationType: 'COMPANY',
    transactionType: 'INCOME',
    amount: 350000,
    category: 'Service Revenue',
    subcategory: 'Enterprise Cloud Architecture',
    transactionDate: '2026-09-01',
    department: 'Enterprise Sales & Accounts',
    description: 'Quarterly enterprise cloud retainer payment from NexaCorp',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'NEFT-NEXA-8812',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    transactionId: 'TXN-1002',
    organizationId: 'SMR-CMP-0001',
    orgId: 'org-001',
    organizationType: 'COMPANY',
    transactionType: 'INCOME',
    amount: 180000,
    category: 'Product Sales',
    subcategory: 'SaaS Platform Subscriptions',
    transactionDate: '2026-09-05',
    department: 'Sales & Marketing',
    description: 'Annual multi-tenant SaaS license renewals (Batch 12)',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI-RAZOR-99120',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-05T14:30:00.000Z'
  },
  {
    transactionId: 'TXN-1003',
    organizationId: 'SMR-CMP-0001',
    orgId: 'org-001',
    organizationType: 'COMPANY',
    transactionType: 'EXPENSE',
    amount: 65000,
    category: 'Office Rent & Facilities',
    subcategory: 'Tech Hub Facility Lease',
    transactionDate: '2026-09-02',
    department: 'Operations',
    description: 'Monthly commercial workspace lease at ORR Tech Hub Tower 4',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'RTGS-LEASE-3310',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-02T11:00:00.000Z'
  },
  {
    transactionId: 'TXN-1004',
    organizationId: 'SMR-CMP-0001',
    orgId: 'org-001',
    organizationType: 'COMPANY',
    transactionType: 'EXPENSE',
    amount: 42000,
    category: 'Cloud & IT Infrastructure',
    subcategory: 'AWS / GCP Compute & Storage',
    transactionDate: '2026-09-07',
    department: 'Engineering',
    description: 'Production cluster kubernetes compute nodes & vector database nodes',
    paymentMethod: 'Credit Card',
    referenceNumber: 'CC-AWS-9021',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-07T09:15:00.000Z'
  },
  {
    transactionId: 'TXN-1005',
    organizationId: 'SMR-CMP-0001',
    orgId: 'org-001',
    organizationType: 'COMPANY',
    transactionType: 'EXPENSE',
    amount: 120000,
    category: 'Payroll & Salaries',
    subcategory: 'Core Engineering Stipends',
    transactionDate: '2026-09-10',
    department: 'Human Resources',
    description: 'Mid-month core engineering and operations salary disbursement',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'NEFT-SAL-7721',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-10T16:00:00.000Z'
  },
  {
    transactionId: 'TXN-1006',
    organizationId: 'SMR-CMP-0001',
    orgId: 'org-001',
    organizationType: 'COMPANY',
    transactionType: 'INCOME',
    amount: 95000,
    category: 'Consulting & Advisory',
    subcategory: 'AI RAG Strategy Sprint',
    transactionDate: '2026-09-14',
    department: 'Enterprise Sales & Accounts',
    description: 'Milestone 2 payment for LLM workflow audit & deployment',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'NEFT-SPRINT-4410',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-14T11:45:00.000Z'
  },
  {
    transactionId: 'TXN-1007',
    organizationId: 'SMR-CMP-0001',
    orgId: 'org-001',
    organizationType: 'COMPANY',
    transactionType: 'EXPENSE',
    amount: 18500,
    category: 'Marketing & Advertising',
    subcategory: 'Search & Developer Outreach',
    transactionDate: '2026-09-16',
    department: 'Sales & Marketing',
    description: 'Q3 Developer campaign ads and product demo showcase',
    paymentMethod: 'Credit Card',
    referenceNumber: 'CC-GOOG-1129',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0001',
    createdAt: '2026-09-16T15:20:00.000Z'
  },
  // GreenLeaf Restaurant (SMR-CMP-0002 / org-002)
  {
    transactionId: 'TXN-2001',
    organizationId: 'SMR-CMP-0002',
    orgId: 'org-002',
    organizationType: 'RESTAURANT',
    transactionType: 'INCOME',
    amount: 245000,
    category: 'Food & Beverage Sales',
    subcategory: 'Dine-in Weekend Operations',
    transactionDate: '2026-09-03',
    department: 'Dining Hall',
    description: 'Weekly gross dine-in settlement via POS terminals',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI-HDFC-9912',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0002',
    createdAt: '2026-09-03T23:30:00.000Z'
  },
  {
    transactionId: 'TXN-2002',
    organizationId: 'SMR-CMP-0002',
    orgId: 'org-002',
    organizationType: 'RESTAURANT',
    transactionType: 'EXPENSE',
    amount: 82000,
    category: 'Inventory & Raw Materials',
    subcategory: 'Organic Produce & Dairy',
    transactionDate: '2026-09-04',
    department: 'Kitchen',
    description: 'Organic bulk vegetables, artisanal cheeses & farm milk shipment',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'NEFT-FARM-2201',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0002',
    createdAt: '2026-09-04T08:00:00.000Z'
  },
  // Apex Institute of Technology (SMR-CMP-0003 / org-003)
  {
    transactionId: 'TXN-3001',
    organizationId: 'SMR-CMP-0003',
    orgId: 'org-003',
    organizationType: 'COLLEGE',
    transactionType: 'INCOME',
    amount: 850000,
    category: 'Tuition Fees',
    subcategory: 'Fall Semester Intake',
    transactionDate: '2026-09-01',
    department: 'Admissions & Finance',
    description: 'Semester 1 Computer Science tuition payments tranche A',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'FEE-ACAD-2026-A',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0003',
    createdAt: '2026-09-01T09:00:00.000Z'
  },
  {
    transactionId: 'TXN-3002',
    organizationId: 'SMR-CMP-0003',
    orgId: 'org-003',
    organizationType: 'COLLEGE',
    transactionType: 'EXPENSE',
    amount: 145000,
    category: 'Lab Equipment & Supplies',
    subcategory: 'CS Hardware & Networking',
    transactionDate: '2026-09-08',
    department: 'Computer Science',
    description: 'High performance compute server blades for AI laboratory',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'PO-APEX-CS-401',
    status: 'COMPLETED',
    createdBy: 'ADM-CMP-0003',
    createdAt: '2026-09-08T14:00:00.000Z'
  }
];

