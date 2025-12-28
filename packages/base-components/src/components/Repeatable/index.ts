import { component } from '@game-cms/utils';

import meta from './meta.js';
import { validator } from './validator.js';

export default component({
  meta,
  validator,
  resolver: (raw, options, context, args) => {
    const { baseOptions, componentId } = options;

    return raw.map((item) =>
      context.data(componentId, item, baseOptions, args)
    );
  },
});
