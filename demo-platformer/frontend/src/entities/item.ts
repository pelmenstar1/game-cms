import { AnimatedSprite, Assets, Container, Texture } from 'pixi.js';

import { sliceSpriteStrip } from '../assets';
import { ANIMATION_SPEED } from '../constants';
import type { AABB, ItemDef, Vec2 } from '../types';

export class Item {
  readonly container = new Container();
  readonly position: Vec2;

  collected = false;

  private sprite: AnimatedSprite;
  private def: ItemDef;
  private collectedFrames: Texture[];

  constructor(def: ItemDef, x: number, y: number) {
    this.def = def;
    this.position = { x, y };

    // Slice the sprite strip into animation frames
    const texture = Assets.get<Texture>(def.sprite.path);
    const frames = sliceSpriteStrip(
      texture,
      def.sprite.frameWidth,
      def.sprite.frameHeight
    );

    // Also prepare the "Collected" effect
    const collectedTex = Assets.get<Texture>('pack/Items/Fruits/Collected.png');
    this.collectedFrames = sliceSpriteStrip(collectedTex, 32, 32);

    this.sprite = new AnimatedSprite(frames);
    this.sprite.animationSpeed = ANIMATION_SPEED;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.play();
    this.container.addChild(this.sprite);

    this.syncSprite();
  }

  /** Get world-space hitbox for collection detection. */
  getWorldHitbox(): AABB {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.def.sprite.frameWidth,
      height: this.def.sprite.frameHeight,
    };
  }

  get effect() {
    return this.def.effect;
  }

  get value() {
    return this.def.value;
  }

  /** Collect the item. Plays collected animation then hides. */
  collect(): void {
    if (this.collected) return;
    this.collected = true;

    this.sprite.textures = this.collectedFrames;
    this.sprite.loop = false;
    this.sprite.animationSpeed = ANIMATION_SPEED;
    this.sprite.play();
    this.sprite.onComplete = () => {
      this.container.visible = false;
    };
  }

  update(_dt: number): void {
    // Items just animate in place
  }

  private syncSprite(): void {
    this.sprite.x = this.position.x + this.def.sprite.frameWidth / 2;
    this.sprite.y = this.position.y + this.def.sprite.frameHeight / 2;
  }
}
