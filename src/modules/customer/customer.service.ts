import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from 'generated/prisma_client';
import { compare } from 'bcrypt';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { PaginatedCustomerResponseDto } from './dto/paginated-customer.dto';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  public async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  public async validateCustomer(
    email: string,
    password: string,
  ): Promise<Omit<Customer, 'password'>> {
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

  public async findAllCustomers(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedCustomerResponseDto> {
    const skip = (page - 1) * limit;

    // Fetch paginated customers and total count in parallel
    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        skip,
        take: limit,
      }),
      this.prisma.customer.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: customers.map((customer) =>
        this.mapToCustomerResponseDto(customer),
      ),
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }

  public async findCustomerByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { email },
      include: { RefreshToken: true },
    });
  }

  public async findCustomerById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
      include: { RefreshToken: true },
    });
  }

  private mapToCustomerResponseDto(customer: any): CustomerResponseDto {
    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      role: customer.role,
      avatar: customer.avatar,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
