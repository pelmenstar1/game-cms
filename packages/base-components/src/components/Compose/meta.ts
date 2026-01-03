import { componentMeta } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

export default componentMeta({
  id: 'base::compose',
  defaultRawData: (options, context) =>
    mapObject(options, (item) =>
      context.getDefault(item.componentId, item.options)
    ),
});
