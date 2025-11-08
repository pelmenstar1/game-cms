import { objectId, stringObjectId } from '@game-cms/shared/mongo';
import type { ObjectId } from 'mongodb';
import z from 'zod';

import type { ToClientType } from './typeutil.js';

export type StorageFolderItem = {
  type: 'folder' | 'file';
  id: ObjectId;
};

export type StorageFolder = {
  name: string;
  parent?: ObjectId;
};

const folderName = z
  .string()
  .min(1)
  .refine((value) => value.includes('/'), {
    error: 'Folder name cannot have slashes',
  });

export const createFolderPayload = z.object({
  name: folderName,
  folderId: stringObjectId.optional(),
});

export type CreateFolderPayload = z.infer<typeof createFolderPayload>;

export type ClientCreateFolderPayload = ToClientType<CreateFolderPayload>;

export const createFolderResponse = z.object({
  id: objectId,
});

export type CreateFolderResponse = z.infer<typeof createFolderPayload>;

export const updateFolderPayload = z.object({
  name: folderName,
});

export type UpdateFolderPayload = z.infer<typeof updateFolderPayload>;

export const deleteFolderOptions = z.object({
  withFiles: z.boolean().optional(),
});

export type DeleteFolderOptions = z.infer<typeof deleteFolderOptions>;
export type ClientDeleteFolderOptions = ToClientType<DeleteFolderOptions>;

export const getFolderResponse = z.object({
  name: folderName,
  folderId: objectId.optional(),
});

export type GetFolderResponse = z.infer<typeof getFolderResponse>;
export type ClientGetFolderResponse = ToClientType<GetFolderResponse>;
