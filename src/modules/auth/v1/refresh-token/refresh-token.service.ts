import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(customerId: string, token: string) {
    await this.prisma.refreshToken.create({
      data: {
        token,
        customerId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 68 * 1000),
      },
    });
  }

  public async findValidToken(token: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
      },
    });
  }

  public async revokeToken(token: string) {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  public async revokeAllTokensForUser(customerId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { customerId },
    });
  }
}
