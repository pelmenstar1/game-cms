import { ToClientType } from '@game-cms/core';
import { JsonValue } from '@game-cms/shared';

export type EntityCheckLogLevel = 'info' | 'error';

export type EntityCheckLogEntry = {
  level: EntityCheckLogLevel;
  message: string;
  timestamp: Date;
  args?: JsonValue;
};

export type ClientEntityCheckLogEntry = ToClientType<
  Omit<EntityCheckLogEntry, 'args'>
> & {
  args?: JsonValue;
};

export type EntityCheckLogFn = (message: string, args?: JsonValue) => void;

type BaseEntityCheckLogger = {
  emit: (entry: EntityCheckLogEntry) => void;
};

export type EntityCheckLogger = BaseEntityCheckLogger &
  Record<EntityCheckLogLevel, EntityCheckLogFn>;
