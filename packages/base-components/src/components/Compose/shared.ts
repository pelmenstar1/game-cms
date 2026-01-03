import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  ComponentErrorById,
  componentMeta,
  ComponentOptionsById,
  ComponentRawDataById,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

const id = 'base::compose';

type Id = typeof id;

export const meta = componentMeta({
  id,
});

export const defaultRawData: ComponentDefaultDataHandler<Id> = (
  options,
  context
) => {
  return mapObject(options, (item) =>
    context.getDefault(item.componentId, item.options)
  );
};

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
