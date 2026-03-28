import { Assets, Container, Sprite, Texture, TilingSprite } from 'pixi.js';

import { getTerrainTile } from './assets';
import { TILE_SIZE } from './constants';
import { Checkpoint } from './entities/checkpoint';
import { Hero } from './entities/hero';
import { Item } from './entities/item';
import { Trap } from './entities/trap';
import { checkOverlap } from './physics';
import type { ItemDef, RoomDef, TrapDef } from './types';

export class Room {
  readonly container = new Container();
  readonly layout: number[][];
  readonly widthPx: number;
  readonly heightPx: number;

  readonly hero: Hero;
  readonly traps: Trap[] = [];
  readonly items: Item[] = [];
  readonly checkpoints: Checkpoint[] = [];

  private background: TilingSprite;
  private terrainContainer = new Container();
  private entityContainer = new Container();

  constructor(
    def: RoomDef,
    hero: Hero,
    trapDefs: Record<string, TrapDef | undefined>,
    itemDefs: Record<string, ItemDef | undefined>
  ) {
    this.layout = def.layout;
    this.widthPx = def.width * TILE_SIZE;
    this.heightPx = def.height * TILE_SIZE;
    this.hero = hero;

    // Background
    const bgTexture = Assets.get<Texture>(
      `pack/Background/${def.background}.png`
    );
    this.background = new TilingSprite({
      texture: bgTexture,
      width: this.widthPx,
      height: this.heightPx,
    });
    this.container.addChild(this.background);

    // Terrain tiles
    const terrainTexture = Assets.get<Texture>(
      'pack/Terrain/Terrain (16x16).png'
    );
    for (let row = 0; row < def.layout.length; row++) {
      for (let col = 0; col < def.layout[row].length; col++) {
        const tileIndex = def.layout[row][col];
        if (tileIndex <= 0) continue;

        const tile = new Sprite(getTerrainTile(terrainTexture, tileIndex));
        tile.x = col * TILE_SIZE;
        tile.y = row * TILE_SIZE;
        this.terrainContainer.addChild(tile);
      }
    }
    this.container.addChild(this.terrainContainer);

    // Traps
    for (const placement of def.traps) {
      const trapDef = trapDefs[placement.defName];
      if (!trapDef) continue;
      const trap = new Trap(trapDef, placement.x, placement.y);
      this.traps.push(trap);
      this.entityContainer.addChild(trap.container);
    }

    // Items
    for (const placement of def.items) {
      const itemDef = itemDefs[placement.defName];
      if (!itemDef) continue;
      const item = new Item(itemDef, placement.x, placement.y);
      this.items.push(item);
      this.entityContainer.addChild(item.container);
    }

    // Checkpoints
    for (const cp of def.checkpoints) {
      const checkpoint = new Checkpoint(cp.type, cp.x, cp.y);
      this.checkpoints.push(checkpoint);
      this.entityContainer.addChild(checkpoint.container);
    }

    this.container.addChild(this.entityContainer);

    // Hero on top
    this.container.addChild(hero.container);
  }

  update(dt: number): {
    score: number;
    damage: number;
    reachedEnd: boolean;
    checkpointPosition: { x: number; y: number } | null;
    bounceForce: number;
  } {
    let score = 0;
    let damage = 0;
    let reachedEnd = false;
    let checkpointPosition: { x: number; y: number } | null = null;
    let bounceForce = 0;

    // Update hero
    this.hero.update(dt, this.layout);

    // Update traps and check for damage / bounce
    const heroHitbox = this.hero.getWorldHitbox();
    for (const trap of this.traps) {
      trap.update(dt);
      if (this.hero.alive && checkOverlap(heroHitbox, trap.getWorldHitbox())) {
        if (trap.bounceForce > 0 && this.hero.velocity.y >= 0) {
          bounceForce = Math.max(bounceForce, trap.bounceForce);
        } else if (trap.damage > 0) {
          damage += trap.damage;
        }
      }
    }

    // Update items and check for collection
    for (const item of this.items) {
      item.update(dt);
      if (
        !item.collected &&
        this.hero.alive &&
        checkOverlap(heroHitbox, item.getWorldHitbox())
      ) {
        item.collect();
        if (item.effect === 'score') {
          score += item.value;
        }
      }
    }

    // Check checkpoints
    for (const cp of this.checkpoints) {
      cp.update(dt);
      if (
        !cp.activated &&
        this.hero.alive &&
        checkOverlap(heroHitbox, cp.getWorldHitbox())
      ) {
        cp.activate();
        if (cp.type === 'mid' || cp.type === 'start') {
          checkpointPosition = { x: cp.position.x, y: cp.position.y - 32 };
        }
        if (cp.type === 'end') {
          reachedEnd = true;
        }
      }
    }

    return { score, damage, reachedEnd, checkpointPosition, bounceForce };
  }
}
