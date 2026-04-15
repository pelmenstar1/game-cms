/* eslint-disable import/no-duplicates */
import './types.js';

import { ComponentId, ComponentSchema } from '@game-cms/core';

import { Id, id } from './types.js';

export function alternative<CId extends ComponentId, Args>(
  baseComponent: ComponentSchema<CId, Args>
): ComponentSchema<Id, { id: CId; baseArgs: Args }> {
  return {
    componentId: id,
    options: {
      componentId: baseComponent.componentId,
      baseOptions: baseComponent.options,
    },
  };
}
