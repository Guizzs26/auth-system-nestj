import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from 'generated/prisma_client';
import { hash } from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Omit<Customer, 'password'>> {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await hash(createCustomerDto.password, 10);

    const customer = await this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        password: hashedPassword,
      },
    });

    const { password, ...customerWithoutPassword } = customer;

    return customerWithoutPassword;
  }
}
