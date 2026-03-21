import { getEntitySchema } from '@game-cms/base-api/client';
import type { EntityClientSchemaById, EntityId } from '@game-cms/base-core';
import { QueryResult } from '@game-cms/shared';

import { useApiQuery } from './useApiQuery.js';

export function useEntitySchema<T extends EntityId>(
  id: T
): QueryResult<EntityClientSchemaById<T>> {
  const [schemaResult] = useApiQuery(getEntitySchema, [id]);

  return schemaResult;
}
