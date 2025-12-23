import { ComponentData } from '@game-cms/types';
import { component } from '@game-cms/utils';

import { id } from './meta';
import { RepeatableOptions } from './types';
import { validator } from './validator';

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
    data: () => [],
  },
});
