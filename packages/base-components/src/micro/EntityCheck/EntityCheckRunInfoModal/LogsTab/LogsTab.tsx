import { ClientEntityCheckLogEntry } from '@game-cms/base-core';
import { List } from '@game-cms/ui';

import { LogEntry } from './LogEntry/index.js';
import styles from './LogsTab.module.scss';

export interface LogsTabProps {
  logEntries: readonly ClientEntityCheckLogEntry[];
}

export function LogsTab({ logEntries }: LogsTabProps) {
  return (
    <List className={styles['root']}>
      {logEntries.map((entry, i) => (
        <LogEntry key={i} className={styles['entry']} value={entry} />
      ))}
    </List>
  );
}
