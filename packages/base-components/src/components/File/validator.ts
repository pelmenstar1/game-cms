import { ComponentOptionsById } from '@game-cms/core';

export function validator(
  data: unknown,
  options: ComponentOptionsById<'base::file'>
) {
  if (!Array.isArray(data) || data.some((item) => typeof item !== 'string')) {
    return 'INVALID_TYPE';
  }

  if (options.minItems !== undefined && data.length < options.minItems) {
    return 'TOO_FEW_ITEMS';
  }

  if (options.maxItems !== undefined && data.length > options.maxItems) {
    return 'TOO_MANY_ITEMS';
  }
}
