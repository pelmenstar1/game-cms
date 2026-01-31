import z from 'zod';

export const getEntityChecksResponse = z.object({
  checks: z.array(z.object({ id: z.string() })),
});
