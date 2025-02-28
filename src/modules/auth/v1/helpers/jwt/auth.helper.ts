import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt.constants';
import { CacheService } from 'src/common/database/cache.service';

@Injectable()
export class AuthHelper {
  private readonly logger = new Logger(AuthHelper.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  public async generateAccessToken(
    customerId: string,
    email: string,
    role: string,
  ): Promise<string> {
    const payload = { sub: customerId, email, role, type: 'access' };

    return this.jwtService.signAsync(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: jwtConstants.accessTokenExpiration,
    });
  }

  public async generateRefreshToken(customerId: string): Promise<string> {
    const payload = { sub: customerId, type: 'refresh' };

    return this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: jwtConstants.refreshTokenExpiration,
    });
  }

  public async validateRefreshToken(token: string): Promise<{ sub: string }> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: jwtConstants.refreshTokenSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  public async validateBlacklistedAccessToken(
    token: string,
  ): Promise<{ sub: string }> {
    try {
      const isBlacklisted =
        await this.cacheService.isAccessTokenBlacklisted(token);

      if (isBlacklisted) {
        throw new UnauthorizedException('Access token is blacklisted');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.accessTokenSecret,
      });

      this.logger.log(`Access token validated: ${token}`);
      return payload;
    } catch (error) {
      this.logger.error(
        `Invalid or expired access token: ${token}`,
        error.stack,
      );
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
