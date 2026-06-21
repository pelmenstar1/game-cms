import { defineComponentController, searchScoreComposer } from '@game-cms/core';
import {
  asyncMapObject,
  mapObject,
  objectAggregation,
} from '@game-cms/shared/object';

import core from './core.js';
import { dataShape } from './internal/schema.js';
import { validator } from './internal/validator.js';

export default defineComponentController({
  core,
  validator: (data, options, context) => {
    const { componentId, baseOptions } = options;

    return validator(data, (nodeValue) =>
      context.validate(componentId, nodeValue, baseOptions)
    );
  },
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
  innerDependencies: (options, context) =>
    context.getDependencies(options.componentId, options.baseOptions),
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
  resolver: (input, options, context, args) => {
    const { componentId, baseOptions } = options;

    return {
      nodes: mapObject(input.nodes, ({ value, meta }) => ({
        meta,
        value: context.resolveOutData(componentId, value, baseOptions, args),
      })),
      edges: input.edges,
    };
  },
  atomWalker: {
    applyEach: (data, options, apply, context) => {
      const { componentId, baseOptions } = options;

      for (const { value } of Object.values(data.nodes)) {
        context.applyEach(componentId, value, baseOptions, apply);
      }
    },
    filter: (data, options, predicate, context) => {
      const { componentId, baseOptions } = options;

      const nodes = objectAggregation(data.nodes)
        .filter(({ value }) => predicate(componentId, value, baseOptions))
        .map(({ value, meta }: (typeof data.nodes)[string]) => ({
          meta,
          value: context.filter(componentId, value, baseOptions, predicate),
        }))
        .result();

      const nodeKeys = new Set(Object.keys(nodes));

      return {
        nodes,
        edges: data.edges.filter(
          ({ source, target }) => nodeKeys.has(source) && nodeKeys.has(target)
        ),
      };
    },
  },
  outerLinkController: {
    contains: (outerLink, data, options, context) => {
      const { componentId, baseOptions } = options;

      return Object.values(data.nodes).some(({ value }) =>
        context.contains(outerLink, componentId, value, baseOptions)
      );
    },
    delete: (outerLink, data, options, context) => {
      const { componentId, baseOptions } = options;

      return {
        edges: data.edges,
        nodes: mapObject(data.nodes, ({ value, meta }) => ({
          meta,
          value: context.delete(outerLink, componentId, value, baseOptions),
        })),
      };
    },
  },
  search: {
    getScore: (query, target, options, context) => {
      const {
        storage: { nodes },
        searchIndex,
      } = target;

      const { componentId, baseOptions } = options;

      const composer = searchScoreComposer();

      for (const key in nodes) {
        composer.include(
          context.getScore(
            query,
            componentId,
            {
              storage: nodes[key].value,
              searchIndex: searchIndex[key],
            },
            baseOptions
          )
        );
      }

      return composer.result();
    },
    createIndex: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return asyncMapObject(data.nodes, ({ value }) =>
        context.createSearchIndex(componentId, value, baseOptions)
      );
    },
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
    disposeData: async (data, options, context) => {
      const { componentId, baseOptions } = options;

      await Promise.all(
        Object.values(data.nodes).map(async ({ value }) =>
          context.disposeData(componentId, value, baseOptions)
        )
      );
    },
  },
  clientOptionsTransformer: {
    toClient: (options, context) => {
      const { componentId, baseOptions } = options;

      return {
        componentId,
        baseOptions: context.toClient(componentId, baseOptions),
      };
    },
  },
});
