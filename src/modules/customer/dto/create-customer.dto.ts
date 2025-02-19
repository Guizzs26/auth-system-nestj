import { z } from 'zod';
import { createCustomerSchema } from '../schemas/create-customer.schema';

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
