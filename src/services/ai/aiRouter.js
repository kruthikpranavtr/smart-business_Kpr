// AI Router for SMARTORA
// Intelligently classifies user queries and routes them to RAG, Agentic AI, Live Database, or LLM

export const aiRouter = {
  // Determine route based on query characteristics
  classifyQuery: (query) => {
    const q = (query || '').toLowerCase().trim();

    // 1. Agent Action / Multi-step Automation
    if (
      q.includes('create task') ||
      (q.includes('find') && q.includes('create')) ||
      q.includes('purchase order') ||
      q.includes('po draft') ||
      q.includes('create automation') ||
      (q.includes('rule') && q.includes('create')) ||
      q.includes('replenish')
    ) {
      return {
        route: 'AGENT_ACTION',
        badge: 'Agentic AI',
        color: 'purple'
      };
    }

    // 2. RAG Knowledge Base Queries (Policies, SOPs, handbooks, guidelines)
    if (
      q.includes('policy') ||
      q.includes('sop') ||
      q.includes('handbook') ||
      q.includes('leave') ||
      q.includes('casual leave') ||
      q.includes('sick leave') ||
      q.includes('maternity') ||
      q.includes('guideline') ||
      q.includes('procedure') ||
      q.includes('protocol') ||
      q.includes('hygiene') ||
      q.includes('sla response') ||
      q.includes('incident severity') ||
      q.includes('tip pool') ||
      q.includes('knowledge base')
    ) {
      return {
        route: 'RAG_QUERY',
        badge: 'RAG Knowledge',
        color: 'teal'
      };
    }

    // 3. Holistic Business Diagnostic / Analytics
    if (
      q.includes('analyze my business') ||
      q.includes('needs attention') ||
      q.includes('what needs attention') ||
      q.includes('health check') ||
      q.includes('summarize today') ||
      q.includes('business summary')
    ) {
      return {
        route: 'ANALYTICS',
        badge: 'Diagnostic AI',
        color: 'amber'
      };
    }

    // 4. Live Database Telemetry Queries
    if (
      q.includes('sales') ||
      q.includes('revenue') ||
      q.includes('invoice') ||
      q.includes('overdue') ||
      q.includes('inventory') ||
      q.includes('stock') ||
      q.includes('expense') ||
      q.includes('supplier') ||
      q.includes('customer') ||
      q.includes('employee') ||
      q.includes('tasks')
    ) {
      return {
        route: 'DATABASE_QUERY',
        badge: 'Live Database',
        color: 'blue'
      };
    }

    // 5. Default Conversational LLM
    return {
      route: 'NORMAL_CHAT',
      badge: 'LLM Copilot',
      color: 'sky'
    };
  }
};
