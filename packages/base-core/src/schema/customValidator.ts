import z from 'zod';

export const componentCustomValidatorPayload = z.strictObject({
  data: z.unknown(),
});
