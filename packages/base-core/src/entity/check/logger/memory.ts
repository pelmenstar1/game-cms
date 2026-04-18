import {
  EntityCheckLogEntry,
  EntityCheckLogFn,
  EntityCheckLogger,
  EntityCheckLogLevel,
} from './types.js';

export interface MemoryEntityCheckLogger extends EntityCheckLogger {
  entries: readonly EntityCheckLogEntry[];
}

export function createMemoryEntityCheckLogger(): MemoryEntityCheckLogger {
  const entries: EntityCheckLogEntry[] = [];

  function createLevelFn(level: EntityCheckLogLevel): EntityCheckLogFn {
    return (message, args) => {
      entries.push({ level, timestamp: new Date(), message, args });
    };
  }

  const logger: MemoryEntityCheckLogger = {
    entries,
    emit: (entry) => {
      entries.push(entry);
    },
    info: createLevelFn('info'),
    error: createLevelFn('error'),
  };

  return logger;
}
