import { Controller, Post, Body, BadRequestException, UseGuards, Req, Get } from '@nestjs/common';
import { DesignValidationService } from './design-validation.service';
import { ValidationRequestDto } from './dto/validation-request.dto';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';

@Controller('design')
@UseGuards(ClerkAuthGuard)
export class DesignValidationController {
    constructor(private readonly validationService: DesignValidationService) { }

    @Post('validate')
    async validate(@Body() body: ValidationRequestDto, @Req() req: any) {
        if (!body.structuredData && !body.freeText) {
            throw new BadRequestException('Either structuredData or freeText must be provided');
        }
        return this.validationService.processValidation(body, req.user.userId);
    }

    @Get('history')
    async getHistory(@Req() req: any) {
        return this.validationService.getHistory(req.user.userId);
    }
}
