import { ComponentClientDataTransformer } from '@game-cms/core';

export const clientTransformer: ComponentClientDataTransformer<'base::file'> = {
  getDefaultData: () => [],
  toClient: (data) => {
    return data.map((item) => ({ ...item, id: item.id.toString() }));
  },
  fromClient: (clientData) => {
    return { result: clientData.map((item) => item.id) };
  },
};
