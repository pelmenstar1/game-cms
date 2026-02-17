import {
  boolean,
  number,
  object,
  optional,
  record,
  string,
  union,
} from 'zod/v4-mini';

export const spritesheetDataWithSize = object({
  frames: record(
    string(),
    object({
      frame: object({
        x: number(),
        y: number(),
        w: number(),
        h: number(),
      }),
      rotated: optional(boolean()),
    })
  ),
  meta: object({
    image: string(),
    scale: union([number(), string()]),
    size: object({
      w: number(),
      h: number(),
    }),
  }),
});
