import type { EntitySchema } from '@game-cms/types';

import { service } from '../utils.js';

function schemas() {
  return cms.service('base::database').collection('base::entitySchema');
}

export default service({
  id: 'base::entitySchema',
  init: async () => {
    await schemas().createIndex({ id: 1 }, { unique: true });
  },
  get: async (id: string) => {
    const result = await schemas().findOne({ id });

    return result;
  },
  create: async (schema: EntitySchema) => {
    await schemas().insertOne(schema);
  },
  update: async ({ id, ...rest }: EntitySchema) => {
    const result = await schemas().updateOne({ id }, rest);

    return result.matchedCount > 0;
  },
  deleteById: async (id: string) => {
    await schemas().deleteOne({ id });
  },
});
