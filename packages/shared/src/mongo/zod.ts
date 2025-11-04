import { ObjectId } from 'mongodb';
import z from 'zod';

export const objectId = z.string().transform((input) => {
  return new ObjectId(input);
});
