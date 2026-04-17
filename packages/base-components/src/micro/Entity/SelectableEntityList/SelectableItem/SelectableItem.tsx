import {
  EntityDisplayKeyById,
  EntityId,
  EntityInternalOutDataById,
  EntitySchemaById,
} from '@game-cms/base-core';
import { classNames } from '@game-cms/ui';

import { BaseItem } from '../../EntityList/BaseItem/index.js';
import styles from './SelectableItem.module.scss';

export type SelectableItemProps<Id extends EntityId> = {
  className?: string;
  schema: EntitySchemaById<Id>;
  value: EntityInternalOutDataById<Id, string>;
  displayKeys: EntityDisplayKeyById<Id>[];
  isSelected?: boolean;
  onSelected: () => void;
};

export function SelectableItem<Id extends EntityId>({
  className,
  schema,
  value,
  displayKeys,
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
      displayKeys={displayKeys}
      wrapper="div"
      wrapperProps={{
        onClick: onSelected,
      }}
    />
  );
}
