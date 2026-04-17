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
import { MultipleDataLoader } from '@game-cms/ui';
import { useCallback } from 'react';

import { useAccessEntity } from '../../../hooks/internal/useAccessEntity.js';
import { useApiQuery } from '../../../hooks/useApiQuery.js';
import { useCheckPermissions } from '../../../hooks/useCheckPermissions.js';
import { useClientTransformerContext } from '../../../hooks/useClientTransformerContext.js';
import { useEntitySchema } from '../../../hooks/useEntitySchema.js';
import { useEntitySharedContext } from '../../../hooks/useEntitySharedContext.js';
import { AccessEntityView } from '../../../micro/Entity/AccessEntityView/index.js';
import { entityCheckFailed } from '../../../utils/entityErrorHandlers/entityCheckFailed.js';
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

  const clientContext = useEntitySharedContext(id);
  const clientTransformerContext = useClientTransformerContext(name);

  const doUpdateEntity = useAccessEntity({
    queryFn: updateEntityById,
    redirectOnSuccess: `/entities/${name}`,
    messageOnSuccess: 'Entity updated',
    messageOnFailure: 'Failed to update the entity',
    errorHandlers: [entityCheckFailed],
  });

  const doDeleteEntity = useAccessEntity({
    queryFn: deleteEntityById,
    redirectOnSuccess: `/entities/${name}`,
    messageOnSuccess: 'Entity deleted',
    messageOnFailure: 'Failed to delete the entity',
  });

  const doUnpublishEntity = useAccessEntity({
    queryFn: unpublishEntity,
    redirectOnSuccess: `/entities/${name}`,
    messageOnSuccess: 'Entity unpublished',
    messageOnFailure: 'Failed to unpublish the entity',
  });

  useCheckPermissions(`entity/${name}$update`);

  const onSave = useCallback(
    (data: EntityInstanceComponents, variant: EntityVariant) => {
      doUpdateEntity(name, id, data, variant);
    },
    [doUpdateEntity, name, id]
  );

  const onDelete = useCallback(() => {
    doDeleteEntity(name, id);
  }, [doDeleteEntity, name, id]);

  const onUnpublish = useCallback(() => {
    doUnpublishEntity(name, id);
  }, [doUnpublishEntity, name, id]);

  return (
    <MultipleDataLoader
      className={styles.content}
      result={
        [entitySchema, entity, clientTransformerContext, clientContext] as const
      }
    >
      {([entitySchema, entity, clientTransformerContext, clientContext]) => (
        <AccessEntityView
          entityId={name}
          schema={entitySchema}
          initialValue={entity}
          initialId={id}
          clientTransformerContext={clientTransformerContext}
          onSave={onSave}
          onDelete={onDelete}
          onUnpublish={onUnpublish}
          clientContext={clientContext}
        />
      )}
    </MultipleDataLoader>
  );
}
