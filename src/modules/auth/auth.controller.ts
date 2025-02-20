import {
  Controller,
  Body,
  Post,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { registerCustomerSchema } from './schemas/register-customer.schema';
import { RegisterCustomerDto } from './dto/register-customer.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerCustomerSchema))
  public async register(@Body() registerCustomerDto: RegisterCustomerDto) {
    return this.authService.register(registerCustomerDto);
  }
}
