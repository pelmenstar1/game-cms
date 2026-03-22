import { ComponentOptionsById } from '@game-cms/core';

export function validator(
  data: unknown,
  options: ComponentOptionsById<'base::checkbox'>
) {
  if (!Array.isArray(data) || data.some((item) => !(item in options.choices))) {
    return 'INVALID_TYPE';
  }
}
