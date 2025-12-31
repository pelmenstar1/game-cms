import {
  ComponentDataById,
  ComponentDataValidator,
  ComponentErrorById,
  ComponentOptionsById,
  ForeignComponentContext,
} from '@game-cms/types';

type Id = 'base::compose';

export const validator: ComponentDataValidator<Id> = <Args>(
  data: ComponentDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentContext['validation']
) => {
  const entries = Object.entries(options).map(
    ([key, { componentId, options }]) =>
      [key, context.data(componentId, data[key], options)] as const
  );

  if (entries.some(([, value]) => value !== undefined)) {
    return Object.fromEntries(entries) as ComponentErrorById<Id, Args>;
  }
};
