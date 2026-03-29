import type { ClientGameData } from '@demo-platformer/shared';
import { Application, Assets, ProgressCallback } from 'pixi.js';

import { loadAllAssets } from './assets';
import { GAME_SCALE } from './constants';
import { initInput, updateInput } from './input';
import { ChallengeScene } from './scenes/challenge-scene';
import { GameplayScene } from './scenes/gameplay-scene';
import { SceneManager } from './scenes/scene';
import { ScoreScene } from './scenes/score-scene';
import { TitleScene } from './scenes/title-scene';
import type {
  GameState,
  HeroDef,
  ItemDef,
  LevelDef,
  SpriteStripDef,
  TrapDef,
} from './types';

function toKey(name: string): string {
  return name.toLowerCase().replaceAll(/\s+/g, '_');
}

type GameDataResult = {
  heroDef: HeroDef;
  trapDefs: Record<string, TrapDef>;
  itemDefs: Record<string, ItemDef>;
  levelDef: LevelDef;
  cmsAssetUrls: string[];
};

async function fetchGameData(): Promise<GameDataResult> {
  const response = await fetch('/api/game-data');
  if (!response.ok) {
    throw new Error(
      `CMS fetch failed: ${response.status} ${response.statusText}`
    );
  }
  const data = (await response.json()) as unknown as ClientGameData;

  const heroDef: HeroDef = {
    name: data.hero.name,
    folder: data.hero.folder,
    frameWidth: data.hero.frameWidth,
    frameHeight: data.hero.frameHeight,
    hp: data.hero.hp,
    speed: data.hero.speed,
    jumpForce: data.hero.jumpForce,
  };

  const trapDefMap = new Map<string, TrapDef>();
  const itemDefMap = new Map<string, ItemDef>();
  const cmsAssetUrls: string[] = [];

  for (const room of data.level.rooms) {
    for (const entry of room.traps) {
      if (!entry.trap) continue;
      const key = toKey(entry.trap.name);
      if (trapDefMap.has(key)) continue;

      const animations: Record<string, SpriteStripDef> = {};
      for (const anim of entry.trap.animations) {
        const url = anim.sprite.image[0]?.url;
        if (url) {
          animations[anim.state] = {
            path: url,
            frameWidth: anim.sprite.frameWidth,
            frameHeight: anim.sprite.frameHeight,
          };
          cmsAssetUrls.push(url);
        }
      }
      trapDefMap.set(key, {
        name: entry.trap.name,
        folder: entry.trap.folder,
        damage: entry.trap.damage,
        behavior: entry.trap.behavior,
        moveRange: entry.trap.moveRange,
        moveSpeed: entry.trap.moveSpeed,
        bounceForce: entry.trap.bounceForce,
        animations,
      });
    }

    for (const entry of room.items) {
      if (!entry.item) continue;
      const key = toKey(entry.item.name);
      if (itemDefMap.has(key)) continue;

      const url = entry.item.sprite.image[0]?.url;
      if (url) {
        itemDefMap.set(key, {
          name: entry.item.name,
          sprite: {
            path: url,
            frameWidth: entry.item.sprite.frameWidth,
            frameHeight: entry.item.sprite.frameHeight,
          },
          effect: entry.item.effect,
          value: entry.item.value,
        });
        cmsAssetUrls.push(url);
      }
    }
  }

  const trapDefs = Object.fromEntries(trapDefMap);
  const itemDefs = Object.fromEntries(itemDefMap);

  const levelDef: LevelDef = {
    name: data.level.name,
    rooms: data.level.rooms.map((room) => ({
      name: room.name,
      background: room.background,
      width: room.width,
      height: room.height,
      layout: room.layout,
      checkpoints: room.checkpoints,
      traps: room.traps.flatMap((e) =>
        e.trap ? [{ defName: toKey(e.trap.name), x: e.x, y: e.y }] : []
      ),
      items: room.items.flatMap((e) =>
        e.item ? [{ defName: toKey(e.item.name), x: e.x, y: e.y }] : []
      ),
    })),
  };

  return { heroDef, trapDefs, itemDefs, levelDef, cmsAssetUrls };
}

