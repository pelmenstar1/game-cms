import {
  componentCore,
  ComponentErrorById,
  ComponentRawInDataById,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

function isRawInData(
  data: unknown
): data is ComponentRawInDataById<'base::alternative'> {
  return (
    isNonNullObject(data) &&
    'default' in data &&
    Array.isArray((data as { alternative?: unknown }).alternative)
  );
}

export default componentCore({
  id: 'base::alternative',
  defaultRawData: (options, context) => ({
    default: context.getDefaultData(options.componentId, options.baseOptions),
    alternative: [],
  }),
  validator: (data, options, context) => {
    if (!isRawInData(data)) {
      return { ownError: 'INVALID_TYPE' as const };
    }

    const { componentId, baseOptions } = options;

    const result: ComponentErrorById<'base::alternative'> = {
      default: context.validate(componentId, data.default, baseOptions),
      alternative: data.alternative.map((item) => ({
        condition: undefined,
        data: context.validate(componentId, item.value, baseOptions),
      })),
    };

    if (
      result.default !== undefined ||
      result.alternative?.some((item) => item.data !== undefined)
    ) {
      return result;
    }
  },
});
