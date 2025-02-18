import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { z } from 'zod';

const createCustomerSchema = z.object({
  firstName: z.string().min(2).max(127),
  lastName: z.string().min(2).max(127),
  email: z.string().email(),
  avatar: z.string().optional(),
  password: z.string(),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'USER']),
});

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCustomerSchema))
  async create(@Body() customerData: CreateCustomerDto) {
    return this.customerService.create(customerData);
  }
}
