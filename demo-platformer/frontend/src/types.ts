import type { Container, PointData, Texture } from 'pixi.js';

// ---- Geometry ----

export interface CollisionResult {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

// ---- Animation ----

/** Maps animation name → array of Pixi Textures sliced from a sprite strip */
export type AnimationSet = Record<string, Texture[]>;

/** Metadata needed to slice a sprite strip PNG into frames */
export interface SpriteStripDef {
  path: string;
  frameWidth: number;
  frameHeight: number;
}

// ---- Hero ----

export type HeroState =
  | 'idle'
  | 'run'
  | 'jump'
  | 'fall'
  | 'doubleJump'
  | 'hit'
  | 'wallJump';

export interface HeroDef {
  name: string;
  /** Animation strips keyed by state (e.g. "idle", "run", "jump") — URLs from CMS */
  animations: Record<string, SpriteStripDef>;
  hp: number;
  speed: number;
  jumpForce: number;
}

export interface SceneDef {
  backgroundAlias: string;
}

export interface GameConfig {
  title: string;
  titleScene: SceneDef;
  scoreScene: SceneDef;
  gravity: number;
  defaultLives: number;
}

// ---- Trap ----

export type TrapBehavior = 'static' | 'moving' | 'triggered';

export interface TrapDef {
  name: string;
  animations: Record<string, SpriteStripDef>;
  damage: number;
  behavior: TrapBehavior;
  moveRange: number;
  moveSpeed: number;
  /** If > 0, this trap bounces the hero upward instead of dealing damage. */
  bounceForce?: number;
}

// ---- Item ----

export type ItemEffect = 'score' | 'heal' | 'speed_boost' | 'destroy';

export interface ItemDef {
  name: string;
  sprite: SpriteStripDef;
  effect: ItemEffect;
  value: number;
  collectedAlias: string;
}

// ---- Placement (in a room) ----

export interface TrapPlacement {
  defName: string;
  x: number;
  y: number;
}

export interface ItemPlacement {
  defName: string;
  x: number;
  y: number;
}

export interface CheckpointImageDef {
  path: string;
  width: number;
  height: number;
}

export interface CheckpointPlacement {
  type: 'start' | 'mid' | 'end';
  x: number;
  y: number;
  idle: CheckpointImageDef;
  active: CheckpointImageDef;
}

// ---- Room ----

export interface RoomDef {
  name: string;
  terrainAlias: string;
  backgroundAlias: string;
  /** 2D grid of tile indices. 0 = empty, >0 = solid tile index in terrain atlas */
  layout: number[][];
  traps: TrapPlacement[];
  items: ItemPlacement[];
  checkpoints: CheckpointPlacement[];
  width: number; // in tiles
  height: number; // in tiles
}

// ---- Level ----

export interface LevelDef {
  name: string;
  rooms: RoomDef[];
}

// ---- Game State ----

export interface GameState {
  score: number;
  hp: number;
  maxHp: number;
  lives: number;
  currentRoomIndex: number;
  checkpointPosition: PointData | null;
}

// ---- Scene ----

export interface Scene {
  readonly container: Container;
  enter(): void;
  update(dt: number): void;
  exit(): void;
}
