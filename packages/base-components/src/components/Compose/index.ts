import './types.js';

import { ComponentOptionsById, ComponentSchema } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import { ComposeInput } from './types.js';

type Id = 'base::compose';

export function compose<const T extends ComposeInput>(
  map: T
): ComponentSchema<Id, T> {
  return {
    componentId: 'base::compose',
    options: mapObject(map, (schema) => ({
      componentId: schema.componentId,
      options: schema.options,
    })) as ComponentOptionsById<Id, T>,
  };
}
