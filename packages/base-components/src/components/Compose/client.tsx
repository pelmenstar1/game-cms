import { ComponentApi, useComponentApi } from '@game-cms/component-api';
import { ComponentOptionsById, ComponentRenderer } from '@game-cms/types';
import { useMemo } from 'react';

import { ComponentGroup } from '../../internal/types.js';
import { ComponentGridGroup } from '../../micro/ComponentGridGroup/index.js';
import styles from './client.module.scss';

function splitEntitySchemaComponentsToGroups<T>(
  api: ComponentApi,
  options: ComponentOptionsById<'base::compose'>
) {
  const compactGroup: Partial<ComponentGroup<T>> = {};
  let compactGroupNonEmpty = false;

  const groups: Partial<ComponentGroup<T>>[] = [];

  for (const [key, schema] of Object.entries(options)) {
    const config = api.getConfig(schema.componentId);
    const compact = config?.ui?.compact ?? false;

    if (compact) {
      compactGroup[key as keyof T] = schema;
      compactGroupNonEmpty = true;
    } else {
      groups.push({
        [key]: schema,
      } as ComponentGroup<T>);
    }
  }

  if (compactGroupNonEmpty) {
    groups.unshift(compactGroup);
  }

  return groups;
}

export const renderer: ComponentRenderer<'base::compose'> = ({
  data,
  options,
  error,
  onDataChanged,
}) => {
  const api = useComponentApi();

  const groups = useMemo(
    () => splitEntitySchemaComponentsToGroups(api, options),
    [api, options]
  );

  console.log('compose', error);

  return (
    <div className={styles.root}>
      {groups.map((group, i) => {
        return (
          <ComponentGridGroup
            key={i}
            group={group}
            data={data}
            error={error}
            onValueChanged={onDataChanged}
          />
        );
      })}
    </div>
  );
};
