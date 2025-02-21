import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/modules/customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@Injectable()
export class SignInService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  public async execute({
    email,
    password,
  }: SignInDto): Promise<SignInResponseDto> {
    const validCustomer = await this.customerService.validateCustomer(
      email,
      password,
    );

    const jwtPayload = { sub: validCustomer.id };
    const jwtToken = await this.jwtService.signAsync(jwtPayload);

    return { accessToken: jwtToken };
  }
}
