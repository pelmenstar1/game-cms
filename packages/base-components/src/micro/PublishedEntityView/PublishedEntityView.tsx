import { getRawEntityDocumentById } from '@game-cms/base-api/client';
import type { EntityId } from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import { MultipleDataLoader, Typography } from '@game-cms/ui';
import { useEffect } from 'react';

import { useApiQuery } from '../../hooks/useApiQuery.js';
import { useClientTransformerContext } from '../../hooks/useClientTransformerContext.js';
import {
  EntityComposeOptions,
  transformDataToClientData,
} from '../../utils/entity.js';

export interface PublishedEntityViewProps<T extends EntityId> {
  className?: string;
  entityId: T;
  id: string;
  options: EntityComposeOptions<T>;

  onUnpublished?: () => void;
}

export function PublishedEntityView<T extends EntityId>({
  className,
  entityId,
  id,
  options,
  onUnpublished,
}: PublishedEntityViewProps<T>) {
  const [dataResult] = useApiQuery(
    getRawEntityDocumentById<T>,
    [entityId, id, 'published'],
    {
      nullIfNotFound: true,
    }
  );

  const api = useComponentApi();
  const clientTransformerContextResult = useClientTransformerContext(entityId);

  const Compose = api.getDefaultRenderer('base::compose');

  useEffect(() => {
    if (dataResult.status === 'success' && dataResult.value === null) {
      onUnpublished?.();
    }
  }, [dataResult, onUnpublished]);

  return (
    <MultipleDataLoader
      className={className}
      result={[dataResult, clientTransformerContextResult] as const}
    >
      {([data, clientTransformerContext]) =>
        data !== null ? (
          <Compose
            data={transformDataToClientData(
              clientTransformerContext,
              data.components,
              options
            )}
            options={options}
            readonly
          />
        ) : (
          <Typography weight="bold" variant="bodyLarge">
            Entity is not published
          </Typography>
        )
      }
    </MultipleDataLoader>
  );
}
