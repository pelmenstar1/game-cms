import type { ComposeOptions } from '@game-cms/base-components';
import type { ClientEntitySchema, EntityData } from '@game-cms/base-types';
import type { ComponentApi } from '@game-cms/component-api';
import { mapObject } from '@game-cms/shared/object';
import type { ComponentClientDataById } from '@game-cms/types';

export function transformEntityConditionalDataToRaw<T extends EntityData>(
  api: ComponentApi,
  schema: ClientEntitySchema<T>,
  data: T | undefined,
  options: ComposeOptions
): ComponentClientDataById<'base::compose'> {
  const dataOrDefault =
    data ??
    (mapObject(schema.components, (propSchema) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      api.getDefaultData(propSchema.controller, propSchema.options)
    ) as T);

  return api.clientResolverContext.toClient(
    'base::compose',
    dataOrDefault,
    options
  );
}

/*
export function transformEntityConditionalDataFromRaw<T extends EntityData>(
  data: RawEntityConditionalData<T>
) {
  return mapObject(data, (value): ConditionalChoices<T[keyof T]> => {
    const alternative = value.alternative.map(({ condition, data }) => {
      if (condition.expression === null) {
        throw new Error('Condition expression is null');
      }

      return {
        condition: condition.expression,
        value: data.value,
      };
    });

    return {
      default: value.default.value,
      alternative: alternative.length > 0 ? alternative : undefined,
    };
  }) as EntityConditionalData<T>;
}
*/
