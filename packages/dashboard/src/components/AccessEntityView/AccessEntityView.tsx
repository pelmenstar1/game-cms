/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
import type {
  EntityCheckClientData,
  EntityId,
  EntityMap,
  EntityRawDataWithChecksById,
  EntityRawInDataById,
  EntitySchemaById,
  EntityVariant,
} from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import type { ComponentClientDataById } from '@game-cms/core';
import { classNames, DeleteIcon, IconButton, Typography } from '@game-cms/ui';
import { useCallback, useMemo, useState } from 'react';

import { useSelfSession } from '@/hooks/useSession';
import {
  type EntityComposeOptions,
  transformDataToClientData,
} from '@/services/entity/transform';

import { EntityReviewBlock } from '../EntityReviewBlock';
import { EntityVariantTabs } from '../EntityVariantTabs';
import styles from './AccessEntityView.module.scss';
import { ActionBlock } from './ActionBlock';

const composeId = 'base::compose';

type ComposeId = typeof composeId;

export interface AccessEntityViewProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  schema: EntitySchemaById<Id>;
  initialId?: string;
  initialValue?: EntityRawDataWithChecksById<Id>;
  onSave?: (value: EntityRawInDataById<Id>, variant: EntityVariant) => void;
  onDelete?: () => void;
  onUnpublish?: () => void;
}

export function AccessEntityView<Id extends EntityId>({
  className,
  schema,
  entityId,
  initialId,
  initialValue,
  onSave,
  onDelete,
  onUnpublish,
}: AccessEntityViewProps<Id>) {
  type Args = EntityMap[Id];
  type ClientData = ComponentClientDataById<ComposeId, Args>;

  const api = useComponentApi();
  const { permissions } = useSelfSession();

  const Compose = api.getComponent(composeId);
  const composeOptions = schema.components as EntityComposeOptions<Id>;

  const [clientData, setClientData] = useState<ClientData>(() =>
    transformDataToClientData(api, initialValue, composeOptions)
  );

  const [selectedVariant, setSelectedVariant] =
    useState<EntityVariant>('draft');

  const data = useMemo(() => {
    return api.clientTransformerContext.fromClient<ComposeId, Args>(
      composeId,
      clientData,
      composeOptions
    );
  }, [api, clientData, composeOptions]);

  const onPublishTransformed = useCallback(() => {
    const rawData = data.result;

    if (rawData !== undefined) {
      onSave?.(rawData, 'published');
    }
  }, [data, onSave]);

  const onSaveTransformed = useCallback(() => {
    const rawData = data.result;

    if (rawData !== undefined) {
      onSave?.(rawData, 'draft');
    }
  }, [data, onSave]);

  const reviewData = initialValue?.['#checks']?.['base::review'] as
    | EntityCheckClientData<'base::review'>
    | undefined;

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          {schema.title}
        </Typography>

        {initialValue !== undefined &&
          permissions.has(`entity/${schema.id}$delete`) && (
            <IconButton
              className={styles.delete}
              title="Delete"
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>
          )}
      </div>

      <div className={styles.content}>
        <div className={styles['entity-data']}>
          {entityId && initialId ? (
            <EntityVariantTabs
              entityId={entityId}
              id={initialId}
              selectedVariant={selectedVariant}
              options={composeOptions}
              draftData={clientData}
              draftError={data.error}
              onDraftDataChanged={setClientData}
              onSelectedVariantChanged={setSelectedVariant}
            />
          ) : (
            <Compose
              data={clientData}
              options={composeOptions}
              error={data.error}
              onDataChanged={setClientData}
            />
          )}
        </div>

        <div className={styles['side-panel']}>
          <ActionBlock
            disabled={data.error !== undefined}
            onPublish={
              selectedVariant !== 'published' ? onPublishTransformed : undefined
            }
            onSave={
              selectedVariant !== 'published' ? onSaveTransformed : undefined
            }
            onUnpublish={
              selectedVariant === 'published' ? onUnpublish : undefined
            }
          />

          {reviewData && initialId && (
            <EntityReviewBlock
              entityId={entityId}
              entityObjectId={initialId}
              data={reviewData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
