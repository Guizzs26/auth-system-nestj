import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { CustomerService } from '../customer/customer.service';
import { hash } from 'bcrypt';
import { Customer } from 'generated/prisma_client';

@Injectable()
export class AuthService {
  constructor(private readonly customerService: CustomerService) {}

  public async register(
    registerCustomerDto: RegisterCustomerDto,
  ): Promise<Omit<Customer, 'password'>> {
    const existingCustomer = await this.customerService.findByEmail(
      registerCustomerDto.email,
    );

    if (existingCustomer) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashPassword(
      registerCustomerDto.password,
    );

    const customer = await this.customerService.create({
      ...registerCustomerDto,
      password: hashedPassword,
    });

    const { password, ...customerWithoutPassword } = customer;

    return customerWithoutPassword;
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
