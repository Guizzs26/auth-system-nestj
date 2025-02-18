import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './customer.controller';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(customerData: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: customerData,
    });
  }
}
