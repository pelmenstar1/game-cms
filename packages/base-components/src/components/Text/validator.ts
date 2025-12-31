import { ComponentDataValidator } from '@game-cms/types';

export const validator: ComponentDataValidator<'base::text'> = (
  text,
  options
) => {
  const { minLength, maxLength } = options;

  if (minLength !== undefined && text.length < minLength) {
    return 'TEXT_TOO_SHORT';
  }

  if (maxLength !== undefined && text.length > maxLength) {
    return 'TEXT_TOO_LONG';
  }
};
