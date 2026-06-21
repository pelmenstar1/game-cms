import { ComponentOptionsById, ComponentSchema } from '@game-cms/core';

import { Id, id } from './types.js';

function validateDimension(value: number, name: string) {
  function throwError(reason: string) {
    throw new Error(`Invalid ${name}: ${value}. Reason: ${reason}`);
  }

  if (value <= 0) {
    throwError('Value must be positive');
  }

  if (!Number.isSafeInteger(value)) {
    throwError('Value must be an integer');
  }
}

export function tileGrid(
  options: ComponentOptionsById<Id>
): ComponentSchema<Id> {
  validateDimension(options.width, 'width');
  validateDimension(options.height, 'height');

  return {
    componentId: id,
    options,
  };
}
