import type { Container, Texture } from 'pixi.js';

// ---- Geometry ----

export interface Vec2 {
  x: number;
  y: number;
}

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

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
  folder: string; // e.g. "Main Characters/Ninja Frog"
  frameWidth: number;
  frameHeight: number;
  hp: number;
  speed: number;
  jumpForce: number;
}

// ---- Trap ----

export type TrapBehavior = 'static' | 'moving' | 'triggered';

export interface TrapDef {
  name: string;
  folder: string; // e.g. "Traps/Saw"
  animations: Record<string, SpriteStripDef>;
  damage: number;
  behavior: TrapBehavior;
  moveRange: number;
  moveSpeed: number;
}

// ---- Item ----

export type ItemEffect = 'score' | 'heal' | 'speed_boost' | 'destroy';

export interface ItemDef {
  name: string;
  sprite: SpriteStripDef;
  effect: ItemEffect;
  value: number;
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

export interface CheckpointPlacement {
  type: 'start' | 'mid' | 'end';
  x: number;
  y: number;
}

// ---- Room ----

export type BackgroundColor =
  | 'Blue'
  | 'Brown'
  | 'Gray'
  | 'Green'
  | 'Pink'
  | 'Purple'
  | 'Yellow';

export interface RoomDef {
  name: string;
  background: BackgroundColor;
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
  checkpointPosition: Vec2 | null;
}

// ---- Scene ----

export interface Scene {
  readonly container: Container;
  enter(): void;
  update(dt: number): void;
  exit(): void;
}
