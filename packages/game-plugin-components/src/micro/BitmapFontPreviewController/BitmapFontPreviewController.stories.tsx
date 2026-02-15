import preview from '#storybook/preview';

import { BitmapFontPreviewController } from './BitmapFontPreviewController';

const meta = preview.meta({ component: BitmapFontPreviewController });

export const Primary: unknown = meta.story({
  args: {
    atlasUrl: '/fonts/sdf/comicsdf.fnt',
    texturesUrls: ['/fonts/sdf/texture.png'],
  },
});
