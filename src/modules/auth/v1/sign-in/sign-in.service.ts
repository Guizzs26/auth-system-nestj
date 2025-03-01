import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/modules/customer/customer.service';
import { AuthHelper } from '../helpers/jwt/auth.helper';
import { RefreshTokenHelper } from '../helpers/jwt/refresh-token.helper';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { CacheService } from 'src/common/database/cache.service';

@Injectable()
export class SignInService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authHelper: AuthHelper,
    private readonly refreshTokenHelper: RefreshTokenHelper,
    private readonly cacheService: CacheService,
  ) {}

  public async execute({
    email,
    password,
  }: SignInDto): Promise<SignInResponseDto> {
    const validCustomer = await this.customerService.validateCustomer(
      email,
      password,
    );

    const accessToken = await this.authHelper.generateAccessToken(
      validCustomer.id,
      validCustomer.email,
      validCustomer.role,
    );

    const refreshToken = await this.authHelper.generateRefreshToken(
      validCustomer.id,
    );
    await this.refreshTokenHelper.storeRefreshToken(
      validCustomer.id,
      refreshToken,
    );

    const decodedAccessToken = this.authHelper.decodeToken(accessToken);
    const ttl = decodedAccessToken.exp - Math.floor(Date.now() / 1000);

    await this.cacheService.setLastAccessToken(
      validCustomer.id,
      accessToken,
      ttl,
    );

    return { accessToken, refreshToken };
  }
}
