import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly TOKEN_PREFIX = 'blacklisted_token:';
  private readonly LAST_ACCESS_TOKEN_PREFIX = 'last_access_token:';

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async addAccessTokenToBlacklist(
    token: string,
    expiresIn: number,
  ): Promise<void> {
    const key = `${this.TOKEN_PREFIX}${token}`;
    console.log(`Blacklisting token with key: ${key}`);

    await this.cacheManager.set(key, 'blacklisted', expiresIn * 1000);
  }

  public async isAccessTokenBlacklisted(token: string): Promise<boolean> {
    const key = `${this.TOKEN_PREFIX}${token}`;
    const value = await this.cacheManager.get<string>(key);

    return value === 'blacklisted';
  }

  public async setLastAccessToken(
    customerId: string,
    token: string,
    ttl: number,
  ): Promise<void> {
    const key = `${this.LAST_ACCESS_TOKEN_PREFIX}${customerId}`;
    await this.cacheManager.set(key, token, ttl * 1000);
  }

  public async getLastAccessToken(customerId: string): Promise<string | null> {
    const key = `${this.LAST_ACCESS_TOKEN_PREFIX}${customerId}`;
    return this.cacheManager.get<string>(key);
  }
}
