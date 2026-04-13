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
    return (message) => {
      entries.push({ level, message });
    };
  }

  const logger: MemoryEntityCheckLogger = {
    entries,
    emit: (entry: EntityCheckLogEntry) => {
      entries.push(entry);
    },
    info: createLevelFn('info'),
    error: createLevelFn('error'),
  };

  return logger;
}
