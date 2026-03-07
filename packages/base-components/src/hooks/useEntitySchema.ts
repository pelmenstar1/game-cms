import type { EntityId, EntitySchemaById } from '@game-cms/base-core';
import { QueryResult } from '@game-cms/shared';
import { useAbstractQueryResult } from '@game-cms/ui';

import { useEntitySchemaContext } from './useEntitySchemaContext.js';

export function useEntitySchema<T extends EntityId>(
  id: T
): QueryResult<EntitySchemaById<T>> {
  const { getEntitySchemaById } = useEntitySchemaContext();

  return useAbstractQueryResult(
    () => getEntitySchemaById(id),
    [getEntitySchemaById, id]
  );
}
