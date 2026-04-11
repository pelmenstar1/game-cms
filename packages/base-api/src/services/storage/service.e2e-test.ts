import {
  type CreateFolderPayload,
  StorageItemType,
  type UploadFilePayload,
} from '@game-cms/base-core';
import { describe, expect, it } from '@game-cms/e2e';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

function service() {
  return cms().service('base::storage');
}

const testContent = new Uint8Array(Buffer.from('hello storage'));

async function createTemporalFile(overrides?: Partial<UploadFilePayload>) {
  const result = await service().uploadFile({
    name: 'test-file.txt',
    mime: 'text/plain',
    content: testContent,
    ...overrides,
  });

  return {
    result,
    [Symbol.asyncDispose]: async () => {
      await service().deleteById(result.id);
    },
  };
}

async function createTemporalFolder(payload: CreateFolderPayload) {
  const id = await service().createFolder(payload);

  return {
    id,
    [Symbol.asyncDispose]: async () => {
      await service().deleteById(id);
    },
  };
}

describe('uploadFile', () => {
  it('should upload a file and return id and url', async () => {
    await using f = await createTemporalFile();

    expect(f.result.id).toBeInstanceOf(ObjectId);
    expect(typeof f.result.url).toBe('string');
    expect(f.result.url.length).toBeGreaterThan(0);
  });
});

describe('createFolder', () => {
  it('should create a folder and return its ObjectId', async () => {
    await using folder = await createTemporalFolder({ name: 'test-folder' });

    expect(folder.id).toBeInstanceOf(ObjectId);
  });
});

describe('getInfo', () => {
  it('should return file info', async () => {
    await using f = await createTemporalFile({ name: 'info-file.txt' });

    const info = await service().getInfo(f.result.id);

    expect(info).toMatchObject({
      id: f.result.id,
      type: StorageItemType.FILE,
      name: 'info-file.txt',
      mime: 'text/plain',
    });
  });

  it('should return folder info', async () => {
    await using folder = await createTemporalFolder({ name: 'info-folder' });

    const info = await service().getInfo(folder.id);

    expect(info).toMatchObject({
      id: folder.id,
      type: StorageItemType.FOLDER,
      name: 'info-folder',
    });
  });

  it('should return null for non-existent id', async () => {
    const info = await service().getInfo(new ObjectId());

    expect(info).toBeNull();
  });
});

describe('getContent', () => {
  it('should return file content as Uint8Array', async () => {
    await using f = await createTemporalFile();

    const content = await service().getContent(f.result.id);

    expect(content).toEqual(testContent);
  });

  it('should return file content as string when encoding is provided', async () => {
    await using f = await createTemporalFile();

    const content = await service().getContent(f.result.id, {
      encoding: 'utf8',
    });

    expect(content).toBe('hello storage');
  });

  it('should throw for a non-existent file id', async () => {
    await expect(service().getContent(new ObjectId())).rejects.toThrow();
  });
});

describe('patchContent', () => {
  it('should update file content', async () => {
    await using f = await createTemporalFile();

    const updatedContent = new Uint8Array(Buffer.from('updated content'));

    await service().patchContent(f.result.id, updatedContent);

    const content = await service().getContent(f.result.id);

    expect(content).toEqual(updatedContent);
  });
});

describe('list', () => {
  it('should list items with pagination metadata', async () => {
    await using _ = await createTemporalFile({ name: 'list-file.txt' });

    const result = await service().list({ size: 10, offset: 0 });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.meta.totalCount).toBeGreaterThan(0);
  });

  it('should filter items by parent folder', async () => {
    await using folder = await createTemporalFolder({ name: 'list-parent' });
    await using _ = await createTemporalFile({
      name: 'child-file.txt',
      parent: folder.id,
    });

    const result = await service().list({
      size: 10,
      offset: 0,
      parent: folder.id,
    });

    expect(result.items.length).toBe(1);
    expect(result.items[0]).toMatchObject({ name: 'child-file.txt' });
  });

  it('should find items by text search', async () => {
    const uniqueName = 'uniquestoragexyz-file.txt';

    await using _ = await createTemporalFile({ name: uniqueName });

    const result = await service().list({
      size: 10,
      offset: 0,
      search: 'uniquestoragexyz',
    });

    expect(result.items.some((item) => item.name === uniqueName)).toBe(true);
  });
});

describe('deleteById', () => {
  it('should delete a file and make it unavailable via getInfo', async () => {
    const { id } = await service().uploadFile({
      name: 'to-delete.txt',
      mime: 'text/plain',
      content: testContent,
    });

    await service().deleteById(id);

    const info = await service().getInfo(id);

    expect(info).toBeNull();
  });

  it('should delete a folder and move its children to root', async () => {
    const folderId = await service().createFolder({ name: 'folder-to-delete' });

    const { id: fileId } = await service().uploadFile({
      name: 'child-of-deleted.txt',
      mime: 'text/plain',
      content: testContent,
      parent: folderId,
    });

    await service().deleteById(folderId);

    const folderInfo = await service().getInfo(folderId);
    expect(folderInfo).toBeNull();

    // child file is moved to root, not deleted
    const fileInfo = await service().getInfo(fileId);
    expect(fileInfo).toBeDefined();

    await service().deleteById(fileId);
  });
});
