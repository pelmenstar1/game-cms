import { componentCore } from '@game-cms/core';

export default componentCore({
  id: 'base::repeatable',
  defaultRawData: () => [],
  validator: (data, options, context) => {
    if (!Array.isArray(data)) {
      return { ownError: 'INVALID_TYPE' as const };
    }

    const result = data.map((element) =>
      context.validate(options.componentId, element, options.baseOptions)
    );

    if (result.some((item) => item !== undefined)) {
      return { items: result };
    }
  },
});
