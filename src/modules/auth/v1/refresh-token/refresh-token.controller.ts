import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenService } from './refresh-token.service';
import { ZodValidationPipe } from 'src/common/libs/core/pipes';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { refreshTokenSchema } from './schema/refresh-token.schema';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth/refresh' })
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(refreshTokenSchema))
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.refreshTokenService.refresh(refreshTokenDto);
  }
}
