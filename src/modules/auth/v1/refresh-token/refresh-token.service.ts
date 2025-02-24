import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from 'src/modules/customer/customer.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { AuthHelper } from '../helpers/jwt/auth.helper';
import { RefreshTokenHelper } from '../helpers/jwt/refresh-token.helper';

// One-time-use refresh token system
@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authHelper: AuthHelper,
    private readonly refreshTokenHelper: RefreshTokenHelper,
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

    const storedToken =
      await this.refreshTokenHelper.findAndInvalidateRefreshToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const newAccessToken = await this.authHelper.generateAccessToken(
      refreshTokenPayload.sub,
      customer.email,
      customer.role,
    );

    const newRefreshToken = await this.authHelper.generateRefreshToken(
      refreshTokenPayload.sub,
    );

    await this.refreshTokenHelper.storeRefreshToken(
      refreshTokenPayload.sub,
      newRefreshToken,
    );

    return { newAccessToken, newRefreshToken };
  }
}
