import { z } from 'zod';
import { registerCustomerSchema } from 'src/modules/auth/schemas/register-customer.schema';

export type CreateCustomerDto = z.infer<typeof registerCustomerSchema>;
