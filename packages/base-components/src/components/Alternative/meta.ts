import { componentMeta } from '@game-cms/core';

export default componentMeta({
  id: 'base::alternative',
  defaultRawData: (options, context) => ({
    default: context.getDefault(options.componentId, options.baseOptions),
    alternative: [],
  }),
});
