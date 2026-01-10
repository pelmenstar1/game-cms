import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  componentMeta,
} from '@game-cms/core';

const id = 'base::number';

type Id = typeof id;

export const meta = componentMeta({
  id,
  config: {
    ui: {
      compact: true,
    },
  },
});

export const defaultRawData: ComponentDefaultDataHandler<Id> = () => 0;

export const validator: ComponentDataValidator<Id> = (value, options) => {
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
};
