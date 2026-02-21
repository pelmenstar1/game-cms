/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  EntityDisplayKeyById,
  EntityId,
  EntitySchemaById,
} from '@game-cms/base-core';
import { ComponentApi, useComponentApi } from '@game-cms/component-api';
import { classNames, Typography } from '@game-cms/ui';
import { ComponentProps, FC, JSX, useMemo } from 'react';

import { getEntityDisplayKeys } from '../../../internal/entity.js';
import { EntityClientDataByIdWithId } from '../types.js';
import styles from './BaseItem.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WrapperComponent = keyof JSX.IntrinsicElements | FC<any>;

export type BaseItemProps<
  Id extends EntityId,
  Wrapper extends WrapperComponent,
> = ComponentProps<Wrapper> & {
  className?: string;
  schema: EntitySchemaById<Id>;
  value: EntityClientDataByIdWithId<Id>;
  wrapper: Wrapper;
};

function getSingleValueAtPath<Id extends EntityId>(
  api: ComponentApi,
  value: EntityClientDataByIdWithId<Id>,
  schema: EntitySchemaById<Id>,
  path: EntityDisplayKeyById<Id>
) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (path === '_id') {
    return value._id;
  }

  let returnValue: unknown;

  api.applyAtPath('base::compose', value, schema.components, path, (result) => {
    returnValue ??= result;
  });

  return String(returnValue);
}

export function BaseItem<
  Id extends EntityId,
  Wrapper extends WrapperComponent,
>({
  className,
  schema,
  value,
  wrapper: Wrapper,
  ...wrapperProps
}: BaseItemProps<Id, Wrapper>) {
  const api = useComponentApi();

  const displayKeys = useMemo(() => getEntityDisplayKeys(schema), [schema]);
  const displayValues = useMemo(
    () =>
      displayKeys.map((key) => getSingleValueAtPath(api, value, schema, key)),
    [api, displayKeys, schema, value]
  );

  return (
    <Wrapper
      className={classNames(styles.root, className)}
      style={{ '--children-count': displayKeys.length }}
      {...(wrapperProps as unknown as ComponentProps<Wrapper>)}
    >
      {displayValues.map((displayValue, i) => (
        <Typography key={displayKeys[i]}>{displayValue}</Typography>
      ))}
    </Wrapper>
  );
}
