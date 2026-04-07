import {
  ComponentErrorById,
  ComponentStorageDataById,
  defineComponentController,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import { isValidData } from '../TileGrid/shared.js';
import core from './core.js';
import { Id } from './types.js';

function isValidDimension(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function validator(value: unknown): ComponentErrorById<Id> | undefined {
  if (!isNonNullObject(value)) {
    return 'INVALID_TYPE';
  }

  const { width, height, grid } = value;

  if (!isValidDimension(width)) {
    return 'INVALID_WIDTH';
  }

  if (!isValidDimension(height)) {
    return 'INVALID_HEIGHT';
  }

  if (!isValidData(grid, width, height)) {
    return 'INVALID_GRID';
  }
}

export default defineComponentController({
  core,
  validator,
  migrate: (data) => {
    if (validator(data) === undefined) {
      return data as ComponentStorageDataById<Id>;
    }
  },
});
