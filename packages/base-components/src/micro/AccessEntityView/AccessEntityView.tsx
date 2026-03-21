import type {
  EntityClientContext,
  EntityClientDataById,
  EntityClientSchemaById,
  EntityComponents,
  EntityId,
  EntityInDataById,
  EntityInternalOutDataById,
  EntityVariant,
} from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import { ForeignComponentClientDataTransformerContext } from '@game-cms/core';
import { classNames } from '@game-cms/ui';
import { useCallback, useMemo, useState } from 'react';

import {
  EntityComposeOptions,
  transformDataToClientData,
} from '../../utils/entity.js';
import { EntityVariantTabs } from '../EntityVariantTabs/index.js';
import styles from './AccessEntityView.module.scss';
import { ActionBlock } from './ActionBlock/index.js';
import { EntityCheckBlock } from './EntityCheckBlock/index.js';
import { Header } from './Header/index.js';
import { PreviewPanel } from './PreviewPanel/index.js';

const composeId = 'base::compose';

type ComposeId = typeof composeId;

export interface AccessEntityViewProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  schema: EntityClientSchemaById<Id>;
  initialId?: string;
  initialValue?: EntityInternalOutDataById<Id>;
  clientContext?: EntityClientContext;
  clientTransformerContext: ForeignComponentClientDataTransformerContext;

  onSave?: (value: EntityInDataById<Id>, variant: EntityVariant) => void;
  onDelete?: () => void;
  onUnpublish?: () => void;
}

export function AccessEntityView<Id extends EntityId>({
  className,
  schema,
  entityId,
  initialId,
  initialValue,
  clientContext,
  clientTransformerContext,
  onSave,
  onDelete,
  onUnpublish,
}: AccessEntityViewProps<Id>) {
  type Args = EntityComponents<Id>;

  const api = useComponentApi();

  const Compose = api.getComponent(composeId);
  const composeOptions = schema.components as EntityComposeOptions<Id>;

  const [clientData, setClientData] = useState(() =>
    transformDataToClientData(
      clientTransformerContext,
      initialValue?.components,
      composeOptions
    )
  );

  const [selectedVariant, setSelectedVariant] =
    useState<EntityVariant>('draft');

  const [previewEnabled, setPreviewEnabled] = useState(false);

  const data = useMemo(() => {
    return clientTransformerContext.fromClient<ComposeId, Args>(
      composeId,
      clientData,
      composeOptions
    );
  }, [clientTransformerContext, clientData, composeOptions]);

  const onPublishTransformed = useCallback(() => {
    const rawData = data.result;

    if (rawData !== undefined) {
      onSave?.(rawData as EntityInDataById<Id>, 'published');
    }
  }, [data, onSave]);

  const onSaveTransformed = useCallback(() => {
    const rawData = data.result;

    if (rawData !== undefined) {
      onSave?.(rawData as EntityInDataById<Id>, 'draft');
    }
  }, [data, onSave]);

  return (
    <div className={classNames(styles.root, className)}>
      <Header
        className={styles.header}
        hasInitialValue={initialValue !== undefined}
        entityId={entityId}
        schema={schema}
        onDelete={onDelete}
        hasPreview={clientContext?.preview !== undefined}
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

          {initialId && initialValue?.checks && (
            <EntityCheckBlock
              entityId={entityId}
              documentId={initialId}
              data={initialValue.checks}
            />
          )}
        </div>

        {clientContext?.preview && previewEnabled && (
          <PreviewPanel<Id>
            className={styles['preview-panel']}
            entityId={entityId}
            data={clientData as EntityClientDataById<Id>}
            schema={schema}
            documentId={initialId}
            previewController={clientContext.preview}
          />
        )}
      </div>
    </div>
  );
}
