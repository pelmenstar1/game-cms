import preview from '#storybook/preview';

import { BitmapFontPreviewController } from './BitmapFontPreviewController';

const meta = preview.meta({ component: BitmapFontPreviewController });

export const Sdf = meta.story({
  args: {
    atlasUrl: '/fonts/sdf/comicsdf.fnt',
    texturesUrls: ['/fonts/sdf/texture.png'],
  },
});

export const Msdf = meta.story({
  args: {
    atlasUrl: '/fonts/msdf/PinyonScript-Regular.fnt',
    texturesUrls: ['/fonts/msdf/Pinyon.webp'],
  },
});
