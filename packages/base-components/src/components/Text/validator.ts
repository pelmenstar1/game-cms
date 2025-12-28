import { componentDataValidator } from '@game-cms/utils';

export const validator = componentDataValidator<'base::text'>(
  (text, options) => {
    const { minLength, maxLength } = options;

    if (minLength !== undefined && text.length < minLength) {
      return 'TEXT_TOO_SHORT';
    }

    if (maxLength !== undefined && text.length > maxLength) {
      return 'TEXT_TOO_LONG';
    }
  }
);
