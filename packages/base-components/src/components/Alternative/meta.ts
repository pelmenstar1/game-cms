import { componentMeta } from '@game-cms/utils';

export default componentMeta({
  id: 'base::alternative',
  defaultData: (options, context) => ({
    default: context.data(options.componentId, options.baseOptions),
    alternative: [],
  }),
});
