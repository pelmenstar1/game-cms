import z from 'zod';

export const pagingOptionsSchema = z.object({
  offset: z.coerce.number().min(0).optional(),
  size: z.coerce.number().refine((value) => value === -1 || value >= 1),
});
