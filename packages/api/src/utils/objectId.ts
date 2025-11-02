import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import { ObjectId } from 'mongodb';

export function parseObjectId(input: string) {
  try {
    return new ObjectId(input);
  } catch {
    throw new ApiError(`Invalid id: ${input}`, ApiErrorCode.VALIDATION_ISSUE);
  }
}
