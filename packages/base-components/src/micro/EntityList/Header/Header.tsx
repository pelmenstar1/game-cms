import { classNames, Typography } from '@game-cms/ui';

import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
  displayKeys: string[];
}

export function Header({ className, displayKeys }: HeaderProps) {
  return (
    <div
      className={classNames(styles['root'], className)}
      style={{ '--children-count': displayKeys.length }}
    >
      {displayKeys.map((key) => (
        <Typography key={key} variant="caption">
          {key}
        </Typography>
      ))}
    </div>
  );
}
