import { z } from 'zod';
import { signUpSchema } from '../schema/sign-up.schema';

export type SignUpDto = z.infer<typeof signUpSchema>;
