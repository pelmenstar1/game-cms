import type {
  CreateFolderPayload,
  UpdateFolderPayload,
} from '@game-cms/base-types';
import { service } from '@game-cms/utils';
import type { ObjectId } from 'mongodb';

function collection() {
  return cms.service('base::database').collection('base::folders');
}

export default service({
  id: 'base::folder',
  create: async (payload: CreateFolderPayload) => {
    const { insertedId } = await collection().insertOne({
      name: payload.name,
      parent: payload.folderId,
    });

    return { id: insertedId };
  },
  getById: async (id: ObjectId) => {
    return collection().findOne({ _id: id });
  },
  updateById: async (id: ObjectId, payload: UpdateFolderPayload) => {
    await collection().updateOne({ _id: id }, { $set: { name: payload.name } });
  },
  deleteById: async (id: ObjectId) => {
    await cms.service('base::database').withTransaction(async (session) => {
      await cms.service('base::file').moveFilesToRoot(id, session);
      await collection().deleteOne({ _id: id }, { session });
    });
  },
});
