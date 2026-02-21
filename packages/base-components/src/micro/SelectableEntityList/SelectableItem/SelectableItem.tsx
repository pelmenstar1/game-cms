import { EntityId, EntitySchemaById } from '@game-cms/base-core';
import { classNames } from '@game-cms/ui';

import { BaseItem } from '../../EntityList/BaseItem/index.js';
import { EntityClientDataByIdWithId } from '../../EntityList/types.js';
import styles from './SelectableItem.module.scss';

export type SelectableItemProps<Id extends EntityId> = {
  className?: string;
  schema: EntitySchemaById<Id>;
  value: EntityClientDataByIdWithId<Id>;
  isSelected?: boolean;
  onSelected: () => void;
};

export function SelectableItem<Id extends EntityId>({
  className,
  schema,
  value,
  isSelected,
  onSelected,
}: SelectableItemProps<Id>) {
  return (
    <BaseItem
      className={classNames(
        styles['root'],
        isSelected && styles['root-selected'],
        className
      )}
      schema={schema}
      value={value}
      wrapper="div"
      onClick={onSelected}
    />
  );
}
