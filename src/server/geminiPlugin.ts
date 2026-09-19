import type { Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

interface AnalyzeIncidentPayload {
  category?: string;
  description?: string;
  locationName?: string;
  zone?: string;
}

interface IncidentAiResult {
  category: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  approximateLocation: string;
  missingInformation: string[];
  explanation: string;
  disclaimer: string;
}

export function geminiIncidentPlugin(): Plugin {
  return {
    name: 'resqroute-gemini-analyzer',
    configureServer(server) {
      server.middlewares.use('/api/gemini/analyze-incident', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let bodyRaw = '';
        req.on('data', (chunk) => {
          bodyRaw += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');

          let payload: AnalyzeIncidentPayload = {};
          try {
            payload = bodyRaw ? JSON.parse(bodyRaw) : {};
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
          }

          const { category = 'other', description = '', locationName = '', zone = 'General Campus' } = payload;

          // Deterministic rule-based fallback generator
          const getDeterministicFallback = (reason: string): IncidentAiResult => {
            const descLower = description.toLowerCase();
            let urgency: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
            let cat = category || 'other';

            if (descLower.includes('chest pain') || descLower.includes('unconscious') || descLower.includes('collapse') || descLower.includes('bleeding heavily') || descLower.includes('fire') || descLower.includes('explosion') || descLower.includes('weapon')) {
              urgency = 'Critical';
              if (descLower.includes('fire') || descLower.includes('smoke')) cat = 'fire';
              else if (descLower.includes('weapon') || descLower.includes('assault')) cat = 'security';
              else cat = 'medical';
            } else if (descLower.includes('fainted') || descLower.includes('injured') || descLower.includes('broken glass') || descLower.includes('fight') || descLower.includes('alarm')) {
              urgency = 'High';
            } else if (descLower.includes('noise') || descLower.includes('leak') || descLower.includes('light out') || descLower.includes('lost')) {
              urgency = 'Low';
              cat = cat === 'medical' ? 'facility' : cat;
            }

            const missing: string[] = [];
            if (!locationName || locationName.length < 4) {
              missing.push('Precise campus building landmark or floor reference');
            }
            if (!descLower.includes('person') && !descLower.includes('people') && !descLower.includes('student')) {
              missing.push('Count or condition of affected individuals');
            }
            if (!descLower.includes('hazard') && cat === 'fire') {
              missing.push('Spread status or presence of smoke odors');
            }

            return {
              category: cat,
              urgency,
              confidence: 0.88,
              approximateLocation: locationName ? `Near ${locationName} (${zone})` : `Zone ${zone}`,
              missingInformation: missing.length > 0 ? missing : ['Specific nearest accessible entrance for responders'],
              explanation: `Automated assessment based on keywords (${reason}). Suggested urgency is ${urgency} due to report indicators. Immediate administrative review recommended.`,
              disclaimer: 'AI RECOMMENDATION ONLY. This analysis is an algorithmic prioritization suggestion and NOT a medical diagnosis, dispatch order, or emergency authority decision.',
            };
          };

          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            const fallback = getDeterministicFallback('Deterministic engine: GEMINI_API_KEY not set');
            res.statusCode = 200;
            res.end(JSON.stringify(fallback));
            return;
          }

          try {
            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const prompt = `You are ResQRoute's triage analysis assistant for college campuses, residential communities, and venues.
Analyze this submitted incident:
Category: ${category}
Location: ${locationName} (Zone: ${zone})
Description: ${description}

Strictly return valid JSON adhering to this exact schema with no extra commentary or markdown:
{
  "category": "medical" | "security" | "fire" | "facility" | "weather" | "other",
  "urgency": "Low" | "Medium" | "High" | "Critical",
  "confidence": number between 0.50 and 0.99,
  "approximateLocation": string (generalized, never exact personal coordinates),
  "missingInformation": [string list of critical details missing from the report that responders or admins would need],
  "explanation": string (brief, professional rationale of 1-3 sentences),
  "disclaimer": "AI RECOMMENDATION ONLY. This analysis is an algorithmic prioritization suggestion and NOT a medical diagnosis, dispatch order, or emergency authority decision."
}`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
              },
            });

            const text = response.text || '';
            let parsed: IncidentAiResult;
            try {
              parsed = JSON.parse(text);
              if (!parsed.disclaimer) {
                parsed.disclaimer = 'AI RECOMMENDATION ONLY. This analysis is an algorithmic prioritization suggestion and NOT a medical diagnosis, dispatch order, or emergency authority decision.';
              }
            } catch {
              parsed = getDeterministicFallback('Parsed fallback after LLM response format mismatch');
            }

            res.statusCode = 200;
            res.end(JSON.stringify(parsed));
          } catch (err: any) {
            console.error('Gemini API call failed:', err?.message || err);
            const fallback = getDeterministicFallback(`Deterministic engine fallback (${err?.message || 'Gemini service unreachable'})`);
            res.statusCode = 200;
            res.end(JSON.stringify(fallback));
          }
        });
      });
    },
  };
}
