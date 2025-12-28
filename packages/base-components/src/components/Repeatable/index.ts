import { ComponentData } from '@game-cms/types';
import { component } from '@game-cms/utils';

import meta from './meta.js';
import { RepeatableOptions } from './types.js';
import { validator } from './validator.js';

export default component<
  RepeatableOptions,
  ComponentData[],
  unknown[],
  (typeof meta)['id']
>({
  meta,
  validator,
  resolver: (raw, options, context, args) => {
    const { base, controller } = options;

    return raw.map((item) => context.data(controller, item, base, args));
  },
});
