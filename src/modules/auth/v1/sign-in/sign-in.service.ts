import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/modules/customer/customer.service';
import { AuthHelper } from '../helpers/jwt/auth.helper';
import { RefreshTokenHelper } from '../helpers/jwt/refresh-token.helper';
import { RequestContextProvider } from 'src/common/context/request.context.';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@Injectable()
export class SignInService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authHelper: AuthHelper,
    private readonly refreshTokenHelper: RefreshTokenHelper,
    private readonly requestContext: RequestContextProvider,
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

    this.requestContext.set('accessToken', accessToken);

    const refreshToken = await this.authHelper.generateRefreshToken(
      validCustomer.id,
    );
    await this.refreshTokenHelper.storeRefreshToken(
      validCustomer.id,
      refreshToken,
    );

    return { accessToken, refreshToken };
  }
}
