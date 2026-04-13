import { JsonValue } from '@game-cms/shared';

export type EntityCheckLogLevel = 'info' | 'error';

export type EntityCheckLogEntry = {
  level: EntityCheckLogLevel;
  message: string;
  args?: JsonValue;
};

export type EntityCheckLogFn = (message: string, args?: JsonValue) => void;

type BaseEntityCheckLogger = {
  emit: (entry: EntityCheckLogEntry) => void;
};

export type EntityCheckLogger = BaseEntityCheckLogger &
  Record<EntityCheckLogLevel, EntityCheckLogFn>;
