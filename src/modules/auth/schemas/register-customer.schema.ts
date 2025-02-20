import { z } from 'zod';

// Define the schema for register a customer
export const registerCustomerSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    })
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(64, { message: 'First name cannot exceed 64 characters' })
    .regex(/^[A-Za-z\s]+$/, { message: 'First name must contain only letters' })
    .trim(),

  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    })
    .min(2, { message: 'Last name must be at least 2 characters long' })
    .max(64, { message: 'Last name cannot exceed 64 characters' })
    .regex(/^[A-Za-z\s]+$/, { message: 'Last name must contain only letters' })
    .trim(),

  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Invalid email address' })
    .max(128, { message: 'Email cannot exceed 128 characters' })
    .trim()
    .toLowerCase(),

  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(64, { message: 'Password cannot exceed 64 characters' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      },
    ),

  avatar: z
    .string({
      invalid_type_error: 'Avatar must be a string',
    })
    .url({ message: 'Avatar must be a valid URL' })
    .optional(),

  role: z.enum(['ADMIN', 'EMPLOYEE', 'USER'], {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be one of ADMIN, EMPLOYEE or USER',
  }),
});
