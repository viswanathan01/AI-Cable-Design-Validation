import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AIGatewayService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. AI features will fail.');
    } else {
      console.log('AI Gateway initialized with API Key: ' + apiKey.substring(0, 8) + '...');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
    // Use gemini-1.5-flash (2.5 does not exist yet and causes 500 errors)
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40
      }
    });
  }

  async validateDesign(inputContext: string): Promise<any> {
    // Cache removed as requested to ensure fresh results

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
      return parsed;
    } catch (error: any) {
      console.error('AI Processing Error:', error?.message || error);
      const msg = error?.message || 'Unknown Error';
      throw new InternalServerErrorException(`AI Validation Failed. Check API Key or Connection. Details: ${msg}`);
    }
  }
}