// ---- Challenge mode data (hardcoded) ----

const CHALLENGE_HERO: HeroDef = {
  name: 'Mask Dude',
  folder: 'Mask Dude',
  frameWidth: 32,
  frameHeight: 32,
  hp: 2,
  speed: 180,
  jumpForce: 330,
};

const CHALLENGE_TRAP_DEFS: Record<string, TrapDef> = {
  trampoline: {
    name: 'Trampoline',
    folder: 'Traps/Trampoline',
    animations: {
      idle: {
        path: 'pack/Traps/Trampoline/Idle.png',
        frameWidth: 28,
        frameHeight: 28,
      },
    },
    damage: 0,
    behavior: 'triggered',
    moveRange: 0,
    moveSpeed: 0,
    bounceForce: 550,
  },
  arrow: {
    name: 'Arrow',
    folder: 'Traps/Arrow',
    animations: {
      idle: {
        path: 'pack/Traps/Arrow/Idle (18x18).png',
        frameWidth: 18,
        frameHeight: 18,
      },
    },
    damage: 1,
    behavior: 'moving',
    moveRange: 160,
    moveSpeed: 100,
  },
  spikes: {
    name: 'Spikes',
    folder: 'Traps/Spikes',
    animations: {
      idle: {
        path: 'pack/Traps/Spikes/Idle.png',
        frameWidth: 16,
        frameHeight: 16,
      },
    },
    damage: 1,
    behavior: 'static',
    moveRange: 0,
    moveSpeed: 0,
  },
};

const CHALLENGE_ITEM_DEFS: Record<string, ItemDef> = {
  kiwi: {
    name: 'Kiwi',
    sprite: {
      path: 'pack/Items/Fruits/Kiwi.png',
      frameWidth: 32,
      frameHeight: 32,
    },
    effect: 'score',
    value: 20,
  },
  strawberry: {
    name: 'Strawberry',
    sprite: {
      path: 'pack/Items/Fruits/Strawberry.png',
      frameWidth: 32,
      frameHeight: 32,
    },
    effect: 'score',
    value: 30,
  },
  melon: {
    name: 'Melon',
    sprite: {
      path: 'pack/Items/Fruits/Melon.png',
      frameWidth: 32,
      frameHeight: 32,
    },
    effect: 'score',
    value: 25,
  },
};

// Challenge room: a forest gauntlet with trampolines, arrows, and gaps (30x18)
const CHALLENGE_LAYOUT: number[][] = (() => {
  const rows = 18;
  const cols = 30;
  const layout: number[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      if (r >= 16) {
        // Ground with gaps for trampolines
        if ((c >= 8 && c <= 10) || (c >= 18 && c <= 20)) {
          row.push(0); // gap
        } else {
          row.push(1);
        }
      } else if (c === 0 || c === cols - 1) {
        // Walls
        row.push(1);
      } else if (r === 12 && c >= 4 && c <= 7) {
        // Low platform left
        row.push(1);
      } else if (r === 9 && c >= 12 && c <= 16) {
        // Mid platform center
        row.push(1);
      } else if (r === 6 && c >= 8 && c <= 11) {
        // High platform left-center
        row.push(1);
      } else if (r === 11 && c >= 21 && c <= 25) {
        // Mid platform right
        row.push(1);
      } else if (r === 7 && c >= 22 && c <= 26) {
        // High platform right
        row.push(1);
      } else if (r === 13 && c >= 13 && c <= 15) {
        // Stepping stone
        row.push(1);
      } else {
        row.push(0);
      }
    }
    layout.push(row);
  }
  return layout;
})();

