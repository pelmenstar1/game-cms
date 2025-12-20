import type {
  ClientEntitySchema,
  ClientEntitySchemaComponents,
  EntityData,
} from '@game-cms/base-types';
import type { RawEntityConditionalData } from '@game-cms/conditional';
import { classNames } from '@game-cms/ui';
import { useMemo } from 'react';

import { splitEntitySchemaComponentsToGroups } from '@/utils/entitySchema';

import { EntityComponentGridGroup } from '../EntityComponentGridGroup';
import styles from './EntityComponentGrid.module.scss';

export interface EntityComponentGridProps<T extends EntityData> {
  className?: string;
  schema: ClientEntitySchema<T>;
  value?: RawEntityConditionalData<T>;
  onValueChanged: (value: RawEntityConditionalData<T>) => void;
}

export function EntityComponentGrid<T extends EntityData>({
  className,
  schema,
  value,
  onValueChanged,
}: EntityComponentGridProps<T>) {
  const groups = useMemo(
    () => splitEntitySchemaComponentsToGroups(schema.components),
    [schema.components]
  );

  return (
    <div className={classNames(styles.root, className)}>
      {groups.map((group, i) => (
        <EntityComponentGridGroup
          key={i}
          schema={group as ClientEntitySchemaComponents<T>}
          value={value}
          onValueChanged={(newValue) => {
            onValueChanged({ ...value, ...newValue });
          }}
        />
      ))}
    </div>
  );
}
