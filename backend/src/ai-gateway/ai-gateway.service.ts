import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AIGatewayService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private cache = new Map<string, any>();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. AI features will fail.');
    } else {
      console.log('AI Gateway initialized with API Key: ' + apiKey.substring(0, 8) + '...');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
    // Use gemini-1.5-flash for lowest latency
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async validateDesign(inputContext: string): Promise<any> {
    // 1. Check Cache
    const cacheKey = Buffer.from(inputContext).toString('base64');
    if (this.cache.has(cacheKey)) {
      console.log('⚡ Served from Cache');
      return this.cache.get(cacheKey);
    }

    const prompt = `
You are an AI-assisted Cable Design Review Engineer.

IMPORTANT ROLE DEFINITION:
- You are NOT a deterministic compliance engine.
- You do NOT perform table lookups.
- You perform probabilistic engineering review similar to a senior human engineer.
- Your job is to assess plausibility, risk, and ambiguity.

INPUT DATA:
${inputContext}

DECISION PRINCIPLES (STRICT):
1. Never assume missing values as compliant.
2. If a value is close to commonly referenced nominal practice, mark WARN — not FAIL.
3. FAIL is only for values that are clearly unsafe, implausible, or far below typical engineering expectations.
4. If you infer anything, it MUST appear in the assumptions list.
5. Never reference IEC table numbers, clause numbers, or exact limits.
6. Use probabilistic language: "typically", "commonly", "often", "may be borderline".

ATTRIBUTE STATUS RULES:
- PASS:
  - Explicitly stated
  - Clearly reasonable for the context
- WARN:
  - Missing but inferred
  - Borderline numeric values
  - Ambiguous interpretation
- FAIL:
  - Physically implausible
  - Clearly insufficient by common engineering judgment

OUTPUT FORMAT RULES:
- STRICT JSON ONLY
- No markdown
- No prose outside JSON

REQUIRED JSON SCHEMA:
{
  "fields": {
    "standard": string | null,
    "voltage": string | null,
    "conductor_material": string | null,
    "conductor_class": string | null,
    "csa": number | null,
    "insulation_material": string | null,
    "insulation_thickness": number | null
  },
  "validation": [
    {
      "field": string,
      "status": "PASS" | "WARN" | "FAIL",
      "expected": string,
      "comment": string
    }
  ],
  "confidence": {
    "overall": number
  },
  "assumptions": string[]
}

CONFIDENCE RULE:
- 0.9+ only if all key parameters are explicit and non-borderline
- 0.6–0.8 if assumptions or WARNs exist
- <0.6 only if major ambiguity exists
`;


    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up markdown if Gemini adds it
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      console.log('--- AI RAW RESPONSE ---');
      console.log(jsonStr);
      console.log('-----------------------');

      const parsed = JSON.parse(jsonStr);

      // 2. Save to Cache (Limit size to avoid memory leaks)
      if (this.cache.size > 100) this.cache.clear();
      this.cache.set(cacheKey, parsed);

      return parsed;
    } catch (error: any) {
      console.error('AI Processing Error:', error?.message || error);
      const msg = error?.message || 'Unknown Error';
      throw new InternalServerErrorException(`AI Validation Failed. Check API Key or Connection. Details: ${msg}`);
    }
  }
}
