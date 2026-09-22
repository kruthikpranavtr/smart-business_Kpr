// Multi-Step Dynamic Business Registration Wizard for SMARTORA
// Universal SaaS Business Management & Automation Platform
// Supports 12 Business Types, Dynamic Step 4 fields, Auto-recommended modules, Summary Review, and Animated Workspace Provisioning

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Store,
  Utensils,
  Laptop,
  Briefcase,
  Factory,
  Truck,
  Hotel,
  Stethoscope,
  GraduationCap,
  Boxes,
  HelpCircle,
  CreditCard,
  Layers,
  Package,
  CheckSquare,
  Bot,
  Receipt,
  Users,
  Calendar,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Sliders,
  DollarSign,
  FileCheck,
  FileText,
  Upload,
  X,
  AlertTriangle,
  Clock4,
  XCircle,
  Copy,
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import {
  getRequirementsForType,
  validateDocumentFile,
  formatBytes,
  checkDuplicateOrganization
} from '../services/verificationService';

// 12 Supported Business Types
const BUSINESS_TYPES = [
  {
    id: 'Retail Shop',
    title: 'Retail Shop',
    desc: 'Groceries, FMCG, apparel, electronics, and neighborhood retail.',
    icon: Store,
    badge: 'Popular',
    defaultModules: ['dashboard', 'sales', 'invoices', 'inventory', 'expenses', 'customers', 'employees', 'suppliers', 'tasks', 'automation', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Supermarket',
    title: 'Supermarket / Hypermarket',
    desc: 'Multi-counter FMCG, barcode scanning, fast checkout, bulk inventory.',
    icon: Boxes,
    badge: 'Popular',
    defaultModules: ['dashboard', 'sales', 'invoices', 'inventory', 'expenses', 'customers', 'employees', 'suppliers', 'tasks', 'automation', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Restaurant / Cafe',
    title: 'Restaurant / Cafe / QSR',
    desc: 'Dining tables, takeaway, kitchen display, food inventory & recipes.',
    icon: Utensils,
    defaultModules: ['dashboard', 'sales', 'invoices', 'inventory', 'expenses', 'employees', 'suppliers', 'appointments', 'tasks', 'automation', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Company / Startup',
    title: 'Company / Tech Startup',
    desc: 'Software, SaaS, digital agencies, projects, invoicing & team tracking.',
    icon: Laptop,
    badge: 'High Growth',
    defaultModules: ['dashboard', 'invoices', 'expenses', 'employees', 'projects', 'tasks', 'automation', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Service Business',
    title: 'Service Business / Agency',
    desc: 'Consulting, marketing, salons, repair services & client appointments.',
    icon: Briefcase,
    defaultModules: ['dashboard', 'invoices', 'expenses', 'customers', 'employees', 'appointments', 'projects', 'tasks', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Manufacturing',
    title: 'Manufacturing & Plants',
    desc: 'Production units, raw materials, bill of materials & supplier supply chains.',
    icon: Factory,
    defaultModules: ['dashboard', 'inventory', 'invoices', 'expenses', 'employees', 'suppliers', 'projects', 'tasks', 'automation', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Wholesale / Distribution',
    title: 'Wholesale & B2B Hub',
    desc: 'B2B volume orders, credit terms, depots, logistics & freight suppliers.',
    icon: Boxes,
    defaultModules: ['dashboard', 'sales', 'invoices', 'inventory', 'expenses', 'customers', 'suppliers', 'tasks', 'automation', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Hotel',
    title: 'Hotel & Hospitality',
    desc: 'Room bookings, housekeeping, restaurant integration & guest billing.',
    icon: Hotel,
    defaultModules: ['dashboard', 'appointments', 'invoices', 'inventory', 'expenses', 'employees', 'suppliers', 'tasks', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Clinic / Healthcare',
    title: 'Clinic & Healthcare',
    desc: 'Patient records, doctor appointments, pharmacy stock & treatment billing.',
    icon: Stethoscope,
    defaultModules: ['dashboard', 'appointments', 'customers', 'invoices', 'inventory', 'expenses', 'employees', 'tasks', 'automation', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Logistics',
    title: 'Logistics & Supply Chain',
    desc: 'Fleet management, cargo transit, delivery dispatch & dispatch tasks.',
    icon: Truck,
    defaultModules: ['dashboard', 'invoices', 'expenses', 'employees', 'suppliers', 'projects', 'tasks', 'automation', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Educational Institution',
    title: 'Educational Institution',
    desc: 'Colleges, universities, schools, student attendance & department ops.',
    icon: GraduationCap,
    defaultModules: ['dashboard', 'students', 'employees', 'departments', 'attendance', 'tasks', 'expenses', 'automation', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  },
  {
    id: 'Other',
    title: 'Other Custom Business',
    desc: 'Non-profit, co-operatives, municipal boards or general enterprises.',
    icon: HelpCircle,
    defaultModules: ['dashboard', 'sales', 'invoices', 'expenses', 'employees', 'tasks', 'automation', 'ai-assistant', 'analytics', 'reports', 'notifications', 'settings']
  }
];

// Available Platform Modules
const ALL_MODULES = [
  { id: 'dashboard', name: 'Smart Dashboard', desc: 'Real-time KPI metric cards, charts and operational pulse.', icon: Layers, locked: true },
  { id: 'sales', name: 'Sales & Orders', desc: 'POS checkout, transaction records and revenue tracking.', icon: TrendingUp },
  { id: 'invoices', name: 'Invoices & Billing', desc: 'GST-compliant billing, PDF invoices and payment tracking.', icon: Receipt },
  { id: 'inventory', name: 'Inventory & Products', desc: 'Stock alerts, catalog SKUs, batch tracking and reorders.', icon: Package },
  { id: 'expenses', name: 'Expenses & Finances', desc: 'Operating expenses, utility bills, rent and salary ledgers.', icon: CreditCard },
  { id: 'customers', name: 'Customers & CRM', desc: 'Customer directories, order history and loyalty points.', icon: Users },
  { id: 'employees', name: 'Employees & HR', desc: 'Staff rosters, roles, monthly salary and attendance.', icon: Briefcase },
  { id: 'suppliers', name: 'Suppliers & Vendors', desc: 'Supplier database, lead times and payment schedules.', icon: Factory },
  { id: 'projects', name: 'Projects & Pipelines', desc: 'Client deliverables, budgets, milestones and progress.', icon: Layers },
  { id: 'appointments', name: 'Appointments & Booking', desc: 'Client scheduling, consultation slots and calendar.', icon: Calendar },
  { id: 'tasks', name: 'Task Management', desc: 'Kanban boards, priority deadlines and team delegations.', icon: CheckSquare },
  { id: 'automation', name: 'Smart Automation Engine', desc: 'Rule-based triggers: low stock alerts, payment reminders.', icon: Zap },
  { id: 'ai-assistant', name: 'AI Business Copilot', desc: 'Conversational assistant answering financial & stock queries.', icon: Bot },
  { id: 'analytics', name: 'Advanced Analytics', desc: 'Deep multi-tab financial, operational and customer metrics.', icon: TrendingUp },
  { id: 'reports', name: 'Reports Center', desc: 'One-click CSV exports and printable PDF statements.', icon: ShieldCheck }
];

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const {
    createOrganization,
    organizations,
    verificationRequests,
    submitVerificationRequest,
    resubmitVerification
  } = useData();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Step 1: Account
  const [account, setAccount] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Step 2: Org Details
  const [selectedOrgType, setSelectedOrgType] = useState('Company / Startup');
  const [orgName, setOrgName] = useState('');
  const [tagline, setTagline] = useState('');

  // Step 3: Location Details
  const [location, setLocation] = useState({
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    address: '',
    pinCode: '',
    currency: 'INR (₹)'
  });

  // Step 4: Statutory Identification & Operational Specifics
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [applicantTitle, setApplicantTitle] = useState('Managing Director / Principal');
  const [website, setWebsite] = useState('');

  const [businessDetails, setBusinessDetails] = useState({
    storeSize: '2,000 sq ft',
    billingCounters: '2 POS Terminals',
    barcodeScanner: 'Yes',
    returnWindow: '7 Days',
    seatingCapacity: '20 Tables (60 Seats)',
    kdsActive: 'Yes',
    serviceOptions: 'Dine-in, Takeaway & Online',
    teamSize: '10-25 People',
    operatingModel: 'Hybrid',
    primaryOffering: 'Custom SaaS & Cloud',
    clinicSpecialization: 'Multi-Speciality Care',
    consultationRooms: '4 Suites',
    doctorCount: '5 Doctors',
    emergencyServices: 'Yes',
    fleetSize: '12 Delivery Vehicles',
    cargoType: 'Retail FMCG Express',
    campusType: 'College / University',
    studentCapacity: '1,500 Students',
    gstin: ''
  });

  // Step 5: Uploaded Proof Documents
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  // Step 6: Modules Selection
  const [selectedModules, setSelectedModules] = useState(() => {
    const defaultType = BUSINESS_TYPES.find(b => b.id === 'Company / Startup') || BUSINESS_TYPES[0];
    return defaultType ? defaultType.defaultModules : ['dashboard', 'invoices', 'expenses', 'employees', 'tasks'];
  });

  // Step 8: Submission Result
  const [submittedTrackingResult, setSubmittedTrackingResult] = useState(null);

  // Status Tracker Modal State
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingLookupId, setTrackingLookupId] = useState('');
  const [trackedAppResult, setTrackedAppResult] = useState(null);
  const [trackingLookupError, setTrackingLookupError] = useState('');
  const [supplementaryFile, setSupplementaryFile] = useState(null);
  const [supplementaryNotes, setSupplementaryNotes] = useState('');
  const [isSubmittingSupplementary, setIsSubmittingSupplementary] = useState(false);

  // Dynamic Document Requirements Matrix for Current Business Type
  const docRequirements = useMemo(() => {
    return getRequirementsForType(selectedOrgType);
  }, [selectedOrgType]);

  // Duplicate Check Live Risk Assessment
  const duplicateRiskAlert = useMemo(() => {
    if (!orgName.trim() && !registrationNumber.trim() && !taxId.trim()) return null;
    return checkDuplicateOrganization(
      {
        name: orgName.trim(),
        registrationNumber: registrationNumber.trim(),
        taxId: taxId.trim(),
        state: location.state
      },
      organizations || [],
      verificationRequests || []
    );
  }, [orgName, registrationNumber, taxId, location.state, organizations, verificationRequests]);

  // Handle Document File Upload
  const handleFileUpload = (req, file) => {
    if (!file) return;
    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError('');

    const newDoc = {
      id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      requirementId: req.id,
      documentType: req.type,
      type: req.type,
      name: file.name,
      documentName: file.name,
      size: file.size,
      fileSize: formatBytes(file.size),
      uploadedDate: new Date().toISOString(),
      uploadedAt: new Date().toISOString()
    };

    setUploadedDocuments(prev => {
      const filtered = prev.filter(d => d.requirementId !== req.id);
      return [...filtered, newDoc];
    });

    addToast('Proof Document Attached', `${file.name} uploaded for ${req.name}.`, 'success');
  };

  const handleRemoveDocument = (requirementId) => {
    setUploadedDocuments(prev => prev.filter(d => d.requirementId !== requirementId));
  };

  // Update recommended modules when business type changes
  const handleOrgTypeSelect = (typeId) => {
    setSelectedOrgType(typeId);
    const matched = BUSINESS_TYPES.find(b => b.id === typeId);
    if (matched) {
      setSelectedModules(matched.defaultModules);
    }
  };

  const toggleModule = (moduleId) => {
    if (moduleId === 'dashboard') return; // Cannot disable dashboard
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(m => m !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };

  // Stepper Wizard Navigation & Validation
  const handleNext = () => {
    setError('');

    // Step 1 validation
    if (step === 1) {
      if (!account.fullName.trim() || !account.email.trim() || !account.password.trim()) {
        setError('Please enter your full name, email and password.');
        return;
      }
      if (account.password !== account.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (account.password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
    }

    // Step 2 validation
    if (step === 2) {
      if (!orgName.trim()) {
        setError('Please enter your business or organization legal name.');
        return;
      }
    }

    // Step 3 validation
    if (step === 3) {
      if (!location.city.trim()) {
        setError('Please specify the city where your business is located.');
        return;
      }
    }

    // Step 4 validation (Statutory Identification)
    if (step === 4) {
      if (!registrationNumber.trim()) {
        setError('Please provide your official Registration / Incorporation / AISHE Number.');
        return;
      }
    }

    // Step 5 validation (Proof Documents)
    if (step === 5) {
      const requiredReqs = docRequirements.filter(r => r.required);
      const missing = requiredReqs.filter(r => !uploadedDocuments.some(d => d.requirementId === r.id));
      if (missing.length > 0) {
        setError(`Please upload all mandatory documents: ${missing.map(m => m.name).join(', ')}.`);
        return;
      }
    }

    // Step 6 validation (Modules)
    if (step === 6) {
      if (selectedModules.length === 0) {
        setError('Please select at least 1 module for your workspace.');
        return;
      }
    }

    // Step 7 Submission (Summary Review -> Submit Verification Application)
    if (step === 7) {
      const currencySymbol = location.currency.includes('₹') ? '₹' : (location.currency.includes('$') ? '$' : '₹');
      const res = submitVerificationRequest({
        name: orgName.trim(),
        organizationType: selectedOrgType,
        type: selectedOrgType,
        tagline: tagline || `Smart Automation for ${selectedOrgType}`,
        registrationNumber: registrationNumber.trim(),
        taxId: taxId.trim(),
        applicantTitle: applicantTitle.trim(),
        website: website.trim(),
        country: location.country,
        state: location.state,
        city: location.city,
        address: location.address,
        pinCode: location.pinCode,
        contactEmail: account.email,
        contactPhone: account.phone,
        submittedBy: account.fullName,
        submittedByEmail: account.email,
        documents: uploadedDocuments,
        currency: location.currency,
        currencySymbol,
        businessDetails,
        enabledModules: selectedModules
      });

      setSubmittedTrackingResult(res);
      setStep(8);
      addToast(
        'Application Submitted',
        `Verification registered with Tracking ID: ${res.trackingId}.`,
        'success'
      );
      return;
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  // Lookup application in Status Tracker Modal
  const handleLookupApplication = (overrideId) => {
    const searchId = (overrideId || trackingLookupId).trim().toUpperCase();
    if (!searchId) {
      setTrackingLookupError('Please enter an application tracking ID.');
      return;
    }
    const found = (verificationRequests || []).find(
      r => r.id.toUpperCase() === searchId || r.registrationNumber?.toUpperCase() === searchId
    );
    if (!found) {
      setTrackingLookupError(`No application found for "${searchId}". Please verify your Tracking ID.`);
      setTrackedAppResult(null);
    } else {
      setTrackedAppResult(found);
      setTrackingLookupError('');
    }
  };

  // Resubmit supplementary proof documents when status is NEEDS_MORE_INFORMATION
  const handleSupplementaryResubmit = () => {
    if (!trackedAppResult) return;
    if (!supplementaryFile && !supplementaryNotes.trim()) {
      addToast('Input Required', 'Please provide explanatory notes or upload a document.', 'warning');
      return;
    }
    setIsSubmittingSupplementary(true);
    try {
      let newDocs = [];
      if (supplementaryFile) {
        newDocs.push({
          id: `DOC-SUPP-${Date.now()}`,
          documentType: 'SUPPLEMENTARY_PROOF',
          type: 'SUPPLEMENTARY_PROOF',
          name: supplementaryFile.name,
          documentName: supplementaryFile.name,
          size: supplementaryFile.size,
          fileSize: formatBytes(supplementaryFile.size)
        });
      }

      resubmitVerification(
        trackedAppResult.id,
        { submittedBy: trackedAppResult.submittedBy },
        newDocs
      );

      // Refresh tracked request
      const refreshed = (verificationRequests || []).find(r => r.id === trackedAppResult.id);
      if (refreshed) {
        setTrackedAppResult({
          ...refreshed,
          verification_status: 'UNDER_REVIEW'
        });
      }
      setSupplementaryFile(null);
      setSupplementaryNotes('');
      addToast('Application Resubmitted', 'Supplementary proof received. Dossier moved back to Under Review.', 'success');
    } catch (e) {
      addToast('Error', 'Failed to resubmit application.', 'danger');
    } finally {
      setIsSubmittingSupplementary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-slate-50 dark:from-[#0b0f19] dark:via-[#0f172a] dark:to-[#0b0f19] text-slate-900 dark:text-white py-10 px-4 flex flex-col items-center justify-center selection:bg-blue-600 selection:text-white">
      
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-3 cursor-pointer group mb-2"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
              SMARTORA
            </span>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              Universal Business Automation & Statutory Due Diligence
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto w-full mt-3 px-2">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Create Your Business Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Statutory institutional verification & automated multi-tenant provisioning.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={Search}
            onClick={() => {
              setIsTrackingModalOpen(true);
              setTrackedAppResult(null);
              setTrackingLookupError('');
            }}
            className="shrink-0 font-semibold text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50"
          >
            Track Application Status
          </Button>
        </div>
      </div>

      {/* Stepper Progress Bar (Steps 1 to 7) */}
      {step < 8 && (
        <div className="w-full max-w-4xl mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-2 overflow-x-auto gap-1">
            <span className={step >= 1 ? 'text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>1. Account</span>
            <span className={step >= 2 ? 'text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>2. Business</span>
            <span className={step >= 3 ? 'text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>3. Location</span>
            <span className={step >= 4 ? 'text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>4. Statutory IDs</span>
            <span className={step >= 5 ? 'text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>5. Proof Docs</span>
            <span className={step >= 6 ? 'text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>6. Modules</span>
            <span className={step >= 7 ? 'text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>7. Review</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-sky-500 transition-all duration-300 rounded-full"
              style={{ width: `${((step - 1) / 6) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-500/5 transition-all">
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Account Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Step 1: Administrator Account Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Set up your master administrator credentials to access your SMARTORA tenant.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={account.fullName}
                    onChange={(e) => setAccount({ ...account, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Work Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="owner@mybusiness.com"
                    value={account.email}
                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Mobile / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="+91 98450 12345"
                    value={account.phone}
                    onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Account Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={account.password}
                    onChange={(e) => setAccount({ ...account, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={account.confirmPassword}
                    onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Organization Type (12 Cards) & Name */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Step 2: Choose Your Industry & Business
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                SMARTORA adapts its data models, dashboard widgets, and automation triggers to your exact industry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Business / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Supermart or Greenleaf Bistro"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tagline or Store Slogan (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Daily Groceries & Essentials"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Industry Type (12 Supported Models)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto p-1">
                {BUSINESS_TYPES.map((bt) => {
                  const Icon = bt.icon;
                  const isSelected = selectedOrgType === bt.id;

                  return (
                    <div
                      key={bt.id}
                      onClick={() => handleOrgTypeSelect(bt.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 bg-slate-50/40 dark:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {bt.badge && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {bt.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                          {bt.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {bt.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Location Details */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Step 3: Business Location & Operating Currency
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Set up regional currency symbols, tax jurisdictions, and headquarters address.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Country *
                </label>
                <select
                  value={location.country}
                  onChange={(e) => setLocation({ ...location, country: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  State / Province *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karnataka, Maharashtra, Tamil Nadu"
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru, Mumbai, Chennai"
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Postal / PIN Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 560038"
                  value={location.pinCode}
                  onChange={(e) => setLocation({ ...location, pinCode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Street / Commercial Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 42 Commercial Street, Indiranagar"
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary Currency *
                </label>
                <select
                  value={location.currency}
                  onChange={(e) => setLocation({ ...location, currency: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="INR (₹)">Indian Rupee - INR (₹)</option>
                  <option value="USD ($)">US Dollar - USD ($)</option>
                  <option value="EUR (€)">Euro - EUR (€)</option>
                  <option value="GBP (£)">British Pound - GBP (£)</option>
                  <option value="AED (د.إ)">UAE Dirham - AED (د.إ)</option>
                  <option value="SGD ($)">Singapore Dollar - SGD ($)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Statutory Identification & Operating Specifics */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                Step 4: Statutory Identification & Operating Parameters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Statutory identifiers required for official registry cross-validation and tenant isolation.
              </p>
            </div>

            {/* Statutory Corporate Identifiers */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Statutory & Regulatory IDs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Registration / Incorporation Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. U72900KA2020PTC123456 or AISHE-C-1234"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    CIN, AISHE Code, Clinical Establishment ID, or Society Registration
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Tax ID / PAN / GSTIN
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. AAACN1234C or 29AAACN1234C1Z5"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Permanent Account Number (PAN), GSTIN, or 12A/80G reference
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Authorized Representative Designation / Title
                  </label>
                  <input
                    type="text"
                    value={applicantTitle}
                    onChange={(e) => setApplicantTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Managing Director, Principal, Chief Medical Officer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://www.yourorganization.com"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Specifics for Industry */}
            {(selectedOrgType === 'Retail Shop' || selectedOrgType === 'Supermarket') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Store Size (sq ft)
                  </label>
                  <input
                    type="text"
                    value={businessDetails.storeSize}
                    onChange={(e) => setBusinessDetails({ ...businessDetails, storeSize: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 2,400 sq ft"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Number of Billing Counters / POS
                  </label>
                  <input
                    type="text"
                    value={businessDetails.billingCounters}
                    onChange={(e) => setBusinessDetails({ ...businessDetails, billingCounters: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 3 POS Terminals"
                  />
                </div>
              </div>
            )}

            {selectedOrgType === 'Restaurant / Cafe' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Seating Capacity
                  </label>
                  <input
                    type="text"
                    value={businessDetails.seatingCapacity}
                    onChange={(e) => setBusinessDetails({ ...businessDetails, seatingCapacity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 20 Tables (80 Seats)"
                  />
                </div>
              </div>
            )}

            {(selectedOrgType === 'Company / Startup' || selectedOrgType === 'Service Business') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Primary Offering
                  </label>
                  <input
                    type="text"
                    value={businessDetails.primaryOffering}
                    onChange={(e) => setBusinessDetails({ ...businessDetails, primaryOffering: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Enterprise Cloud & Automation"
                  />
                </div>
              </div>
            )}

            {selectedOrgType === 'Educational Institution' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Campus Category
                  </label>
                  <select
                    value={businessDetails.campusType}
                    onChange={(e) => setBusinessDetails({ ...businessDetails, campusType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Engineering / Autonomous College">Engineering / Autonomous College</option>
                    <option value="K-12 School">K-12 School</option>
                    <option value="University / Multi-Faculty">University / Multi-Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Student Capacity
                  </label>
                  <input
                    type="text"
                    value={businessDetails.studentCapacity}
                    onChange={(e) => setBusinessDetails({ ...businessDetails, studentCapacity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 2,500 Students"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Official Proof Documents Upload */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  Step 5: Upload Statutory Proof Documents
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {uploadedDocuments.length} Attached
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload official regulatory records required for <strong>{selectedOrgType}</strong>. All files are securely watermarked and audited.
              </p>
            </div>

            {/* Live Duplicate Risk Warning Banner */}
            {duplicateRiskAlert?.hasDuplicateRisk && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Potential Duplicate Entity Detected</h4>
                  <p className="mt-1">
                    {duplicateRiskAlert.topRisk?.reason || 'An organization matching these registration details already exists in the system.'}
                  </p>
                </div>
              </div>
            )}

            {/* Document Requirements Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docRequirements.map(req => {
                const uploaded = uploadedDocuments.find(d => d.requirementId === req.id);
                return (
                  <div
                    key={req.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      uploaded
                        ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800'
                        : req.required
                        ? 'border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <FileText className={`w-3.5 h-3.5 ${uploaded ? 'text-emerald-500' : 'text-blue-500'}`} />
                          {req.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          req.required
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {req.required ? 'Mandatory' : 'Optional'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                        {req.description}
                      </p>
                    </div>

                    <div>
                      {uploaded ? (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                          <div className="flex items-center gap-2 truncate mr-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <div className="truncate">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">{uploaded.name}</span>
                              <span className="text-[10px] text-slate-400">{uploaded.fileSize}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(req.id)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/60 dark:bg-slate-800/30 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer transition">
                          <Upload className="w-3.5 h-3.5 text-blue-500" />
                          <span>Attach Document (.pdf, .png, .jpg)</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(req, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Statutory Upload Disclaimer */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Maximum file size: 10 MB per document. Supported MIME types: PDF, JPG, JPEG, PNG. All documents are stored under AES-256 equivalent encryption and inspected strictly by authorized compliance officers.
              </span>
            </div>
          </div>
        )}

        {/* STEP 6: Module Selection */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  Step 6: Select Enabled Modules
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {selectedModules.length} Modules Selected
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Modules with the "Recommended" badge are optimized for <strong>{selectedOrgType}</strong>. You can toggle any module on or off.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
              {ALL_MODULES.map((mod) => {
                const Icon = mod.icon;
                const isSelected = selectedModules.includes(mod.id);
                const matchedOrgType = BUSINESS_TYPES.find(b => b.id === selectedOrgType);
                const isRecommended = matchedOrgType?.defaultModules.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1">
                        {isRecommended && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Recommended
                          </span>
                        )}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={mod.locked}
                          onChange={() => {}} // Handled by container onClick
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {mod.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {mod.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7: Review & Final Submission */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Step 7: Verification Application Summary
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify your organization configuration and statutory proof documents before submitting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Org Profile Summary */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Legal Entity Profile
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {orgName || 'Untitled Workspace'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Sector: <strong>{selectedOrgType}</strong>
                </p>
                <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
                  <p>Reg #: <strong>{registrationNumber || 'Pending'}</strong></p>
                  <p>Tax ID: <strong>{taxId || 'N/A'}</strong></p>
                  {website && <p>Website: {website}</p>}
                </div>
                <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-900/30 text-xs text-slate-600 dark:text-slate-400">
                  <span>Signatory: <strong>{account.fullName}</strong> ({applicantTitle})</span>
                </div>
              </div>

              {/* Location & Proof Docs Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Operating Jurisdiction
                  </span>
                  <div className="mt-1 text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                    <p><strong>{location.city}, {location.state}, {location.country}</strong></p>
                    {location.address && <p className="text-slate-500 truncate">{location.address}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Proof Documents Attached ({uploadedDocuments.length})
                  </span>
                  <div className="space-y-1">
                    {uploadedDocuments.map(d => (
                      <div key={d.id} className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{d.name} ({d.fileSize})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Compliance Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">SMARTORA Statutory Compliance Agreement</strong>
                By submitting this application, you declare that all uploaded incorporation proof documents are genuine. Your tenant workspace will enter the <strong>PENDING</strong> verification queue. Master administrator login credentials will be granted upon Platform Owner statutory verification clearance.
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Application Submitted & Verification Tracking */}
        {step === 8 && submittedTrackingResult && (
          <div className="py-6 space-y-6 animate-in zoom-in-95 duration-300 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 uppercase tracking-widest">
                Status: PENDING STATUTORY REVIEW
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
                Verification Application Registered!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Your institutional onboarding application for <strong>{orgName}</strong> has been received.
              </p>
            </div>

            {/* Tracking ID Spotlight Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900 text-left space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Application Tracking ID (Save this reference)
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-blue-600 dark:text-blue-400">
                  {submittedTrackingResult.trackingId}
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  icon={Copy}
                  onClick={() => {
                    navigator.clipboard.writeText(submittedTrackingResult.trackingId);
                    addToast('Copied', 'Tracking ID copied to clipboard.', 'info');
                  }}
                >
                  Copy ID
                </Button>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-left text-xs space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> What Happens Next?
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>Our platform compliance team cross-references submitted proof documents against official registries (MCA, UGC, NMC, Darpan).</li>
                <li>Once validated, your tenant organization status transitions to <strong>VERIFIED</strong>.</li>
                <li>Your master administrator credentials will be activated, and you can sign in directly to your smart workspace.</li>
                <li>You can track application progress or provide supplementary records at any time using your Tracking ID.</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                icon={Search}
                onClick={() => {
                  setTrackingLookupId(submittedTrackingResult.trackingId);
                  handleLookupApplication(submittedTrackingResult.trackingId);
                  setIsTrackingModalOpen(true);
                }}
              >
                Track Application Status
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Actions (Steps 1 to 7) */}
        {step < 8 && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                size="md"
                onClick={handleBack}
                icon={ArrowLeft}
              >
                Back
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
              >
                Already have an account? <span className="text-blue-600 font-bold">Sign In</span>
              </button>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
            >
              {step === 7 ? (
                <span className="flex items-center gap-2">
                  Submit Application for Verification
                  <ShieldCheck className="w-4 h-4 text-white" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue to Step {step + 1}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        )}

      </div>

      {/* MODAL: APPLICATION STATUS TRACKER */}
      {isTrackingModalOpen && (
        <Modal
          isOpen={isTrackingModalOpen}
          onClose={() => {
            setIsTrackingModalOpen(false);
            setTrackedAppResult(null);
            setTrackingLookupError('');
          }}
          title="Organization Verification Application Tracker"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your Application Tracking ID (e.g. <code>VER-2026-001</code>) or official Registration Number to check verification progress and submit requested supplementary proofs.
            </p>

            {/* Tracking ID Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Enter Tracking ID (e.g. VER-2026-001)..."
                  value={trackingLookupId}
                  onChange={(e) => setTrackingLookupId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLookupApplication();
                  }}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={Search}
                onClick={() => handleLookupApplication()}
                className="shrink-0"
              >
                Track Status
              </Button>
            </div>

            {/* Quick Sample IDs */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
              <span className="font-semibold">Quick Demos:</span>
              {[
                { id: 'VER-2026-001', label: 'VER-2026-001 (Pending)' },
                { id: 'VER-2026-002', label: 'VER-2026-002 (Under Review)' },
                { id: 'VER-2026-003', label: 'VER-2026-003 (Needs Info)' },
                { id: 'VER-2026-004', label: 'VER-2026-004 (Rejected)' },
                { id: 'VER-2026-005', label: 'VER-2026-005 (Verified)' }
              ].map(sample => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    setTrackingLookupId(sample.id);
                    handleLookupApplication(sample.id);
                  }}
                  className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 font-mono transition"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {trackingLookupError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{trackingLookupError}</span>
              </div>
            )}

            {/* Tracked Result Dossier */}
            {trackedAppResult && (
              <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">APPLICATION TRACKING ID</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                      {trackedAppResult.id}
                    </span>
                  </div>
                  <div>
                    {trackedAppResult.verification_status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        <Clock4 className="w-3.5 h-3.5" /> PENDING REVIEW
                      </span>
                    )}
                    {trackedAppResult.verification_status === 'UNDER_REVIEW' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                        <Clock4 className="w-3.5 h-3.5" /> UNDER COMPLIANCE REVIEW
                      </span>
                    )}
                    {trackedAppResult.verification_status === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED TENANT
                      </span>
                    )}
                    {trackedAppResult.verification_status === 'NEEDS_MORE_INFORMATION' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                        <HelpCircle className="w-3.5 h-3.5" /> ACTION REQUIRED: MORE INFO
                      </span>
                    )}
                    {trackedAppResult.verification_status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        <XCircle className="w-3.5 h-3.5" /> APPLICATION REJECTED
                      </span>
                    )}
                    {trackedAppResult.verification_status === 'SUSPENDED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-200 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border border-rose-400">
                        <ShieldAlert className="w-3.5 h-3.5" /> TENANT SUSPENDED
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Organization Legal Name:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{trackedAppResult.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Registration / AISHE #:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{trackedAppResult.registrationNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assigned Reviewer:</span>
                    <span className="font-medium">{trackedAppResult.reviewer || 'Compliance Queue'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Submitted On:</span>
                    <span className="font-medium font-mono">
                      {trackedAppResult.submittedAt ? new Date(trackedAppResult.submittedAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                </div>

                {/* Status Specific Action Panels */}
                {trackedAppResult.verification_status === 'VERIFIED' && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Congratulations! Your tenant instance has been approved and activated.</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      Your master administrator credentials are active. Sign in to launch your workspace.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate('login')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold w-full"
                    >
                      Proceed to Sign In
                    </Button>
                  </div>
                )}

                {trackedAppResult.verification_status === 'REJECTED' && (
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl space-y-1.5 text-xs text-rose-800 dark:text-rose-200">
                    <div className="flex items-center gap-2 font-bold">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Statutory Rejection Notice</span>
                    </div>
                    <p className="text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900 font-mono">
                      {trackedAppResult.rejectionReason || 'Registration details could not be validated against official statutory registry records.'}
                    </p>
                  </div>
                )}

                {trackedAppResult.verification_status === 'NEEDS_MORE_INFORMATION' && (
                  <div className="p-3.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-xl space-y-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-orange-900 dark:text-orange-200">
                      <HelpCircle className="w-4 h-4 text-orange-600" />
                      <span>Action Required: Reviewer Requested Additional Documents</span>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-orange-200 dark:border-orange-800 text-slate-700 dark:text-slate-300">
                      <strong>Reviewer Note:</strong> {trackedAppResult.reviewNotes || 'Please upload supplementary proof documentation.'}
                    </div>

                    {/* Resubmission Form */}
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Upload Supplementary Proof Document:
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSupplementaryFile(e.target.files[0]);
                          }
                        }}
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {supplementaryFile && (
                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {supplementaryFile.name} ({formatBytes(supplementaryFile.size)})
                        </div>
                      )}

                      <textarea
                        rows={2}
                        placeholder="Add response note / clarification for the reviewer..."
                        value={supplementaryNotes}
                        onChange={(e) => setSupplementaryNotes(e.target.value)}
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />

                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isSubmittingSupplementary}
                        onClick={handleSupplementaryResubmit}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold"
                      >
                        {isSubmittingSupplementary ? 'Submitting...' : 'Submit Supplementary Documents'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Audit History Timeline */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Application History Log
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {(trackedAppResult.auditHistory || trackedAppResult.verificationHistory || []).map((h, idx) => (
                      <div key={idx} className="text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 font-mono">
                        <span><strong>{h.action}</strong> by {h.actor || h.actorName || 'User'}</span>
                        <span>{h.timestamp ? new Date(h.timestamp).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsTrackingModalOpen(false);
                  setTrackedAppResult(null);
                  setTrackingLookupError('');
                }}
              >
                Close Tracker
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
