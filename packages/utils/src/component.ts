import type {
  ComponentController,
  ComponentData,
  ComponentDataValidator,
  ComponentMeta,
  ComponentOptions,
  ServerComponentSchema,
} from '@game-cms/types';

export function componentAccessor<
  Options extends ComponentOptions,
  Data extends ComponentData,
  Error,
  Id extends string,
>(controller: ComponentController<Options, Data, Error, Id>) {
  return (
    input: Omit<
      ServerComponentSchema<Options, Data, Error, Id>,
      'controller' | 'config'
    >
  ) => {
    return { controller, ...input };
  };
}

export function componentMeta<
  Options extends ComponentOptions,
  Data extends ComponentData,
  Id extends string,
>(value: ComponentMeta<Options, Data, Id>) {
  return value;
}

export function componentDataValidator<
  Options extends ComponentOptions,
  Data extends ComponentData,
  Error,
>(value: ComponentDataValidator<Options, Data, Error>) {
  return value;
}
