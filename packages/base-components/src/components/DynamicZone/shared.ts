import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  ComponentErrorById,
  componentMeta,
  ComponentOptionsById,
  ComponentRawDataById,
  ForeignComponentValidationContext,
} from '@game-cms/core';

const id = 'base::dynamic-zone';

type Id = typeof id;

export const meta = componentMeta({ id });

export const defaultRawData: ComponentDefaultDataHandler<Id> = [];

export const validator: ComponentDataValidator<Id> = <Args>(
  data: ComponentRawDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentValidationContext
) => {
  const errors = data.map((dataItem) => {
    const { componentId, options: baseOptions } = options[dataItem.key];

    return context.validate(componentId, dataItem.data, baseOptions);
  });

  return errors.every((element) => element === undefined)
    ? undefined
    : (errors as ComponentErrorById<'base::dynamic-zone', Args>);
};
