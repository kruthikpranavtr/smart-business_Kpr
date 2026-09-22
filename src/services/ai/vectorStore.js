// Multi-Tenant Vector Store for SMARTORA RAG Architecture
// Stores and searches document chunks with strict pre-retrieval organizational isolation

import { embeddingProvider } from './embeddingProvider';
import { storageService } from '../storageService';

const VECTOR_STORE_KEY = 'smartora_vector_chunks';

export const vectorStore = {
  // Retrieve all chunks from storage
  getAllChunks: () => {
    try {
      const raw = localStorage.getItem(VECTOR_STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to parse vector store chunks', e);
      return [];
    }
  },

  // Save all chunks to storage
  saveAllChunks: (chunks) => {
    try {
      localStorage.setItem(VECTOR_STORE_KEY, JSON.stringify(chunks));
    } catch (e) {
      console.error('Failed to save vector store chunks', e);
    }
  },

  // Add chunks for a document
  addChunks: (newChunks) => {
    const existing = vectorStore.getAllChunks();
    // Filter out old chunks for the same doc if re-indexing
    const docIds = new Set(newChunks.map(c => c.docId));
    const filtered = existing.filter(c => !docIds.has(c.docId));
    const merged = [...filtered, ...newChunks];
    vectorStore.saveAllChunks(merged);
    return merged;
  },

  // Delete all chunks belonging to a document under a specific tenant
  deleteDocChunks: (docId, organization_id) => {
    const existing = vectorStore.getAllChunks();
    const updated = existing.filter(c => !(c.docId === docId && c.organization_id === organization_id));
    vectorStore.saveAllChunks(updated);
    return updated;
  },

  // Get all chunks for a given organization
  getTenantChunks: (organization_id) => {
    const all = vectorStore.getAllChunks();
    return all.filter(c => c.organization_id === organization_id);
  },

  // Secure Multi-Tenant Semantic Search
  // Filters by organization_id and permissions BEFORE similarity computation
  search: (queryText, { organization_id, department_id, userRole, topK = 3, minScore = 0.12 }) => {
    if (!queryText || !organization_id) return [];

    const queryVector = embeddingProvider.getEmbedding(queryText);
    const allChunks = vectorStore.getAllChunks();

    // STEP 1: Strict Multi-Tenant Isolation Filtering (Runs BEFORE similarity)
    const tenantChunks = allChunks.filter(chunk => {
      // Must match active tenant organization exactly
      if (chunk.organization_id !== organization_id) {
        return false;
      }

      // If document is restricted to department managers or admins
      if (chunk.permissions === 'Engineering & Management') {
        if (userRole === 'STAFF' || userRole === 'END_USER') return false;
      }
      if (chunk.permissions === 'Admins Only') {
        if (userRole !== 'COMPANY_ADMIN' && userRole !== 'PLATFORM_OWNER') return false;
      }

      // If department-specific document, verify user's department
      if (chunk.department_id && userRole === 'DEPARTMENT_MANAGER') {
        if (department_id && chunk.department_id !== department_id && chunk.permissions !== 'All Employees' && chunk.permissions !== 'All Staff') {
          return false;
        }
      }

      return true;
    });

    if (tenantChunks.length === 0) {
      return [];
    }

    // STEP 2: Compute Cosine Similarity against authorized tenant chunks only
    const scored = tenantChunks.map(chunk => {
      const score = embeddingProvider.cosineSimilarity(queryVector, chunk.vector);
      return { chunk, score };
    });

    // STEP 3: Rank and filter by minimum relevance threshold
    return scored
      .filter(item => item.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
};
