/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  AnimatedSprite,
  Container,
  type PointData,
  type RectangleLike,
} from 'pixi.js';

import { buildAnimationSet } from '../assets';
import { ANIMATION_SPEED } from '../constants';
import type { AnimationSet, TrapDef } from '../types';

export class Trap {
  private sprite: AnimatedSprite;
  private animations: AnimationSet;
  private def: TrapDef;

  // Moving behavior state
  private originX: number;
  private originY: number;
  private moveDirection = 1;

  readonly container = new Container();
  readonly position: PointData;

  constructor(def: TrapDef, x: number, y: number) {
    this.def = def;
    this.position = { x, y };
    this.originX = x;
    this.originY = y;

    this.animations = buildAnimationSet(def.animations);

    // Pick the "on" or "idle" animation as default
    const defaultAnim =
      this.animations['on'] ??
      this.animations['idle'] ??
      Object.values(this.animations)[0];

    this.sprite = new AnimatedSprite(defaultAnim);
    this.sprite.animationSpeed = ANIMATION_SPEED;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.play();
    this.container.addChild(this.sprite);

    this.syncSprite();
  }

  /** Get world-space hitbox for damage collision. */
  private updateMoving(dt: number): void {
    this.position.x += this.def.moveSpeed * this.moveDirection * dt;

    if (Math.abs(this.position.x - this.originX) >= this.def.moveRange) {
      this.moveDirection *= -1;
      this.position.x = this.originX + this.def.moveRange * this.moveDirection;
    }
  }

  private syncSprite(): void {
    this.sprite.x = this.position.x + this.sprite.width / 2;
    this.sprite.y = this.position.y + this.sprite.height / 2;
  }

  getWorldHitbox(): RectangleLike {
    const frames = this.sprite.textures;
    const frame = frames[0];
    const w = 'width' in frame ? frame.width : this.sprite.width;
    const h = 'height' in frame ? frame.height : this.sprite.height;
    return {
      x: this.position.x,
      y: this.position.y,
      width: w,
      height: h,
    };
  }

  get damage(): number {
    return this.def.damage;
  }

  get bounceForce(): number {
    return this.def.bounceForce ?? 0;
  }

  update(dt: number): void {
    switch (this.def.behavior) {
      case 'static': {
        // No movement, just animate
        break;
      }

      case 'moving': {
        this.updateMoving(dt);
        break;
      }

      case 'triggered': {
        // Triggered traps activate when hero is near - handled externally
        break;
      }
    }

    this.syncSprite();
  }
}
