import { storageAddon } from '@game-cms/base-core';
import type { Size } from '@game-cms/shared';
import sharp, { type ResizeOptions } from 'sharp';

import type { AnyFormatOptions } from './types.js';
import { filePathWithWidth, tryGetImageMeta } from './utils.js';

type Data<Variant> = { variants: Variant[] };

declare module '@game-cms/base-core' {
  interface StorageAddonTypeMap<Extra> {
    responsive: {
      optional: true;
      hydrated: Data<{ size: Size; url: string }>;
      persistent: Data<{ size: Size; extra: Extra }>;
    };
  }
}

type ResponsiveImagesOptions = {
  breakpoints: number[];
  resizeOptions?: Pick<
    ResizeOptions,
    'kernel' | 'withoutEnlargement' | 'withoutReduction' | 'fastShrinkOnLoad'
  >;
  outputOptions?: AnyFormatOptions;
};

export function responsiveImages(options: ResponsiveImagesOptions) {
  return storageAddon({
    id: 'responsive',
    getData: async (item, context) => {
      const meta = await tryGetImageMeta(item.content);
      if (meta === undefined) {
        return;
      }

      const aspectRatio = meta.height / meta.width;

      const targetWidths = options.breakpoints.filter(
        (breakpoint) => breakpoint < meta.width
      );

      const variants = await Promise.all(
        targetWidths.map(async (targetWidth) => {
          const targetHeight = Math.round(targetWidth * aspectRatio);

          const stream = sharp(item.content)
            .resize({
              width: targetWidth,
              height: targetHeight,
              ...options.resizeOptions,
            })
            .toFormat(meta.format, options.outputOptions);

          const { extra } = await context.provider.protocol.upload({
            name: filePathWithWidth(item.name, targetWidth),
            mime: item.mime,
            content: stream,
          });

          return { size: { width: targetWidth, height: targetHeight }, extra };
        })
      );

      return { variants };
    },
    hydrateData: async (data, context) => {
      const { protocol } = context.provider;

      return {
        variants: await Promise.all(
          data.variants.map(async ({ size, extra }) => ({
            size,
            url: await protocol.getUrl(extra),
          }))
        ),
      };
    },
  });
}
