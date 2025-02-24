import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignUpService } from './sign-up.service';
import { ZodValidationPipe } from 'src/common/libs/core/pipes';
import { signUpSchema } from './schema/sign-up.schema';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth/signup' })
export class SignUpController {
  constructor(private readonly signUpService: SignUpService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(signUpSchema))
  public async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<SignUpResponseDto> {
    return this.signUpService.execute(signUpDto);
  }
}
