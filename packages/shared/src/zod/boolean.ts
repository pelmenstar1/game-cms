import z from 'zod';

export const stringBoolean = z.string().transform((value, ctx) => {
  switch (value) {
    case 'true': {
      return true;
    }
    case 'false': {
      return false;
    }
    default: {
      ctx.addIssue({
        code: 'invalid_value',
        values: ['false', 'true'],
        input: value,
      });

      return z.NEVER;
    }
  }
});
