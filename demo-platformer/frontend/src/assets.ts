import { Assets, Rectangle, Texture } from 'pixi.js';

import { TERRAIN_COLS, TILE_SIZE } from './constants';
import type { AnimationSet, SpriteStripDef } from './types';

/**
 * Slice a horizontal sprite strip into an array of frame textures.
 * The strip is assumed to be a single row of equal-width frames.
 */
export function sliceSpriteStrip(
  texture: Texture,
  frameWidth: number,
  frameHeight: number
): Texture[] {
  const frameCount = Math.floor(texture.width / frameWidth);
  const frames: Texture[] = [];

  for (let i = 0; i < frameCount; i++) {
    const frame = new Texture({
      source: texture.source,
      frame: new Rectangle(i * frameWidth, 0, frameWidth, frameHeight),
    });
    frames.push(frame);
  }

  // If the strip is a single frame (e.g. Jump, Fall, static Idle), return at least that one
  if (frames.length === 0 && texture.width >= frameWidth) {
    frames.push(
      new Texture({
        source: texture.source,
        frame: new Rectangle(0, 0, frameWidth, frameHeight),
      })
    );
  }

  return frames;
}

/**
 * Extract a single tile from the terrain tileset atlas.
 * Tiles are arranged in a grid of TERRAIN_COLS columns, each TILE_SIZE x TILE_SIZE.
 * Index is 0-based, row-major.
 */
export function getTerrainTile(
  terrainTexture: Texture,
  tileIndex: number
): Texture {
  const col = tileIndex % TERRAIN_COLS;
  const row = Math.floor(tileIndex / TERRAIN_COLS);

  return new Texture({
    source: terrainTexture.source,
    frame: new Rectangle(
      col * TILE_SIZE,
      row * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    ),
  });
}

/**
 * Build an AnimationSet from a map of { animationName -> SpriteStripDef }.
 * All strip PNGs must be loaded via Assets.load() first.
 */
export function buildAnimationSet(
  stripDefs: Record<string, SpriteStripDef>
): AnimationSet {
  const set: AnimationSet = {};

  for (const [name, def] of Object.entries(stripDefs)) {
    const texture = Assets.get<Texture>(def.path);
    set[name] = sliceSpriteStrip(texture, def.frameWidth, def.frameHeight);
  }

  return set;
}

// ---- Static engine assets (not managed by CMS) ----

const CHECKPOINT_ASSETS = [
  'pack/Items/Checkpoints/Start/Start (Idle).png',
  'pack/Items/Checkpoints/Start/Start (Moving) (64x64).png',
  'pack/Items/Checkpoints/End/End (Idle).png',
  'pack/Items/Checkpoints/End/End (Pressed) (64x64).png',
  'pack/Items/Checkpoints/Checkpoint/Checkpoint (No Flag).png',
  'pack/Items/Checkpoints/Checkpoint/Checkpoint (Flag Out) (64x64).png',
  'pack/Items/Checkpoints/Checkpoint/Checkpoint (Flag Idle)(64x64).png',
];

/**
 * Load only the static engine assets required by the current CMS data.
 * Backgrounds are loaded based on which colors the rooms actually reference.
 */
export async function loadStaticAssets(
  backgroundColors: string[],
  onProgress?: (progress: number) => void
): Promise<void> {
  const paths: string[] = [
    'pack/Terrain/Terrain (16x16).png',
    'pack/Items/Fruits/Collected.png',
    ...CHECKPOINT_ASSETS,
  ];

  const uniqueBgs = [...new Set(backgroundColors)];
  for (const bg of uniqueBgs) {
    paths.push(`pack/Background/${bg}.png`);
  }

  for (const path of paths) {
    Assets.add({ alias: path, src: path });
  }

  await Assets.load(paths, onProgress);
}
