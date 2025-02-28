import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly TOKEN_PREFIX = 'blacklisted_token:'; // Prefixo definido corretamente

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async addAccessTokenToBlacklist(
    token: string,
    expiresIn: number,
  ): Promise<void> {
    try {
      const key = `${this.TOKEN_PREFIX}${token}`;
      console.log(`Blacklisting token with key: ${key}`);

      await this.cacheManager.set(key, 'blacklisted', expiresIn * 1000);

      this.logger.debug(
        `Token added to blacklist, expires in ${expiresIn} seconds`,
      );
      this.logger.debug(`Redis key: ${key}`);
    } catch (error) {
      this.logger.error(
        `Failed to add access token to blacklist: ${token}`,
        error.stack,
      );
      throw error;
    }
  }

  public async isAccessTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const key = `${this.TOKEN_PREFIX}${token}`;
      const value = await this.cacheManager.get(key);

      return value === 'blacklisted';
    } catch (error) {
      this.logger.error(
        `Failed to check if access token is blacklisted: ${token}`,
        error.stack,
      );
      throw error;
    }
  }
}
