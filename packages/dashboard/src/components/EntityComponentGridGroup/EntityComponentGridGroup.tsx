import type {
  ClientEntitySchemaComponents,
  EntityData,
} from '@game-cms/base-types';
import { resolveMaybeFactory } from '@game-cms/shared';
import type { ClientComponentSchema, ComponentId } from '@game-cms/types';
import { classNames } from '@game-cms/ui';
import type { SetStateAction } from 'react';

import type {
  RawConditionalChoicesById,
  RawEntityConditionalData,
} from '@/types/conditional';

import { EntityComponent } from '../EntityComponent';
import styles from './EntityComponentGridGroup.module.scss';

export interface EntityComponentGridGroupProps<T extends EntityData> {
  className?: string;
  schema: ClientEntitySchemaComponents<T>;
  value: RawEntityConditionalData<T>;
  onValueChanged: (value: SetStateAction<RawEntityConditionalData<T>>) => void;
}

export function EntityComponentGridGroup<T extends EntityData>({
  className,
  schema,
  value,
  onValueChanged,
}: EntityComponentGridGroupProps<T>) {
  const entries = Object.entries<ClientComponentSchema>(schema);

  return (
    <div
      className={classNames(
        styles.root,
        entries.length > 1 && styles['root-multiple-children'],
        className
      )}
    >
      {entries.map(([key, schemaEntry]) => {
        type Data = RawConditionalChoicesById<ComponentId>;

        const onDataChanged = (newData: SetStateAction<Data>) => {
          onValueChanged((value) => ({
            ...value,
            [key]: resolveMaybeFactory(newData, value[key]),
          }));
        };

        return (
          <EntityComponent
            key={key}
            title={key}
            componentId={schemaEntry.controller}
            options={schemaEntry.options}
            defaultData={schemaEntry.defaultData}
            data={value[key]}
            onDataChanged={onDataChanged}
          />
        );
      })}
    </div>
  );
}
