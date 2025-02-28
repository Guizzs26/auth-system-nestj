import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/common/database/cache.service';
import { RefreshTokenHelper } from '../helpers/jwt/refresh-token.helper';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt.constants';

@Injectable()
export class SignOutService {
  private readonly logger = new Logger(SignOutService.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly refreshTokenHelper: RefreshTokenHelper,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      // Decode the access token to get the expiration time
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: jwtConstants.accessTokenSecret,
      });

      if (decoded && typeof decoded === 'object' && 'exp' in decoded) {
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresIn = decoded.exp - currentTime;

        // Only blacklist if the token is still valid
        if (expiresIn > 0) {
          await this.cacheService.addAccessTokenToBlacklist(
            accessToken,
            expiresIn,
          );

          this.logger.log(
            `Access token blacklisted (expires in ${expiresIn}s)`,
          );
        } else {
          this.logger.log('Access token already expired, skipping blacklist');
        }
      } else {
        this.logger.warn('Could not decode access token properly');
      }

      // Invalidate the refresh token regardless of access token status
      await this.refreshTokenHelper.findAndInvalidateRefreshToken(refreshToken);
      this.logger.log('Refresh token invalidated successfully');
    } catch (error) {
      this.logger.error(`Error during sign-out: ${error.message}`, error.stack);
      throw error;
    }
  }
}
