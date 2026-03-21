import { createEntity } from '@game-cms/base-api/client';
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
import { useCheckPermissions } from '../../../hooks/useCheckPermissions.js';
import { useClientTransformerContext } from '../../../hooks/useClientTransformerContext.js';
import { useEntitySchema } from '../../../hooks/useEntitySchema.js';
import { useEntitySharedContext } from '../../../hooks/useEntitySharedContext.js';
import { AccessEntityView } from '../../../micro/AccessEntityView/index.js';
import styles from './route.module.scss';

export default function Page({ params }: { params: { name: string } }) {
  const { name } = params;

  const entitySchema = useEntitySchema(name);
  const clientContext = useEntitySharedContext(name);
  const clientTransformerContext = useClientTransformerContext(name);

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
    <MultipleDataLoader
      className={styles.root}
      result={[entitySchema, clientTransformerContext, clientContext] as const}
    >
      {([schema, clientTransformerContext, clientContext]) => (
        <AccessEntityView
          entityId={name}
          schema={schema}
          clientTransformerContext={clientTransformerContext}
          clientContext={clientContext}
          onSave={onSave}
        />
      )}
    </MultipleDataLoader>
  );
}
