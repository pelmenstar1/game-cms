import { ComponentOptionsById } from '@game-cms/core';

export function validator(
  data: unknown,
  options: ComponentOptionsById<'base::json'>
) {
  const { type } = options;
  if (type) {
    const result = type.safeParse(data);
    if (!result.success) {
      return 'INVALID_FORMAT';
    }
  }
}
