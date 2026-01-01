import {
  ComponentDataValidator,
  ComponentErrorById,
  ComponentOptionsById,
  ComponentRawDataById,
  ForeignComponentValidationContext,
} from '@game-cms/types';

type Id = 'base::dynamic-zone';

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
