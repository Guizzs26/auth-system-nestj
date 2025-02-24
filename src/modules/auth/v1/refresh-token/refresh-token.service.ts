import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInResponseDto } from '../sign-in/dto/sign-in-response.dto';
import { AuthHelper } from '../auth-helper/jwt/auth-helper';

// One-time-use refresh token system
@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authHelper: AuthHelper,
  ) {}

  public async refresh({
    refreshToken,
  }: RefreshTokenDto): Promise<SignInResponseDto> {
    const refreshTokenPayload =
      await this.authHelper.validateRefreshToken(refreshToken);

    // Finding token in db
    const storedToken = await this.findActiveRefreshToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke the old refresh token
    await this.invalidateRefreshToken(refreshToken);

    // Generate a new access token
    const accessToken = await this.authHelper.retrieveAccessToken(
      refreshTokenPayload.sub,
    );

    // Generate a new refresh token
    const newRefreshToken = await this.authHelper.retrieveRefreshToken(
      refreshTokenPayload.sub,
    );

    await this.create(refreshTokenPayload.sub, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  public async create(customerId: string, token: string) {
    await this.prisma.refreshToken.create({
      data: {
        token,
        customerId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 68 * 1000),
      },
    });
  }

  private async findActiveRefreshToken(token: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
      },
    });
  }

  private async invalidateRefreshToken(token: string) {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  private async invalidateAllRefreshTokensForUser(customerId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { customerId },
    });
  }
}
