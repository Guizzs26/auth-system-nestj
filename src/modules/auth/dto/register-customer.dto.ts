import { z } from 'zod';
import { registerCustomerSchema } from '../schemas/register-customer.schema';

export type RegisterCustomerDto = z.infer<typeof registerCustomerSchema>;
