import type { ClientGameData } from '@demo-platformer/shared';
import { Application, Assets, ProgressCallback } from 'pixi.js';

import { buildAnimationSet } from './assets';
import { GAME_SCALE } from './constants';
import { initInput, updateInput } from './input';
import { GameplayScene } from './scenes/gameplay-scene';
import { SceneManager } from './scenes/scene';
import { ScoreScene } from './scenes/score-scene';
import { TitleScene } from './scenes/title-scene';
import type {
  GameConfig,
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
  gameConfig: GameConfig;
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

  const cmsAssetUrls: string[] = [
    data.config.titleScene.background.url,
    data.config.scoreScene.background.url,
  ];

  const gameConfig: GameConfig = {
    title: data.config.title,
    titleScene: {
      backgroundAlias: data.config.titleScene.background.url,
    },
    scoreScene: {
      backgroundAlias: data.config.scoreScene.background.url,
    },
    gravity: data.config.gravity,
    defaultLives: data.config.defaultLives,
  };

  const heroAnimations: Record<string, SpriteStripDef> = {};
  for (const anim of data.hero.animations) {
    const url = anim.sprite[0]?.url;
    if (url) {
      heroAnimations[anim.state] = {
        path: url,
        frameWidth: data.hero.frameWidth,
        frameHeight: data.hero.frameHeight,
      };
      cmsAssetUrls.push(url);
    }
  }

  const heroDef: HeroDef = {
    name: data.hero.name,
    animations: heroAnimations,
    hp: data.hero.hp,
    speed: data.hero.speed,
    jumpForce: data.hero.jumpForce,
  };

  const trapDefMap = new Map<string, TrapDef>();
  const itemDefMap = new Map<string, ItemDef>();

  for (const room of data.level.rooms) {
    cmsAssetUrls.push(room.background.url, room.terrain.url);

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
            frameWidth: anim.sprite.width,
            frameHeight: anim.sprite.height,
          };
          cmsAssetUrls.push(url);
        }
      }
      trapDefMap.set(key, {
        name: entry.trap.name,
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
            frameWidth: entry.item.sprite.width,
            frameHeight: entry.item.sprite.height,
          },
          collectedAlias: entry.item.collected.url,
          effect: entry.item.effect,
          value: entry.item.value,
        });

        cmsAssetUrls.push(url, entry.item.collected.url);
      }
    }
  }

  const trapDefs = Object.fromEntries(trapDefMap);
  const itemDefs = Object.fromEntries(itemDefMap);

  const levelDef: LevelDef = {
    name: data.level.name,
    rooms: data.level.rooms.map((room) => ({
      name: room.name,
      backgroundAlias: room.background.url,
      terrainAlias: room.terrain.url,
      width: room.width,
      height: room.height,
      layout: room.layout,
      checkpoints: room.checkpoints.map((cp) => {
        const images = room.checkpointImages[cp.type];
        cmsAssetUrls.push(images.idle.file.url, images.moving.file.url);
        return {
          type: cp.type,
          x: cp.x,
          y: cp.y,
          idle: {
            path: images.idle.file.url,
            width: images.idle.width,
            height: images.idle.height,
          },
          active: {
            path: images.moving.file.url,
            width: images.moving.width,
            height: images.moving.height,
          },
        };
      }),
      traps: room.traps.flatMap((e) =>
        e.trap ? [{ defName: toKey(e.trap.name), x: e.x, y: e.y }] : []
      ),
      items: room.items.flatMap((e) =>
        e.item ? [{ defName: toKey(e.item.name), x: e.x, y: e.y }] : []
      ),
    })),
  };

  return {
    gameConfig,
    heroDef,
    trapDefs,
    itemDefs,
    levelDef,
    cmsAssetUrls,
  };
}

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
  const { gameConfig, heroDef, trapDefs, itemDefs, levelDef, cmsAssetUrls } =
    await fetchGameData();

  const app = new Application();

  await Assets.init({
    preferences: {
      crossOrigin: 'anonymous',
    },
  });

  await app.init({
    background: '#1a1a2e',
    antialias: false,
    roundPixels: true,
  });

  observeResize(app, container);
  container.append(app.canvas);

  // Pixel-art rendering: disable texture smoothing
  app.stage.scale.set(GAME_SCALE);

  // Load CMS-served sprite assets (hero, trap, and item images from CMS file storage)
  if (cmsAssetUrls.length > 0) {
    for (const url of cmsAssetUrls) {
      Assets.add({ alias: url, src: url });
    }
    await Assets.load(cmsAssetUrls, onProgress);
  }

  // Pre-build hero idle frames for the title screen
  const heroAnimations = buildAnimationSet(heroDef.animations);
  const heroIdleFrames =
    heroAnimations['idle'] ?? Object.values(heroAnimations)[0];

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
        gameConfig.title,
        gameConfig.titleScene.backgroundAlias,
        heroIdleFrames,
        () => {
          startGame();
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
        gameConfig,
        (state: GameState) => {
          showScore(state);
        }
      )
    );
  }

  function showScore(state: GameState) {
    sceneManager.setScene(
      new ScoreScene(
        screenWidth,
        screenHeight,
        gameConfig.titleScene.backgroundAlias,
        state,
        () => {
          showTitle();
        }
      )
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
