import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  ComponentErrorById,
  componentMeta,
  ComponentOptionsById,
  ComponentRawDataById,
  ForeignComponentValidationContext,
} from '@game-cms/core';

import { OwnError } from './types.js';

const id = 'base::dynamic-zone';

type Id = typeof id;

export const meta = componentMeta({ id });

export const defaultRawData: ComponentDefaultDataHandler<Id> = [];

export const validator: ComponentDataValidator<Id> = <Args>(
  data: ComponentRawDataById<Id, Args>,
  { minItems, maxItems, options }: ComponentOptionsById<Id, Args>,
  context: ForeignComponentValidationContext
) => {
  const items = data.map((dataItem) => {
    const { componentId, options: baseOptions } = options[dataItem.key];

    return context.validate(componentId, dataItem.data, baseOptions);
  });

  let ownError: OwnError | undefined;

  if (minItems !== undefined && items.length < minItems) {
    ownError = 'TOO_FEW_ITEMS';
  } else if (maxItems !== undefined && items.length > maxItems) {
    ownError = 'TOO_MANY_ITEMS';
  }

  console.log(ownError);

  if (
    ownError !== undefined ||
    items.some((element) => element !== undefined)
  ) {
    return { ownError, items } as ComponentErrorById<
      'base::dynamic-zone',
      Args
    >;
  }
};
