import type { EntityData } from '@game-cms/types';
import { classNames } from '@game-cms/ui';

import styles from './EntityListItem.module.scss';

export interface EntityListItemProps {
  className?: string;
  value: EntityData & { _id: string };
}

export function EntityListItem({ className, value }: EntityListItemProps) {
  return <div className={classNames(styles.root, className)}>{value._id}</div>;
}
