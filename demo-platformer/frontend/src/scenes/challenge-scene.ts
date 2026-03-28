import { Container, Text, TextStyle } from 'pixi.js';

import { DEFAULT_HP, DEFAULT_LIVES, TILE_SIZE } from '../constants';
import { Hero } from '../entities/hero';
import { Level } from '../level';
import { Room } from '../room';
import type {
  GameState,
  HeroDef,
  ItemDef,
  LevelDef,
  Scene,
  TrapDef,
} from '../types';

/** Seconds without collecting an item before the combo resets. */
const COMBO_WINDOW = 1.5;

const TIMER_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 20,
  fill: 0xff4444,
  stroke: { color: 0x000000, width: 4 },
  fontWeight: 'bold',
});

const HUD_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 16,
  fill: 0xffffff,
  stroke: { color: 0x000000, width: 3 },
});

const COMBO_STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 18,
  fill: 0xffdd44,
  stroke: { color: 0x000000, width: 3 },
  fontWeight: 'bold',
});

/**
 * A timed challenge gameplay scene.
 *
 * Differences from the standard GameplayScene:
 * - Countdown timer — the player must reach the end flag before time expires.
 * - Combo multiplier — collecting items in quick succession multiplies score.
 * - Trampoline support — traps with bounceForce launch the hero upward.
 * - Single attempt (no lives) — running out of time or HP ends the run.
 */
export class ChallengeScene implements Scene {
  readonly container = new Container();

  private worldContainer = new Container();
  private hudContainer = new Container();

  private hero: Hero | undefined;
  private room: Room | undefined;
  private level: Level;
  private state: GameState;

  private heroDef: HeroDef;
  private trapDefs: Record<string, TrapDef>;
  private itemDefs: Record<string, ItemDef>;

  private screenWidth: number;
  private screenHeight: number;
  private onGameOver: (state: GameState) => void;

  // Timer
  private timeRemaining: number;
  private timerText!: Text;

  // Combo
  private combo = 0;
  private comboTimer = 0;
  private comboText!: Text;

  // HUD
  private scoreText!: Text;
  private hpText!: Text;

  constructor(
    screenWidth: number,
    screenHeight: number,
    levelDef: LevelDef,
    heroDef: HeroDef,
    trapDefs: Record<string, TrapDef>,
    itemDefs: Record<string, ItemDef>,
    timeLimitSeconds: number,
    onGameOver: (state: GameState) => void
  ) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.heroDef = heroDef;
    this.trapDefs = trapDefs;
    this.itemDefs = itemDefs;
    this.onGameOver = onGameOver;
    this.timeRemaining = timeLimitSeconds;

    this.level = new Level(levelDef);

    this.state = {
      score: 0,
      hp: heroDef.hp || DEFAULT_HP,
      maxHp: heroDef.hp || DEFAULT_HP,
      lives: DEFAULT_LIVES,
      currentRoomIndex: 0,
      checkpointPosition: null,
    };

    this.container.addChild(this.worldContainer);
    this.buildHUD();
    this.container.addChild(this.hudContainer);
  }

  enter(): void {
    this.buildRoom();
  }

  update(dt: number): void {
    if (!this.room || !this.hero) return;

    // Countdown timer
    this.timeRemaining -= dt;
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.state.lives = 0;
      this.onGameOver(this.state);
      return;
    }

    // Combo decay
    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }

    const result = this.room.update(dt);

    // Apply score with combo multiplier
    if (result.score > 0) {
      this.combo++;
      this.comboTimer = COMBO_WINDOW;
      const multiplier = Math.min(this.combo, 5); // cap at x5
      this.state.score += result.score * multiplier;
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

    // Handle death — single attempt, respawn at checkpoint but lose time
    if (!this.hero.alive) {
      this.state.lives--;
      if (this.state.lives <= 0) {
        this.onGameOver(this.state);
        return;
      }
      const spawnPos =
        this.state.checkpointPosition ?? this.findStartPosition();
      this.hero.respawn(spawnPos.x, spawnPos.y, true);
      this.state.hp = this.hero.hp;
      // Time penalty on death
      this.timeRemaining = Math.max(0, this.timeRemaining - 5);
    }

    // Room complete
    if (result.reachedEnd) {
      this.state.currentRoomIndex++;
      this.state.checkpointPosition = null;
      const nextRoom = this.level.advance();
      if (!nextRoom) {
        // Add time bonus to score
        this.state.score += Math.floor(this.timeRemaining) * 10;
        this.onGameOver(this.state);
        return;
      }
      this.buildRoom();
    }

    this.updateCamera();
    this.updateHUD();
  }

  exit(): void {
    this.worldContainer.removeChildren();
  }

  private buildHUD(): void {
    this.timerText = new Text({ text: '', style: TIMER_STYLE });
    this.timerText.x = this.screenWidth / 2 - 30;
    this.timerText.y = 8;

    this.scoreText = new Text({ text: 'Score: 0', style: HUD_STYLE });
    this.scoreText.x = 10;
    this.scoreText.y = 10;

    this.hpText = new Text({ text: 'HP: 3', style: HUD_STYLE });
    this.hpText.x = 10;
    this.hpText.y = 32;

    this.comboText = new Text({ text: '', style: COMBO_STYLE });
    this.comboText.anchor.set(1, 0);
    this.comboText.x = this.screenWidth - 10;
    this.comboText.y = 10;

    this.hudContainer.addChild(
      this.timerText,
      this.scoreText,
      this.hpText,
      this.comboText
    );
  }

  private updateHUD(): void {
    const seconds = Math.ceil(this.timeRemaining);
    this.timerText.text = `${seconds}s`;
    // Flash red when low on time
    this.timerText.alpha =
      this.timeRemaining <= 10
        ? 0.5 + 0.5 * Math.abs(Math.sin(this.timeRemaining * 4))
        : 1;

    this.scoreText.text = `Score: ${this.state.score}`;
    this.hpText.text = `HP: ${this.state.hp}/${this.state.maxHp}`;

    if (this.combo >= 2) {
      const multiplier = Math.min(this.combo, 5);
      this.comboText.text = `x${multiplier} COMBO`;
      this.comboText.visible = true;
    } else {
      this.comboText.visible = false;
    }
  }

  private buildRoom(): void {
    this.worldContainer.removeChildren();

    const roomDef = this.level.getCurrentRoom();
    const startPos = this.findStartPositionFromDef(roomDef);

    this.hero = new Hero(this.heroDef, startPos.x, startPos.y);
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
    return { x: 2 * TILE_SIZE, y: 2 * TILE_SIZE };
  }

  private updateCamera(): void {
    if (!this.hero || !this.room) return;

    const halfW = this.screenWidth / 2;
    const halfH = this.screenHeight / 2;

    let camX = this.hero.position.x - halfW;
    let camY = this.hero.position.y - halfH;

    camX = Math.max(0, Math.min(camX, this.room.widthPx - this.screenWidth));
    camY = Math.max(0, Math.min(camY, this.room.heightPx - this.screenHeight));

    this.worldContainer.x = -camX;
    this.worldContainer.y = -camY;
  }
}
