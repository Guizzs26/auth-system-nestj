import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async index() {
    return this.customerService.findAllCustomers();
  }
}
