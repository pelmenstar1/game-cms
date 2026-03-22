import { ComponentOptionsById } from '@game-cms/core';

export function validator(
  data: unknown,
  options: ComponentOptionsById<'base::dropdown'>
) {
  if (!options.items.some(({ key }) => data === key)) {
    return 'INVALID_TYPE';
  }
}
