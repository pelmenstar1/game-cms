import z from 'zod';

export const pagingOptionsSchema = z.object({
  offset: z.number().min(0).optional(),
  size: z.number().refine((value) => value === -1 || value >= 1),
});
