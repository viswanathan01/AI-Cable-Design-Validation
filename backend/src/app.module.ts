import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DesignValidationModule } from './design-validation/design-validation.module';
import { AIGatewayModule } from './ai-gateway/ai-gateway.module';

import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI!),
        DesignValidationModule,
        AIGatewayModule,
        WebhooksModule,
    ],
})
export class AppModule { }
