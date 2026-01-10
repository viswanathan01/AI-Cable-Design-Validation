import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { DesignValidationService } from './design-validation.service';
import { ValidationRequestDto } from './dto/validation-request.dto';

@Controller('design')
export class DesignValidationController {
    constructor(private readonly validationService: DesignValidationService) { }

    @Post('validate')
    async validate(@Body() body: ValidationRequestDto) {
        if (!body.structuredData && !body.freeText) {
            throw new BadRequestException('Either structuredData or freeText must be provided');
        }
        return this.validationService.processValidation(body);
    }
}
