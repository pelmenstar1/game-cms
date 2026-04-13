import {
  AbortOptions,
  EntityCheckRun,
  EntityCheckRunWithId,
  ListEntityCheckRunsOptions,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { PageData } from '@game-cms/shared';
import { ObjectId } from 'mongodb';

import { getPage } from '../../../utils/paging.js';

declare module '@game-cms/base-core' {
  interface DatabaseCollectionTypeMap {
    'base::entityCheckRun': EntityCheckRun;
  }
}

function collection() {
  return cms().service('base::database').collection('base::entityCheckRun');
}

async function addRun(info: EntityCheckRun) {
  await collection().insertOne(info);
}

export type ListOptions = ListEntityCheckRunsOptions & AbortOptions;

async function list(
  options: ListOptions
): Promise<PageData<EntityCheckRunWithId<ObjectId>>> {
  const { checkId, entityId, documentId, offset, size, signal } = options;

  const result = await getPage(
    collection(),
    { size, offset, signal },
    {
      pre: [{ $match: { checkId, entityId, documentId } }],
    }
  );

  return {
    items: result.items.map((item) => ({ ...item, id: item._id })),
    meta: result.meta,
  };
}

export default service({
  lifecycle: {},
  addRun,
  list,
});
