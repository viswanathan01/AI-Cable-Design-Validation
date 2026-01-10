import { Module } from '@nestjs/common';
import { DesignValidationController } from './design-validation.controller';
import { DesignValidationService } from './/design-validation.service';
import { AIGatewayModule } from '../ai-gateway/ai-gateway.module';

@Module({
    imports: [AIGatewayModule],
    controllers: [DesignValidationController],
    providers: [DesignValidationService],
})
export class DesignValidationModule { }
