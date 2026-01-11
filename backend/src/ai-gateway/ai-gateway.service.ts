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
    // Use gemini-1.5-flash for lowest latency with JSON mode enforced
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
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

    const prompt = `
Act as a Senior Cable Engineer. Validate strictly against IEC 60502-1 (LV) or 60502-2 (MV).
Reason about the input. Do not behave like a simple lookup table.

INPUT:
${inputContext}

Ref_Standards:
- LV (0.6/1kV): IEC 60502-1
- MV (3.6/6kV+): IEC 60502-2

Validation_Logic:
- Conductor: Class 1/2/5/6 check.
- Insulation: Thickness vs Voltage check.
- Armour/Sheath: Suitability check.

Output_Format: JSON ONLY.
{
  "fields": { "standard": "...", "voltage": "...", "conductor_material": "...", "conductor_class": "...", "csa": "...", "insulation_material": "...", "insulation_thickness": "..." },
  "validation": [ { "field": "...", "status": "PASS|WARN|FAIL", "expected": "...", "comment": "..." } ],
  "confidence": { "overall": 0.0-1.0 },
  "assumptions": ["..."]
}

Status_Logc:
PASS: Explicitly compliant.
WARN: Inferred, borderline, or ambiguous.
FAIL: Impossible or clearly unsafe.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const jsonStr = response.text(); // JSON Mode ensures pure JSON

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
