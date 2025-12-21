import { componentDataValidator } from '@game-cms/utils';

import { ComponentData, ComponentOptions } from './types';

export const validator = componentDataValidator(
  (text: ComponentData, options: ComponentOptions) => {
    const { minLength, maxLength } = options;

    if (minLength !== undefined && text.length < minLength) {
      return 'TEXT_TOO_SHORT';
    }

    if (maxLength !== undefined && text.length > maxLength) {
      return 'TEXT_TOO_LONG';
    }
  }
);
