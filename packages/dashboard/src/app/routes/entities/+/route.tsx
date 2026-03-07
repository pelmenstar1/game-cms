import { createEntity } from '@game-cms/base-api/client';
import {
  useApiAction,
  useCheckPermissions,
  useEntitySchema,
} from '@game-cms/base-components/micro';
import type {
  EntityInstanceComponents,
  EntityVariant,
} from '@game-cms/base-core';
import { DataLoader, useNotification, useTypedNavigate } from '@game-cms/ui';
import { useCallback } from 'react';

import { AccessEntityView } from '@/components/AccessEntityView';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export default function Page({ params }: Route.ComponentProps) {
  const { name } = params;

  const entitySchema = useEntitySchema(name);

  const notification = useNotification();
  const redirect = useTypedNavigate();

  const doCreateEntity = useApiAction(createEntity);

  useCheckPermissions(`entity/${name}$create`);

  const onSave = useCallback(
    (data: EntityInstanceComponents, variant: EntityVariant) => {
      doCreateEntity(name, data, variant)
        .then(() => {
          void redirect(`/entities/${name}`);

          notification.info('Entity added');
        })
        .catch(() => {
          notification.error('Failed to add an entity');
        });
    },
    [doCreateEntity, notification, name, redirect]
  );

  return (
    <DataLoader className={styles.root} result={entitySchema}>
      {(schema) => (
        <AccessEntityView entityId={name} schema={schema} onSave={onSave} />
      )}
    </DataLoader>
  );
}
