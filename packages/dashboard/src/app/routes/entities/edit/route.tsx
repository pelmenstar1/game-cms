import type { EntityData } from '@game-cms/base-types';
import {
  deleteEntityById,
  getRawEntityById,
  updateEntityById,
} from '@game-cms/client';
import { useApiAction, useApiQuery } from '@game-cms/component-api';
import { DataLoader, useNotification, useTypedNavigate } from '@game-cms/ui';
import { useCallback } from 'react';
import { getEntitySchemaById } from 'virtual:dashboard/entityConnector';

import { AccessEntityView } from '@/components/AccessEntityView';

import type { Route } from './+types/route';

export default function Page({ params }: Route.ComponentProps) {
  const { id, name } = params;
  const entitySchema = getEntitySchemaById(name);

  const [entity] = useApiQuery(getRawEntityById, [name, id], {
    redirectOnNotFound: true,
  });

  const notification = useNotification();
  const redirect = useTypedNavigate();

  const doUpdateEntity = useApiAction(updateEntityById);
  const doDeleteEntity = useApiAction(deleteEntityById);

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
    <DataLoader result={entity}>
      {(entity) => (
        <AccessEntityView
          schema={entitySchema}
          initialValue={entity}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </DataLoader>
  );
}
