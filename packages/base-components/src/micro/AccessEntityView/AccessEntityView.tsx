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
import { maybePromiseThen, Or } from '@game-cms/shared';
import { classNames } from '@game-cms/ui';
import { useCallback, useEffect, useState } from 'react';

import {
  EntityComposeError,
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

type InDataWithError<Id extends EntityId> = Or<
  { data: EntityInDataById<Id> },
  { error: EntityComposeError<Id> }
>;

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
  const [inData, setInData] = useState<InDataWithError<Id> | undefined>();

  const error = inData?.error;

  useEffect(() => {
    const validationResult = api.validate<ComposeId, Args>(
      composeId,
      clientData,
      composeOptions
    );

    void maybePromiseThen(validationResult, (error) => {
      if (error !== undefined) {
        setInData({ error });
      } else {
        const data = clientTransformerContext.fromClient(
          composeId,
          clientData,
          composeOptions
        );

        setInData({ data: data as EntityInDataById<Id> });
      }
    });
  }, [api, clientData, clientTransformerContext, composeOptions]);

  const onPublishTransformed = useCallback(() => {
    const rawData = inData?.data;

    if (rawData !== undefined) {
      onSave?.(rawData, 'published');
    }
  }, [inData, onSave]);

  const onSaveTransformed = useCallback(() => {
    const rawData = inData?.data;

    if (rawData !== undefined) {
      onSave?.(rawData as EntityInDataById<Id>, 'draft');
    }
  }, [inData, onSave]);

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
              draftError={error}
              onDraftDataChanged={setClientData}
              onSelectedVariantChanged={setSelectedVariant}
            />
          ) : (
            <Compose
              data={clientData}
              options={composeOptions}
              error={error}
              onDataChanged={setClientData}
            />
          )}
        </div>

        <div className={styles['side-panel']}>
          <ActionBlock
            disabled={error !== undefined}
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
