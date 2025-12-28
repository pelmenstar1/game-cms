import { ComponentErrorById } from '@game-cms/types';
import { componentDataValidator } from '@game-cms/utils';

export const validator = componentDataValidator<'base::alternative'>(
  (data, options, context) => {
    const { componentId, baseOptions } = options;

    const result: ComponentErrorById<'base::alternative'> = {
      default: context.data(componentId, data.default, baseOptions),
      alternative: data.alternative.map((item) => ({
        condition: undefined,
        data: context.data(componentId, item, baseOptions),
      })),
    };

    if (
      result.default !== undefined ||
      result.alternative.some((item) => item.data !== undefined)
    ) {
      return result;
    }
  }
);
