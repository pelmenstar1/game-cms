import { mapObject } from '@game-cms/shared/object';
import { ForeignComponentContext } from '@game-cms/types';
import { componentMeta } from '@game-cms/utils';

import { ComposeOptions } from './types.js';

export default componentMeta({
  id: 'base::compose',
  defaultData: (
    options: ComposeOptions,
    context: ForeignComponentContext['default']
  ) =>
    mapObject(options, (item) => context.data(item.componentId, item.options)),
});
