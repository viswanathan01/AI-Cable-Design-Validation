import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';

@Module({
    controllers: [WebhooksController],
    providers: [],
})
export class WebhooksModule { }
