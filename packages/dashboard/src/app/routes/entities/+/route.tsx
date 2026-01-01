import type { EntityData } from '@game-cms/base-types';
import { createEntity, getEntitySchema } from '@game-cms/client';
import { useApiAction, useApiQuery } from '@game-cms/component-api';
import { DataLoader, useNotification, useTypedNavigate } from '@game-cms/ui';
import { useCallback } from 'react';

import { AccessEntityView } from '@/components/AccessEntityView';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export default function Page({ params }: Route.ComponentProps) {
  const [entitySchema] = useApiQuery(getEntitySchema, [params.name], {
    redirectOnNotFound: true,
  });

  const notification = useNotification();
  const redirect = useTypedNavigate();

  const doCreateEntity = useApiAction(createEntity);

  const onSave = useCallback(
    (data: EntityData) => {
      doCreateEntity(params.name, data)
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
      {(entitySchema) => (
        <AccessEntityView schema={entitySchema} onSave={onSave} />
      )}
    </DataLoader>
  );
}
