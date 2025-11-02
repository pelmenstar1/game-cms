import { apiRoute } from '../../utils.js';
import { entitySchemaWithComponentValidation } from '../../utils/entitySchema.js';

export default apiRoute({
  path: '/entitySchema',
  method: 'POST',
  validation: {
    body: entitySchemaWithComponentValidation,
  },
  handler: async (req, res) => {
    const schema = req.body;

    await cms.service('base::entitySchema').create(schema);

    res.status(201).end();
  },
});
