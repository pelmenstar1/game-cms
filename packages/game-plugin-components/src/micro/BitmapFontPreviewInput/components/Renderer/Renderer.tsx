import { BitmapFont } from 'pixi.js';
import { useEffect, useState } from 'react';

import { PixiScene } from '../../../PixiScene';
import { BitmapFontInputApp, createBitmapFontInputApp } from './app';

export interface RendererProps {
  className?: string;
  text: string;
  font: BitmapFont;
}

export function Renderer({ className, text, font }: RendererProps) {
  const [app, setApp] = useState<BitmapFontInputApp | null>(null);

  useEffect(() => {
    app?.setText(text);
  }, [app, text]);

  useEffect(() => {
    app?.setFont(font);
  }, [app, font]);

  return (
    <PixiScene
      sceneLoader={createBitmapFontInputApp}
      onSceneLoaded={setApp}
      className={className}
    />
  );
}
