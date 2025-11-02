import z from 'zod';

import { type ComponentData, componentSchema } from './component.js';

export const entitySchema = z.object({
  id: z.string(),
  title: z.string().check(z.minLength(1)),
  components: z.record(z.string(), componentSchema),
});

export type EntitySchema = z.infer<typeof entitySchema>;

export type EntityData = Record<string, ComponentData>;
