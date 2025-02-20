import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from 'generated/prisma_client';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  public async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }

  public async findAllCustomers(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }
}
