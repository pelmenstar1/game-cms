import {
  deleteEntityById,
  getEntitySchema,
  getRawEntityById,
  updateEntityById,
} from '@game-cms/client';
import type { EntityConditionalData } from '@game-cms/conditional';
import { useNotification } from '@game-cms/ui';
import { useCallback } from 'react';

import { AccessEntityView } from '@/components/AccessEntityView';
import { MultipleDataLoader } from '@/components/MultipleDataLoader';
import { useApiAction } from '@/hooks/useApiAction';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useTypedNavigate } from '@/hooks/useTypedNavigate';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export default function Page({ params }: Route.ComponentProps) {
  const { id, name } = params;
  const [entitySchema] = useApiQuery(getEntitySchema, [name], {
    redirectOnNotFound: true,
  });

  const [entity] = useApiQuery(getRawEntityById, [name, id], {
    redirectOnNotFound: true,
  });

  const notification = useNotification();
  const redirect = useTypedNavigate();

  const doUpdateEntity = useApiAction(updateEntityById);
  const doDeleteEntity = useApiAction(deleteEntityById);

  const onSave = useCallback(
    (data: EntityConditionalData) => {
      doUpdateEntity(name, id, data)
        .then(() => {
          void redirect('/entities');

          notification.info('Entity updated');
        })
        .catch(() => {
          notification.error('Failed to update an entity');
        });
    },
    [doUpdateEntity, notification, name, id, redirect]
  );

  const onDelete = useCallback(() => {
    doDeleteEntity(name, id)
      .then(() => {
        void redirect('/entities');

        notification.info('Entity deleted');
      })
      .catch(() => {
        notification.error('Failed to delete the entity');
      });
  }, [doDeleteEntity, id, name, notification, redirect]);

  return (
    <MultipleDataLoader
      className={styles.root}
      result={[entitySchema, entity] as const}
    >
      {([entitySchema, entity]) => (
        <AccessEntityView
          schema={entitySchema}
          initialValue={entity}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </MultipleDataLoader>
  );
}
