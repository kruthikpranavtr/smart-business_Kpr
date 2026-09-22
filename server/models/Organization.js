import mongoose from 'mongoose';
import { diskStore } from '../config/db.js';

const organizationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  companyId: { type: String, required: true, unique: true, index: true },
  adminId: { type: String, required: true },
  companyCode: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  industry: { type: String, default: 'General Enterprise' },
  tagline: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: 'India' },
  website: { type: String, default: '' },
  logo: { type: String, default: null },
  currency: { type: String, default: 'INR (₹)' },
  currencySymbol: { type: String, default: '₹' },
  verification_status: { type: String, default: 'VERIFIED' },
  status: { type: String, default: 'Active' },
  subscription: {
    plan: { type: String, default: 'Professional' },
    status: { type: String, default: 'Active' },
    mrr: { type: String, default: '₹6,999/mo' },
    billingCycle: { type: String, default: 'Annual' }
  }
}, {
  timestamps: true
});

const MongooseOrg = mongoose.models.Organization || mongoose.model('Organization', organizationSchema);

const INITIAL_ORGANIZATIONS = [
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
    status: 'Active',
    subscription: { plan: 'Enterprise Plus', status: 'Active', mrr: '₹14,999/mo', billingCycle: 'Annual' }
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
    status: 'Active',
    subscription: { plan: 'Growth Tier', status: 'Active', mrr: '₹4,999/mo', billingCycle: 'Monthly' }
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
    status: 'Active',
    subscription: { plan: 'Campus Enterprise', status: 'Active', mrr: '₹24,999/mo', billingCycle: 'Annual' }
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
    status: 'Active',
    subscription: { plan: 'Professional', status: 'Active', mrr: '₹6,999/mo', billingCycle: 'Annual' }
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
    tagline: 'Compassionate Diagnostic Care & Family Wellness',
    currency: 'INR (₹)',
    currencySymbol: '₹',
    status: 'Active',
    subscription: { plan: 'Professional', status: 'Active', mrr: '₹8,499/mo', billingCycle: 'Annual' }
  }
];

export const OrganizationModel = {
  getAll: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        const orgs = await MongooseOrg.find().lean();
        if (orgs.length > 0) return orgs;
      }
    } catch (e) {
      console.error('[Org Model] MongoDB query error:', e.message);
    }
    return diskStore.readCollection('organizations', INITIAL_ORGANIZATIONS);
  },

  findById: async (orgId) => {
    const orgs = await OrganizationModel.getAll();
    return orgs.find(o => o.id === orgId || o.companyId === orgId) || null;
  },

  updateCompany: async (orgId, updateData) => {
    const orgs = diskStore.readCollection('organizations', INITIAL_ORGANIZATIONS);
    const index = orgs.findIndex(o => o.id === orgId || o.companyId === orgId);
    if (index === -1) return null;

    const current = orgs[index];
    // Immutable ID Protection
    const sanitized = { ...updateData };
    delete sanitized.id;
    delete sanitized.companyId;
    delete sanitized.adminId;

    const updated = {
      ...current,
      ...sanitized,
      updatedAt: new Date().toISOString()
    };

    orgs[index] = updated;
    diskStore.writeCollection('organizations', orgs);

    try {
      if (mongoose.connection.readyState === 1) {
        await MongooseOrg.findOneAndUpdate({ id: current.id }, { $set: sanitized }, { new: true, upsert: true });
      }
    } catch (e) {
      console.error('[Org Model] MongoDB update error:', e.message);
    }

    return updated;
  }
};
