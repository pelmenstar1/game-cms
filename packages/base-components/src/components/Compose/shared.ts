import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  ComponentErrorById,
  componentMeta,
  ComponentOptionsById,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
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
    context.getDefaultData(item.componentId, item.options)
  );
};

export const validator: ComponentDataValidator<Id> = <Args>(
  data: unknown,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentValidationContext
) => {
  if (!isNonNullObject(data)) {
    return { ownError: 'INVALID_TYPE' };
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
};
