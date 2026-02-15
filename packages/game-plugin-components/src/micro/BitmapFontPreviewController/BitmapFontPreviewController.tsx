import { createAbortController, handleResponseError } from '@game-cms/shared';
import { DataLoader, useAbstractQueryResult } from '@game-cms/ui';
import {
  Assets,
  BitmapFont,
  bitmapFontXMLStringParser,
  Texture,
  TextureSourceOptions,
  UnresolvedAsset,
} from 'pixi.js';

import { BitmapFontPreviewRenderer } from '../BitmapFontPreviewRenderer';

export interface BitmapFontPreviewControllerProps {
  className?: string;
  texturesUrls: string[];
  atlasUrl: string;
}

export function BitmapFontPreviewController({
  className,
  texturesUrls,
  atlasUrl,
}: BitmapFontPreviewControllerProps) {
  const result = useAbstractQueryResult(() => {
    const abortController = createAbortController();

    const worker = async () => {
      const atlasResponse = await fetch(atlasUrl, {
        signal: abortController?.signal,
      });

      if (!atlasResponse.ok) {
        await handleResponseError(atlasResponse, 'Failed to load atlas');
      }

      const atlasText = await atlasResponse.text();
      const fontData = bitmapFontXMLStringParser.parse(atlasText);

      const textureOptions: TextureSourceOptions = fontData.distanceField
        ? {
            scaleMode: 'linear',
            alphaMode: 'premultiply-alpha-on-upload',
            autoGenerateMipmaps: false,
            resolution: 1,
          }
        : {};

      const textures = await Assets.load<Texture>(
        texturesUrls.map(
          (url): UnresolvedAsset => ({ src: url, options: textureOptions })
        )
      );

      return new BitmapFont({
        data: fontData,
        textures: Object.values(textures),
      });
    };

    return {
      promise: worker(),
      abort: () => {
        abortController?.abort();
      },
    };
  }, [texturesUrls, atlasUrl]);

  return (
    <DataLoader className={className} result={result}>
      {(font) => <BitmapFontPreviewRenderer font={font} />}
    </DataLoader>
  );
}
