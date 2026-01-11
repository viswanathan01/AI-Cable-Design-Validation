import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
    private readonly logger = new Logger(ClerkAuthGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization Header');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Invalid Authorization Header Format');
        }

        try {
            const verifiedToken = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
            });
            // Attach user to request
            // Typically email/name are not in standard session token unless customized. 
            // We'll check standard claims or metadata if present.
            // For now, we'll extract what's available. 
            // 'sid' is session id, 'sub' is user id.
            // Emails are usually in a separate API call or enhanced JWT.
            // But user requested "Populate user metadata from Clerk token claims".
            // If strictly from token, we might only have sub. 
            // We will attempt to use 'email' or 'name' if they exist in the payload (custom claims or otherwise).

            const payload = verifiedToken as any;

            request.user = {
                id: payload.sub,
                email: payload.email || payload.email_address, // Best effort
                name: payload.name || payload.username || payload.given_name // Best effort
            };
            return true;
        } catch (error) {
            this.logger.error('Clerk Validation Failed', error);
            throw new UnauthorizedException('Invalid Session Token');
        }
    }
}
