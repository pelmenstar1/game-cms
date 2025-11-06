import { MongoServerError } from 'mongodb';

function isErrorWithCode(
  value: unknown,
  code: number
): value is MongoServerError {
  return (
    value instanceof MongoServerError && 'code' in value && value.code === code
  );
}

export function isDuplicateKeyError(value: unknown): value is MongoServerError {
  return isErrorWithCode(value, 11_000);
}
