import type { OpaqueApiTokenWithId } from '@game-cms/base-core';
import type { ToClientType } from '@game-cms/core';
import { classNames, Link } from '@game-cms/ui';

import styles from './ApiTokenItem.module.scss';

export interface ApiTokenItemProps {
  className?: string;
  info: ToClientType<OpaqueApiTokenWithId>;
}

export function ApiTokenItem({ className, info }: ApiTokenItemProps) {
  return (
    <li className={classNames(styles.root, className)}>
      <Link to={`/settings/api-tokens/${info.id}`} weight="bold">
        {info.name}
      </Link>
    </li>
  );
}
