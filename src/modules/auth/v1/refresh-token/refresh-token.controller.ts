import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenService } from './refresh-token.service';
import { AuthHelper } from '../auth-helper/jwt/auth-helper';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ZodValidationPipe } from 'src/common/pipes';
import { refreshTokenSchema } from './schema/refresh-token.schema';
import { SignInResponseDto } from '../sign-in/dto/sign-in-response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth/refresh', version: '1' })
export class RefreshTokenController {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly authHelper: AuthHelper,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(refreshTokenSchema))
  public async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<SignInResponseDto> {
    // One-time-use refresh token system

    // Finding token in db
    const storedToken =
      await this.refreshTokenService.findValidToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Validate refresh token
    const validToken = await this.authHelper.validateRefreshToken(storedToken);

    // Revoke the old refresh token
    await this.refreshTokenService.revokeToken(refreshToken);

    // Generate a new access token
    const accessToken = await this.authHelper.retrieveAccessToken(
      storedToken.customerId,
    );

    // Generate a new refresh token
    const newRefreshToken = await this.authHelper.retrieveRefreshToken(
      storedToken.customerId,
    );

    await this.refreshTokenService.create(
      storedToken.customerId,
      newRefreshToken,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }
}
