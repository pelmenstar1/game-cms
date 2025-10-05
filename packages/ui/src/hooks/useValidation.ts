import { useMemo } from 'react';

export type ValidationResult<K extends string = string> = Record<
  K,
  [boolean, string]
>;

// Use this helper to infer the K.
export function useValidation<K extends string>(
  value: ValidationResult<K>
): ValidationResult<K> {
  const deps = Object.values(value).flat();

  // Stabilize the result - change it only when condition or title are changed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => value, deps);
}

export function testValidationResult(result: ValidationResult) {
  return Object.values(result).every(([condition]) => condition);
}

export function getValidationItem<K extends string>(
  result: ValidationResult<K>,
  key: K
): string | undefined {
  const [condition, title] = result[key];

  return condition ? undefined : title;
}
