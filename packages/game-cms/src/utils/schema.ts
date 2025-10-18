import { httpMethods } from '@game-cms/types';
import z from 'zod';

const httpMethod = z.enum(httpMethods);

export const serviceSchema = z.object({
  id: z.string(),
});

export const routeSchema = z.object({
  path: z.string(),
  method: httpMethod,
  handler: z.function(),
});

export const componentSchema = z.object({
  id: z.string(),
  defaultOptions: z.function(),
  defaultData: z.function(),
  isValid: z.function(),
});
