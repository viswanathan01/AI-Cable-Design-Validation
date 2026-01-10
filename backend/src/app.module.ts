import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DesignValidationModule } from './design-validation/design-validation.module';
import { AIGatewayModule } from './ai-gateway/ai-gateway.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DesignValidationModule,
        AIGatewayModule,
    ],
})
export class AppModule { }
