import { array, number, object, record, string, unknown } from 'zod/v4-mini';

export const dataShape = object({
  nodes: record(
    string(),
    object({
      value: unknown(),
      meta: object({
        position: object({
          x: number(),
          y: number(),
        }),
      }),
    })
  ),
  edges: array(
    object({
      source: string(),
      target: string(),
    })
  ),
});
