// Embedding Provider for SMARTORA RAG Architecture
// Provides deterministic vector embeddings and cosine similarity search
// Fully self-contained, high-performance client-side vectorizer with pluggable external provider support

export const embeddingProvider = {
  // Vector dimension for semantic hashing
  DIMENSION: 256,

  // Simple token normalization and stopword filter
  tokenize: (text) => {
    if (!text || typeof text !== 'string') return [];
    const stopwords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'to', 'for', 'of',
      'with', 'as', 'by', 'this', 'that', 'it', 'from', 'be', 'are', 'was', 'were'
    ]);
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !stopwords.has(w));
  },

  // Hash a word into an index in [0, DIMENSION - 1]
  hashWord: (word) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % 256;
  },

  // Generate normalized dense embedding vector
  getEmbedding: (text) => {
    const vector = new Float32Array(256);
    const tokens = embeddingProvider.tokenize(text);

    if (tokens.length === 0) return Array.from(vector);

    // Compute TF weights
    const tf = {};
    for (const token of tokens) {
      tf[token] = (tf[token] || 0) + 1;
    }

    // Hash tokens and character bigrams into feature vector
    for (const [token, count] of Object.entries(tf)) {
      const idx = embeddingProvider.hashWord(token);
      vector[idx] += count * 1.5;

      // Also hash character bigrams for subword robustness
      for (let i = 0; i < token.length - 1; i++) {
        const bigram = token.slice(i, i + 2);
        const bIdx = embeddingProvider.hashWord(bigram);
        vector[bIdx] += 0.4;
      }
    }

    // L2 Normalization
    let norm = 0;
    for (let i = 0; i < 256; i++) {
      norm += vector[i] * vector[i];
    }
    norm = Math.sqrt(norm);

    if (norm > 0) {
      for (let i = 0; i < 256; i++) {
        vector[i] /= norm;
      }
    }

    return Array.from(vector);
  },

  // Compute Cosine Similarity between two normalized vectors
  cosineSimilarity: (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    return Math.max(0, dotProduct);
  }
};
