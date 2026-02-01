import type {
  EntityClientDataById,
  EntityDisplayKeyById,
  EntityId,
  EntitySchemaById,
} from '@game-cms/base-core';
import { ComponentApi, useComponentApi } from '@game-cms/component-api';
import { classNames, Link, Typography } from '@game-cms/ui';
import { useMemo } from 'react';

import { getEntityDisplayKeys } from '@/utils/entity';

import styles from './Item.module.scss';

type EntityClientDataByIdWithId<Id extends EntityId> =
  EntityClientDataById<Id> & { _id: string };

export interface ItemProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  schema: EntitySchemaById<Id>;
  value: EntityClientDataByIdWithId<Id>;
}

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

export function Item<Id extends EntityId>({
  className,
  schema,
  entityId,
  value,
}: ItemProps<Id>) {
  const api = useComponentApi();

  const displayKeys = useMemo(() => getEntityDisplayKeys(schema), [schema]);
  const displayValues = useMemo(
    () =>
      displayKeys.map((key) => getSingleValueAtPath(api, value, schema, key)),
    [api, displayKeys, schema, value]
  );

  return (
    <Link
      className={classNames(styles.root, className)}
      to={`/entities/${entityId}/edit/${value._id}`}
      style={{ '--children-count': displayKeys.length }}
    >
      {displayValues.map((displayValue, i) => (
        <Typography key={displayKeys[i]}>{displayValue}</Typography>
      ))}
    </Link>
  );
}
