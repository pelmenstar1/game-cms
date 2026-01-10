import {
  componentCore,
  ComponentErrorById,
  ComponentOptionsById,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { mapObject } from '@game-cms/shared/object';

export default componentCore({
  id: 'base::compose',
  defaultRawData: (options, context) => {
    return mapObject(options, (item) =>
      context.getDefaultData(item.componentId, item.options)
    );
  },
  validator: <Args>(
    data: unknown,
    options: ComponentOptionsById<'base::compose', Args>,
    context: ForeignComponentValidationContext
  ) => {
    if (!isNonNullObject(data)) {
      return { ownError: 'INVALID_TYPE' as const };
    }

    const entries = Object.entries(options).map(
      ([key, { componentId, options }]) =>
        [
          key,
          context.validate(
            componentId,
            (data as Record<string, unknown>)[key],
            options
          ),
        ] as const
    );

    if (entries.some(([, value]) => value !== undefined)) {
      return { properties: Object.fromEntries(entries) } as ComponentErrorById<
        'base::compose',
        Args
      >;
    }
  },
});
