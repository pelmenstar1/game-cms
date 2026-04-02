import fs from 'node:fs';
import path from 'node:path';

import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

/** Resolve a sprite file relative to the frontend public/pack directory. */
const PACK_DIR = path.resolve(__dirname, '../../..', 'frontend/public/pack');

async function uploadSprite(filePath: string): Promise<string> {
  const storage = cms().service('base::storage');
  const absolute = path.join(PACK_DIR, filePath);
  const content = fs.readFileSync(absolute);
  const { id } = await storage.uploadFile({
    name: path.basename(filePath),
    mime: 'image/png',
    content,
  });
  return id.toString();
}

const HERO_DEF = {
  name: 'Ninja Frog',
  folder: 'Ninja Frog',
  frameWidth: 32,
  frameHeight: 32,
  hp: 3,
  speed: 160,
  jumpForce: 350,
  animations: [
    { state: 'idle', file: 'Main Characters/Ninja Frog/Idle (32x32).png' },
    { state: 'run', file: 'Main Characters/Ninja Frog/Run (32x32).png' },
    { state: 'jump', file: 'Main Characters/Ninja Frog/Jump (32x32).png' },
    { state: 'fall', file: 'Main Characters/Ninja Frog/Fall (32x32).png' },
    {
      state: 'doubleJump',
      file: 'Main Characters/Ninja Frog/Double Jump (32x32).png',
    },
    { state: 'hit', file: 'Main Characters/Ninja Frog/Hit (32x32).png' },
    {
      state: 'wallJump',
      file: 'Main Characters/Ninja Frog/Wall Jump (32x32).png',
    },
  ],
};

interface TrapAnimDef {
  state: string;
  file: string;
  frameWidth: number;
  frameHeight: number;
}

interface TrapDefInput {
  name: string;
  folder: string;
  damage: number;
  behavior: 'static' | 'moving' | 'triggered';
  moveRange: number;
  moveSpeed: number;
  bounceForce: number;
  animations: TrapAnimDef[];
}

const TRAP_DEFS: Record<string, TrapDefInput> = {
  spikes: {
    name: 'Spikes',
    folder: 'Traps/Spikes',
    damage: 1,
    behavior: 'static',
    moveRange: 0,
    moveSpeed: 0,
    bounceForce: 0,
    animations: [
      {
        state: 'idle',
        file: 'Traps/Spikes/Idle.png',
        frameWidth: 16,
        frameHeight: 16,
      },
    ],
  },
  saw: {
    name: 'Saw',
    folder: 'Traps/Saw',
    damage: 1,
    behavior: 'moving',
    moveRange: 96,
    moveSpeed: 80,
    bounceForce: 0,
    animations: [
      {
        state: 'off',
        file: 'Traps/Saw/Off.png',
        frameWidth: 38,
        frameHeight: 38,
      },
      {
        state: 'on',
        file: 'Traps/Saw/On (38x38).png',
        frameWidth: 38,
        frameHeight: 38,
      },
    ],
  },
  fire: {
    name: 'Fire',
    folder: 'Traps/Fire',
    damage: 1,
    behavior: 'static',
    moveRange: 0,
    moveSpeed: 0,
    bounceForce: 0,
    animations: [
      {
        state: 'off',
        file: 'Traps/Fire/Off.png',
        frameWidth: 16,
        frameHeight: 32,
      },
      {
        state: 'on',
        file: 'Traps/Fire/On (16x32).png',
        frameWidth: 16,
        frameHeight: 32,
      },
    ],
  },
};

interface ItemDefInput {
  name: string;
  file: string;
  sprite: { frameWidth: number; frameHeight: number };
  effect: 'score' | 'heal' | 'speed_boost' | 'destroy';
  value: number;
}

const ITEM_DEFS: Record<string, ItemDefInput> = {
  apple: {
    name: 'Apple',
    file: 'Items/Fruits/Apple.png',
    sprite: { frameWidth: 32, frameHeight: 32 },
    effect: 'score',
    value: 10,
  },
  cherries: {
    name: 'Cherries',
    file: 'Items/Fruits/Cherries.png',
    sprite: { frameWidth: 32, frameHeight: 32 },
    effect: 'score',
    value: 20,
  },
  bananas: {
    name: 'Bananas',
    file: 'Items/Fruits/Bananas.png',
    sprite: { frameWidth: 32, frameHeight: 32 },
    effect: 'score',
    value: 15,
  },
};

// A simple demo room layout (25x15 tiles)
// 1 = solid tile (using index 1 in the terrain atlas)
const DEMO_LAYOUT: number[][] = (() => {
  const rows = 15;
  const cols = 25;
  const layout: number[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      if (r >= 13) {
        // Ground (bottom 2 rows)
        row.push(1);
      } else if (c === 0 || c === cols - 1) {
        // Walls
        row.push(1);
      } else if (r === 9 && c >= 5 && c <= 9) {
        // Floating platform
        row.push(1);
      } else if (r === 7 && c >= 14 && c <= 18) {
        // Another platform
        row.push(1);
      } else if (r === 10 && c >= 19 && c <= 22) {
        // Stepping stones
        row.push(1);
      } else {
        row.push(0);
      }
    }
    layout.push(row);
  }
  return layout;
})();

