import { ToClientType } from '@game-cms/core';
import { ObjectId } from 'mongodb';
import z from 'zod';

import { listEntityCheckRunsOptions } from '../../schema/entity/index.js';
import { EntityId } from '../core.js';
import {
  ClientEntityCheckLogEntry,
  EntityCheckLogEntry,
} from './logger/types.js';
import { EntityCheckId } from './types.js';

export type EntityCheckRunStatus = 'success' | 'failed';

export interface ConciseEntityCheckRun {
  checkId: EntityCheckId;
  entityId: EntityId;
  documentId?: ObjectId;
  createdAt: Date;
  finishedAt: Date;
  status: EntityCheckRunStatus;
}

export interface EntityCheckRun extends ConciseEntityCheckRun {
  logEntries?: readonly EntityCheckLogEntry[];
}

export type EntityCheckRunWithId<Id = string> = EntityCheckRun & { id: Id };
export type ConciseEntityCheckRunWithId<Id = string> = ConciseEntityCheckRun & {
  id: Id;
};

export type ClientConciseEntityCheckRunWithId =
  ToClientType<ConciseEntityCheckRunWithId>;

export type ClientEntityCheckRunWithId = ToClientType<
  Omit<EntityCheckRunWithId, 'logEntries'>
> & {
  logEntries?: readonly ClientEntityCheckLogEntry[];
};

export type ListEntityCheckRunsOptions = z.infer<
  typeof listEntityCheckRunsOptions
>;
