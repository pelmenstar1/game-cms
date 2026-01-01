import {
  ComponentDataResolverArgs,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentResolvedDataById,
  ForeignComponentDataResolverContext,
} from '@game-cms/types';
import { component } from '@game-cms/utils';

import meta from './meta.js';
import { validator } from './validator.js';

type Id = (typeof meta)['id'];

export default component({
  meta,
  validator,
  resolver: <Args>(
    raw: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentDataResolverContext,
    args: ComponentDataResolverArgs
  ) => {
    return raw.map((item) => {
      const { componentId, options: baseOptions } = options[item.key];

      return context.resolveRawData(componentId, item.data, baseOptions, args);
    }) as ComponentResolvedDataById<Id, Args>;
  },
});
