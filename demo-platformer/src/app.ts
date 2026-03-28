import { Application, ProgressCallback } from 'pixi.js';

import { loadAllAssets } from './assets';
import { GAME_SCALE } from './constants';
import { initInput, updateInput } from './input';
import { ChallengeScene } from './scenes/challenge-scene';
import { GameplayScene } from './scenes/gameplay-scene';
import { SceneManager } from './scenes/scene';
import { ScoreScene } from './scenes/score-scene';
import { TitleScene } from './scenes/title-scene';
import type { GameState, HeroDef, ItemDef, LevelDef, TrapDef } from './types';

// ---- Hardcoded game data (will be replaced by CMS data later) ----

const HERO_DEF: HeroDef = {
  name: 'Ninja Frog',
  folder: 'Ninja Frog',
  frameWidth: 32,
  frameHeight: 32,
  hp: 3,
  speed: 160,
  jumpForce: 350,
};

const TRAP_DEFS: Record<string, TrapDef> = {
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
  saw: {
    name: 'Saw',
    folder: 'Traps/Saw',
    animations: {
      on: {
        path: 'pack/Traps/Saw/On (38x38).png',
        frameWidth: 38,
        frameHeight: 38,
      },
    },
    damage: 1,
    behavior: 'moving',
    moveRange: 96,
    moveSpeed: 80,
  },
  fire: {
    name: 'Fire',
    folder: 'Traps/Fire',
    animations: {
      on: {
        path: 'pack/Traps/Fire/On (16x32).png',
        frameWidth: 16,
        frameHeight: 32,
      },
    },
    damage: 1,
    behavior: 'static',
    moveRange: 0,
    moveSpeed: 0,
  },
};

const ITEM_DEFS: Record<string, ItemDef> = {
  apple: {
    name: 'Apple',
    sprite: {
      path: 'pack/Items/Fruits/Apple.png',
      frameWidth: 32,
      frameHeight: 32,
    },
    effect: 'score',
    value: 10,
  },
  cherries: {
    name: 'Cherries',
    sprite: {
      path: 'pack/Items/Fruits/Cherries.png',
      frameWidth: 32,
      frameHeight: 32,
    },
    effect: 'score',
    value: 20,
  },
  bananas: {
    name: 'Bananas',
    sprite: {
      path: 'pack/Items/Fruits/Bananas.png',
      frameWidth: 32,
      frameHeight: 32,
    },
    effect: 'score',
    value: 15,
  },
};

// A simple demo room layout (20x15 tiles)
// 1 = grass top-left, 2 = grass top, 3 = grass top-right (using indices into the terrain atlas)
// For simplicity, we use index 1 as the only solid tile
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

const DEMO_LEVEL: LevelDef = {
  name: 'Demo Level',
  rooms: [
    {
      name: 'Room 1',
      background: 'Blue',
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
        { type: 'start', x: 2 * 16, y: 13 * 16 },
        { type: 'end', x: 23 * 16, y: 13 * 16 },
      ],
    },
  ],
};

// ---- Challenge mode data ----

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
  spikes: TRAP_DEFS.spikes,
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
        // Trampolines in the ground gaps
        { defName: 'trampoline', x: 9 * 16, y: 15 * 16 },
        { defName: 'trampoline', x: 19 * 16, y: 15 * 16 },
        // Trampoline on a platform for extra height
        { defName: 'trampoline', x: 14 * 16, y: 8 * 16 },
        // Arrows patrolling near platforms
        { defName: 'arrow', x: 11 * 16, y: 11 * 16 },
        { defName: 'arrow', x: 20 * 16, y: 6 * 16 },
        // Spikes guarding the end
        { defName: 'spikes', x: 26 * 16, y: 15 * 16 },
        { defName: 'spikes', x: 27 * 16, y: 15 * 16 },
      ],
      items: [
        // Fruits scattered across platforms — collect fast for combo!
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

  // Load all assets
  await loadAllAssets(onProgress);

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
        DEMO_LEVEL,
        HERO_DEF,
        TRAP_DEFS,
        ITEM_DEFS,
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
