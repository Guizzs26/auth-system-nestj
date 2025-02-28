import { z } from 'zod';

export const signOutSchema = z.object({
  authorization: z
    .string({
      required_error: 'Authorization header is required',
    })
    .trim()
    .refine((value) => value.startsWith('Bearer '), {
      message: 'Authorization header must start with "Bearer "',
    })
    .refine((value) => value.length > 7, {
      message: 'Access token cannot be empty',
    }),

  'refresh-token': z
    .string({
      required_error: 'Refresh token is required',
    })
    .trim()
    .refine((value) => !value.includes(' '), {
      message: 'Refresh token should not contain spaces',
    }),
});

// export const extractTokens = (headers: z.infer<typeof signOutSchema>) => {
//   return {
//     accessToken: headers.authorization.replace('Bearer ', ''),
//     refreshToken: headers['refresh-token'],
//   };
// };
