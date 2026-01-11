import type { EntityId, EntitySchemaById } from '@game-cms/base-core';
import { pendingQueryResult, type QueryResult } from '@game-cms/shared';
import { useEffect, useState } from 'react';

import { getEntitySchemaById } from '@/connector/entity';

export function useEntitySchema<T extends EntityId>(id: T) {
  const [result, setResult] =
    useState<QueryResult<EntitySchemaById<T>>>(pendingQueryResult());

  useEffect(() => {
    getEntitySchemaById(id)
      .then((value) => {
        setResult({ status: 'success', value });
      })
      .catch((error: unknown) => {
        setResult({ status: 'error', error });
      });
  }, [id]);

  return result;
}
