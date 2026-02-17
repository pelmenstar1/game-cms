import { Assets } from 'pixi.js';

export async function initPixiAssets() {
  await Assets.init({
    preferences: {
      crossOrigin: 'use-credentials',
    },
  });
}
