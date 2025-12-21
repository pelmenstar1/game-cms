import { createEntity, getEntitySchema } from '@game-cms/client';
import type { EntityConditionalData } from '@game-cms/conditional';
import { useNotification } from '@game-cms/ui';
import { useCallback } from 'react';

import { AccessEntityView } from '@/components/AccessEntityView';
import { DataLoader } from '@/components/DataLoader';
import { useApiAction } from '@/hooks/useApiAction';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useTypedNavigate } from '@/hooks/useTypedNavigate';

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
    (data: EntityConditionalData) => {
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
