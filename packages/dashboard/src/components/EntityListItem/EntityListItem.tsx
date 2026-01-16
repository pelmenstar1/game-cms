import type { EntityId } from '@game-cms/base-core';
import { classNames, Link, Typography } from '@game-cms/ui';

import styles from './EntityListItem.module.scss';

export interface EntityListItemProps {
  className?: string;
  entityId: EntityId;
  value: { _id: string };
}

export function EntityListItem({
  className,
  entityId,
  value,
}: EntityListItemProps) {
  return (
    <Link
      className={classNames(styles.root, className)}
      to={`/entities/${entityId}/edit/${value._id}`}
    >
      <Typography>{value._id}</Typography>
    </Link>
  );
}
