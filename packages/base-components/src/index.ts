import {
  componentAccessor,
  type ComponentId,
  type ComponentOptionsById,
  type ComponentSchema,
} from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import type { ComposeInput } from './components/Compose/types.js';
import { DynamicZoneInput } from './components/DynamicZone/types.js';
import File from './components/File/index.js';
import Number from './components/Number/index.js';
import Text from './components/Text/index.js';

export type * from './components/Alternative/types.js';
export type * from './components/Compose/types.js';
export type * from './components/DynamicZone/types.js';
export type * from './components/File/types.js';
export type * from './components/Number/types.js';
export type * from './components/Repeatable/types.js';
export type * from './components/Text/types.js';

export const text = componentAccessor(Text);
export const number = componentAccessor(Number);
export const file = componentAccessor(File);

export function repeatable<Id extends ComponentId, Args>(
  baseComponent: ComponentSchema<Id, Args>
): ComponentSchema<'base::repeatable', { id: Id; baseArgs: Args }> {
  return {
    componentId: 'base::repeatable',
    options: {
      componentId: baseComponent.componentId,
      baseOptions: baseComponent.options,
    },
  };
}

export function compose<const T extends ComposeInput>(
  map: T
): ComponentSchema<'base::compose', T> {
  return {
    componentId: 'base::compose',
    options: mapObject(map, (schema) => ({
      componentId: schema.componentId,
      options: schema.options,
    })) as ComponentOptionsById<'base::compose', T>,
  };
}

export function alternative<Id extends ComponentId, Args>(
  baseComponent: ComponentSchema<Id, Args>
): ComponentSchema<'base::alternative', { id: Id; baseArgs: Args }> {
  return {
    componentId: 'base::alternative',
    options: {
      componentId: baseComponent.componentId,
      baseOptions: baseComponent.options,
    },
  };
}

export function dynamicZone<const T extends DynamicZoneInput>(
  input: T
): ComponentSchema<'base::dynamic-zone', T> {
  return {
    componentId: 'base::dynamic-zone',
    options: mapObject(input, (item) => ({
      title: item.title,
      componentId: item.component.componentId,
      options: item.component.options,
    })) as ComponentOptionsById<'base::dynamic-zone', T>,
  };
}
