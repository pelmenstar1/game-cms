import { classNames, DynamicColumnGrid, Typography } from '@game-cms/ui';

import { EntityCheckItemField } from '../Item/Item.js';
import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
  fields?: EntityCheckItemField[];
}

type ColumnMap = Record<EntityCheckItemField, string>;

const COLUMNS: ColumnMap = {
  status: 'Status',
  checkId: 'Check ID',
  createdAt: 'Created At',
  finishedAt: 'Finished At',
};

const COLUMN_KEYS = Object.keys(COLUMNS) as EntityCheckItemField[];

export function Header({ className, fields = COLUMN_KEYS }: HeaderProps) {
  return (
    <DynamicColumnGrid
      className={classNames(styles.root, className)}
      columns={fields.length}
      distribution="even"
    >
      {fields.map((col) => (
        <Typography key={col} weight="bold">
          {COLUMNS[col]}
        </Typography>
      ))}
    </DynamicColumnGrid>
  );
}
