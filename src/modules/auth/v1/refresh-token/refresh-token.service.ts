import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { CustomerService } from 'src/modules/customer/customer.service';
import { CacheService } from 'src/common/database/cache.service';
import { AuthHelper } from '../helpers/jwt/auth.helper';
import { RefreshTokenHelper } from '../helpers/jwt/refresh-token.helper';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';

// One-time-use refresh token system
@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly cacheService: CacheService,
    private readonly authHelper: AuthHelper,
    private readonly refreshTokenHelper: RefreshTokenHelper,
  ) {}

  public async refresh({
    refreshToken,
  }: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const refreshTokenPayload =
      await this.authHelper.validateRefreshToken(refreshToken);

    const customer = await this.customerService.findCustomerById(
      refreshTokenPayload.sub,
    );

    if (!customer) {
      throw new UnauthorizedException('User not found for the given token');
    }

    const storedToken =
      await this.refreshTokenHelper.findAndInvalidateRefreshToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const oldAccessToken = await this.cacheService.getLastAccessToken(
      refreshTokenPayload.sub,
    );

    if (oldAccessToken) {
      const decodedOldAccessToken = this.authHelper.decodeToken(oldAccessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = decodedOldAccessToken.exp - currentTime;

      if (expiresIn > 0) {
        await this.cacheService.addAccessTokenToBlacklist(
          oldAccessToken,
          expiresIn,
        );
      }
    }

    const newAccessToken = await this.authHelper.generateAccessToken(
      refreshTokenPayload.sub,
      customer.email,
      customer.role,
    );

    const newRefreshToken = await this.authHelper.generateRefreshToken(
      refreshTokenPayload.sub,
    );

    await this.refreshTokenHelper.storeRefreshToken(
      refreshTokenPayload.sub,
      newRefreshToken,
    );

    const decodedAccessToken = this.authHelper.decodeToken(newAccessToken);
    const ttl = decodedAccessToken.exp - Math.floor(Date.now() / 1000);

    await this.cacheService.setLastAccessToken(
      refreshTokenPayload.sub,
      newAccessToken,
      ttl,
    );

    return { newAccessToken, newRefreshToken };
  }
}
