import { AiIncidentAnalysis, IncidentCategory, IncidentUrgency } from '../types';

interface AnalyzeInput {
  category: IncidentCategory;
  description: string;
  locationName: string;
  zone: string;
}

export async function analyzeIncidentReport(input: AnalyzeInput): Promise<AiIncidentAnalysis> {
  try {
    const res = await fetch('/api/gemini/analyze-incident', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      category: data.category || input.category,
      urgency: (data.urgency as IncidentUrgency) || 'Medium',
      confidence: typeof data.confidence === 'number' ? data.confidence : 0.85,
      approximateLocation: data.approximateLocation || `Near ${input.locationName || 'General Campus'}`,
      missingInformation: Array.isArray(data.missingInformation) ? data.missingInformation : ['Exact building entrance and floor level'],
      explanation: data.explanation || 'Analyzed based on reported keywords and situational category.',
      disclaimer: data.disclaimer || 'AI RECOMMENDATION ONLY. This analysis is an algorithmic prioritization suggestion and NOT a medical diagnosis, dispatch order, or emergency authority decision.',
      analyzedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('[ResQRoute Client] Failed server-side call, invoking client deterministic fallback:', err);
    // Deterministic fallback if server route fails
    const desc = input.description.toLowerCase();
    let urgency: IncidentUrgency = 'Medium';
    if (desc.includes('unconscious') || desc.includes('chest pain') || desc.includes('fire') || desc.includes('weapon')) {
      urgency = 'Critical';
    } else if (desc.includes('fainted') || desc.includes('injured') || desc.includes('bleeding')) {
      urgency = 'High';
    }

    return {
      category: input.category,
      urgency,
      confidence: 0.82,
      approximateLocation: input.locationName ? `Near ${input.locationName} (${input.zone})` : `Zone ${input.zone}`,
      missingInformation: [
        'Precise floor or stairwell indicator',
        'Physical description or presence of hazards',
      ],
      explanation: 'Deterministic offline evaluation: keywords analyzed for campus responder readiness.',
      disclaimer: 'AI RECOMMENDATION ONLY. This analysis is an algorithmic prioritization suggestion and NOT a medical diagnosis, dispatch order, or emergency authority decision.',
      analyzedAt: new Date().toISOString(),
    };
  }
}
