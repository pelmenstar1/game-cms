import { componentDataValidator } from '@game-cms/utils';

import { NumberData, NumberOptions } from './types.js';

export const validator = componentDataValidator(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_data: NumberData, _options: NumberOptions) => undefined
);
