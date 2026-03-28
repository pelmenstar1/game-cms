// ---- Tile / sprite sizes ----
export const TILE_SIZE = 16;
export const CHAR_FRAME_SIZE = 32;
export const TERRAIN_COLS = 22;
export const TERRAIN_ROWS = 11;

// ---- Physics ----
export const GRAVITY = 800; // px/s²
export const DEFAULT_JUMP_FORCE = 350; // px/s (applied upward)
export const DEFAULT_SPEED = 160; // px/s
export const MAX_FALL_SPEED = 600; // px/s

// ---- Hero defaults ----
export const DEFAULT_HP = 3;
export const DEFAULT_LIVES = 3;
export const INVINCIBILITY_DURATION = 1; // seconds after taking damage

// ---- Animation ----
export const ANIMATION_SPEED = 0.15; // AnimatedSprite speed (frames per tick)

// ---- Input key bindings ----
export const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  JUMP: 'Space',
  ENTER: 'Enter',
} as const;

// ---- Scale ----
export const GAME_SCALE = 3; // pixel-art upscale factor
