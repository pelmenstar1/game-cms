import type {
  ComponentController,
  ComponentData,
  ComponentOptions,
  ServerComponentSchema,
} from '@game-cms/types';

export function componentAccessor<
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
