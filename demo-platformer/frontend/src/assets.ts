import { Assets, ProgressCallback, Rectangle, Texture } from 'pixi.js';

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
 * Build an AnimationSet from a map of { animationName → SpriteStripDef }.
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

// ---- Character sprite strip definitions ----

const CHARACTER_ANIMATIONS = [
  'Idle (32x32)',
  'Run (32x32)',
  'Jump (32x32)',
  'Fall (32x32)',
  'Double Jump (32x32)',
  'Hit (32x32)',
  'Wall Jump (32x32)',
] as const;

const ANIMATION_NAME_MAP: Record<string, string> = {
  'Idle (32x32)': 'idle',
  'Run (32x32)': 'run',
  'Jump (32x32)': 'jump',
  'Fall (32x32)': 'fall',
  'Double Jump (32x32)': 'doubleJump',
  'Hit (32x32)': 'hit',
  'Wall Jump (32x32)': 'wallJump',
};

export function getCharacterStripDefs(
  folder: string
): Record<string, SpriteStripDef> {
  const defs: Record<string, SpriteStripDef> = {};

  for (const fileName of CHARACTER_ANIMATIONS) {
    const animName = ANIMATION_NAME_MAP[fileName];
    defs[animName] = {
      path: `pack/Main Characters/${folder}/${fileName}.png`,
      frameWidth: 32,
      frameHeight: 32,
    };
  }

  return defs;
}

// ---- Asset manifest & loading ----

const CHARACTERS = ['Ninja Frog', 'Mask Dude', 'Pink Man', 'Virtual Guy'];

const BACKGROUNDS = [
  'Blue',
  'Brown',
  'Gray',
  'Green',
  'Pink',
  'Purple',
  'Yellow',
];

const FRUITS = [
  'Apple',
  'Bananas',
  'Cherries',
  'Kiwi',
  'Melon',
  'Orange',
  'Pineapple',
  'Strawberry',
];

function buildAssetManifest(): string[] {
  const paths: string[] = [];

  // Characters
  for (const char of CHARACTERS) {
    for (const anim of CHARACTER_ANIMATIONS) {
      paths.push(`pack/Main Characters/${char}/${anim}.png`);
    }
  }
  paths.push(
    'pack/Main Characters/Appearing (96x96).png',
    'pack/Main Characters/Desappearing (96x96).png',
    'pack/Terrain/Terrain (16x16).png'
  );

  // Backgrounds
  for (const bg of BACKGROUNDS) {
    paths.push(`pack/Background/${bg}.png`);
  }

  // Fruits
  for (const fruit of FRUITS) {
    paths.push(`pack/Items/Fruits/${fruit}.png`);
  }
  paths.push('pack/Items/Fruits/Collected.png');

  // Boxes
  for (const box of ['Box1', 'Box2', 'Box3']) {
    paths.push(
      `pack/Items/Boxes/${box}/Idle.png`,
      `pack/Items/Boxes/${box}/Hit (28x24).png`,
      `pack/Items/Boxes/${box}/Break.png`
    );
  }

  // Checkpoints
  paths.push(
    'pack/Items/Checkpoints/Start/Start (Idle).png',
    'pack/Items/Checkpoints/Start/Start (Moving) (64x64).png',
    'pack/Items/Checkpoints/End/End (Idle).png',
    'pack/Items/Checkpoints/End/End (Pressed) (64x64).png',
    'pack/Items/Checkpoints/Checkpoint/Checkpoint (No Flag).png',
    'pack/Items/Checkpoints/Checkpoint/Checkpoint (Flag Out) (64x64).png',
    'pack/Items/Checkpoints/Checkpoint/Checkpoint (Flag Idle)(64x64).png',
    'pack/Traps/Spikes/Idle.png',
    'pack/Traps/Saw/Off.png',
    'pack/Traps/Saw/On (38x38).png',
    'pack/Traps/Saw/Chain.png',
    'pack/Traps/Fire/Off.png',
    'pack/Traps/Fire/On (16x32).png',
    'pack/Traps/Fire/Hit (16x32).png',
    'pack/Traps/Arrow/Idle (18x18).png',
    'pack/Traps/Arrow/Hit (18x18).png',
    'pack/Traps/Rock Head/Idle.png',
    'pack/Traps/Rock Head/Blink (42x42).png',
    'pack/Traps/Rock Head/Top Hit (42x42).png',
    'pack/Traps/Rock Head/Bottom Hit (42x42).png',
    'pack/Traps/Rock Head/Left Hit (42x42).png',
    'pack/Traps/Rock Head/Right Hit (42x42).png',
    'pack/Traps/Spike Head/Idle.png',
    'pack/Traps/Spike Head/Blink (54x52).png',
    'pack/Traps/Spike Head/Top Hit (54x52).png',
    'pack/Traps/Spike Head/Bottom Hit (54x52).png',
    'pack/Traps/Spike Head/Left Hit (54x52).png',
    'pack/Traps/Spike Head/Right Hit (54x52).png',
    'pack/Traps/Falling Platforms/Off.png',
    'pack/Traps/Falling Platforms/On (32x10).png',
    'pack/Traps/Fan/Off.png',
    'pack/Traps/Fan/On (24x8).png',
    'pack/Traps/Trampoline/Idle.png',
    'pack/Traps/Trampoline/Jump (28x28).png',
    'pack/Traps/Spiked Ball/Spiked Ball.png',
    'pack/Traps/Spiked Ball/Chain.png',
    'pack/Traps/Blocks/Idle.png',
    'pack/Traps/Blocks/HitSide (22x22).png',
    'pack/Traps/Blocks/HitTop (22x22).png',
    'pack/Traps/Blocks/Part 1 (22x22).png',
    'pack/Traps/Blocks/Part 2 (22x22).png',
    'pack/Traps/Platforms/Brown Off.png',
    'pack/Traps/Platforms/Brown On (32x8).png',
    'pack/Traps/Platforms/Grey Off.png',
    'pack/Traps/Platforms/Grey On (32x8).png',
    'pack/Traps/Platforms/Chain.png',
    'pack/Traps/Sand Mud Ice/Sand Mud Ice (16x6).png',
    'pack/Traps/Sand Mud Ice/Sand Particle.png',
    'pack/Traps/Sand Mud Ice/Mud Particle.png',
    'pack/Traps/Sand Mud Ice/Ice Particle.png',
    'pack/Other/Dust Particle.png',
    'pack/Other/Shadow.png',
    'pack/Other/Confetti (16x16).png',
    'pack/Other/Transition.png'
  );

  return paths;
}

/** Load all game assets. Call once at startup. */
export async function loadAllAssets(
  onProgress?: ProgressCallback
): Promise<void> {
  const manifest = buildAssetManifest();

  // Register all assets with their path as alias
  for (const path of manifest) {
    Assets.add({ alias: path, src: path });
  }

  await Assets.load(manifest, onProgress);
}
