/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { mapObject } from '@game-cms/shared/object';
import type {
  ComponentController,
  ComponentData,
  ComponentOptions,
  ServerComponentSchema,
} from '@game-cms/types';
import { componentAccessor } from '@game-cms/utils';

import Compose from './Compose/index.js';
import type {
  ComposeData,
  ComposeError,
  ComposeInput,
  ComposeOptions,
} from './Compose/types.js';
import Number from './Number/index.js';
import Repeatable from './Repeatable/index.js';
import type { RepeatableOptions } from './Repeatable/types.js';
import Text from './Text/index.js';

export * from './Compose/types.js';
export * from './Repeatable/types.js';
export * from './Text/types.js';

export const text = componentAccessor(Text);
export const number = componentAccessor(Number);

export function repeatable<
  Options extends ComponentOptions,
  Data extends ComponentData,
  Error,
  Id extends string,
>(
  component: ServerComponentSchema<Options, Data, Error, Id>
): ServerComponentSchema<
  RepeatableOptions<Options, Id>,
  Data[],
  Error[],
  'base::list'
> {
  return {
    controller: Repeatable as unknown as ComponentController<
      RepeatableOptions<Options, Id>,
      Data[],
      Error[],
      'base::list'
    >,
    options: {
      controller: component.controller.meta.id,
      base: component.options,
    },
  };
}

export function compose<const T extends ComposeInput>(
  map: T
): ServerComponentSchema<
  ComposeOptions<T>,
  ComposeData<T>,
  ComposeError<T>,
  'base::compose'
> {
  return {
    controller: Compose as ComponentController<
      ComposeOptions<T>,
      ComposeData<T>,
      ComposeError<T>,
      'base::compose'
    >,
    options: mapObject(map, (schema) => ({
      componentId: schema.controller.meta.id,
      options: schema.options,
    })) as ComposeOptions<T>,
  };
}
