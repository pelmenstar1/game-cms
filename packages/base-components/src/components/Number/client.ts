import { ComponentClientDataTransformer } from '@game-cms/core';
import { safeParseFloat } from '@game-cms/shared/string';

export const clientTransformer: ComponentClientDataTransformer<'base::number'> =
  {
    getDefaultData: () => '0',
    fromClient: (data) => {
      const result = safeParseFloat(data);
      if (result === null) {
        return { error: 'NAN' };
      }

      return { result };
    },
    toClient: (data) => data.toString(),
  };
