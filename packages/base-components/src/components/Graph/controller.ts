import { componentController } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import core from './core.js';

export default componentController({
  core,
  resolver: (raw, options, context, args) => {
    const { componentId, baseOptions } = options;

    return {
      nodes: mapObject(raw.nodes, ({ value, meta }) => ({
        meta,
        value: context.resolveRawData(componentId, value, baseOptions, args),
      })),
      edges: raw.edges,
    };
  },
  storageTransformer: {
    fromStorage: async (data, options, context) => {
      const { componentId, baseOptions } = options;

      const nodes = await Promise.all(
        Object.entries(data.nodes).map(async ([key, { value, meta }]) => {
          const storageValue = await context.fromStorage(
            componentId,
            value,
            baseOptions
          );

          return [key, { value: storageValue, meta }] as const;
        })
      );

      return { nodes: Object.fromEntries(nodes), edges: data.edges };
    },
    toStorage: async (data, options, context) => {
      const { componentId, baseOptions } = options;

      const nodes = await Promise.all(
        Object.entries(data.nodes).map(async ([key, { value, meta }]) => {
          const storageValue = await context.toStorage(
            componentId,
            value,
            baseOptions
          );

          return [key, { value: storageValue, meta }] as const;
        })
      );

      return { nodes: Object.fromEntries(nodes), edges: data.edges };
    },
  },
});
