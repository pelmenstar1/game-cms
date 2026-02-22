/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
import {
  EntityComposeOptions,
  transformDataToClientData,
} from '@game-cms/base-components/micro';
import type {
  EntityCheckClientData,
  EntityClientDataById,
  EntityComponents,
  EntityId,
  EntityRawDataWithChecksById,
  EntityRawInDataById,
  EntitySchemaById,
  EntityVariant,
} from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import { classNames } from '@game-cms/ui';
import { useCallback, useMemo, useState } from 'react';

import { EntityReviewBlock } from '../EntityReviewBlock';
import { EntityVariantTabs } from '../EntityVariantTabs';
import styles from './AccessEntityView.module.scss';
import { ActionBlock } from './ActionBlock';
import { Header } from './Header';
import { PreviewPanel } from './PreviewPanel';

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
  type Args = EntityComponents<Id>;

  const api = useComponentApi();

  const Compose = api.getComponent(composeId);
  const composeOptions = schema.components as EntityComposeOptions<Id>;

  const [clientData, setClientData] = useState(() =>
    transformDataToClientData(api, initialValue, composeOptions)
  );

  const [selectedVariant, setSelectedVariant] =
    useState<EntityVariant>('draft');

  const [previewEnabled, setPreviewEnabled] = useState(false);

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
      onSave?.(rawData as EntityRawInDataById<Id>, 'published');
    }
  }, [data, onSave]);

  const onSaveTransformed = useCallback(() => {
    const rawData = data.result;

    if (rawData !== undefined) {
      onSave?.(rawData as EntityRawInDataById<Id>, 'draft');
    }
  }, [data, onSave]);

  const reviewData = initialValue?.['#checks']?.['base::review'] as
    | EntityCheckClientData<'base::review'>
    | undefined;

  return (
    <div className={classNames(styles.root, className)}>
      <Header
        className={styles.header}
        hasInitialValue={initialValue !== undefined}
        entityId={entityId}
        schema={schema}
        onDelete={onDelete}
        previewEnabled={previewEnabled}
        onPreviewEnabledChanged={setPreviewEnabled}
      />

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
              documentId={initialId}
              data={reviewData}
            />
          )}
        </div>

        {previewEnabled && (
          <PreviewPanel<Id>
            className={styles['preview-panel']}
            entityId={entityId}
            data={clientData as EntityClientDataById<Id>}
            schema={schema}
            documentId={initialId}
          />
        )}
      </div>
    </div>
  );
}
