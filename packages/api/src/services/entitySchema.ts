import { env } from '@game-cms/env';
import { service } from '@game-cms/shared-api';
import type { ClientEntitySchema, ServerEntitySchema } from '@game-cms/types';

function toClientEntitySchema(schema: ServerEntitySchema): ClientEntitySchema {
  console.log(schema);
  const { components } = schema;

  return {
    ...schema,
    components: Object.fromEntries(
      Object.entries(components).map(([key, value]) => [
        key,
        {
          ...value,
          controller: value.controller.id,
        },
      ])
    ),
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
