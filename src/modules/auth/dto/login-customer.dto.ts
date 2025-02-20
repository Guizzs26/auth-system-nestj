import { z } from 'zod';
import { loginCustomerSchema } from '../schemas/login-customer.schema';

export type LoginCustomerDto = z.infer<typeof loginCustomerSchema>;
