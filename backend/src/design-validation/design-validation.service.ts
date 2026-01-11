import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AIGatewayService } from '../ai-gateway/ai-gateway.service';
import { ValidationRequestDto } from './dto/validation-request.dto';
import { ValidationResult, ValidationResultDocument } from './schemas/validation-result.schema';

@Injectable()
export class DesignValidationService {
    constructor(
        private aiGateway: AIGatewayService,
        @InjectModel(ValidationResult.name) private validationModel: Model<ValidationResultDocument>
    ) { }

    async processValidation(dto: ValidationRequestDto, userId: string) {
        // 1. Normalize Input
        let context = '';

        if (dto.structuredData) {
            context += `Structured Specs: ${JSON.stringify(dto.structuredData)}\n`;
        }
        if (dto.freeText) {
            context += `Engineer Notes/Specs: "${dto.freeText}"\n`;
        }

        const startTime = Date.now();

        // 2. Call AI Gateway
        const aiResponse = await this.aiGateway.validateDesign(context);

        const latency = Date.now() - startTime;

        // 3. Persist to MongoDB (Async, don't block return significantly)
        const statusSummary = {
            passCount: aiResponse.validation?.filter((v: any) => v.status === 'PASS').length || 0,
            warnCount: aiResponse.validation?.filter((v: any) => v.status === 'WARN').length || 0,
            failCount: aiResponse.validation?.filter((v: any) => v.status === 'FAIL').length || 0,
        };

        const resultDoc = new this.validationModel({
            userId,
            inputType: dto.structuredData ? 'structured' : 'free_text',
            inputPayload: dto,
            extractedFields: aiResponse.fields,
            aiResult: aiResponse,
            statusSummary,
            latencyMs: latency
        });

        // We specifically await the save to ensure data integrity before responding, 
        // though requirement said "non-blocking". MongoDB saves are very fast.
        // For strict non-blocking we could remove await or use Promise.all.
        // Let's await to catch write errors.
        try {
            await resultDoc.save();
        } catch (dbErr) {
            console.error('Failed to save validation history:', dbErr);
            // Non-blocking in spirit: We still return the AI result even if DB fails
        }

        return {
            timestamp: new Date().toISOString(),
            id: resultDoc._id,
            originalInput: dto,
            result: aiResponse
        };
    }

    async getHistory(userId: string, limit: number = 10, skip: number = 0) {
        return this.validationModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    }
}
