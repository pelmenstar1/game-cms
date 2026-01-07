import type { EntityData } from '@game-cms/base-core';
import { createEntity } from '@game-cms/client';
import { useApiAction } from '@game-cms/component-api';
import { useNotification, useTypedNavigate } from '@game-cms/ui';
import { useCallback } from 'react';

import { AccessEntityView } from '@/components/AccessEntityView';
import { getEntitySchemaById } from '@/connector/entity';

import type { Route } from './+types/route';

export default function Page({ params }: Route.ComponentProps) {
  const entitySchema = getEntitySchemaById(params.name);

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

  return <AccessEntityView schema={entitySchema} onSave={onSave} />;
}
