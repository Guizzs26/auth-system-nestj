import { z } from 'zod';
import { signInSchema } from '../schema/sign-in.schema';

export type SignInDto = z.infer<typeof signInSchema>;
