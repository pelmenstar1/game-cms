import {
  EntityCheckClientDataMap,
  EntityCheckId,
  EntityId,
} from '@game-cms/base-core';
import { createCachedFactory } from '@game-cms/shared';
import React from 'react';

import { EntityCheckContextType } from '../../../../context/EntityCheckContext.js';
import { useEntityCheckContext } from '../../../../hooks/useEntityCheckContext.js';

export type EntityCheckBlockProps = {
  data: EntityCheckClientDataMap;
  entityId: EntityId;
  documentId: string;
};

const getComponent = createCachedFactory(
  <Id extends EntityCheckId>(checkId: Id, context: EntityCheckContextType) => {
    return React.lazy(async () => {
      const controller = await context.getClientController(checkId);
      const renderer = await controller?.renderer?.();

      if (!renderer) {
        return { default: () => null };
      }

      return renderer;
    });
  }
);

export function EntityCheckBlock({
  data,
  entityId,
  documentId,
}: EntityCheckBlockProps) {
  const context = useEntityCheckContext();

  return (
    <div>
      {Object.entries(data).map(([checkId, checkData]) => {
        const Component = getComponent(checkId, context);
        const options = context.getOptions(checkId);

        return (
          <Component
            key={checkId}
            data={checkData}
            entityId={entityId}
            documentId={documentId}
            options={options}
          />
        );
      })}
    </div>
  );
}
