import type {
  ClientEntitySchema,
  ServerEntitySchema,
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
        config: value.controller.config,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        defaultData: foreignComponentContext.default.data(id, value.options),
        controller: id,
      };
    }),
  };
}

function getById(id: string) {
  const { entitySchemas } = env();

  const result = entitySchemas.find((schema) => schema.id === id);

  return result ?? null;
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
