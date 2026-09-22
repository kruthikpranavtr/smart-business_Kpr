// Agent Tools Service for SMARTORA
// Connects Agentic AI directly to existing SMARTORA business modules, databases, and APIs
// Declares Read tools, Action tools, and High-Risk Approval flags

import { storageService } from '../storageService';
import { matchesTenant } from '../../utils/tenantUtils';

export const agentTools = {
  // --- READ TOOLS (Zero risk, directly queries live tenant database with strict isolation) ---

  getSales: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0001';
    const allSales = storageService.getItem(keys.SALES, []);
    const tenantSales = allSales.filter(s => matchesTenant(s, orgId));
    
    const totalRevenue = tenantSales.reduce((acc, s) => acc + (s.amount || 0), 0);
    const completed = tenantSales.filter(s => s.status === 'Completed' || s.status === 'Delivered');
    
    return {
      success: true,
      count: tenantSales.length,
      totalRevenue,
      completedCount: completed.length,
      recentSales: tenantSales.slice(0, 5)
    };
  },

  getInventory: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0001';
    const allProducts = storageService.getItem(keys.PRODUCTS, []);
    const tenantProducts = allProducts.filter(p => matchesTenant(p, orgId));

    const lowStock = tenantProducts.filter(p => p.status === 'Low Stock' || p.stock <= (p.minStock || 10));
    const outOfStock = tenantProducts.filter(p => p.status === 'Out of Stock' || p.stock === 0);

    return {
      success: true,
      totalCatalog: tenantProducts.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      lowStockItems: lowStock.map(p => ({ id: p.id, name: p.name, stock: p.stock, minStock: p.minStock, price: p.price })),
      outOfStockItems: outOfStock.map(p => ({ id: p.id, name: p.name, price: p.price }))
    };
  },

  getInvoices: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0001';
    const allInvoices = storageService.getItem(keys.INVOICES, []);
    const tenantInvoices = allInvoices.filter(i => matchesTenant(i, orgId));

    const overdue = tenantInvoices.filter(i => (i.status || '').toLowerCase() === 'overdue');
    const pending = tenantInvoices.filter(i => (i.status || '').toLowerCase() === 'pending');
    const overdueTotal = overdue.reduce((acc, i) => acc + (Number(i.total) || Number(i.amount) || 0), 0);
    const pendingTotal = pending.reduce((acc, i) => acc + (Number(i.total) || Number(i.amount) || 0), 0);

    return {
      success: true,
      totalInvoices: tenantInvoices.length,
      overdueCount: overdue.length,
      overdueTotal,
      overdueInvoices: overdue.map(i => ({ id: i.id, customer: i.customer, total: i.total || i.amount, dueDate: i.dueDate })),
      pendingCount: pending.length,
      pendingTotal
    };
  },

  getTasks: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0001';
    const allTasks = storageService.getItem(keys.TASKS, []);
    const tenantTasks = allTasks.filter(t => matchesTenant(t, orgId));

    const pending = tenantTasks.filter(t => t.status !== 'Completed');
    const overdue = tenantTasks.filter(t => t.status === 'Overdue');
    const highPriority = pending.filter(t => t.priority === 'High' || t.priority === 'Urgent');

    return {
      success: true,
      totalTasks: tenantTasks.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
      overdueTasks: overdue.map(t => ({ id: t.id, title: t.title, assignedTo: t.assignedTo, deadline: t.deadline })),
      highPriorityTasks: highPriority.map(t => ({ id: t.id, title: t.title, assignedTo: t.assignedTo }))
    };
  },

  getExpenses: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0001';
    const allExpenses = storageService.getItem(keys.EXPENSES, []);
    const tenantExpenses = allExpenses.filter(e => matchesTenant(e, orgId));
    const totalAmount = tenantExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

    return {
      success: true,
      totalExpenses: totalAmount,
      recentExpenses: tenantExpenses.slice(0, 5)
    };
  },

  getCustomers: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0001';
    const allCustomers = storageService.getItem(keys.CUSTOMERS, []);
    const tenantCustomers = allCustomers.filter(c => matchesTenant(c, orgId));

    return {
      success: true,
      totalCustomers: tenantCustomers.length,
      customers: tenantCustomers.slice(0, 5)
    };
  },

  getEmployees: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0001';
    const allEmployees = storageService.getItem(keys.EMPLOYEES, []);
    const tenantEmployees = allEmployees.filter(e => matchesTenant(e, orgId));

    return {
      success: true,
      totalEmployees: tenantEmployees.length,
      employees: tenantEmployees.slice(0, 6)
    };
  },

  // --- ACADEMIC / COLLEGE READ TOOLS ---
  getStudents: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0003';
    const allStudents = storageService.getItem(keys.STUDENTS, []);
    const tenantStudents = allStudents.filter(s => matchesTenant(s, orgId));

    return {
      success: true,
      totalStudents: tenantStudents.length,
      students: tenantStudents.slice(0, 5).map(s => ({
        id: s.id || s.studentId,
        name: s.name,
        course: s.course || s.degree,
        department: s.department,
        status: s.status || 'Active'
      }))
    };
  },

  getCourses: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0003';
    const allCourses = storageService.getItem(keys.COURSES, []);
    const tenantCourses = allCourses.filter(c => matchesTenant(c, orgId));

    return {
      success: true,
      totalCourses: tenantCourses.length,
      courses: tenantCourses.map(c => ({ id: c.id, code: c.code, name: c.name, department: c.department }))
    };
  },

  // --- HOSPITALITY / HOTEL READ TOOLS ---
  getRooms: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0002';
    const allRooms = storageService.getItem(keys.ROOMS, []);
    const tenantRooms = allRooms.filter(r => matchesTenant(r, orgId));

    const occupied = tenantRooms.filter(r => r.status === 'Occupied');
    const available = tenantRooms.filter(r => r.status === 'Available');
    const cleaning = tenantRooms.filter(r => r.status === 'Cleaning');
    const maintenance = tenantRooms.filter(r => r.status === 'Maintenance');

    return {
      success: true,
      totalRooms: tenantRooms.length,
      occupiedCount: occupied.length,
      availableCount: available.length,
      cleaningCount: cleaning.length,
      maintenanceCount: maintenance.length,
      occupancyRate: tenantRooms.length > 0 ? Math.round((occupied.length / tenantRooms.length) * 100) : 0
    };
  },

  getReservations: (params = {}, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || context.organizationId || 'SMR-CMP-0002';
    const allRes = storageService.getItem(keys.RESERVATIONS, []);
    const tenantRes = allRes.filter(r => matchesTenant(r, orgId));

    const confirmed = tenantRes.filter(r => r.status === 'Confirmed');
    const checkedIn = tenantRes.filter(r => r.status === 'Checked In');

    return {
      success: true,
      totalReservations: tenantRes.length,
      confirmedCount: confirmed.length,
      checkedInCount: checkedIn.length,
      recent: tenantRes.slice(0, 5)
    };
  },

  getBusinessSummary: (params = {}, context = {}) => {
    const orgType = (context.organizationType || context.type || '').toLowerCase();

    if (orgType.includes('college') || orgType.includes('education')) {
      const studs = agentTools.getStudents({}, context);
      const crs = agentTools.getCourses({}, context);
      const emps = agentTools.getEmployees({}, context);
      const tasks = agentTools.getTasks({}, context);
      return {
        success: true,
        category: 'College',
        totalStudents: studs.totalStudents,
        totalCourses: crs.totalCourses,
        facultyCount: emps.totalEmployees,
        pendingTasks: tasks.pendingCount
      };
    }

    if (orgType.includes('hotel') || orgType.includes('resort')) {
      const roomData = agentTools.getRooms({}, context);
      const resData = agentTools.getReservations({}, context);
      const staffData = agentTools.getEmployees({}, context);
      return {
        success: true,
        category: 'Hotel',
        totalRooms: roomData.totalRooms,
        availableRooms: roomData.availableCount,
        occupiedRooms: roomData.occupiedCount,
        occupancyRate: `${roomData.occupancyRate}%`,
        activeReservations: resData.confirmedCount + resData.checkedInCount,
        staffCount: staffData.totalEmployees
      };
    }

    const sales = agentTools.getSales({}, context);
    const inventory = agentTools.getInventory({}, context);
    const invoices = agentTools.getInvoices({}, context);
    const tasks = agentTools.getTasks({}, context);
    const expenses = agentTools.getExpenses({}, context);

    return {
      success: true,
      category: 'Company',
      revenue: sales.totalRevenue,
      expenses: expenses.totalExpenses,
      lowStockProducts: inventory.lowStockCount,
      outOfStockProducts: inventory.outOfStockCount,
      overdueInvoices: invoices.overdueCount,
      overdueInvoicesAmount: invoices.overdueTotal,
      overdueTasks: tasks.overdueCount,
      pendingTasks: tasks.pendingCount
    };
  },

  // --- ACTION TOOLS (Mutating existing SMARTORA state) ---

  createTask: (params, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || 'org-001';
    const tasks = storageService.getItem(keys.TASKS, []);

    const newTask = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      organization_id: orgId,
      title: params.title || 'Automated Agent Task Assignment',
      department: params.department || context.department || 'Operations',
      assignedTo: params.assignedTo || 'Inventory Lead',
      deadline: params.deadline || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      priority: params.priority || 'High',
      status: 'Pending',
      progress: 0,
      description: params.description || 'Generated autonomously by SMARTORA Agent.'
    };

    const nextTasks = [newTask, ...tasks];
    storageService.setItem(keys.TASKS, nextTasks);

    return {
      success: true,
      createdTask: newTask,
      message: `Drafted task "${newTask.title}" assigned to ${newTask.assignedTo}.`
    };
  },

  createNotification: (params, context = {}) => {
    const keys = storageService.getKeys();
    const notifs = storageService.getItem(keys.NOTIFICATIONS, []);

    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: params.title || 'SMARTORA Agent Dispatch',
      message: params.message || 'Action executed by autonomous agent.',
      time: 'Just now',
      read: false,
      type: params.type || 'info'
    };

    const nextNotifs = [newNotif, ...notifs];
    storageService.setItem(keys.NOTIFICATIONS, nextNotifs);

    return {
      success: true,
      notification: newNotif
    };
  },

  createAutomation: (params, context = {}) => {
    const keys = storageService.getKeys();
    const rules = storageService.getItem(keys.AUTOMATION_RULES, []);

    const newRule = {
      id: `RUL-${Date.now().toString().slice(-4)}`,
      name: params.name || 'Autonomous Event Trigger',
      category: params.category || 'Operations',
      trigger: params.trigger || 'Task Status Changed to Overdue',
      condition: params.condition || 'WHEN task.status == "Overdue"',
      action: params.action || 'Notify Department Manager immediately',
      enabled: true,
      lastRun: 'Pending',
      executionCount: 0
    };

    const nextRules = [newRule, ...rules];
    storageService.setItem(keys.AUTOMATION_RULES, nextRules);

    return {
      success: true,
      rule: newRule,
      message: `New Automation Rule "${newRule.name}" created and online.`
    };
  },

  // --- HIGH RISK ACTION PROPOSALS (Require Human Approval Card) ---

  createPurchaseOrderDraft: (params, context = {}) => {
    const keys = storageService.getKeys();
    const orgId = context.organization_id || 'org-001';

    const approvalItem = {
      id: `APV-${Date.now().toString().slice(-4)}`,
      runId: context.runId || `RUN-${Date.now().toString().slice(-4)}`,
      organization_id: orgId,
      title: `Purchase Order Authorization: ₹${(params.amount || 48500).toLocaleString('en-IN')} for ${params.supplier || 'Primary Supplier'}`,
      category: 'Financial / Procurement',
      riskLevel: 'High',
      requestedBy: context.userName || 'SMARTORA Autonomous Agent',
      requestedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      details: {
        supplier: params.supplier || 'National Wholesale Distributors',
        amount: params.amount || 48500,
        currency: '₹',
        items: params.items || [
          { name: params.itemName || 'Low-Stock Restock Batch', qty: params.qty || 50, unitPrice: params.unitPrice || 970 }
        ],
        justification: params.justification || 'Buffer restock triggered by agent low inventory analysis.'
      },
      status: 'Pending'
    };

    const existingApprovals = storageService.getItem(keys.PENDING_APPROVALS, []);
    storageService.setItem(keys.PENDING_APPROVALS, [approvalItem, ...existingApprovals]);

    return {
      success: true,
      requiresApproval: true,
      approvalItem: approvalItem,
      message: `Prepared Purchase Order draft for ₹${(params.amount || 48500).toLocaleString('en-IN')}. Awaiting executive approval.`
    };
  }
};