const CHALLENGE_LEVEL: LevelDef = {
  name: 'Forest Challenge',
  rooms: [
    {
      name: 'Forest Gauntlet',
      background: 'Green',
      layout: CHALLENGE_LAYOUT,
      width: 30,
      height: 18,
      traps: [
        { defName: 'trampoline', x: 9 * 16, y: 15 * 16 },
        { defName: 'trampoline', x: 19 * 16, y: 15 * 16 },
        { defName: 'trampoline', x: 14 * 16, y: 8 * 16 },
        { defName: 'arrow', x: 11 * 16, y: 11 * 16 },
        { defName: 'arrow', x: 20 * 16, y: 6 * 16 },
        { defName: 'spikes', x: 26 * 16, y: 15 * 16 },
        { defName: 'spikes', x: 27 * 16, y: 15 * 16 },
      ],
      items: [
        { defName: 'kiwi', x: 5 * 16, y: 10 * 16 },
        { defName: 'kiwi', x: 6 * 16, y: 10 * 16 },
        { defName: 'strawberry', x: 9 * 16, y: 4 * 16 },
        { defName: 'melon', x: 13 * 16, y: 7 * 16 },
        { defName: 'melon', x: 15 * 16, y: 7 * 16 },
        { defName: 'strawberry', x: 23 * 16, y: 5 * 16 },
        { defName: 'kiwi', x: 22 * 16, y: 9 * 16 },
        { defName: 'strawberry', x: 24 * 16, y: 9 * 16 },
        { defName: 'melon', x: 14 * 16, y: 11 * 16 },
      ],
      checkpoints: [
        { type: 'start', x: 2 * 16, y: 16 * 16 },
        { type: 'mid', x: 14 * 16, y: 13 * 16 },
        { type: 'end', x: 28 * 16, y: 16 * 16 },
      ],
    },
  ],
};

const CHALLENGE_TIME_LIMIT = 45; // seconds

// ---- App bootstrap ----

function observeResize(app: Application, container: HTMLElement) {
  const observer = new ResizeObserver(() => {
    const bounds = container.getBoundingClientRect();
    app.renderer.resize(bounds.width, bounds.height);
  });

  observer.observe(container);
}

export async function launchApp(
  container: HTMLElement,
  onProgress?: ProgressCallback
) {
  // Fetch game data from CMS before initializing the app
  const { heroDef, trapDefs, itemDefs, levelDef, cmsAssetUrls } =
    await fetchGameData();

  const app = new Application();

  await app.init({
    background: '#1a1a2e',
    antialias: false,
    roundPixels: true,
  });

  observeResize(app, container);
  container.append(app.canvas);

  // Pixel-art rendering: disable texture smoothing
  app.stage.scale.set(GAME_SCALE);

  // Load static pack assets
  await loadAllAssets(onProgress);

  // Load CMS-served sprite assets (trap and item images from CMS file storage)
  if (cmsAssetUrls.length > 0) {
    for (const url of cmsAssetUrls) {
      Assets.add({ alias: url, src: url });
    }
    await Assets.load(cmsAssetUrls);
  }

  // Initialize input
  initInput();

  // Scene manager
  const sceneManager = new SceneManager(app);
  const screenWidth = app.screen.width / GAME_SCALE;
  const screenHeight = app.screen.height / GAME_SCALE;

  function showTitle() {
    sceneManager.setScene(
      new TitleScene(
        screenWidth,
        screenHeight,
        () => {
          startGame();
        },
        () => {
          startChallenge();
        }
      )
    );
  }

  function startGame() {
    sceneManager.setScene(
      new GameplayScene(
        screenWidth,
        screenHeight,
        levelDef,
        heroDef,
        trapDefs,
        itemDefs,
        (state: GameState) => {
          showScore(state);
        }
      )
    );
  }

  function startChallenge() {
    sceneManager.setScene(
      new ChallengeScene(
        screenWidth,
        screenHeight,
        CHALLENGE_LEVEL,
        CHALLENGE_HERO,
        CHALLENGE_TRAP_DEFS,
        CHALLENGE_ITEM_DEFS,
        CHALLENGE_TIME_LIMIT,
        (state: GameState) => {
          showScore(state);
        }
      )
    );
  }

  function showScore(state: GameState) {
    sceneManager.setScene(
      new ScoreScene(screenWidth, screenHeight, state, () => {
        showTitle();
      })
    );
  }

  // Game loop
  app.ticker.add((ticker) => {
    updateInput();
    sceneManager.update(ticker.deltaMS / 1000);
  });

  // Start with title screen
  showTitle();
}
