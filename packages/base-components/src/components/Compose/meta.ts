import { mapObject } from '@game-cms/shared/object';
import { componentMeta } from '@game-cms/utils';

export default componentMeta({
  id: 'base::compose',
  defaultData: (options, context) =>
    mapObject(options, (item) => context.data(item.componentId, item.options)),
});
