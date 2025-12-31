import { mapObject } from '@game-cms/shared/object';
import type {
  ComponentId,
  ComponentOptionsById,
  ComponentSchema,
} from '@game-cms/types';
import { componentAccessor } from '@game-cms/utils';

import type { ComposeInput } from './components/Compose/types.js';
import { DynamicZoneInput } from './components/DynamicZone/types.js';
import Number from './components/Number/index.js';
import Text from './components/Text/index.js';

export type * from './components/Alternative/types.js';
export type * from './components/Compose/types.js';
export type * from './components/DynamicZone/types.js';
export type * from './components/Number/types.js';
export type * from './components/Repeatable/types.js';
export type * from './components/Text/types.js';

export const text = componentAccessor(Text);
export const number = componentAccessor(Number);

export function repeatable<Id extends ComponentId, Args>(
  baseComponent: ComponentSchema<Id, Args>
): ComponentSchema<'base::repeatable', { componentId: Id; baseArgs: Args }> {
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
    })),
  };
}

export function alternative<Id extends ComponentId, Args>(
  baseComponent: ComponentSchema<Id, Args>
): ComponentSchema<'base::alternative', { componentId: Id; baseArgs: Args }> {
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
