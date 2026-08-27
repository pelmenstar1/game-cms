import type {
  EntityClientSchemaById,
  EntityDescriptor,
  EntityId,
  EntitySchemaById,
} from '@game-cms/base-core';
import {
  ForeignComponentClientOptionsTransformerContext,
  service,
} from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';

function getEntry<Id extends EntityId>(id: Id) {
  return env().entity.schemaRegistry?.items[id] as unknown as
    EntityDescriptor<Id> | undefined;
}

function getSchemaById<Id extends EntityId>(id: Id) {
  return getEntry(id)?.schema;
}

function toClientSchema<Id extends EntityId>(
  context: ForeignComponentClientOptionsTransformerContext,
  schema: EntitySchemaById<Id>
): EntityClientSchemaById<Id> {
  return {
    title: schema.title,
    displayKeys: schema.displayKeys,
    components: mapObject(schema.components, (component) => {
      const { componentId, options } = component;
      const clientOptions = context.toClient(componentId, options);

      return {
        componentId,
        options: clientOptions,
      };
    }),
  };
}

function getAll() {
  return env().entity.schemaRegistry?.items ?? {};
}

export default service({
  lifecycle: {},
  getEntry,
  getSchemaById,
  getAll,
  getClientSchemaById<Id extends EntityId>(
    id: Id
  ): EntityClientSchemaById<Id> | undefined {
    const schema = getSchemaById(id);

    if (schema) {
      const { foreignClientOptionsTransformerContext } =
        cms().service('base::component');

      return toClientSchema(foreignClientOptionsTransformerContext, schema);
    }
  },
  getClientAllSchemas() {
    const map = getAll();

    const { foreignClientOptionsTransformerContext } =
      cms().service('base::component');

    return mapObject(map, ({ schema }) =>
      toClientSchema(foreignClientOptionsTransformerContext, schema)
    );
  },
});
