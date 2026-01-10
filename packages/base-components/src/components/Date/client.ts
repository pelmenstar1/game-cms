import { ComponentClientDataTransformer } from '@game-cms/core';
import { resolveDateLike } from '@game-cms/shared/chrono';

export const clientTransformer: ComponentClientDataTransformer<'base::date'> = {
  getDefaultData: (options) =>
    options.minDate ? resolveDateLike(options.minDate) : new Date(),
  fromClient: (data) => ({ result: data.toISOString() }),
  toClient: (data) => new Date(data),
};
