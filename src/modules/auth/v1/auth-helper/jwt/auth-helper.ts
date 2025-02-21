import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthHelper {
  constructor(private readonly jwtService: JwtService) {}

  public retrieveAccessToken(customerId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: customerId });
  }
}
