import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

export type ShadowFileOrchestrationOptions<Args> = {
  mime: string;
  shadowName: string;
  getContent: (text: string, args: Args) => Promise<string>;
};

export function createShadowFileOrchestration<Args>(
  options: ShadowFileOrchestrationOptions<Args>
) {
  async function loadAndGetContent(
    originalId: ObjectId,
    args: Args
  ): Promise<string> {
    const originalContent = await cms()
      .service('base::storage')
      .getContent(originalId, { encoding: 'utf8' });

    return options.getContent(originalContent, args);
  }

  return {
    async upload(originalId: ObjectId, args: Args) {
      const shadowContent = await loadAndGetContent(originalId, args);

      const { id: shadowAtlasId } = await cms()
        .service('base::storage')
        .uploadFile({
          name: options.shadowName,
          mime: options.mime,
          content: Buffer.from(shadowContent, 'utf8'),
          hidden: true,
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