const DEMO_LEVEL = {
  name: 'Demo Level',
  rooms: [
    {
      name: 'Room 1',
      background: 'Blue' as const,
      layout: DEMO_LAYOUT,
      width: 25,
      height: 15,
      traps: [
        { defName: 'spikes', x: 7 * 16, y: 12 * 16 },
        { defName: 'spikes', x: 8 * 16, y: 12 * 16 },
        { defName: 'spikes', x: 9 * 16, y: 12 * 16 },
        { defName: 'saw', x: 12 * 16, y: 11 * 16 },
        { defName: 'fire', x: 17 * 16, y: 11 * 16 },
      ],
      items: [
        { defName: 'apple', x: 4 * 16, y: 11 * 16 },
        { defName: 'cherries', x: 6 * 16, y: 7 * 16 },
        { defName: 'bananas', x: 15 * 16, y: 5 * 16 },
        { defName: 'apple', x: 20 * 16, y: 8 * 16 },
      ],
      checkpoints: [
        { type: 'start' as const, x: 2 * 16, y: 13 * 16 },
        { type: 'end' as const, x: 23 * 16, y: 13 * 16 },
      ],
    },
  ],
};

export default apiRoute({
  url: '/move-data',
  method: 'POST',
  handler: async () => {
    const entity = cms().service('base::entity');

    // Step 1: Upload hero sprites and create hero entity
    const heroAnimations = await Promise.all(
      HERO_DEF.animations.map(async (anim) => ({
        state: anim.state,
        sprite: [await uploadSprite(anim.file)],
      }))
    );

    const hero = await entity.create(
      'hero',
      {
        name: HERO_DEF.name,
        folder: HERO_DEF.folder,
        frameWidth: HERO_DEF.frameWidth,
        frameHeight: HERO_DEF.frameHeight,
        hp: HERO_DEF.hp,
        speed: HERO_DEF.speed,
        jumpForce: HERO_DEF.jumpForce,
        animations: heroAnimations,
      },
      'published'
    );

    // Step 2: Upload trap sprites and create trap entities
    const trapIds: Record<string, string> = {};
    for (const [key, def] of Object.entries(TRAP_DEFS)) {
      const animations = await Promise.all(
        def.animations.map(async (anim) => ({
          state: anim.state,
          sprite: {
            image: [await uploadSprite(anim.file)],
            frameWidth: anim.frameWidth,
            frameHeight: anim.frameHeight,
          },
        }))
      );

      const trap = await entity.create(
        'trap',
        {
          name: def.name,
          folder: def.folder,
          damage: def.damage,
          behavior: def.behavior,
          moveRange: def.moveRange,
          moveSpeed: def.moveSpeed,
          bounceForce: def.bounceForce,
          animations,
        },
        'published'
      );
      trapIds[key] = trap.id.toString();
    }

    // Step 3: Upload item sprites and create item entities
    const itemIds: Record<string, string> = {};
    for (const [key, def] of Object.entries(ITEM_DEFS)) {
      const imageId = await uploadSprite(def.file);
      const item = await entity.create(
        'item',
        {
          name: def.name,
          sprite: {
            image: [imageId],
            frameWidth: def.sprite.frameWidth,
            frameHeight: def.sprite.frameHeight,
          },
          effect: def.effect,
          value: def.value,
        },
        'published'
      );
      itemIds[key] = item.id.toString();
    }

    // Step 4: Create room entities
    const roomIds: string[] = [];
    for (const roomDef of DEMO_LEVEL.rooms) {
      const room = await entity.create(
        'room',
        {
          name: roomDef.name,
          background: roomDef.background,
          width: roomDef.width,
          height: roomDef.height,
          layout: roomDef.layout,
          traps: roomDef.traps.map((t) => ({
            trap: trapIds[t.defName] ?? '',
            x: t.x,
            y: t.y,
          })),
          items: roomDef.items.map((i) => ({
            item: itemIds[i.defName] ?? '',
            x: i.x,
            y: i.y,
          })),
          checkpoints: roomDef.checkpoints.map((c) => ({
            type: c.type,
            x: c.x,
            y: c.y,
          })),
        },
        'published'
      );
      roomIds.push(room.id.toString());
    }

    // Step 5: Create level entity
    const level = await entity.create(
      'level',
      {
        name: DEMO_LEVEL.name,
        rooms: roomIds,
      },
      'published'
    );

    // Step 6: Create game-config singleton
    // gravity is used directly by the frontend physics engine (px/s²)
    const config = await entity.create(
      'game-config',
      {
        title: 'Pixel Dash',
        hero: hero.id.toString(),
        startingLevel: level.id.toString(),
        gravity: 800,
        defaultLives: 3,
      },
      'published'
    );

    return {
      heroId: hero.id.toString(),
      trapIds,
      itemIds,
      roomIds,
      levelId: level.id.toString(),
      configId: config.id.toString(),
    };
  },
});
