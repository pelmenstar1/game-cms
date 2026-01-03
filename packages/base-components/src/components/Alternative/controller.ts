import {
  ConditionalValueInput,
  resolveConditionalData,
} from '@game-cms/conditional';
import { component } from '@game-cms/core';

import { defaultRawData, meta, validator } from './shared.js';

export default component<'base::alternative'>({
  meta,
  defaultRawData,
  validator,
  resolver: (raw, _options, _context, args) => {
    return resolveConditionalData(raw, args as ConditionalValueInput);
  },
});
