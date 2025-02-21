import { z } from 'zod';

export const customerQueryParamsSchema = z.object({
  page: z
    .preprocess((val) => Number(val), z.number().min(1).default(1))
    .optional(),

  limit: z.preprocess(
    (val) => Number(val),
    z.number().min(1).max(100).default(10).optional(),
  ),
});
