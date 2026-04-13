import type {
  EntityCheckClientDataMap,
  EntityId,
  EntityVariant,
} from '@game-cms/base-core';
import { useEffect, useState } from 'react';

import { useEntityCheckContext } from './useEntityCheckContext.js';

export function useEntityChecksAllowed(
  entityId: EntityId,
  documentId: string | undefined,
  checks: EntityCheckClientDataMap | undefined
): Record<EntityVariant, boolean> {
  const entityCheckContext = useEntityCheckContext();

  const [checksAllowed, setChecksAllowed] = useState<
    Record<EntityVariant, boolean>
  >({ draft: true, published: true });

  useEffect(() => {
    if (!checks || !documentId) {
      setChecksAllowed({ draft: true, published: true });
      return;
    }

    void Promise.all(
      Object.entries(checks).map(async ([checkId, data]) => {
        const controller =
          await entityCheckContext.getClientController(checkId);
        const isAllowed = controller?.isAllowed;

        if (isAllowed === undefined) {
          return { draft: true, published: true };
        }

        return {
          draft: isAllowed({
            entityId,
            documentId,
            data,
            documentVariant: 'draft',
          }),
          published: isAllowed({
            entityId,
            documentId,
            data,
            documentVariant: 'published',
          }),
        };
      })
    ).then((results) => {
      setChecksAllowed({
        draft: results.every((r) => r.draft),
        published: results.every((r) => r.published),
      });
    });
  }, [entityCheckContext, entityId, documentId, checks]);

  return checksAllowed;
}
