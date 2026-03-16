import { cms, env } from '@game-cms/global';
import { MaybePromise } from '@game-cms/shared';
import { ObjectId } from 'mongodb';

type GetContentContext = {
  getUrl: (id: ObjectId) => MaybePromise<string>;
};

export type ShadowFileOrchestrationOptions<Args> = {
  mime: string;
  shadowName: string;
  getContent: (
    text: string,
    args: Args,
    context: GetContentContext
  ) => Promise<string>;
};

export function createShadowFileOrchestration<Args>(
  options: ShadowFileOrchestrationOptions<Args>
) {
  const getContentContext: GetContentContext = {
    getUrl: (id) => {
      const deterministicUrls =
        env().config.storage.provider.meta?.deterministicUrls ?? true;

      if (!deterministicUrls) {
        throw new Error(
          'Cannot create shadow files with non-deterministic URLs in current storage provider'
        );
      }

      return cms().service('base::storage').getUrl(id);
    },
  };

  async function loadAndGetContent(
    originalId: ObjectId,
    args: Args
  ): Promise<string> {
    const originalContent = await cms()
      .service('base::storage')
      .getContent(originalId, { encoding: 'utf8' });

    return options.getContent(originalContent, args, getContentContext);
  }

  return {
    async upload(originFile: ObjectId, args: Args) {
      const shadowContent = await loadAndGetContent(originFile, args);

      const { id: shadowAtlasId } = await cms()
        .service('base::storage')
        .uploadFile({
          name: options.shadowName,
          mime: options.mime,
          content: Buffer.from(shadowContent, 'utf8'),
          hidden: true,
          originFile,
        });

      return shadowAtlasId;
    },
    async patch(targetShadowId: ObjectId, originalId: ObjectId, args: Args) {
      const shadowContent = await loadAndGetContent(originalId, args);

      await cms()
        .service('base::storage')
        .patchContent(targetShadowId, Buffer.from(shadowContent, 'utf8'));
    },
  };
}
