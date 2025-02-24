import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { CustomerService } from 'src/modules/customer/customer.service';
import { AuthHelper } from '../auth-helper/jwt/auth-helper';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

// One-time-use refresh token system
@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerService: CustomerService,
    private readonly authHelper: AuthHelper,
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

    const storedToken = await this.findAndInvalidateRefreshToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Generate a new access token
    const newAccessToken = await this.authHelper.generateAccessToken(
      refreshTokenPayload.sub,
      customer.email,
      customer.role,
    );

    // Generate a new refresh token
    const newRefreshToken = await this.authHelper.generateRefreshToken(
      refreshTokenPayload.sub,
    );

    await this.storeRefreshToken(refreshTokenPayload.sub, newRefreshToken);

    return { newAccessToken, newRefreshToken };
  }

  public async storeRefreshToken(customerId: string, token: string) {
    await this.prisma.refreshToken.create({
      data: {
        token,
        customerId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  private async findAndInvalidateRefreshToken(token: string) {
    return this.prisma.$transaction(async (tx) => {
      const storedToken = await tx.refreshToken.findFirst({
        where: {
          token,
          revoked: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (storedToken && !storedToken.revoked) {
        await tx.refreshToken.updateMany({
          where: { token },
          data: { revoked: true, revokedAt: new Date() },
        });
      }

      return storedToken;
    });
  }

  private async invalidateAllRefreshTokensForUser(customerId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { customerId },
      data: { revoked: true, revokedAt: new Date() },
    });
  }

  @Cron(CronExpression.EVERY_8_HOURS)
  private async cleanUpExpiredTokens() {
    await this.prisma.refreshToken.deleteMany({
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
  }
}
