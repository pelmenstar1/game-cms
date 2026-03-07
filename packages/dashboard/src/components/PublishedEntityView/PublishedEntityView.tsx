import { getRawEntityDocumentById } from '@game-cms/base-api/client';
import {
  EntityComposeOptions,
  transformDataToClientData,
  useApiQuery,
} from '@game-cms/base-components/micro';
import type { EntityId } from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import { DataLoader, Typography } from '@game-cms/ui';
import { useEffect } from 'react';

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

  const Compose = api.getComponent('base::compose');

  useEffect(() => {
    if (dataResult.status === 'success' && dataResult.value === null) {
      onUnpublished?.();
    }
  }, [dataResult, onUnpublished]);

  return (
    <DataLoader className={className} result={dataResult}>
      {(data) =>
        data !== null ? (
          <Compose
            data={transformDataToClientData(api, data.components, options)}
            options={options}
            readonly
          />
        ) : (
          <Typography weight="bold" variant="bodyLarge">
            Entity is not published
          </Typography>
        )
      }
    </DataLoader>
  );
}
