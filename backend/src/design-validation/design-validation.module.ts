import { Module } from '@nestjs/common';
import { DesignValidationController } from './design-validation.controller';
import { DesignValidationService } from './/design-validation.service';
import { AIGatewayModule } from '../ai-gateway/ai-gateway.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidationResult, ValidationResultSchema } from './schemas/validation-result.schema';

@Module({
    imports: [
        AIGatewayModule,
        MongooseModule.forFeature([{ name: ValidationResult.name, schema: ValidationResultSchema }]),
    ],
    controllers: [DesignValidationController],
    providers: [DesignValidationService],
})
export class DesignValidationModule { }
