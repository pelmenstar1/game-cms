import { ComponentData } from '@game-cms/types';
import { component } from '@game-cms/utils';

import { defaultData, id } from './meta.js';
import { RepeatableOptions } from './types.js';
import { validator } from './validator.js';

export default component<
  RepeatableOptions,
  ComponentData[],
  unknown[],
  typeof id
>({
  id,
  validation: {
    data: validator,
  },
  default: {
    data: defaultData,
  },
});
