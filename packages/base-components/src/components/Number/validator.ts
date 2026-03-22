import { ComponentOptionsById } from '@game-cms/core';

export function validator(
  value: unknown,
  options: ComponentOptionsById<'base::number'>
) {
  if (typeof value !== 'number') {
    return 'INVALID_TYPE';
  }

  if (options.integer && !Number.isInteger(value)) {
    return 'EXPECTED_INTEGER';
  }

  if (options.min !== undefined && value < options.min) {
    return 'TOO_SMALL';
  }

  if (options.max !== undefined && value > options.max) {
    return 'TOO_LARGE';
  }
}
