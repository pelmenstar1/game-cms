import { StorageItemType } from '@game-cms/base-core';
import { expect, test } from '@game-cms/e2e';

import {
  createFolder,
  deleteStorageItemById,
  getStorageItemInfo,
  listStorageItems,
  uploadFile,
} from '../../requests/index.js';
import { describeApiFlow } from '../apiFlow.js';

describeApiFlow('storage file flow', (contextRef) => {
  test('upload, get, list, delete file', async () => {
    const { context } = contextRef;

    const filename = 'test.txt';
    const content = new Blob(['hello world'], { type: 'text/plain' });

    const { id, url } = await uploadFile(context, { content, filename });

    expect(id).toBeDefined();
    expect(url).toBeDefined();

    const info = await getStorageItemInfo(context, id);

    expect(info).toMatchObject({
      type: StorageItemType.FILE,
      name: filename,
    });

    const { items } = await listStorageItems(context, {
      size: 100,
      parent: 'no-parent',
    });

    expect(items.some((item) => item.id === id)).toBe(true);

    await deleteStorageItemById(context, id);

    await expect(() => getStorageItemInfo(context, id)).rejects.toBeDefined();
  });

  test('create, get, list contents, delete folder', async () => {
    const { context } = contextRef;

    const folderName = 'test-folder';

    const { id: folderId } = await createFolder(context, { name: folderName });

    expect(folderId).toBeDefined();

    const folderInfo = await getStorageItemInfo(context, folderId);

    expect(folderInfo).toMatchObject({
      type: StorageItemType.FOLDER,
      name: folderName,
    });

    const { id: fileId } = await uploadFile(context, {
      content: new Blob(['data'], { type: 'text/plain' }),
      filename: 'nested.txt',
      parent: folderId,
    });

    const { items } = await listStorageItems(context, {
      size: 100,
      parent: folderId,
    });

    expect(items.some((item) => item.id === fileId)).toBe(true);

    await deleteStorageItemById(context, folderId, { force: true });

    await expect(() =>
      getStorageItemInfo(context, folderId)
    ).rejects.toBeDefined();
  });
});
