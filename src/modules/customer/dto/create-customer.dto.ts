import { z } from 'zod';
import { signUpSchema } from 'src/modules/auth/v1/sign-up/schema/sign-up.schema';

export type CreateCustomerDto = z.infer<typeof signUpSchema>;
