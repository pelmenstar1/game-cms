import { createEntity } from '@game-cms/base-api/client';
import type {
  EntityClientInstanceData,
  EntityVariant,
} from '@game-cms/base-core';
import { useApiAction } from '@game-cms/component-api';
import { DataLoader, useNotification, useTypedNavigate } from '@game-cms/ui';
import { useCallback } from 'react';

import { AccessEntityView } from '@/components/AccessEntityView';
import { useCheckPermissions } from '@/hooks/useCheckPermissions';
import { useEntitySchema } from '@/hooks/useEntitySchema';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export default function Page({ params }: Route.ComponentProps) {
  const entitySchema = useEntitySchema(params.name);

  const notification = useNotification();
  const redirect = useTypedNavigate();

  const doCreateEntity = useApiAction(createEntity);

  useCheckPermissions(`entity/${params.name}$create`);

  const onSave = useCallback(
    (data: EntityClientInstanceData, variant: EntityVariant) => {
      doCreateEntity(params.name, data, variant)
        .then(() => {
          void redirect('/entities');

          notification.info('Entity added');
        })
        .catch(() => {
          notification.error('Failed to add an entity');
        });
    },
    [doCreateEntity, notification, params.name, redirect]
  );

  return (
    <DataLoader className={styles.root} result={entitySchema}>
      {(schema) => (
        <AccessEntityView
          entityId={params.name}
          schema={schema}
          onSave={onSave}
        />
      )}
    </DataLoader>
  );
}
