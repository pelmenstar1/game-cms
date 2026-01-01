import { mapObject } from '@game-cms/shared/object';
import { componentMeta } from '@game-cms/utils';

export default componentMeta({
  id: 'base::compose',
  defaultRawData: (options, context) =>
    mapObject(options, (item) =>
      context.getDefault(item.componentId, item.options)
    ),
});
