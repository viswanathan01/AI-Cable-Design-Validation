import { IsOptional, IsString, IsObject } from 'class-validator';

export class ValidationRequestDto {
    @IsOptional()
    @IsObject()
    structuredData?: Record<string, any>;

    @IsOptional()
    @IsString()
    freeText?: string;
}
