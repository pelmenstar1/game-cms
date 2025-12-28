import {
  ConditionalValueInput,
  resolveConditionalData,
} from '@game-cms/conditional';
import { component } from '@game-cms/utils';

import meta from './meta.js';
import { validator } from './validator.js';

export default component<'base::alternative'>({
  meta,
  validator,
  resolver: (raw, _options, _context, args) => {
    return resolveConditionalData(raw, args as ConditionalValueInput);
  },
});
