import type { EntityId } from '@game-cms/base-core';
import { useAbstractQueryResult } from '@game-cms/ui';

import { getEntitySchemaById } from '@/connector/entity';

export function useEntitySchema<T extends EntityId>(id: T) {
  return useAbstractQueryResult(() => getEntitySchemaById(id), [id]);
}
