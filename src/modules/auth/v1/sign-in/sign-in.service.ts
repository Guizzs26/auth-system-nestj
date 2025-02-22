import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/modules/customer/customer.service';
import { RefreshTokenService } from '../refresh-token';
import { AuthHelper } from '../auth-helper/jwt/auth-helper';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@Injectable()
export class SignInService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly authHelper: AuthHelper,
  ) {}

  public async execute({
    email,
    password,
  }: SignInDto): Promise<SignInResponseDto> {
    const validCustomer = await this.customerService.validateCustomer(
      email,
      password,
    );

    const accessToken = await this.authHelper.retrieveAccessToken(
      validCustomer.id,
    );

    const refreshToken = await this.authHelper.retrieveRefreshToken(
      validCustomer.id,
    );
    await this.refreshTokenService.create(validCustomer.id, refreshToken);

    return { refreshToken, accessToken };
  }
}
