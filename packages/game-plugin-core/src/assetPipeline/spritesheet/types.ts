import { ObjectId } from 'mongodb';

export type SpritesheetStorageEntry = {
  imageId: ObjectId;
  atlasId: ObjectId;
};

export type SpritesheetUrlEntry = {
  imageUrl: string;
  atlasUrl: string;
};

declare module '../core.js' {
  interface GameAssetPipelineStepTypeRegistry {
    spritesheet: {
      out: Record<string, SpritesheetUrlEntry>;
      storage: Record<string, SpritesheetStorageEntry>;
    };
  }
}
