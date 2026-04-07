import { defineComponentClientController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import { isValidData } from '../TileGrid/shared.js';
import core from './core.js';

function parseDimension(value: unknown) {
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);

    if (parsed > 0) {
      return parsed;
    }
  }
}

export default defineComponentClientController({
  core,
  validator: (value) => {
    if (!isNonNullObject(value)) {
      return 'INVALID_TYPE';
    }

    const { width, height, grid } = value;

    const widthInt = parseDimension(width);
    const heightInt = parseDimension(height);

    if (!widthInt) {
      return 'INVALID_WIDTH';
    }

    if (!heightInt) {
      return 'INVALID_HEIGHT';
    }

    if (!isValidData(grid, widthInt, heightInt)) {
      return 'INVALID_GRID';
    }
  },
  getDefaultData: () => ({ width: '1', height: '1', grid: [0] }),
  transformer: {
    fromClient: (clientData) => {
      const width = parseDimension(clientData.width) ?? 1;
      const height = parseDimension(clientData.height) ?? 1;

      if (!width || !height) {
        throw new Error('Invalid dimensions');
      }

      return { width, height, grid: clientData.grid };
    },
    toClient: (outData) => {
      const { width, height, grid } = outData;

      return {
        width: width.toString(),
        height: height.toString(),
        grid,
      };
    },
  },
});
