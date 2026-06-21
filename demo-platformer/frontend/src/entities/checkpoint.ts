import {
  AnimatedSprite,
  Assets,
  Container,
  type PointData,
  type RectangleLike,
  Texture,
} from 'pixi.js';

import { sliceSpriteStrip } from '../assets';
import { ANIMATION_SPEED } from '../constants';
import type { CheckpointImageDef } from '../types';

type CheckpointType = 'start' | 'mid' | 'end';

interface CheckpointAssets {
  idle: Texture[];
  active: Texture[];
}

function loadCheckpointAssets(
  idle: CheckpointImageDef,
  active: CheckpointImageDef
): CheckpointAssets {
  return {
    idle: sliceSpriteStrip(
      Assets.get<Texture>(idle.path),
      idle.width,
      idle.height
    ),
    active: sliceSpriteStrip(
      Assets.get<Texture>(active.path),
      active.width,
      active.height
    ),
  };
}

export class Checkpoint {
  private sprite: AnimatedSprite;
  private assets: CheckpointAssets;

  readonly container = new Container();
  readonly position: PointData;
  readonly type: CheckpointType;

  activated = false;

  constructor(
    type: CheckpointType,
    x: number,
    y: number,
    idle: CheckpointImageDef,
    active: CheckpointImageDef
  ) {
    this.type = type;
    this.position = { x, y };
    this.assets = loadCheckpointAssets(idle, active);

    this.sprite = new AnimatedSprite(this.assets.idle);
    this.sprite.animationSpeed = ANIMATION_SPEED;
    this.sprite.anchor.set(0.5, 1); // bottom-center anchor for flags
    this.sprite.play();
    this.container.addChild(this.sprite);

    this.syncSprite();
  }

  private syncSprite(): void {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  getWorldHitbox(): RectangleLike {
    return {
      x: this.position.x - 16,
      y: this.position.y - 64,
      width: 32,
      height: 64,
    };
  }

  activate(): void {
    if (this.activated) return;
    this.activated = true;

    this.sprite.textures = this.assets.active;
    this.sprite.animationSpeed = ANIMATION_SPEED;
    this.sprite.play();
  }

  update(_dt: number): void {
    // Checkpoints just animate in place
  }
}
