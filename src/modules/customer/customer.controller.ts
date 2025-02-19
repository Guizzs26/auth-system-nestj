import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { createCustomerSchema } from './schemas/create-customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCustomerSchema))
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }
}
