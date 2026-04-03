import { ZodType } from 'zod';

import { JsonParserValidator } from '../../../api/client/responseParser.js';

export function zodJsonValidator<T>(
  schema: ZodType<T>
): JsonParserValidator<T> {
  return (data) => schema.parse(data);
}
