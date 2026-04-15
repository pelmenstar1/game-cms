/* eslint-disable import/no-duplicates */
import './types.js';

import {
  ComponentId,
  ComponentOptionsById,
  ComponentSchema,
} from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import { DynamicZoneInput, DynamicZoneInputEntry, Id, id } from './types.js';

export function dynamicZoneEntry<Id extends ComponentId, Args>(
  value: DynamicZoneInputEntry<Id, Args>
) {
  return value;
}

export function dynamicZone<const T extends DynamicZoneInput>(
  input: T
): ComponentSchema<Id, T> {
  return {
    componentId: id,
    options: {
      minItems: input.minItems,
      maxItems: input.maxItems,
      options: mapObject(input.options, (item) => ({
        title: item.title,
        option: item.option,
        componentId: item.component.componentId,
        options: item.component.options,
      })),
    } as ComponentOptionsById<Id, T>,
  };
}
