import { createEntity } from '@game-cms/base-api/client';
import type {
  EntityInstanceComponents,
  EntityVariant,
} from '@game-cms/base-core';
import { MultipleDataLoader } from '@game-cms/ui';
import { useCallback } from 'react';

import { useAccessEntity } from '../../../hooks/internal/useAccessEntity.js';
import { useCheckPermissions } from '../../../hooks/useCheckPermissions.js';
import { useClientTransformerContext } from '../../../hooks/useClientTransformerContext.js';
import { useEntitySchema } from '../../../hooks/useEntitySchema.js';
import { useEntitySharedContext } from '../../../hooks/useEntitySharedContext.js';
import { AccessEntityView } from '../../../micro/Entity/AccessEntityView/index.js';
import { entityCheckFailed } from '../../../utils/entityErrorHandlers/entityCheckFailed.js';
import styles from './route.module.scss';

export default function Page({ params }: { params: { name: string } }) {
  const { name } = params;

  const entitySchema = useEntitySchema(name);
  const clientContext = useEntitySharedContext(name);
  const clientTransformerContext = useClientTransformerContext(name);

  const doCreateEntity = useAccessEntity({
    queryFn: createEntity,
    redirectOnSuccess: `/entities/${name}`,
    messageOnSuccess: 'Entity added',
    messageOnFailure: 'Failed to add an entity',
    errorHandlers: [entityCheckFailed],
  });

  useCheckPermissions(`entity/${name}$create`);

  const onSave = useCallback(
    (data: EntityInstanceComponents, variant: EntityVariant) => {
      doCreateEntity(name, data, variant);
    },
    [doCreateEntity, name]
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
