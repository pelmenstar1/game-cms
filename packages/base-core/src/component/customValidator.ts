import type z from 'zod';

import type { componentCustomValidatorPayload } from '../schema/customValidator.js';

export type ComponentCustomValidatorPayload = z.infer<
  typeof componentCustomValidatorPayload
>;

export type ComponentCustomValidatorResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: unknown;
    };
