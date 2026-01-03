import { env } from '@game-cms/global';

function emitGetEntitySchemas() {
  const { entitySchemas } = env();

  const map = Object.fromEntries(
    entitySchemas.map((schema) => [schema.id, schema] as const)
  );

  return `
const map = ${JSON.stringify(map)};
export const getEntitySchemas = () => Object.values(map);
export const getEntitySchemaById = (id) => map[id];`;
}

export function emitEntityConnector(): string {
  return emitGetEntitySchemas();
}
