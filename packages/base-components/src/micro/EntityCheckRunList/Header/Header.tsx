import { classNames, Typography } from '@game-cms/ui';

import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
}

const COLUMNS = ['Status', 'Check ID', 'Created At', 'Finished At'];

export function Header({ className }: HeaderProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {COLUMNS.map((col) => (
        <Typography key={col} weight="bold">
          {col}
        </Typography>
      ))}
    </div>
  );
}
