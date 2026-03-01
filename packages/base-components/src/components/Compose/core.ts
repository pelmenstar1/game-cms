import {
  ComponentDataValidatorParams,
  ComponentErrorById,
  ComponentOptionsById,
  defineComponentCore,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { mapObject } from '@game-cms/shared/object';

export default defineComponentCore({
  id: 'base::compose',
  defaultOutData: (options, context) => {
    return mapObject(options, (item) =>
      context.getDefaultData(item.componentId, item.options)
    );
  },
  pathWalker: (data, options, path, apply, context) => {
    const dotIndex = path.indexOf('.');

    if (dotIndex !== -1) {
      const prefix = path.slice(0, dotIndex);
      const suffix = path.slice(dotIndex + 1);

      const value = data[prefix];
      const { componentId, options: baseOptions } = options[prefix];

      context.applyAtPath(componentId, value, baseOptions, suffix, apply);
    } else {
      apply(data[path]);
    }
  },
  validator: <Args>(
    data: unknown,
    options: ComponentOptionsById<'base::compose', Args>,
    context: ForeignComponentValidationContext,
    params?: ComponentDataValidatorParams
  ) => {
    if (!isNonNullObject(data)) {
      return { ownError: 'INVALID_TYPE' as const };
    }

    const entries = Object.entries(options).map(
      ([key, { componentId, options }]) => {
        const propValue = data[key];
        if (propValue === undefined && params?.partial) {
          return [key, undefined] as const;
        }

        const error = context.validate(componentId, propValue, options, params);

        return [key, error] as const;
      }
    );

    if (entries.some(([, value]) => value !== undefined)) {
      return { properties: Object.fromEntries(entries) } as ComponentErrorById<
        'base::compose',
        Args
      >;
    }
  },
});
