import { EntityClientContext, EntityId } from '@game-cms/base-core';
import { QueryResult } from '@game-cms/shared';
import { useAbstractQueryResult } from '@game-cms/ui';

import { useEntitySchemaContext } from './useEntitySchemaContext.js';

export function useEntitySharedContext(
  id: EntityId
): QueryResult<EntityClientContext | undefined> {
  const { getEntitySharedContext } = useEntitySchemaContext();

  return useAbstractQueryResult(
    () => getEntitySharedContext(id),
    [getEntitySharedContext, id]
  );
}
