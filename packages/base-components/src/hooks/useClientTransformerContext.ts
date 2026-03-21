import { EntityId } from '@game-cms/base-core';
import { ForeignComponentClientDataTransformerContext } from '@game-cms/core';
import { QueryResult } from '@game-cms/shared';
import { useAbstractQueryResult } from '@game-cms/ui';

import { useEntityHub } from '../shared.js';

export function useClientTransformerContext(
  id: EntityId
): QueryResult<ForeignComponentClientDataTransformerContext> {
  const { getClientDataResolverContext } = useEntityHub();

  return useAbstractQueryResult(
    () => getClientDataResolverContext(id),
    [getClientDataResolverContext, id]
  );
}
