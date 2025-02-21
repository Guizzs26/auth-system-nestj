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
import { PaginatedCustomerResponseDto } from './dto/paginated-customer.dto';
import { ZodValidationPipe } from 'src/common/pipes';
import { customerQueryParamsSchema } from './schema/customer-query-params.schema';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async index(
    @Query(new ZodValidationPipe(customerQueryParamsSchema))
    query: {
      page: number;
      limit: number;
    },
  ): Promise<PaginatedCustomerResponseDto> {
    return this.customerService.findAllCustomers(query.page, query.limit);
  }
}
