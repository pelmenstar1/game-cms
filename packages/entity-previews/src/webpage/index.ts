import { EntityPreviewController } from '@game-cms/base-core';

import { WebpageEntityPreviewOptions } from './types.js';

export * from './source.js';
export * from './types.js';

export function webpageEntityPreview(
  options: WebpageEntityPreviewOptions
): EntityPreviewController<WebpageEntityPreviewOptions> {
  return {
    renderer: () => import('./renderer.js'),
    options,
  };
}
