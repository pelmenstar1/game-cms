import {
  EntityClientSchemaById,
  EntityDisplayKeyById,
  EntityId,
} from '@game-cms/base-core';
import { ComponentApi } from '@game-cms/component-api';
import { ComponentId, ComponentSchema } from '@game-cms/core';
import { createCachedFactory } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import React from 'react';

const MAX_KEYS = 5;

export const getComponentListPreviewComponent = createCachedFactory(
  (id: ComponentId, context: ComponentApi) => {
    return React.lazy(async () => {
      const listPreviewModule = await context.getRendererByVariant(
        id,
        'listPreview'
      );

      return { default: listPreviewModule?.listPreview ?? (() => null) };
    });
  }
);

export function getEntityDisplayKeys<Id extends EntityId>(
  schema: EntityClientSchemaById<Id>,
  context: ComponentApi
): EntityDisplayKeyById<Id>[] {
  const { displayKeys } = schema;
  if (displayKeys) {
    return displayKeys.slice(0, MAX_KEYS);
  }

  const result = Object.entries<ComponentSchema>(schema.components).map(
    ([key, { componentId }]) => {
      if (context.hasRendererByVariant(componentId, 'listPreview')) {
        return key as EntityDisplayKeyById<Id>;
      }
    }
  );

  const filtered = filterOutNullable(result).slice(0, MAX_KEYS - 1);

  return ['id', ...filtered];
}
