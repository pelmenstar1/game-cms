import { useComponentApi } from '@game-cms/component-api';
import type { ComponentData } from '@game-cms/core';
import { classNames, Labeled } from '@game-cms/ui';

import {
  ComponentGroup,
  ComponentGroupItem,
} from '../../components/Compose/internal/types.js';
import styles from './ComponentGridGroup.module.scss';

export interface ComponentGridGroupProps<
  K extends string,
  T extends Record<K, ComponentData>,
> {
  className?: string;
  group: ComponentGroup<T>;
  data: T;
  error?: Record<K, unknown>;
  readonly?: boolean;
  onValueChanged?: (value: T) => void;
}

export function ComponentGridGroup<
  K extends string,
  T extends Record<K, ComponentData>,
>({
  className,
  group,
  data,
  error,
  readonly,
  onValueChanged,
}: ComponentGridGroupProps<K, T>) {
  const api = useComponentApi();
  const entries = Object.entries<ComponentGroupItem>(group);

  return (
    <div
      className={classNames(
        styles.root,
        entries.length > 1 && styles['root-multiple-children'],
        className
      )}
    >
      {entries.map(([key, schemaEntry]) => {
        const Component = api.getComponent(schemaEntry.componentId);
        const onDataChanged = (newData: ComponentData) => {
          onValueChanged?.({
            ...data,
            [key]: newData,
          });
        };

        return (
          <Labeled key={key} title={key}>
            <Component
              options={schemaEntry.options}
              data={data[key as K]}
              error={error?.[key as K]}
              readonly={readonly}
              onDataChanged={onDataChanged}
            />
          </Labeled>
        );
      })}
    </div>
  );
}
