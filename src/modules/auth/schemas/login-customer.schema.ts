import { z } from 'zod';

export const loginCustomerSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Invalid email address' })
    .max(128, { message: 'Email cannot exceed 128 characters' })
    .trim()
    .toLowerCase(),

  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});
