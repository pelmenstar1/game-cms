import {
  ComponentDataValidator,
  ComponentErrorById,
  ComponentOptionsById,
  ComponentRawDataById,
  ForeignComponentValidationContext,
} from '@game-cms/types';

type Id = 'base::compose';

export const validator: ComponentDataValidator<Id> = <Args>(
  data: ComponentRawDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentValidationContext
) => {
  const entries = Object.entries(options).map(
    ([key, { componentId, options }]) =>
      [key, context.validate(componentId, data[key], options)] as const
  );

  if (entries.some(([, value]) => value !== undefined)) {
    return Object.fromEntries(entries) as ComponentErrorById<Id, Args>;
  }
};
