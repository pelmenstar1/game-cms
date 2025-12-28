import { componentDataValidator } from '@game-cms/utils';

export const validator = componentDataValidator<'base::compose'>(
  (data, options, context) => {
    const entries = Object.entries(options).map(
      ([key, { componentId, options }]) =>
        [key, context.data(componentId, data[key], options)] as const
    );

    if (entries.some(([, value]) => value !== undefined)) {
      return Object.fromEntries(entries);
    }
  }
);
