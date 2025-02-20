import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from 'generated/prisma_client';
import { compare } from 'bcrypt';
@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  public async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  public async validateCustomer(email: string, password: string) {
    const customer = await this.findCustomerByEmail(email);

    if (!customer) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await compare(password, customer.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = customer;

    return result;
  }

  public async findAllCustomers(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }

  public async findCustomerByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }

  public async findCustomerById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }
}
