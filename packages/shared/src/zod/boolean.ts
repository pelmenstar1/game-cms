import z from 'zod';

export const stringBoolean = z.string().transform((value, ctx) => {
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else {
    ctx.addIssue({
      code: 'invalid_value',
      values: ['false', 'true'],
    });
  }
});
