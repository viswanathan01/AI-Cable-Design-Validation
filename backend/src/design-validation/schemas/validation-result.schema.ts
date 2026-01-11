import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ValidationResultDocument = ValidationResult & Document;
export class UserInfo {
    @Prop({ required: true })
    id: string; // Clerk User ID

    @Prop()
    email?: string;

    @Prop()
    name?: string;
}

@Schema({ timestamps: true })
export class ValidationResult {
    @Prop({ type: UserInfo, required: true })
    user: UserInfo;

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
