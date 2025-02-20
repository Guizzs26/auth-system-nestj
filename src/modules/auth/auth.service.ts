import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { Customer } from 'generated/prisma_client';
import { EmailAlreadyInUseException } from 'src/common/exceptions';
import { hash } from 'bcrypt';

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
      throw new EmailAlreadyInUseException();
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
