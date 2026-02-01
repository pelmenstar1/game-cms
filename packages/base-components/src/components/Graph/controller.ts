import { defineComponentController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { mapObject } from '@game-cms/shared/object';

import core from './core.js';
import { dataShape } from './internal/schema.js';

export default defineComponentController({
  core,
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
  pathWalker: (data, options, path, apply, context) => {
    const { componentId, baseOptions } = options;
    const { nodes } = data;

    for (const key in nodes) {
      const nodeValue = nodes[key];

      if (isNonNullObject(nodeValue)) {
        const { value } = nodeValue;

        context.applyAtPath(componentId, value, baseOptions, path, apply);
      }
    }
  },
  migrate: (data, options, context) => {
    const result = dataShape.safeParse(data);

    if (result.success) {
      const { componentId, baseOptions } = options;

      return {
        nodes: mapObject(result.data.nodes, (node) => ({
          meta: node.meta,
          value: context.migrate(componentId, node.value, baseOptions),
        })),
        edges: result.data.edges,
      };
    }
  },
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
    getDefaultData: () => ({
      nodes: {},
      edges: [],
    }),
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
