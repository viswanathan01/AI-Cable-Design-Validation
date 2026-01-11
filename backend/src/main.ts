import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://ai-cable-design-validation.vercel.app' // Optional alias
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Backend is running on http://localhost:${port}`);
}
bootstrap();
