import { EntityClientSchemaMap } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/entitySchema/list',
  method: 'GET',
  config: {
    id: 'entitySchema$get',
  },
  handler: (): EntityClientSchemaMap => {
    const schemas = cms().service('base::entitySchema').getClientAllSchemas();

    return schemas;
  },
});
