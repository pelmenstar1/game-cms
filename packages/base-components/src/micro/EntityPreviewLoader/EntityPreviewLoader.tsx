import { getRawEntityById } from '@game-cms/base-api/client';
import {
  EntityId,
  EntityRawDataById,
  EntitySchemaById,
} from '@game-cms/base-core';
import { useApiQuery, useComponentApi } from '@game-cms/component-api';
import { MultipleDataLoader } from '@game-cms/ui';
import { useMemo } from 'react';

import { useEntitySchema } from '../../hooks/useEntitySchema.js';
import {
  EntityComposeOptions,
  transformDataToClientData,
} from '../../shared.js';

export interface EntityPreviewLoaderProps {
  className?: string;
  entityId: EntityId;
  documentId: string;
}

type RendererProps<Id extends EntityId> = {
  entitySchema: EntitySchemaById<Id>;
  document: EntityRawDataById<Id>;
};

function Renderer<Id extends EntityId>({
  entitySchema,
  document,
}: RendererProps<Id>) {
  const api = useComponentApi();
  const Compose = api.getComponent('base::compose');

  const composeOptions = entitySchema.components as EntityComposeOptions<Id>;

  const clientData = useMemo(
    () => transformDataToClientData(api, document, composeOptions),
    [api, document, composeOptions]
  );

  return <Compose data={clientData} options={composeOptions} readonly />;
}

export function EntityPreviewLoader({
  className,
  entityId,
  documentId,
}: EntityPreviewLoaderProps) {
  const [documentResult] = useApiQuery(getRawEntityById, [
    entityId,
    documentId,
    'draft',
  ]);

  const entitySchemaResult = useEntitySchema(entityId);

  return (
    <MultipleDataLoader
      className={className}
      result={[documentResult, entitySchemaResult] as const}
    >
      {([document, entitySchema]) => (
        <Renderer entitySchema={entitySchema} document={document} />
      )}
    </MultipleDataLoader>
  );
}
