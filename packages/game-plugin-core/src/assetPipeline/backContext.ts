import '@game-cms/core';

import { GameAssetPipeline } from './core.js';

declare module '@game-cms/core' {
  interface ComponentBackContext {
    assetPipelines?: Record<string, GameAssetPipeline>;
  }
}
