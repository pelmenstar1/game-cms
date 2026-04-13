import {
  ClientEntityCheckLogEntry,
  EntityCheckLogLevel,
} from '@game-cms/base-core';
import {
  classNames,
  DateTimeUTC,
  ErrorIcon,
  InfoIcon,
  JsonRawText,
  Typography,
} from '@game-cms/ui';
import { FC, useMemo } from 'react';

import styles from './LogEntry.module.scss';

type IconComponent = FC<{ className?: string }>;

const LOG_ICONS: Record<EntityCheckLogLevel, IconComponent> = {
  info: InfoIcon,
  error: ErrorIcon,
};

export type LogEntryProps = {
  className?: string;
  value: ClientEntityCheckLogEntry;
};

export function LogEntry({ className, value }: LogEntryProps) {
  const { level, message, timestamp, args } = value;
  const Icon = LOG_ICONS[level];

  const argsText = useMemo(() => {
    if (args !== undefined) {
      return JSON.stringify(args, null, 2);
    }
  }, [args]);

  return (
    <li className={classNames(styles['root'], className)}>
      <Icon className={classNames(styles['icon'], styles[`icon-${level}`])} />

      <Typography>{message}</Typography>

      <DateTimeUTC className={styles['timestamp']} input={timestamp} />

      {argsText && <JsonRawText className={styles['args']} text={argsText} />}
    </li>
  );
}
