import { ComponentCustomValidatorResult } from '@game-cms/base-core';
import { componentCustomValidatorPayload } from '@game-cms/base-core/schema';
import { ApiError, apiRoute } from '@game-cms/core/api';
import { componentDataValidatorParams } from '@game-cms/core/schema';
import { env } from '@game-cms/global';
import z from 'zod';

export default apiRoute({
  url: '/validator/check/:id',
  method: 'POST',
  schema: {
    params: z.object({
      id: z.string(),
    }),
    body: componentCustomValidatorPayload,
    querystring: componentDataValidatorParams,
  },
  handler: async (req): Promise<ComponentCustomValidatorResult> => {
    const { id } = req.params;
    const { data } = req.body;
    const validatorParams = req.query;

    const validator = env().config.entity?.customValidators?.[id];
    if (!validator) {
      throw new ApiError(
        `Custom validator "${id}" not found`,
        'base::entity/notFound'
      );
    }

    const error = await validator.check(data, validatorParams);

    if (error === undefined) {
      return { ok: true };
    }

    return { ok: false, error };
  },
});
