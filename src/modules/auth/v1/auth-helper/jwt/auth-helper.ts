import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt.constants';

@Injectable()
export class AuthHelper {
  constructor(private readonly jwtService: JwtService) {}

  public async retrieveAccessToken(customerId: string): Promise<string> {
    const payload = { sub: customerId };

    return this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '30m',
    });
  }

  public async retrieveRefreshToken(customerId: string): Promise<string> {
    const payload = { sub: customerId };

    return this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '7d',
    });
  }

  public async validateRefreshToken(token: string): Promise<{ sub: string }> {
    return this.jwtService.verifyAsync(token, {
      secret: jwtConstants.refreshSecret,
    });
  }
}
