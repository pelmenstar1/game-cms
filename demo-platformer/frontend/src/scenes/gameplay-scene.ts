import { Container } from 'pixi.js';

import { TILE_SIZE } from '../constants';
import { Hero } from '../entities/hero';
import { HUD } from '../hud';
import { Level } from '../level';
import { Room } from '../room';
import type {
  GameConfig,
  GameState,
  HeroDef,
  ItemDef,
  LevelDef,
  Scene,
  TrapDef,
} from '../types';

export class GameplayScene implements Scene {
  readonly container = new Container();

  private worldContainer = new Container();
  private hudOverlay: HUD;

  private hero: Hero | undefined;
  private room: Room | undefined;
  private level: Level;
  private state: GameState;

  private heroDef: HeroDef;
  private trapDefs: Record<string, TrapDef>;
  private itemDefs: Record<string, ItemDef>;
  private gravity: number;

  private screenWidth: number;
  private screenHeight: number;
  private onGameOver: (state: GameState) => void;

  constructor(
    screenWidth: number,
    screenHeight: number,
    levelDef: LevelDef,
    heroDef: HeroDef,
    trapDefs: Record<string, TrapDef>,
    itemDefs: Record<string, ItemDef>,
    config: GameConfig,
    onGameOver: (state: GameState) => void
  ) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.heroDef = heroDef;
    this.trapDefs = trapDefs;
    this.itemDefs = itemDefs;
    this.gravity = config.gravity;
    this.onGameOver = onGameOver;

    this.level = new Level(levelDef);

    this.state = {
      score: 0,
      hp: heroDef.hp,
      maxHp: heroDef.hp,
      lives: config.defaultLives,
      currentRoomIndex: 0,
      checkpointPosition: null,
    };

    this.hudOverlay = new HUD();
    this.container.addChild(this.worldContainer);
    this.container.addChild(this.hudOverlay.container);
  }

  enter(): void {
    this.buildRoom();
  }

  update(dt: number): void {
    if (!this.room || !this.hero) return;

    const result = this.room.update(dt);

    // Apply score
    if (result.score > 0) {
      this.state.score += result.score;
    }

    // Apply trampoline bounce
    if (result.bounceForce > 0 && this.hero.alive) {
      this.hero.velocity.y = -result.bounceForce;
    }

    // Apply damage
    if (result.damage > 0 && this.hero.alive) {
      this.hero.takeDamage(result.damage);
      this.state.hp = this.hero.hp;
    }

    // Save checkpoint
    if (result.checkpointPosition) {
      this.state.checkpointPosition = result.checkpointPosition;
    }

    // Handle death
    if (!this.hero.alive) {
      this.state.lives--;
      if (this.state.lives <= 0) {
        this.onGameOver(this.state);
        return;
      }
      // Respawn at checkpoint or room start
      const spawnPos =
        this.state.checkpointPosition ?? this.findStartPosition();
      this.hero.respawn(spawnPos.x, spawnPos.y, true);
      this.state.hp = this.hero.hp;
    }

    // Room complete — advance to next
    if (result.reachedEnd) {
      this.state.currentRoomIndex++;
      this.state.checkpointPosition = null;
      const nextRoom = this.level.advance();
      if (!nextRoom) {
        // Level complete
        this.onGameOver(this.state);
        return;
      }
      this.buildRoom();
    }

    // Camera follow
    this.updateCamera();

    // HUD
    this.hudOverlay.update(this.state);
  }

  exit(): void {
    this.worldContainer.removeChildren();
  }

  private buildRoom(): void {
    this.worldContainer.removeChildren();

    const roomDef = this.level.getCurrentRoom();
    const startPos = this.findStartPositionFromDef(roomDef);

    this.hero = new Hero(this.heroDef, startPos.x, startPos.y, this.gravity);
    this.room = new Room(roomDef, this.hero, this.trapDefs, this.itemDefs);
    this.worldContainer.addChild(this.room.container);
  }

  private findStartPosition(): { x: number; y: number } {
    return this.findStartPositionFromDef(this.level.getCurrentRoom());
  }

  private findStartPositionFromDef(roomDef: (typeof this.level.rooms)[0]): {
    x: number;
    y: number;
  } {
    const startCp = roomDef.checkpoints.find((cp) => cp.type === 'start');
    if (startCp) {
      return { x: startCp.x, y: startCp.y - 32 };
    }
    // Default: top-left area, on ground
    return { x: 2 * TILE_SIZE, y: 2 * TILE_SIZE };
  }

  private updateCamera(): void {
    if (!this.hero || !this.room) return;

    const halfW = this.screenWidth / 2;
    const halfH = this.screenHeight / 2;

    let camX = this.hero.position.x - halfW;
    let camY = this.hero.position.y - halfH;

    // Clamp to room bounds
    camX = Math.max(0, Math.min(camX, this.room.widthPx - this.screenWidth));
    camY = Math.max(0, Math.min(camY, this.room.heightPx - this.screenHeight));

    this.worldContainer.x = -camX;
    this.worldContainer.y = -camY;
  }
}
