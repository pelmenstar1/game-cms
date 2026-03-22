import { isNonNullObject } from '@game-cms/shared';

function isAlternativeData(data: unknown): data is {
  default: unknown;
  alternative: { condition: unknown; value: unknown }[];
} {
  return (
    isNonNullObject(data) &&
    'default' in data &&
    Array.isArray(data.alternative)
  );
}

export function validator(
  data: unknown,
  validate: (data: unknown) => unknown,
  validateCondition?: (condition: unknown) => string | undefined
) {
  if (!isAlternativeData(data)) {
    return { ownError: 'INVALID_TYPE' as const };
  }

  const result = {
    default: validate(data.default),
    alternative: data.alternative.map((item) => ({
      condition: validateCondition?.(item.condition),
      data: validate(item.value),
    })),
  };

  if (
    result.default !== undefined ||
    result.alternative.some(
      (item) => item.condition !== undefined || item.data !== undefined
    )
  ) {
    return result;
  }
}
