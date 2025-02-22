import { z } from 'zod';
import { refreshTokenSchema } from '../schema/refresh-token.schema';

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
