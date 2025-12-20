import type {
  ClientEntitySchemaComponents,
  EntityData,
} from '@game-cms/base-types';
import type { RawEntityConditionalData } from '@game-cms/conditional';
import type { ClientComponentSchema } from '@game-cms/types';
import { classNames } from '@game-cms/ui';

import { EntityComponent } from '../EntityComponent';
import styles from './EntityComponentGridGroup.module.scss';

export interface EntityComponentGridGroupProps<T extends EntityData> {
  className?: string;
  schema: ClientEntitySchemaComponents<T>;
  value?: RawEntityConditionalData<T>;
  onValueChanged: (value: RawEntityConditionalData<T>) => void;
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
      {entries.map(([key, schemaEntry]) => (
        <EntityComponent
          key={key}
          title={key}
          componentId={schemaEntry.controller}
          options={schemaEntry.options}
          defaultData={schemaEntry.defaultData}
          data={value?.[key] ?? { default: schemaEntry.defaultData }}
          onDataChanged={(newData) => {
            const newValue = { ...value, [key]: newData };

            onValueChanged(newValue as RawEntityConditionalData<T>);
          }}
        />
      ))}
    </div>
  );
}
