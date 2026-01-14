import type { EntityData } from '@game-cms/base-core';
import {
  deleteEntityById,
  getRawEntityById,
  updateEntityById,
} from '@game-cms/client';
import { useApiAction, useApiQuery } from '@game-cms/component-api';
import {
  MultipleDataLoader,
  useNotification,
  useTypedNavigate,
} from '@game-cms/ui';
import { useCallback } from 'react';

import { AccessEntityView } from '@/components/AccessEntityView';
import { useCheckPermissions } from '@/hooks/useCheckPermissions';
import { useEntitySchema } from '@/hooks/useEntitySchema';

import type { Route } from './+types/route';
import styles from './route.module.scss';

export default function Page({ params }: Route.ComponentProps) {
  const { id, name } = params;

  const entitySchema = useEntitySchema(name);

  const [entity] = useApiQuery(getRawEntityById, [name, id], {
    redirectOnNotFound: true,
  });

  const notification = useNotification();
  const redirect = useTypedNavigate();

  const doUpdateEntity = useApiAction(updateEntityById);
  const doDeleteEntity = useApiAction(deleteEntityById);

  useCheckPermissions(`entity/${id}$update`);

  const onSave = useCallback(
    (data: EntityData) => {
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
      className={styles.content}
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
