import { BitmapFont } from 'pixi.js';
import { useEffect, useState } from 'react';

import { PixiScene } from '../PixiScene';
import { BitmapFontPreviewApp, createBitmapFontPreviewApp } from './app';

export interface BitmapFontPreviewRendererProps {
  className?: string;
  font: BitmapFont;
}

export function BitmapFontPreviewRenderer({
  className,
  font,
}: BitmapFontPreviewRendererProps) {
  const [app, setApp] = useState<BitmapFontPreviewApp | null>(null);

  useEffect(() => {
    if (app) {
      app.setFont(font);
    }
  }, [app, font]);

  return (
    <PixiScene
      className={className}
      sceneLoader={createBitmapFontPreviewApp}
      onSceneLoaded={setApp}
    />
  );
}
