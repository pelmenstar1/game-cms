import {
  AbortOptions,
  ConciseEntityCheckRunWithId,
  EntityCheckRun,
  EntityCheckRunWithId,
  ListEntityCheckRunsOptions,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { PageData } from '@game-cms/shared';
import { omitUndefined } from '@game-cms/shared/object';
import { ObjectId } from 'mongodb';

import { getPage } from '../../../utils/paging.js';

declare module '@game-cms/base-core' {
  interface DatabaseCollectionTypeMap {
    'base::entityCheckRun': EntityCheckRun;
  }
}

export type GetByIdOptions = { id: ObjectId } & AbortOptions;
export type ListOptions = ListEntityCheckRunsOptions & AbortOptions;

function collection() {
  return cms().service('base::database').collection('base::entityCheckRun');
}

async function addRun(info: EntityCheckRun) {
  await collection().insertOne(info);
}

async function addRuns(values: readonly EntityCheckRun[]) {
  if (values.length > 0) {
    await collection().insertMany(values);
  }
}

async function list(
  options: ListOptions
): Promise<PageData<ConciseEntityCheckRunWithId<ObjectId>>> {
  const { checkId, entityId, documentId, offset, size, signal } = options;

  const match = omitUndefined({ checkId, entityId, documentId });

  const result = await getPage(
    collection(),
    { size, offset, signal },
    {
      pre: [{ $match: match }],
      post: [{ $project: { logEntries: 0 } }],
    }
  );

  return {
    items: result.items.map((item) => ({
      ...item,
      id: item._id,
    })),
    meta: result.meta,
  };
}

async function getById(
  options: GetByIdOptions
): Promise<EntityCheckRunWithId<ObjectId> | null> {
  const { id, signal } = options;

  const doc = await collection().findOne(
    { _id: id },
    { projection: { _id: 0 }, signal }
  );

  if (doc === null) {
    return null;
  }

  return { ...doc, id: doc._id };
}

export default service({
  lifecycle: {},
  addRun,
  addRuns,
  getById,
  list,
});
