import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CustomerService } from './customer.service';
import { ZodValidationPipe } from 'src/common/libs/core/pipes';
import { customerQueryParamsSchema } from './schema/customer-query-params.schema';
import { PaginatedCustomerResponseDto } from './dto/paginated-customer.dto';

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
