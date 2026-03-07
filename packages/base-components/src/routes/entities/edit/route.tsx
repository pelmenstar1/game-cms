import {
  deleteEntityById,
  getRawEntityDocumentById,
  unpublishEntity,
  updateEntityById,
} from '@game-cms/base-api/client';
import type {
  EntityInstanceComponents,
  EntityVariant,
} from '@game-cms/base-core';
import {
  MultipleDataLoader,
  useNotification,
  useTypedNavigate,
} from '@game-cms/ui';
import { useCallback } from 'react';

import { useApiAction } from '../../../hooks/useApiAction.js';
import { useApiQuery } from '../../../hooks/useApiQuery.js';
import { useCheckPermissions } from '../../../hooks/useCheckPermissions.js';
import { useEntitySchema } from '../../../hooks/useEntitySchema.js';
import { AccessEntityView } from '../../../micro/AccessEntityView/index.js';
import styles from './route.module.scss';

export default function Page({
  params,
}: {
  params: { id: string; name: string };
}) {
  const { id, name } = params;

  const entitySchema = useEntitySchema(name);

  const [entity] = useApiQuery(getRawEntityDocumentById, [name, id, 'draft'], {
    redirectOnNotFound: true,
  });

  const notification = useNotification();
  const redirect = useTypedNavigate();

  const doUpdateEntity = useApiAction(updateEntityById);
  const doDeleteEntity = useApiAction(deleteEntityById);
  const doUnpublishEntity = useApiAction(unpublishEntity);

  useCheckPermissions(`entity/${name}$update`);

  const onSave = useCallback(
    (data: EntityInstanceComponents, variant: EntityVariant) => {
      doUpdateEntity(name, id, data, variant)
        .then(() => {
          void redirect(`/entities/${name}`);

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

  const onUnpublish = useCallback(() => {
    doUnpublishEntity(name, id)
      .then(() => {
        void redirect('/entities');

        notification.info('Entity unpublished');
      })
      .catch(() => {
        notification.error('Failed to unpublish the entity');
      });
  }, [doUnpublishEntity, id, name, notification, redirect]);

  return (
    <MultipleDataLoader
      className={styles.content}
      result={[entitySchema, entity] as const}
    >
      {([entitySchema, entity]) => (
        <AccessEntityView
          entityId={name}
          schema={entitySchema}
          initialValue={entity}
          initialId={id}
          onSave={onSave}
          onDelete={onDelete}
          onUnpublish={onUnpublish}
        />
      )}
    </MultipleDataLoader>
  );
}
