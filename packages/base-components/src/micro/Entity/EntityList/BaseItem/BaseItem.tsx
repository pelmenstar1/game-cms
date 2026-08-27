import {
  EntityClientSchemaById,
  EntityDisplayKeyById,
  EntityId,
} from '@game-cms/base-core';
import { ComponentApi, useComponentApi } from '@game-cms/component-api';
import {
  ComponentId,
  ComponentOptionsById,
  ComponentOutDataById,
} from '@game-cms/core';
import { classNames } from '@game-cms/ui';
import { ComponentProps, ElementType, useMemo } from 'react';

import { getComponentListPreviewComponent } from '../../../../internal/entity.js';
import { EntityListItemInfo } from '../types.js';
import styles from './BaseItem.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WrapperComponent = ElementType<any>;

export type BaseItemProps<
  Id extends EntityId,
  Wrapper extends WrapperComponent,
> = {
  className?: string;
  schema: EntityClientSchemaById<Id>;
  value: EntityListItemInfo<Id>;
  displayKeys: EntityDisplayKeyById<Id>[];
  wrapper: Wrapper;
  wrapperProps: ComponentProps<Wrapper>;
};

function getSingleValueAtPath<Id extends EntityId>(
  api: ComponentApi,
  value: EntityListItemInfo<Id>,
  schema: EntityClientSchemaById<Id>,
  path: EntityDisplayKeyById<Id>
) {
  if (path === 'id') {
    return value.id;
  }

  let returnValue:
    { data: unknown; id: ComponentId; options: unknown } | undefined;

  api.applyAtPath(
    'base::compose',
    value.components,
    schema.components,
    path,
    (data, id, options) => {
      returnValue ??= { data, id, options };
    }
  );

  return returnValue;
}

type BaseItemPartProps<Id extends ComponentId, Args> = {
  componentId: Id;
  componentApi: ComponentApi;
  data: ComponentOutDataById<Id, Args>;
  options: ComponentOptionsById<Id, Args>;
};

function BaseItemPart<Id extends ComponentId, Args>({
  componentId,
  componentApi,
  data,
  options,
}: BaseItemPartProps<Id, Args>) {
  const Component = useMemo(
    () => getComponentListPreviewComponent(componentId, componentApi),
    [componentId, componentApi]
  );

  return <Component data={data} options={options} />;
}

export function BaseItem<
  Id extends EntityId,
  Wrapper extends WrapperComponent,
>({
  className,
  schema,
  value,
  displayKeys,
  wrapper: Wrapper,
  wrapperProps,
}: BaseItemProps<Id, Wrapper>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = Wrapper as ElementType<any>;

  const api = useComponentApi();

  const displayValues = useMemo(
    () =>
      displayKeys.map((key) => getSingleValueAtPath(api, value, schema, key)),
    [api, displayKeys, schema, value]
  );

  return (
    <Tag
      className={classNames(styles.root, className)}
      style={{ '--children-count': displayKeys.length }}
      {...wrapperProps}
    >
      {displayValues.map((value, i) => {
        const displayKey = displayKeys[i];

        if (typeof value === 'string') {
          value = { data: value, id: 'base::text', options: {} };
        }

        if (value === undefined) {
          return <span key={displayKey} />;
        }

        return (
          <BaseItemPart
            key={displayKey}
            componentApi={api}
            componentId={value.id}
            data={value.data}
            options={value.options}
          />
        );
      })}
    </Tag>
  );
}
