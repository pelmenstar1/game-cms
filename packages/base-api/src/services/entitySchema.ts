import type {
  ClientEntitySchema,
  EntityId,
  ServerEntitySchema,
  ServerEntitySchemaById,
} from '@game-cms/base-types';
import { cms, env } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';
import { service } from '@game-cms/utils';

function toClientEntitySchema(schema: ServerEntitySchema): ClientEntitySchema {
  const { components } = schema;
  const { foreignComponentContext } = cms().service('base::component');

  return {
    ...schema,
    components: mapObject(components, (value) => {
      const { id } = value.controller.meta;

      return {
        ...value,
        config: value.controller.meta.config,
        defaultData: foreignComponentContext.default.data(id, value.options),
        controller: id,
      };
    }),
  };
}

function getById<Id extends EntityId>(id: Id) {
  const { entitySchemas } = env();

  const result = entitySchemas.find((schema) => schema.id === id);

  return (result ?? null) as ServerEntitySchemaById<Id> | null;
}

export default service({
  id: 'base::entitySchema',
  getById,
  getClientById: (id: string) => {
    const result = getById(id);

    return result ? toClientEntitySchema(result) : null;
  },
  getAll() {
    return env().entitySchemas;
  },
  getClientAll() {
    return env().entitySchemas.map((value) => toClientEntitySchema(value));
  },
});
