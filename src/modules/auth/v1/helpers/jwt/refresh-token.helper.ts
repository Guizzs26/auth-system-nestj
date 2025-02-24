import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createHash } from 'node:crypto';

@Injectable()
export class RefreshTokenHelper {
  private readonly logger = new Logger(RefreshTokenHelper.name);

  constructor(private readonly prisma: PrismaService) {}

  public async storeRefreshToken(
    customerId: string,
    token: string,
  ): Promise<void> {
    const tokenHash = this.hashToken(token);

    await this.prisma.refreshToken.create({
      data: {
        token: tokenHash,
        customerId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  public async findAndInvalidateRefreshToken(
    token: string,
  ): Promise<string | null> {
    const tokenHash = this.hashToken(token);

    return this.prisma.$transaction(async (tx) => {
      const storedToken = await tx.refreshToken.findFirst({
        where: {
          token: tokenHash,
          revoked: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (storedToken && !storedToken.revoked) {
        await tx.refreshToken.updateMany({
          where: { token: tokenHash },
          data: { revoked: true, revokedAt: new Date() },
        });

        return token;
      }

      return null;
    });
  }

  public async invalidateAllRefreshTokensForUser(
    customerId: string,
  ): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { customerId },
      data: { revoked: true, revokedAt: new Date() },
    });
  }

  @Cron(CronExpression.EVERY_8_HOURS)
  private async cleanUpExpiredTokens(): Promise<void> {
    this.logger.log('Cleaning up expired tokens...');

    try {
      const result = await this.prisma.refreshToken.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            {
              revoked: true,
              revokedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
          ],
        },
      });

      this.logger.log(
        `Expired tokens cleaned up successfully. Deleted count: ${result.count}`,
      );
    } catch (error) {
      this.logger.error('Failed to clean up expired tokens', error.stack);
      throw new Error('Failed to clean up expired tokens');
    }
  }

  public hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
