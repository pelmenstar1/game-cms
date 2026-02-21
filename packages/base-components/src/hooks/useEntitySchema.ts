import type { EntityId, EntitySchemaById } from '@game-cms/base-core';
import { QueryResult } from '@game-cms/shared';
import { useAbstractQueryResult } from '@game-cms/ui';
import { useContext } from 'react';

import { EntitySchemaContext } from '../context/EntitySchemaContext.js';

export function useEntitySchema<T extends EntityId>(
  id: T
): QueryResult<EntitySchemaById<T>> {
  const { getEntitySchemaById } = useContext(EntitySchemaContext);

  return useAbstractQueryResult(
    () => getEntitySchemaById(id),
    [getEntitySchemaById, id]
  );
}
