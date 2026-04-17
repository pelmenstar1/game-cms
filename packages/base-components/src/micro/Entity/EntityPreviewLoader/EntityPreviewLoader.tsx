import { getRawEntityDocumentById } from '@game-cms/base-api/client';
import {
  EntityId,
  EntityInternalOutDataById,
  EntitySchemaById,
} from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import { ForeignComponentClientDataTransformerContext } from '@game-cms/core';
import { MultipleDataLoader } from '@game-cms/ui';
import { useMemo } from 'react';

import { useApiQuery } from '../../../hooks/useApiQuery.js';
import { useClientTransformerContext } from '../../../hooks/useClientTransformerContext.js';
import { useEntitySchema } from '../../../hooks/useEntitySchema.js';
import {
  EntityComposeOptions,
  transformDataToClientData,
} from '../../../utils/entity.js';

export interface EntityPreviewLoaderProps {
  className?: string;
  entityId: EntityId;
  documentId: string;
}

type RendererProps<Id extends EntityId> = {
  entitySchema: EntitySchemaById<Id>;
  document: EntityInternalOutDataById<Id>;
  clientTransformerContext: ForeignComponentClientDataTransformerContext;
};

function Renderer<Id extends EntityId>({
  entitySchema,
  document,
  clientTransformerContext,
}: RendererProps<Id>) {
  const api = useComponentApi();
  const Compose = api.getDefaultRenderer('base::compose');

  const composeOptions = entitySchema.components as EntityComposeOptions<Id>;

  const clientData = useMemo(
    () =>
      transformDataToClientData(
        clientTransformerContext,
        document.components,
        composeOptions
      ),
    [clientTransformerContext, document, composeOptions]
  );

  return <Compose data={clientData} options={composeOptions} readOnly />;
}

export function EntityPreviewLoader({
  className,
  entityId,
  documentId,
}: EntityPreviewLoaderProps) {
  const [documentResult] = useApiQuery(getRawEntityDocumentById, [
    entityId,
    documentId,
    'draft',
  ]);

  const clientTransformerContextResult = useClientTransformerContext(entityId);

  const entitySchemaResult = useEntitySchema(entityId);

  return (
    <MultipleDataLoader
      className={className}
      result={
        [
          documentResult,
          entitySchemaResult,
          clientTransformerContextResult,
        ] as const
      }
    >
      {([document, entitySchema, clientTransformerContext]) => (
        <Renderer
          entitySchema={entitySchema}
          document={document}
          clientTransformerContext={clientTransformerContext}
        />
      )}
    </MultipleDataLoader>
  );
}
