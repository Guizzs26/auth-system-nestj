import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes';
import { registerCustomerSchema } from './schemas';
import { loginCustomerSchema } from './schemas';
import { RegisterCustomerDto } from './dto';
import { LoginCustomerDto } from './dto/login-customer.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerCustomerSchema))
  public async register(@Body() registerCustomerDto: RegisterCustomerDto) {
    return this.authService.register(registerCustomerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginCustomerSchema))
  public async login(@Body() loginCustomerDto: LoginCustomerDto) {
    return this.authService.login(
      loginCustomerDto.email,
      loginCustomerDto.password,
    );
  }
}
