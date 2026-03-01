import {
  ComponentClientDataById,
  ComponentClientDataTransformer,
  ComponentInDataById,
} from '@game-cms/core';
import { InvalidJson, parseJsonOptional } from '@game-cms/shared/json';

export const clientTransformer: ComponentClientDataTransformer<'base::json'> = {
  getDefaultData: ({ allowEmpty }) => (allowEmpty ? '' : '{}'),
  toClient: (data) => JSON.stringify(data, null, 2),
  fromClient: <Args>(data: ComponentClientDataById<'base::json', Args>) => {
    const parsedData =
      parseJsonOptional<ComponentInDataById<'base::json', Args>>(data);

    if (parsedData === InvalidJson) {
      return { error: 'INVALID_FORMAT' };
    }

    return { result: parsedData };
  },
};
