import { Injectable } from '@nestjs/common';
import { AIGatewayService } from '../ai-gateway/ai-gateway.service';
import { ValidationRequestDto } from './dto/validation-request.dto';

@Injectable()
export class DesignValidationService {
    constructor(private aiGateway: AIGatewayService) { }

    async processValidation(dto: ValidationRequestDto) {
        // 1. Normalize Input
        let context = '';

        if (dto.structuredData) {
            context += `Structured Specs: ${JSON.stringify(dto.structuredData)}\n`;
        }
        if (dto.freeText) {
            context += `Engineer Notes/Specs: "${dto.freeText}"\n`;
        }

        // 2. Call AI Gateway
        const aiResponse = await this.aiGateway.validateDesign(context);

        // 3. Return result (Future: Save to DB here)
        return {
            timestamp: new Date().toISOString(),
            originalInput: dto,
            result: aiResponse
        };
    }
}
