import type { EntityConditionalData } from '@game-cms/conditional';
import { classNames } from '@game-cms/ui';

import styles from './EntityListItem.module.scss';

export interface EntityListItemProps {
  className?: string;
  value: EntityConditionalData & { _id: string };
}

export function EntityListItem({ className, value }: EntityListItemProps) {
  return <div className={classNames(styles.root, className)}>{value._id}</div>;
}
