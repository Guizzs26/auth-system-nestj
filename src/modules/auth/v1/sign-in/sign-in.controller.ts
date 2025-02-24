import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInService } from './sign-in.service';
import { ZodValidationPipe } from 'src/common/libs/core/pipes';
import { signInSchema } from './schema/sign-in.schema';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth/signin' })
export class SignInController {
  constructor(private readonly signInService: SignInService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(signInSchema))
  public async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<SignInResponseDto> {
    return this.signInService.execute(signInDto);
  }
}
