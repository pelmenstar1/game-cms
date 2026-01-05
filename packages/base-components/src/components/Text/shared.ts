import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  componentMeta,
} from '@game-cms/core';

const id = 'base::text';

type Id = typeof id;

export const meta = componentMeta({
  id,
  config: {
    ui: {
      compact: true,
    },
  },
});

export const defaultRawData: ComponentDefaultDataHandler<Id> = () => '';

export const validator: ComponentDataValidator<Id> = (text, options) => {
  if (typeof text !== 'string') {
    return 'INVALID_TYPE';
  }

  const { minLength, maxLength } = options;

  if (minLength !== undefined && text.length < minLength) {
    return 'TEXT_TOO_SHORT';
  }

  if (maxLength !== undefined && text.length > maxLength) {
    return 'TEXT_TOO_LONG';
  }
};
