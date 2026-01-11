import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ValidationResultDocument = ValidationResult & Document;

@Schema({ timestamps: true })
export class ValidationResult {
    @Prop({ required: true })
    userId: string; // Clerk User ID

    @Prop({ required: true, enum: ['structured', 'free_text'] })
    inputType: string;

    @Prop({ type: Object, required: true })
    inputPayload: any;

    @Prop({ type: Object })
    extractedFields: any;

    @Prop({ type: Object, required: true })
    aiResult: {
        validation: any[];
        confidence: { overall: number };
        assumptions: string[];
    };

    @Prop({ type: Object })
    statusSummary: {
        passCount: number;
        warnCount: number;
        failCount: number;
    };

    @Prop()
    latencyMs: number;
}

export const ValidationResultSchema = SchemaFactory.createForClass(ValidationResult);
