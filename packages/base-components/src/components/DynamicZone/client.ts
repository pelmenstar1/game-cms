import { ComponentClientDataTransformer } from '@game-cms/core';

export const clientTransformer: ComponentClientDataTransformer<'base::dynamic-zone'> =
  {
    getDefaultData: () => [],
    toClient: (data, options, context) => {
      return Promise.all(
        data.map(async (dataItem) => {
          const { componentId, options: baseOptions } =
            options.options[dataItem.key];

          return {
            clientKey: context.idSource(),
            key: dataItem.key,
            data: await context.toClient(
              componentId,
              dataItem.data,
              baseOptions
            ),
          };
        })
      );
    },
    fromClient: (clientData, options, context) => {
      const result = clientData.map((value) => {
        const { componentId, options: baseOptions } =
          options.options[value.key];

        return context.fromClient(componentId, value.data, baseOptions);
      });

      const errors = result.map(({ error }) => error);

      if (errors.some((value) => value !== undefined)) {
        return { error: { items: errors } };
      }

      return {
        result: result.map((item, index) => ({
          key: clientData[index].key,
          data: item.result,
        })),
      };
    },
  };
