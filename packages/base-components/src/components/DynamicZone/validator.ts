import { componentDataValidator } from '@game-cms/utils';

export const validator = componentDataValidator<'base::dynamic-zone'>(
  (data, options, context) => {
    const errors = data.map((dataItem) => {
      const { componentId, options: baseOptions } = options[dataItem.key];

      return context.data(componentId, dataItem.data, baseOptions);
    });

    return errors.every((element) => element === undefined)
      ? undefined
      : errors;
  }
);
