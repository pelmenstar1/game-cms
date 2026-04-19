import { ObjectId } from 'mongodb';
import z from 'zod';

export const objectId = z.instanceof(ObjectId);

export const stringObjectId = z.string().transform((input, ctx) => {
  try {
    return new ObjectId(input);
  } catch {
    ctx.addIssue({
      code: 'custom',
      message: 'Invalid ObjectId string',
    });

    return z.NEVER;
  }
});
