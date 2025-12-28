/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { mapObject } from '@game-cms/shared/object';
import type {
  ComponentController,
  ComponentData,
  ComponentOptions,
  ServerComponentSchema,
} from '@game-cms/types';
import { componentAccessor } from '@game-cms/utils';

import Alternative from './components/Alternative/index.js';
import {
  AlternativeClientData,
  AlternativeData,
  AlternativeError,
  AlternativeOptions,
} from './components/Alternative/types.js';
import Compose from './components/Compose/index.js';
import type {
  ComposeClientData,
  ComposeData,
  ComposeError,
  ComposeInput,
  ComposeOptions,
  ComposeResolvedData,
} from './components/Compose/types.js';
import Number from './components/Number/index.js';
import Repeatable from './components/Repeatable/index.js';
import type { RepeatableOptions } from './components/Repeatable/types.js';
import Text from './components/Text/index.js';

export type * from './components/Alternative/types.js';
export type * from './components/Compose/types.js';
export type * from './components/Repeatable/types.js';
export type * from './components/Text/types.js';

export const text = componentAccessor(Text);
export const number = componentAccessor(Number);

export function repeatable<
  Options extends ComponentOptions,
  Data extends ComponentData,
  Error,
  Id extends string,
  ResolvedData extends ComponentData,
  ClientData extends ComponentData,
>(
  component: ServerComponentSchema<
    Options,
    Data,
    Error,
    Id,
    ResolvedData,
    ClientData
  >
): ServerComponentSchema<
  RepeatableOptions<Options, Id>,
  Data[],
  Error[],
  'base::list',
  ResolvedData[],
  ClientData[]
> {
  return {
    controller: Repeatable as unknown as ComponentController<
      RepeatableOptions<Options, Id>,
      Data[],
      Error[],
      'base::list',
      ResolvedData[],
      ClientData[]
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
  'base::compose',
  ComposeResolvedData<T>,
  ComposeClientData<T>
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

export function alternative<
  BaseOptions extends ComponentOptions,
  ResolvedData extends ComponentData,
  BaseError,
  Id extends string,
>(
  baseComponent: ServerComponentSchema<BaseOptions, ResolvedData, BaseError, Id>
): ServerComponentSchema<
  AlternativeOptions<BaseOptions, Id>,
  AlternativeData<ResolvedData>,
  AlternativeError<BaseError>,
  'base::alternative',
  ResolvedData,
  AlternativeClientData
> {
  return {
    controller: Alternative as unknown as ComponentController<
      AlternativeOptions<BaseOptions, Id>,
      AlternativeData<ResolvedData>,
      AlternativeError<BaseError>,
      'base::alternative',
      ResolvedData,
      AlternativeClientData
    >,
    options: {
      baseOptions: baseComponent.options,
      componentId: baseComponent.controller.meta.id,
    },
  };
}
