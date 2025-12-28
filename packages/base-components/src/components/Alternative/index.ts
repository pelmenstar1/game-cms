import {
  ConditionalValueInput,
  resolveConditionalData,
} from '@game-cms/conditional';
import { ComponentData } from '@game-cms/types';
import { component } from '@game-cms/utils';

import meta from './meta.js';
import {
  AlternativeClientData,
  AlternativeData,
  AlternativeError,
  AlternativeOptions,
} from './types.js';
import { validator } from './validator.js';

export default component<
  AlternativeOptions,
  AlternativeData,
  AlternativeError,
  'base::alternative',
  ComponentData,
  AlternativeClientData
>({
  meta,
  validator,
  resolver: (raw, _options, _context, args) => {
    return resolveConditionalData(raw, args as ConditionalValueInput);
  },
});
