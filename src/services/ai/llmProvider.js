// LLM Provider Abstraction for SMARTORA
// Provides natural-language reasoning, summarization, and business-data interpretation
// Supports external Gemini API and fallbacks to high-precision local grounded reasoning

export const llmProvider = {
  // Check if external Gemini API key is configured
  isExternalAvailable: () => {
    return Boolean(import.meta.env?.VITE_GEMINI_API_KEY);
  },

  // Generate response from external LLM or local grounded engine
  generate: async (prompt, systemContext = '') => {
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemContext}\n\nUser Query: ${prompt}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 800
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return candidateText;
          }
        }
      } catch (e) {
        console.warn('External LLM call failed or timed out. Falling back to local grounded reasoning engine.', e);
      }
    }

    // Default: Grounded Local Reasoning Engine (Fast, zero-latency, zero fabrication)
    return null;
  }
};
