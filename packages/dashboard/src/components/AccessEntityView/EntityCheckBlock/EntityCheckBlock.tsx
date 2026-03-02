import {
  EntityCheckClientDataMap,
  EntityCheckId,
  EntityId,
} from '@game-cms/base-core';
import { createCachedFactory } from '@game-cms/shared';
import React from 'react';

import { getEntityCheckRenderer } from '@/connector/entityCheck';

export type EntityCheckBlockProps = {
  data: EntityCheckClientDataMap;
  entityId: EntityId;
  documentId: string;
};

const getComponent = createCachedFactory(
  <Id extends EntityCheckId>(checkId: Id) => {
    return React.lazy(async () => {
      const renderer = await getEntityCheckRenderer(checkId);
      if (!renderer) {
        return { default: () => null };
      }

      return { default: renderer };
    });
  }
);

export function EntityCheckBlock({
  data,
  entityId,
  documentId,
}: EntityCheckBlockProps) {
  return (
    <div>
      {Object.entries(data).map(([checkId, checkData]) => {
        const Component = getComponent(checkId);

        return (
          <Component
            key={checkId}
            data={checkData}
            entityId={entityId}
            documentId={documentId}
          />
        );
      })}
    </div>
  );
}
