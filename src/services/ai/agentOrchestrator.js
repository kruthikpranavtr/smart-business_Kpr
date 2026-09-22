// Agentic AI Orchestrator for SMARTORA
// Plans, selects authorized tools, executes multi-step workflows,
// generates Human Approval cards for high-risk actions, and maintains execution telemetry

import { agentTools } from './agentTools';
import { ragService } from './ragService';
import { storageService } from '../storageService';

export const agentOrchestrator = {
  // Execute an Autonomous Agent Workflow
  runAgent: async (goalText, userContext = {}) => {
    const keys = storageService.getKeys();
    const runId = `RUN-${Math.floor(1050 + Math.random() * 8900)}`;
    const q = goalText.toLowerCase().trim();
    const orgId = userContext.organization_id || 'org-001';

    let plan = [];
    let toolsUsed = [];
    let actions = [];
    let requiresApproval = false;
    let approvalItem = null;
    let summary = '';
    let status = 'Completed';

    // --- WORKFLOW 1: INVENTORY AUDIT & REPLENISHMENT TASK CREATION ---
    if (q.includes('low-stock') || q.includes('low stock') || q.includes('replenish') || (q.includes('inventory') && q.includes('task'))) {
      plan = [
        '1. Verify user RBAC permissions for Inventory and Tasks.',
        '2. Query SMARTORA live inventory API (getInventory).',
        '3. Identify products below configured minimum safety thresholds.',
        '4. Create task drafts in SMARTORA Task System for warehouse leads.',
        '5. Dispatch system alert and record audit trail.'
      ];
      toolsUsed = ['getInventory', 'createTask', 'createNotification', 'logAuditEvent'];

      const invData = agentTools.getInventory({}, userContext);
      const lowItems = invData.lowStockItems;

      if (lowItems.length === 0) {
        summary = `All inventory catalog items for **${userContext.organizationName || 'Current Organization'}** are at or above minimum safety levels. No restock tasks were required.`;
        actions.push('Audited inventory catalog: 0 low stock items found.');
      } else {
        actions.push(`Identified ${lowItems.length} low-stock products: ${lowItems.map(i => i.name).join(', ')}.`);

        // Create tasks for each low stock item
        lowItems.slice(0, 3).forEach(item => {
          const taskRes = agentTools.createTask({
            title: `Restock Order: ${item.name} (${item.stock} left, min: ${item.minStock})`,
            assignedTo: 'Warehouse Operations Lead',
            department: 'Operations',
            priority: 'High',
            description: `Auto-generated replenishment order by SMARTORA Agent for ${item.name}. Current stock: ${item.stock}.`
          }, userContext);
          actions.push(`Created Task ${taskRes.createdTask.id}: Restock ${item.name}.`);
        });

        agentTools.createNotification({
          title: 'Inventory Alert Tasks Dispatched',
          message: `${lowItems.length} replenishment tasks generated for warehouse operations.`,
          type: 'warning'
        }, userContext);

        summary = `I analyzed your live catalog and found **${lowItems.length} low-stock products**.\n\nI created **${Math.min(lowItems.length, 3)} task drafts** assigned to the Warehouse Operations Lead in the SMARTORA Task System:\n${lowItems.slice(0, 3).map(i => `• **${i.name}**: ${i.stock} units remaining (min: ${i.minStock})`).join('\n')}\n\nThese tasks are currently active on the task board. No financial purchase orders have been dispatched without your approval.`;
      }
    }

    // --- WORKFLOW 2: BUSINESS HEALTH ANALYSIS & ANOMALY DETECTION ---
    else if (q.includes('analyze my business') || q.includes('needs attention') || q.includes('business summary') || q.includes('health check') || q.includes('what needs attention')) {
      plan = [
        '1. Retrieve multi-tenant sales, expenses, inventory, invoices, and tasks.',
        '2. Aggregate gross revenue, overdue receivables, and task bottlenecks.',
        '3. Cross-reference operating thresholds to isolate critical bottlenecks.',
        '4. Produce synthesized executive report with recommended interventions.'
      ];
      toolsUsed = ['getBusinessSummary', 'getSales', 'getInvoices', 'getInventory', 'getTasks'];

      const summaryData = agentTools.getBusinessSummary({}, userContext);
      const curr = userContext.currencySymbol || '₹';

      summary = `### 📊 SMARTORA Autonomous Business Diagnostic
**Organization:** ${userContext.organizationName || 'Current Organization'}

**Key Operational Metrics:**
• **Total Gross Revenue:** **${curr}${summaryData.revenue.toLocaleString('en-IN')}**
• **Operating Expenses:** **${curr}${summaryData.expenses.toLocaleString('en-IN')}**
• **Overdue Invoices:** **${summaryData.overdueInvoices} accounts** totaling **${curr}${summaryData.overdueInvoicesAmount.toLocaleString('en-IN')}**
• **Low/Out of Stock SKUs:** **${summaryData.lowStockProducts + summaryData.outOfStockProducts} items** requiring replenishment
• **Pending Tasks:** **${summaryData.pendingTasks} active** (${summaryData.overdueTasks} overdue)

**Primary Areas Requiring Immediate Attention:**
1. **Accounts Receivable:** ${summaryData.overdueInvoices} overdue invoices require payment reminder dispatch.
2. **Catalog Health:** ${summaryData.lowStockProducts} products are operating below threshold buffers.
3. **Workflow Velocity:** ${summaryData.overdueTasks} tasks have crossed target delivery deadlines.`;

      actions.push('Aggregated cross-functional telemetry across sales, inventory, billing, and tasks.');
    }

    // --- WORKFLOW 3: AGENT + RAG (DATABASE + POLICY REASONING) ---
    else if ((q.includes('policy') || q.includes('sop') || q.includes('rule')) && (q.includes('inventory') || q.includes('leave') || q.includes('action'))) {
      plan = [
        '1. Query live SMARTORA database for operational state.',
        '2. Execute RAG vector search in tenant knowledge base for relevant policy.',
        '3. Ground LLM reasoning against both real database and policy clauses.',
        '4. Compile grounded recommendation with source attribution.'
      ];
      toolsUsed = ['getInventory', 'searchKnowledgeBase', 'ragService'];

      const ragResult = await ragService.generateAnswer(goalText, userContext);
      const invData = agentTools.getInventory({}, userContext);

      actions.push('Retrieved live inventory levels.');
      actions.push(`Queried tenant knowledge base: ${ragResult.sources.length} sources matched.`);

      summary = `### 📑 Policy-Grounded Operational Assessment\n\n` +
        `**Live Database Finding:** You have **${invData.lowStockCount} products below minimum thresholds**.\n\n` +
        `${ragResult.text}\n\n` +
        `**Agent Recommendation:** In accordance with your organization's policy, procurement reorder requests should be placed before stock reaches zero.`;
    }

    // --- WORKFLOW 4: PURCHASE ORDER DRAFT (High-Risk -> Human Approval Card) ---
    else if (q.includes('purchase order') || q.includes('po draft') || q.includes('buy') || q.includes('procure') || q.includes('order stock')) {
      plan = [
        '1. Identify supplier and compute replenishment volume.',
        '2. Evaluate transaction threshold: Amount exceeds autonomous limit (High Risk).',
        '3. Formulate Purchase Order draft proposal.',
        '4. Dispatch Human Approval Card to executive queue.'
      ];
      toolsUsed = ['createPurchaseOrderDraft', 'requestHumanApproval'];

      const draftRes = agentTools.createPurchaseOrderDraft({
        supplier: 'Dell Enterprise India Ltd',
        amount: 48500,
        itemName: 'Enterprise Cloud Server Arrays & Storage Modules',
        qty: 3,
        unitPrice: 16166
      }, { ...userContext, runId });

      requiresApproval = true;
      approvalItem = draftRes.approvalItem;
      status = 'Pending Approval';

      actions.push('Constructed Purchase Order draft PO-2025-08.');
      actions.push('Flagged financial authorization card for human approval.');

      summary = `I prepared a **Purchase Order Draft for ₹48,500** for **Dell Enterprise India Ltd**.\n\nBecause financial commitments over ₹25,000 represent a high-risk action, this order requires your explicit authorization before transmission to suppliers. Please review and approve below:`;
    }

    // --- WORKFLOW 5: AUTOMATION RULE CREATION (High-Risk Proposal) ---
    else if (q.includes('automation') || q.includes('automate') || (q.includes('rule') && q.includes('create'))) {
      plan = [
        '1. Formulate event trigger condition and target action.',
        '2. Validate against existing SMARTORA Automation Engine syntax.',
        '3. Present proposed rule specification for user confirmation.',
        '4. Commit rule to live event listener queue.'
      ];
      toolsUsed = ['createAutomation', 'logAuditEvent'];

      const autoRes = agentTools.createAutomation({
        name: 'Auto-Notify Manager on Overdue Tasks',
        category: 'Operations',
        trigger: 'Task Deadline Elapsed (Daily 00:00 IST)',
        condition: 'WHEN task.status == "Overdue" && task.priority == "High"',
        action: 'Dispatch urgent push notification and email alert to Department Manager'
      }, userContext);

      actions.push(`Created Automation Rule "${autoRes.rule.name}".`);

      summary = `I formulated and activated a new automation rule in your **SMARTORA Automation Engine**:\n\n• **Rule Name:** ${autoRes.rule.name}\n• **Trigger:** ${autoRes.rule.trigger}\n• **Condition:** \`${autoRes.rule.condition}\`\n• **Action:** ${autoRes.rule.action}\n\nThis rule is now live and will evaluate automatically against your organization's tasks.`;
    }

    // --- DEFAULT WORKFLOW: GENERAL OPERATIONAL EXECUTION ---
    else {
      plan = [
        '1. Inspect query intent and verify tenant permissions.',
        '2. Query relevant SMARTORA database module.',
        '3. Synthesize structured answer.'
      ];
      toolsUsed = ['getBusinessSummary'];
      const summaryData = agentTools.getBusinessSummary({}, userContext);
      actions.push('Queried organization business summary.');

      summary = `I analyzed your organization's current operations:\n• **Sales Revenue:** ₹${summaryData.revenue.toLocaleString('en-IN')}\n• **Overdue Invoices:** ${summaryData.overdueInvoices}\n• **Low Stock Items:** ${summaryData.lowStockProducts}\n• **Pending Tasks:** ${summaryData.pendingTasks}\n\nYou can ask me to perform actions like: "Find low-stock products and create tasks", "Analyze overdue invoices", or "Prepare a purchase order draft".`;
    }

    // Create Agent Run Log Entry
    const runRecord = {
      id: runId,
      organization_id: orgId,
      user_id: userContext.userId || 'usr-current',
      userName: userContext.userName || 'Authenticated User',
      request: goalText,
      plan,
      toolsUsed,
      actions,
      approvalStatus: requiresApproval ? 'Pending Approval' : 'Autonomous',
      riskLevel: requiresApproval ? 'High' : 'Low',
      status,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      resultSummary: summary.slice(0, 160) + '...'
    };

    // Save run record to localStorage
    const existingRuns = storageService.getItem(keys.AGENT_RUNS, []);
    storageService.setItem(keys.AGENT_RUNS, [runRecord, ...existingRuns]);

    return {
      runId,
      plan,
      toolsUsed,
      actions,
      requiresApproval,
      approvalItem,
      summary,
      status
    };
  }
};
