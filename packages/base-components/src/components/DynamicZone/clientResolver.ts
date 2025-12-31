import { ComponentClientDataResolver } from '@game-cms/types';

export const clientResolver: ComponentClientDataResolver<'base::dynamic-zone'> =
  {
    toClient: (data, _, context) =>
      data.map((dataItem) => ({ ...dataItem, clientKey: context.idSource() })),
    fromClient: (clientData, options, context) => {
      const result = clientData.map((value) => {
        const { componentId, options: baseOptions } = options[value.key];

        return context.fromClient(componentId, value.data, baseOptions);
      });

      const errors = result.map(({ error }) => error);

      if (errors.some((value) => value !== undefined)) {
        return { error: errors };
      }

      return {
        result: result.map((item, index) => ({
          key: clientData[index].key,
          data: item.result,
        })),
      };
    },
  };
