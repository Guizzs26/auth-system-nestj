import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenService } from './refresh-token.service';
import { ZodValidationPipe } from 'src/common/libs/core/pipes';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { refreshTokenSchema } from './schema/refresh-token.schema';
import { SignInResponseDto } from '../sign-in/dto/sign-in-response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth/refresh' })
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(refreshTokenSchema))
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SignInResponseDto> {
    return this.refreshTokenService.refresh(refreshTokenDto);
  }
}
