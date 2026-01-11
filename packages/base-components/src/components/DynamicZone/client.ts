import { ComponentClientDataTransformer } from '@game-cms/core';

export const clientTransformer: ComponentClientDataTransformer<'base::dynamic-zone'> =
  {
    ownValidation: true,
    getDefaultData: () => [],
    toClient: (data, options, context) => {
      return data.map((dataItem) => {
        const { componentId, options: baseOptions } =
          options.options[dataItem.key];

        return {
          clientKey: context.idSource(),
          key: dataItem.key,
          data: context.toClient(componentId, dataItem.data, baseOptions),
        };
      });
    },
    fromClient: (clientData, options, context) => {
      const result = clientData.map((value) => {
        const { componentId, options: baseOptions } =
          options.options[value.key];

        const client = context.fromClient(componentId, value.data, baseOptions);

        return {
          client,
          coreError:
            client.result !== undefined
              ? context.validation.validate(
                  componentId,
                  client.result,
                  baseOptions
                )
              : undefined,
        };
      });

      const errors = result.map(
        ({ client: { error }, coreError }) => error ?? coreError
      );

      if (errors.some((value) => value !== undefined)) {
        return { error: { items: errors } };
      }

      return {
        result: result.map((item, index) => ({
          key: clientData[index].key,
          data: item.client.result,
        })),
      };
    },
  };
