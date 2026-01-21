import { ComponentClientDataTransformer } from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

export const clientTransformer: ComponentClientDataTransformer<'base::graph'> =
  {
    getDefaultData: () => ({
      edges: [],
      nodes: {},
    }),
    fromClient: (clientData, options, context) => {
      const { componentId, baseOptions } = options;
      const entries = Object.entries(clientData.nodes).map(
        ([key, { value, meta }]) => ({
          key,
          meta,
          value: context.fromClient(componentId, value, baseOptions),
        })
      );

      if (entries.some(({ value }) => value.error !== undefined)) {
        return {
          error: {
            base: Object.fromEntries(
              entries.map(({ key, value }) => [key, value.error])
            ),
          },
        };
      }

      return {
        result: {
          nodes: Object.fromEntries(
            entries.map(({ key, value, meta }) => [
              key,
              {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: value.result!,
                meta,
              },
            ])
          ),
          edges: clientData.edges,
        },
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
  };
