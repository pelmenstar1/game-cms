import { ComponentClientDataResolver } from '@game-cms/types';

export const clientResolver: ComponentClientDataResolver<'base::list'> = {
  toClient: (data, options, context) => {
    return data.map((item) =>
      context.toClient(options.controller, item, options.base)
    );
  },
  fromClient: (clientData, options, context) => {
    const result = clientData.map((item) =>
      context.fromClient(options.controller, item, options.base)
    );

    const errors = result.map(({ error }) => error);

    if (errors.some((value) => value !== undefined)) {
      return { error: errors };
    }

    return { result: result.map((item) => item.result) };
  },
};
