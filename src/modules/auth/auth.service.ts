import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { Customer } from 'generated/prisma_client';
import { EmailAlreadyInUseException } from 'src/common/exceptions';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(
    registerCustomerDto: RegisterCustomerDto,
  ): Promise<Omit<Customer, 'password'>> {
    const existingCustomer = await this.customerService.findCustomerByEmail(
      registerCustomerDto.email,
    );

    if (existingCustomer) {
      throw new EmailAlreadyInUseException();
    }

    const hashedPassword = await this.hashPassword(
      registerCustomerDto.password,
    );

    const newCustomer = await this.customerService.create({
      ...registerCustomerDto,
      password: hashedPassword,
    });

    const { password, ...customerWithoutPassword } = newCustomer;

    return customerWithoutPassword;
  }

  public async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const validCustomer = await this.customerService.validateCustomer(
      email,
      password,
    );

    const jwtPayload = { sub: validCustomer.id, email: validCustomer.email };

    return { access_token: await this.jwtService.signAsync(jwtPayload) };
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
