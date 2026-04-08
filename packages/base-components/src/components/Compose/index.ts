import './types.js';

import { ComponentOptionsById, ComponentSchema } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import { ComposeInput, Id, id } from './types.js';

export function compose<const T extends ComposeInput>(
  map: T
): ComponentSchema<Id, T> {
  return {
    componentId: id,
    options: mapObject(map, (schema) => ({
      componentId: schema.componentId,
      options: schema.options,
    })) as ComponentOptionsById<Id, T>,
  };
}
