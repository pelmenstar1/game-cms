import { z, type ZodType } from 'zod';

export function zodMaybeArray<Out, In>(value: ZodType<Out, In>) {
  return z.union([value, z.array(value)]);
}
