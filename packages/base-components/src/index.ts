import {
  ComponentController,
  ComponentData,
  ComponentOptions,
  ServerComponentSchema,
} from '@game-cms/types';
import { componentAccessor } from '@game-cms/utils';

import Number from './Number';
import Repeatable from './Repeatable';
import { RepeatableOptions } from './Repeatable/types';
import Text from './Text';

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
      controller: component.controller.id,
      base: component.options,
    },
  };
}
