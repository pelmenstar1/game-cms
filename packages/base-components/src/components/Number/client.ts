import { ComponentClientDataTransformer } from '@game-cms/core';
import { isFloatString } from '@game-cms/shared';

export const clientTransformer: ComponentClientDataTransformer<'base::number'> =
  {
    getDefaultData: () => '0',
    fromClient: (data) => {
      const result = Number.parseFloat(data);
      if (Number.isNaN(result) || !isFloatString(data)) {
        return { error: 'NAN' };
      }

      return { result };
    },
    toClient: (data) => data.toString(),
  };
