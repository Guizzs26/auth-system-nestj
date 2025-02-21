import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/modules/customer/customer.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { AuthHelper } from '../auth-helper/jwt/auth-helper';

@Injectable()
export class SignInService {
  constructor(
    private readonly customerService: CustomerService,
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

    return { accessToken };
  }
}
