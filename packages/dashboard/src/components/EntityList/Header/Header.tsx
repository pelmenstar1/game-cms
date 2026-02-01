import { EntitySchema } from '@game-cms/base-core';
import { classNames, Typography } from '@game-cms/ui';

import { getEntityDisplayKeys } from '@/utils/entity';

import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
  schema: EntitySchema;
}

export function Header({ className, schema }: HeaderProps) {
  const keys = getEntityDisplayKeys(schema);

  return (
    <div
      className={classNames(styles['root'], className)}
      style={{ '--children-count': keys.length }}
    >
      {keys.map((key) => (
        <Typography key={key} variant="caption">
          {key}
        </Typography>
      ))}
    </div>
  );
}
