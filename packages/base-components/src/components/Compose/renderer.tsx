import { ComponentApi, useComponentApi } from '@game-cms/component-api';
import {
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRenderer,
} from '@game-cms/core';
import { useMemo } from 'react';

import { ComponentGroup } from '../../internal/types.js';
import { ComponentGridGroup } from '../../micro/ComponentGridGroup/index.js';
import styles from './renderer.module.scss';
import { ComposeOptionsEntry } from './types.js';

type Id = 'base::compose';

type ComposeGroup<Args> = ComponentGroup<ComponentRawDataById<Id, Args>>;

function splitEntitySchemaComponentsToGroups<Args>(
  api: ComponentApi,
  options: ComponentOptionsById<Id, Args>
): ComposeGroup<Args>[] {
  const compactGroup: Partial<ComposeGroup<Args>> = {};
  let compactGroupNonEmpty = false;

  const groups: unknown[] = [];

  for (const [key, schema] of Object.entries<ComposeOptionsEntry>(options)) {
    const config = api.getConfig(schema.componentId);
    const compact = config?.ui?.compact ?? false;

    if (compact) {
      compactGroup[key as keyof ComposeGroup<Args>] = schema;
      compactGroupNonEmpty = true;
    } else {
      groups.push({
        [key]: schema,
      } as ComposeGroup<Args>);
    }
  }

  if (compactGroupNonEmpty) {
    groups.unshift(compactGroup);
  }

  return groups as ComposeGroup<Args>[];
}

export const renderer: ComponentRenderer<Id> = ({
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

  return (
    <div className={styles.root}>
      {groups.map((group, i) => (
        <ComponentGridGroup
          key={i}
          group={group}
          data={data}
          error={error?.properties}
          onValueChanged={onDataChanged}
        />
      ))}
    </div>
  );
};
