// RAG (Retrieval-Augmented Generation) Pipeline Service for SMARTORA
// Handles Document Text Extraction, Semantic Chunking, Multi-Tenant Vector Indexing,
// and Secure Context Retrieval with Exact Source Citations

import { embeddingProvider } from './embeddingProvider';
import { vectorStore } from './vectorStore';
import { storageService } from '../storageService';

export const ragService = {
  // Semantic chunking: splits text into coherent paragraphs / policy clauses
  chunkText: (text, maxChunkChars = 350, overlap = 50) => {
    if (!text || typeof text !== 'string') return [];

    // Split by numbered clauses or double newlines first
    const sections = text.split(/\n(?=\d+\.|\bSection\b|[A-Z\s]{4,}:)/g);
    const chunks = [];

    for (const sec of sections) {
      const clean = sec.trim();
      if (!clean) continue;

      if (clean.length <= maxChunkChars) {
        chunks.push(clean);
      } else {
        // Split long section into overlapping sentence windows
        const sentences = clean.split(/(?<=[.?!])\s+/);
        let currentChunk = '';

        for (const sentence of sentences) {
          if ((currentChunk + ' ' + sentence).length > maxChunkChars && currentChunk) {
            chunks.push(currentChunk.trim());
            // Preserve overlap
            currentChunk = currentChunk.slice(-overlap) + ' ' + sentence;
          } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
          }
        }
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
      }
    }

    return chunks;
  },

  // Index a single document into the multi-tenant vector store
  indexDocument: (doc) => {
    if (!doc || !doc.content || !doc.organization_id) return [];

    const textChunks = ragService.chunkText(doc.content);
    const vectorChunks = textChunks.map((chunkText, idx) => ({
      id: `${doc.id}-chk-${idx + 1}`,
      docId: doc.id,
      docTitle: doc.title,
      filename: doc.filename || `${doc.title}.pdf`,
      organization_id: doc.organization_id,
      department_id: doc.department_id || null,
      permissions: doc.permissions || 'All Employees',
      category: doc.category || 'General',
      text: chunkText,
      vector: embeddingProvider.getEmbedding(chunkText),
      createdAt: new Date().toISOString()
    }));

    vectorStore.addChunks(vectorChunks);
    return vectorChunks;
  },

  // Index an array of documents (used to seed initial knowledge base)
  indexDocuments: (docs) => {
    const allVectorChunks = [];
    for (const doc of docs) {
      const chunks = ragService.indexDocument(doc);
      allVectorChunks.push(...chunks);
    }
    return allVectorChunks;
  },

  // Auto-initialize vector store with pre-seeded documents if empty
  ensureInitialized: () => {
    const existingChunks = vectorStore.getAllChunks();
    if (existingChunks.length === 0) {
      const keys = storageService.getKeys();
      const docs = storageService.getItem(keys.KNOWLEDGE_BASE_DOCS, []);
      if (docs && docs.length > 0) {
        ragService.indexDocuments(docs);
      }
    }
  },

  // Search Knowledge Base with strict tenant boundary
  search: (query, userContext) => {
    ragService.ensureInitialized();

    const { organization_id, department_id, role } = userContext;
    const matches = vectorStore.search(query, {
      organization_id,
      department_id,
      userRole: role,
      topK: 3,
      minScore: 0.12
    });

    return matches.map(({ chunk, score }) => ({
      docId: chunk.docId,
      title: chunk.docTitle,
      filename: chunk.filename,
      category: chunk.category,
      text: chunk.text,
      score: Math.round(score * 100)
    }));
  },

  // Complete RAG Query Answer Generation with Grounded Citations
  generateAnswer: async (query, userContext) => {
    const results = ragService.search(query, userContext);

    // If no relevant documents found in this organization
    if (results.length === 0) {
      return {
        found: false,
        text: `I couldn't find sufficient information regarding this query in the authorized knowledge base for your organization (**${userContext.organizationName || 'Current Organization'}**).`,
        sources: []
      };
    }

    const topMatch = results[0];
    const sources = results.map(r => ({
      docId: r.docId,
      title: r.title,
      filename: r.filename,
      snippet: r.text.slice(0, 180) + (r.text.length > 180 ? '...' : ''),
      relevanceScore: `${r.score}% Match`
    }));

    // Synthesize grounded explanation from retrieved chunks
    let answerText = `According to your organization's official document **"${topMatch.title}"**:\n\n`;
    
    // Extract key policy clauses from top matching chunks
    const formattedSnippets = results
      .map(r => `• ${r.text}`)
      .join('\n\n');

    answerText += `${formattedSnippets}\n\n`;
    answerText += `_Source: **${topMatch.filename}** (Relevance Confidence: ${topMatch.score}%)_`;

    return {
      found: true,
      text: answerText,
      sources: sources
    };
  }
};
