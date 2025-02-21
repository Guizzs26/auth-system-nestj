import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PaginatedCustomerDto } from './dto/paginated-customer.dto';
import { ZodValidationPipe } from 'src/common/pipes';
import { customerQueryParamsSchema } from './schema/customer-query-params.schema';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of customers',
    type: PaginatedCustomerDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  public async index(
    @Query(new ZodValidationPipe(customerQueryParamsSchema))
    query: {
      page: number;
      limit: number;
    },
  ): Promise<PaginatedCustomerDto> {
    return this.customerService.findAllCustomers(query.page, query.limit);
  }
}
