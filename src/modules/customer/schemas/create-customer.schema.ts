import { z } from 'zod';

export const createCustomerSchema = z.object({
  firstName: z.string().min(2).max(127),
  lastName: z.string().min(2).max(127),
  email: z.string().email(),
  avatar: z.string().optional(),
  password: z.string(),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'USER']),
});
