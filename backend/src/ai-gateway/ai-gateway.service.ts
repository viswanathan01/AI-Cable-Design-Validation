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
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1500, // Increase slightly to avoid JSON text truncation
        topP: 0.8,
        topK: 40
      }
    });
  }

  async validateDesign(inputContext: string): Promise<any> {
    // 1. Check Cache
    const cacheKey = Buffer.from(inputContext).toString('base64');
    if (this.cache.has(cacheKey)) {
      console.log('⚡ Served from Cache');
      return this.cache.get(cacheKey);
    }

    // Optimized Prompt for Speed
    const prompt = `
Role: Cable Design Validation (IEC 60502).
Input: ${inputContext}

Task: Validate voltage, conductor (CSA/Class/Material), insulation (Type/Thickness).
Rules:
1. IEC 60502-1 (LV) default.
2. Status: PASS (compliant), WARN (inferred/borderline), FAIL (unsafe).
3. Brevity is critical.
4. JSON ONLY.

Output Schema:
{
  "fields": { "standard": "...", "voltage": "...", "csa": "...", "insulation_thickness": "..." },
  "validation": [
    { "field": "...", "status": "PASS|WARN|FAIL", "expected": "...", "comment": "..." }
  ],
  "confidence": { "overall": 0.0-1.0 },
  "assumptions": ["..."]
}

Speed Constraints:
- For PASS: Comment MUST be < 5 words (e.g. "Compliant", "Standard value").
- For WARN/FAIL: concise explanation.
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
