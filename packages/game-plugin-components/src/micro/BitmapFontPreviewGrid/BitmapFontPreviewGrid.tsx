import { BitmapFont } from 'pixi.js';
import { useEffect, useState } from 'react';

import { PixiScene } from '../PixiScene';
import { BitmapFontGridApp, createBitmapFontGridApp } from './app';

export interface BitmapFontPreviewGridProps {
  className?: string;
  font: BitmapFont;
}

export function BitmapFontPreviewGrid({
  className,
  font,
}: BitmapFontPreviewGridProps) {
  const [app, setApp] = useState<BitmapFontGridApp | null>(null);

  useEffect(() => {
    if (app) {
      app.setFont(font);
    }
  }, [app, font]);

  return (
    <PixiScene
      className={className}
      sceneLoader={createBitmapFontGridApp}
      onSceneLoaded={setApp}
    />
  );
}
