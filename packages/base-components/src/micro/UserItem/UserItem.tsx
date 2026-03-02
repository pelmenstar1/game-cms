import type { NoPasswordUser } from '@game-cms/base-core';
import type { ToClientType } from '@game-cms/core';
import { classNames, Link } from '@game-cms/ui';

import styles from './UserItem.module.scss';

export interface UserItemProps {
  className?: string;
  info: ToClientType<NoPasswordUser>;
}

export function UserItem({ className, info }: UserItemProps) {
  return (
    <li className={classNames(styles.root, className)}>
      <Link to={`/settings/users/${info.id}`} weight="bold">
        {info.displayName}
      </Link>
    </li>
  );
}
