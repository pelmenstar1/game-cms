import { ComponentClientContext } from '@game-cms/core';

import { EntityId } from './core.js';

export interface EntityClientContext {
  components?: ComponentClientContext;
}

export type EntityClientContextMap = {
  [Id in EntityId]?: EntityClientContext;
};

export function defineEntityClientContext(context: EntityClientContext) {
  return context;
}
