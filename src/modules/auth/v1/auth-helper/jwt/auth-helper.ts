import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt.constants';

@Injectable()
export class AuthHelper {
  constructor(private readonly jwtService: JwtService) {}

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
}
