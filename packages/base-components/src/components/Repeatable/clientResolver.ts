import { ComponentClientDataResolver } from '@game-cms/types';

export const clientResolver: ComponentClientDataResolver<'base::repeatable'> = {
  toClient: (data, options, context) => {
    return data.map((item) => ({
      clientKey: context.idSource(),
      data: context.toClient(options.componentId, item, options.baseOptions),
    }));
  },
  fromClient: (clientData, options, context) => {
    const result = clientData.map((item) =>
      context.fromClient(options.componentId, item.data, options.baseOptions)
    );

    const errors = result.map(({ error }) => error);

    if (errors.some((value) => value !== undefined)) {
      return { error: errors };
    }

    return { result: result.map((item) => item.result) };
  },
};
