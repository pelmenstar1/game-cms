import { componentMeta } from '@game-cms/utils';

import { AlternativeData, AlternativeOptions } from './types.js';

export default componentMeta({
  id: 'base::alternative',
  defaultData: (options: AlternativeOptions, context): AlternativeData => ({
    default: context.data(options.componentId, options.baseOptions),
    alternative: [],
  }),
});
