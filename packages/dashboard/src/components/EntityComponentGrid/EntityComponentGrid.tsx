import type {
  ClientComponentSchema,
  ClientEntitySchema,
  EntityData,
} from '@game-cms/types';
import { classNames } from '@game-cms/ui';

import { EntityComponent } from '../EntityComponent';
import styles from './EntityComponentGrid.module.scss';

export interface EntityComponentGridProps<T extends EntityData> {
  className?: string;
  schema: ClientEntitySchema<T>;
  value?: T;
  onValueChanged: (value: T) => void;
}

export function EntityComponentGrid<T extends EntityData>({
  className,
  schema,
  value,
  onValueChanged,
}: EntityComponentGridProps<T>) {
  return (
    <div className={classNames(styles.root, className)}>
      {Object.entries<ClientComponentSchema>(schema.components).map(
        ([key, schemaEntry]) => (
          <EntityComponent
            key={key}
            title={key}
            componentId={schemaEntry.controller}
            options={schemaEntry.options}
            data={value?.[key] ?? schemaEntry.defaultData}
            onDataChanged={(newData) => {
              const newValue = { ...value, [key]: newData };

              onValueChanged(newValue as T);
            }}
          />
        )
      )}
    </div>
  );
}
