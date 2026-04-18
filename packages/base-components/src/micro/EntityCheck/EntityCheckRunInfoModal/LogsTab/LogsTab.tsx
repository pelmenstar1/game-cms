import { ClientEntityCheckLogEntry } from '@game-cms/base-core';
import {
  DownloadIcon,
  DownloadTextLink,
  IconComponentBase,
  List,
  Toolbar,
} from '@game-cms/ui';
import { useMemo } from 'react';

import { LogEntry } from './LogEntry/index.js';
import styles from './LogsTab.module.scss';

export interface LogsTabProps {
  logEntries: readonly ClientEntityCheckLogEntry[];
}

export function LogsTab({ logEntries }: LogsTabProps) {
  const rawJson = useMemo(() => JSON.stringify(logEntries), [logEntries]);

  return (
    <List className={styles['root']}>
      <Toolbar>
        <IconComponentBase
          as={DownloadTextLink}
          content={rawJson}
          mime="application/json"
          download="logs.json"
          hover="fill"
        >
          <DownloadIcon />
        </IconComponentBase>
      </Toolbar>

      {logEntries.map((entry, i) => (
        <LogEntry key={i} className={styles['entry']} value={entry} />
      ))}
    </List>
  );
}
