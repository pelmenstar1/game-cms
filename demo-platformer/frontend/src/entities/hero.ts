import {
  AnimatedSprite,
  Container,
  type PointData,
  type RectangleLike,
} from 'pixi.js';

import { buildAnimationSet } from '../assets';
import {
  ANIMATION_SPEED,
  DEFAULT_JUMP_FORCE,
  DEFAULT_SPEED,
  INVINCIBILITY_DURATION,
  KEYS,
} from '../constants';
import { isDown, justPressed } from '../input';
import { applyGravity, moveAndCollide } from '../physics';
import type {
  AnimationSet,
  CollisionResult,
  HeroDef,
  HeroState,
} from '../types';

export class Hero {
  readonly container = new Container();
  readonly position: PointData;
  readonly velocity: PointData = { x: 0, y: 0 };

  /** Hitbox relative to position (smaller than the full 32x32 frame) */
  readonly hitbox: RectangleLike = { x: 6, y: 4, width: 20, height: 28 };

  hp: number;
  maxHp: number;
  alive = true;

  private state: HeroState = 'idle';
  private facingRight = true;
  private onGround = false;
  private onWall = false;
  private canDoubleJump = false;
  private invincibilityTimer = 0;

  private animations: AnimationSet;
  private sprite: AnimatedSprite;

  private speed: number;
  private jumpForce: number;
  private gravity: number;

  constructor(def: HeroDef, spawnX: number, spawnY: number, gravity: number) {
    this.position = { x: spawnX, y: spawnY };
    this.hp = def.hp;
    this.maxHp = def.hp;
    this.speed = def.speed || DEFAULT_SPEED;
    this.jumpForce = def.jumpForce || DEFAULT_JUMP_FORCE;
    this.gravity = gravity;

    // Build animation textures from CMS-provided sprite strip URLs
    this.animations = buildAnimationSet(def.animations);

    // Create initial AnimatedSprite with idle animation
    const idleFrames =
      this.animations['idle'] ?? Object.values(this.animations)[0];
    this.sprite = new AnimatedSprite(idleFrames);
    this.sprite.animationSpeed = ANIMATION_SPEED;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.play();
    this.container.addChild(this.sprite);
  }

  /** Get world-space hitbox for collision checks. */
  getWorldHitbox(): RectangleLike {
    return {
      x: this.position.x + this.hitbox.x,
      y: this.position.y + this.hitbox.y,
      width: this.hitbox.width,
      height: this.hitbox.height,
    };
  }

  update(dt: number, layout: number[][]): void {
    if (!this.alive) return;

    // Invincibility countdown
    if (this.invincibilityTimer > 0) {
      this.invincibilityTimer -= dt;
      // Blink effect
      this.sprite.alpha = Math.sin(this.invincibilityTimer * 10) > 0 ? 1 : 0.3;
    } else {
      this.sprite.alpha = 1;
    }

    // If in hit state, wait for animation to finish
    if (this.state === 'hit') {
      this.velocity.x = 0;
      applyGravity(this.velocity, this.gravity, dt);
      moveAndCollide(this.position, this.velocity, this.hitbox, layout, dt);
      this.syncSprite();
      return;
    }

    this.handleInput(dt);
    this.applyPhysics(dt, layout);
    this.updateAnimationState();
    this.syncSprite();
  }

  takeDamage(amount: number): void {
    if (this.invincibilityTimer > 0 || !this.alive) return;

    this.hp -= amount;
    this.invincibilityTimer = INVINCIBILITY_DURATION;

    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.setState('hit');
      this.sprite.loop = false;
    } else {
      this.setState('hit');
      this.sprite.loop = false;
      this.sprite.onComplete = () => {
        this.sprite.onComplete = undefined;
        this.setState('idle');
        this.sprite.loop = true;
      };
    }
  }

  respawn(x: number, y: number, fullHp: boolean): void {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.alive = true;
    if (fullHp) this.hp = this.maxHp;
    this.invincibilityTimer = INVINCIBILITY_DURATION;
    this.setState('idle');
    this.sprite.loop = true;
  }

  private handleInput(_dt: number): void {
    // Horizontal movement
    this.velocity.x = 0;
    if (isDown(KEYS.LEFT)) {
      this.velocity.x = -this.speed;
      this.facingRight = false;
    }
    if (isDown(KEYS.RIGHT)) {
      this.velocity.x = this.speed;
      this.facingRight = true;
    }

    // Jump
    if (justPressed(KEYS.JUMP) || justPressed(KEYS.UP)) {
      if (this.onGround) {
        this.velocity.y = -this.jumpForce;
        this.onGround = false;
        this.canDoubleJump = true;
      } else if (this.canDoubleJump) {
        this.velocity.y = -this.jumpForce;
        this.canDoubleJump = false;
      }
    }
  }

  private applyPhysics(dt: number, layout: number[][]): void {
    applyGravity(this.velocity, this.gravity, dt);

    const collision: CollisionResult = moveAndCollide(
      this.position,
      this.velocity,
      this.hitbox,
      layout,
      dt
    );

    this.onGround = collision.bottom;
    this.onWall = collision.left || collision.right;

    if (this.onGround) {
      this.canDoubleJump = true;
    }
  }

  private updateAnimationState(): void {
    let newState: HeroState;

    if (!this.onGround) {
      if (this.velocity.y < 0) {
        newState = this.canDoubleJump ? 'jump' : 'doubleJump';
      } else {
        newState = 'fall';
      }
    } else if (this.velocity.x !== 0) {
      newState = 'run';
    } else {
      newState = 'idle';
    }

    if (newState !== this.state) {
      this.setState(newState);
    }
  }

  private setState(state: HeroState): void {
    this.state = state;
    const frames = this.animations[state];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!frames) return;

    this.sprite.textures = frames;
    this.sprite.animationSpeed = ANIMATION_SPEED;
    this.sprite.play();
  }

  private syncSprite(): void {
    // Position sprite at center of the 32x32 frame area
    this.sprite.x = this.position.x + 16;
    this.sprite.y = this.position.y + 16;
    this.sprite.scale.x = this.facingRight ? 1 : -1;
  }
}
