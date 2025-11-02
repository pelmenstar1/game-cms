import { componentSchema, entitySchema } from '@game-cms/types';
import z from 'zod';

const components = z.record(
  z.string(),
  componentSchema.refine(({ componentId, options }) => {
    const result = cms
      .service('base::component')
      .getController(componentId)
      .validation.options.safeParse(options);

    return result.success;
  })
);

export const entitySchemaWithComponentValidation = z.object({
  ...entitySchema.shape,
  components,
});
