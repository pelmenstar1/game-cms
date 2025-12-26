import { componentDataValidator } from '@game-cms/utils';

import { TextData, TextOptions } from './types.js';

export const validator = componentDataValidator(
  (text: TextData, options: TextOptions) => {
    const { minLength, maxLength } = options;

    if (minLength !== undefined && text.length < minLength) {
      return 'TEXT_TOO_SHORT';
    }

    if (maxLength !== undefined && text.length > maxLength) {
      return 'TEXT_TOO_LONG';
    }
  }
);
