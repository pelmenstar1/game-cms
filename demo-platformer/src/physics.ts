import { MAX_FALL_SPEED, TILE_SIZE } from './constants';
import type { AABB, CollisionResult, Vec2 } from './types';

/** Apply gravity to velocity. Mutates velocity in place. */
export function applyGravity(
  velocity: Vec2,
  gravity: number,
  dt: number
): void {
  velocity.y = Math.min(velocity.y + gravity * dt, MAX_FALL_SPEED);
}

/** Check if tile at (col, row) is solid in the layout grid. */
function isSolid(layout: number[][], col: number, row: number): boolean {
  if (row < 0 || row >= layout.length) return false;
  const rowData = layout[row];
  if (col < 0 || col >= rowData.length) return false;
  return rowData[col] > 0;
}

/**
 * Move an entity and resolve collisions against the tile grid.
 * Uses separate X and Y passes for clean corner handling.
 * Mutates position and velocity in place. Returns which sides collided.
 */
export function moveAndCollide(
  position: Vec2,
  velocity: Vec2,
  hitbox: AABB,
  layout: number[][],
  dt: number
): CollisionResult {
  const result: CollisionResult = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };

  // --- X axis ---
  position.x += velocity.x * dt;
  resolveX(position, velocity, hitbox, layout, result);

  // --- Y axis ---
  position.y += velocity.y * dt;
  resolveY(position, velocity, hitbox, layout, result);

  return result;
}

function resolveX(
  position: Vec2,
  velocity: Vec2,
  hitbox: AABB,
  layout: number[][],
  result: CollisionResult
): void {
  const left = position.x + hitbox.x;
  const right = left + hitbox.width;
  const top = position.y + hitbox.y;
  const bottom = top + hitbox.height - 1;

  const rowStart = Math.floor(top / TILE_SIZE);
  const rowEnd = Math.floor(bottom / TILE_SIZE);

  if (velocity.x > 0) {
    const col = Math.floor(right / TILE_SIZE);
    for (let row = rowStart; row <= rowEnd; row++) {
      if (isSolid(layout, col, row)) {
        position.x = col * TILE_SIZE - hitbox.x - hitbox.width;
        velocity.x = 0;
        result.right = true;
        return;
      }
    }
  } else if (velocity.x < 0) {
    const col = Math.floor(left / TILE_SIZE);
    for (let row = rowStart; row <= rowEnd; row++) {
      if (isSolid(layout, col, row)) {
        position.x = (col + 1) * TILE_SIZE - hitbox.x;
        velocity.x = 0;
        result.left = true;
        return;
      }
    }
  }
}

function resolveY(
  position: Vec2,
  velocity: Vec2,
  hitbox: AABB,
  layout: number[][],
  result: CollisionResult
): void {
  const left = position.x + hitbox.x;
  const right = left + hitbox.width - 1;
  const top = position.y + hitbox.y;
  const bottom = top + hitbox.height;

  const colStart = Math.floor(left / TILE_SIZE);
  const colEnd = Math.floor(right / TILE_SIZE);

  if (velocity.y > 0) {
    const row = Math.floor(bottom / TILE_SIZE);
    for (let col = colStart; col <= colEnd; col++) {
      if (isSolid(layout, col, row)) {
        position.y = row * TILE_SIZE - hitbox.y - hitbox.height;
        velocity.y = 0;
        result.bottom = true;
        return;
      }
    }
  } else if (velocity.y < 0) {
    const row = Math.floor(top / TILE_SIZE);
    for (let col = colStart; col <= colEnd; col++) {
      if (isSolid(layout, col, row)) {
        position.y = (row + 1) * TILE_SIZE - hitbox.y;
        velocity.y = 0;
        result.top = true;
        return;
      }
    }
  }
}

/** Simple AABB overlap test for entity-entity collision. */
export function checkOverlap(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
