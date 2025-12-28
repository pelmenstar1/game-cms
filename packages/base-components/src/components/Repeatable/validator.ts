import { componentDataValidator } from '@game-cms/utils';

export const validator = componentDataValidator<'base::repeatable'>(
  (data, options, context) => {
    const result = data.map((element) =>
      context.data(options.componentId, element, options.baseOptions)
    );

    return result.every((element) => element === undefined)
      ? undefined
      : result;
  }
);
