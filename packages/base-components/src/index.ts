import {
  ComponentController,
  ComponentData,
  ComponentOptions,
  ServerComponentSchema,
} from '@game-cms/types';

import Number from './Number';
import Text from './Text';

function componentAccessor<
  Options extends ComponentOptions,
  Data extends ComponentData,
  Id extends string,
>(controller: ComponentController<Options, Data, Id>) {
  return (
    input: Omit<ServerComponentSchema<Options, Data, Id>, 'controller'>
  ) => {
    return { controller, ...input };
  };
}

export const text = componentAccessor(Text);
export const number = componentAccessor(Number);
