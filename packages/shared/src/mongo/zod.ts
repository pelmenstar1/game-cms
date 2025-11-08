import { ObjectId } from 'mongodb';
import z from 'zod';

export const objectId = z.instanceof(ObjectId);

export const stringObjectId = z.string().transform((input) => {
  return new ObjectId(input);
});
