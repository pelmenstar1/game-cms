import z from 'zod';

export const componentDataValidatorParams = z.object({
  partial: z.boolean().optional(),
});
