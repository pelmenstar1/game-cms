import { ObjectId } from 'mongodb';
import z from 'zod';

export const objectId = z.string().transform((input) => {
  try {
    return new ObjectId(input);
  } catch {
    return false;
  }
});
