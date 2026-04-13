import { ObjectId } from 'mongodb';
import z from 'zod';

import { listEntityCheckRunsOptions } from '../../schema/entity/index.js';
import { EntityId } from '../core.js';
import { EntityCheckLogEntry } from './logger/types.js';
import { EntityCheckId } from './types.js';

export type EntityCheckRunStatus = 'success' | 'failed';

export type EntityCheckRun = {
  checkId: EntityCheckId;
  entityId: EntityId;
  documentId: ObjectId;
  status: EntityCheckRunStatus;
  logEntries?: readonly EntityCheckLogEntry[];
};

export type EntityCheckRunWithId<Id = string> = EntityCheckRun & { id: Id };

export type ListEntityCheckRunsOptions = z.infer<
  typeof listEntityCheckRunsOptions
>;
