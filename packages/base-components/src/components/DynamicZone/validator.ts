import {
  ComponentDataById,
  ComponentDataValidator,
  ComponentErrorById,
  ComponentOptionsById,
  ForeignComponentContext,
} from '@game-cms/types';

type Id = 'base::dynamic-zone';

export const validator: ComponentDataValidator<Id> = <Args>(
  data: ComponentDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentContext['validation']
) => {
  const errors = data.map((dataItem) => {
    const { componentId, options: baseOptions } = options[dataItem.key];

    return context.data(componentId, dataItem.data, baseOptions);
  });

  return errors.every((element) => element === undefined)
    ? undefined
    : (errors as ComponentErrorById<'base::dynamic-zone', Args>);
};
