import { checkCustomValidation } from '@game-cms/base-api/client';
import { defineComponentDataCustomValidatorClientConnector } from '@game-cms/core';
import { RequestContext } from '@game-cms/core/api/client';

export default defineComponentDataCustomValidatorClientConnector({
  getClientValidator: (id) => ({
    check: (data, context, params) => {
      const requestContext: RequestContext = {
        client: context.apiClient,
      };

      return checkCustomValidation(requestContext, id, data, params);
    },
  }),
});
