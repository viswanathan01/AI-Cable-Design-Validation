import { Controller, Post, Headers, Req, BadRequestException, Logger } from '@nestjs/common';
import { Webhook } from 'svix';

@Controller('api/webhooks')
export class WebhooksController {
    private readonly logger = new Logger(WebhooksController.name);

    @Post('clerk')
    async handleClerkWebhook(
        @Headers('svix-id') svix_id: string,
        @Headers('svix-timestamp') svix_timestamp: string,
        @Headers('svix-signature') svix_signature: string,
        @Req() req: any
    ) {
        // 1. Verify Headers
        if (!svix_id || !svix_timestamp || !svix_signature) {
            this.logger.error('Missing Svix headers');
            throw new BadRequestException('Missing Svix headers');
        }

        // 2. Get Raw Body using NestJS rawBody feature (enabled in main.ts)
        // req.rawBody must be enabled in NestFactory options
        const payload = req.rawBody;
        if (!payload) {
            this.logger.error('Missing Raw Body - Ensure rawBody: true in main.ts');
            throw new BadRequestException('Missing payload');
        }

        // 3. Verify Signature
        const secret = process.env.CLERK_WEBHOOK_SECRET;
        if (!secret) {
            this.logger.error('CLERK_WEBHOOK_SECRET is not set');
            throw new BadRequestException('Server configuration error');
        }

        const wh = new Webhook(secret);
        let evt: any;

        try {
            evt = wh.verify(payload.toString(), {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });
        } catch (err: any) {
            this.logger.error('Webhook verification failed', err.message);
            throw new BadRequestException('Webhook verification failed');
        }

        // 4. Handle Event
        const eventType = evt.type;
        this.logger.log(`Received Clerk Webhook: ${eventType}`);

        /* 
           Here you can sync user data to your local database.
           Examples:
           if (eventType === 'user.created') { ... }
           if (eventType === 'user.updated') { ... }
           if (eventType === 'user.deleted') { ... }
        */

        if (eventType === 'user.created') {
            const { id, email_addresses, first_name, last_name } = evt.data;
            const primaryEmail = email_addresses?.[0]?.email_address;
            this.logger.log(`New User Created: ${id} (${primaryEmail})`);
            // TODO: Create user profile in MongoDB if needed
        } else if (eventType === 'user.updated') {
            this.logger.log(`User Updated: ${evt.data.id}`);
            // TODO: Update user profile
        } else if (eventType === 'user.deleted') {
            this.logger.log(`User Deleted: ${evt.data.id}`);
            // TODO: Delete/Archive user
        }

        return { success: true };
    }
}
