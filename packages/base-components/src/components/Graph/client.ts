import { defineComponentClientController } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import core from './core.js';
import { validator } from './internal/validator.js';

export default defineComponentClientController<'base::graph'>({
  core,
  getDefaultData: () => ({
    edges: [],
    nodes: {},
  }),
  validator: (data, options, context) => {
    const { componentId, baseOptions } = options;

    return validator(data, (nodeValue) =>
      context.validate(componentId, nodeValue, baseOptions)
    );
  },
  transformer: {
    fromClient: (clientData, options, context) => {
      const { componentId, baseOptions } = options;
      const entries = Object.entries(clientData.nodes).map(
        ([key, { value, meta }]) => ({
          key,
          meta,
          value: context.fromClient(componentId, value, baseOptions),
        })
      );

      return {
        nodes: Object.fromEntries(
          entries.map(({ key, value, meta }) => [key, { value, meta }])
        ),
        edges: clientData.edges,
      };
    },
    toClient: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return {
        nodes: mapObject(data.nodes, ({ value, meta }) => ({
          value: context.toClient(componentId, value, baseOptions),
          meta: {
            position: meta.position,
          },
        })),
        edges: data.edges,
      };
    },
  },
});
