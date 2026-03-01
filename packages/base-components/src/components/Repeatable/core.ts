import { defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'base::repeatable',
  defaultOutData: () => [],
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
  pathWalker: (data, options, path, apply, context) => {
    const { componentId, baseOptions } = options;

    for (const item of data) {
      context.applyAtPath(componentId, item, baseOptions, path, apply);
    }
  },
});
