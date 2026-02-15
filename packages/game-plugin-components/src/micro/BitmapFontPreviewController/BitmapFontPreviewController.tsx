import { createAbortController, handleResponseError } from '@game-cms/shared';
import { DataLoader, Tab, Tabs, useAbstractQueryResult } from '@game-cms/ui';
import {
  Assets,
  BitmapFont,
  bitmapFontXMLStringParser,
  ResolvedAsset,
  Texture,
  TextureSourceOptions,
} from 'pixi.js';
import { useState } from 'react';

import { BitmapFontPreviewGrid } from '../BitmapFontPreviewGrid';
import { BitmapFontPreviewInput } from '../BitmapFontPreviewInput';

export interface BitmapFontPreviewControllerProps {
  className?: string;
  texturesUrls: string[];
  atlasUrl: string;
}

type TabName = 'grid' | 'input';

export function BitmapFontPreviewController({
  className,
  texturesUrls,
  atlasUrl,
}: BitmapFontPreviewControllerProps) {
  const [selectedTab, setSelectedTab] = useState<TabName>('grid');

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

      const textures = await Assets.loader.load<Texture>(
        texturesUrls.map(
          (url): ResolvedAsset => ({ src: url, data: textureOptions })
        )
      );

      const font = new BitmapFont(
        {
          data: fontData,
          textures: Object.values(textures),
        },
        atlasUrl
      );

      // Pixi internally relies on this cache key to find bitmap font.
      // We must do it otherwise Pixi will use dynamic bitmap fonts.
      Assets.cache.set(`${fontData.fontFamily}-bitmap`, font);

      return font;
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
      {(font) => (
        <Tabs selectedTab={selectedTab} onSelectedTabChanged={setSelectedTab}>
          <Tab tabId="grid" title="Grid">
            <BitmapFontPreviewGrid font={font} />
          </Tab>

          <Tab tabId="input" title="Input">
            <BitmapFontPreviewInput font={font} />
          </Tab>
        </Tabs>
      )}
    </DataLoader>
  );
}
