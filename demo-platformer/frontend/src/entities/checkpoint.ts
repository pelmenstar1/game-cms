import { AnimatedSprite, Assets, Container, Texture } from 'pixi.js';

import { sliceSpriteStrip } from '../assets';
import { ANIMATION_SPEED } from '../constants';
import type { AABB, Vec2 } from '../types';

type CheckpointType = 'start' | 'mid' | 'end';

interface CheckpointAssets {
  idle: Texture[];
  active: Texture[];
}

function loadCheckpointAssets(type: CheckpointType): CheckpointAssets {
  switch (type) {
    case 'start': {
      return {
        idle: sliceSpriteStrip(
          Assets.get<Texture>('pack/Items/Checkpoints/Start/Start (Idle).png'),
          64,
          64
        ),
        active: sliceSpriteStrip(
          Assets.get<Texture>(
            'pack/Items/Checkpoints/Start/Start (Moving) (64x64).png'
          ),
          64,
          64
        ),
      };
    }

    case 'mid': {
      return {
        idle: sliceSpriteStrip(
          Assets.get<Texture>(
            'pack/Items/Checkpoints/Checkpoint/Checkpoint (No Flag).png'
          ),
          64,
          64
        ),
        active: sliceSpriteStrip(
          Assets.get<Texture>(
            'pack/Items/Checkpoints/Checkpoint/Checkpoint (Flag Idle)(64x64).png'
          ),
          64,
          64
        ),
      };
    }

    case 'end': {
      return {
        idle: sliceSpriteStrip(
          Assets.get<Texture>('pack/Items/Checkpoints/End/End (Idle).png'),
          64,
          64
        ),
        active: sliceSpriteStrip(
          Assets.get<Texture>(
            'pack/Items/Checkpoints/End/End (Pressed) (64x64).png'
          ),
          64,
          64
        ),
      };
    }
  }
}

export class Checkpoint {
  readonly container = new Container();
  readonly position: Vec2;
  readonly type: CheckpointType;

  activated = false;

  private sprite: AnimatedSprite;
  private assets: CheckpointAssets;

  constructor(type: CheckpointType, x: number, y: number) {
    this.type = type;
    this.position = { x, y };
    this.assets = loadCheckpointAssets(type);

    this.sprite = new AnimatedSprite(this.assets.idle);
    this.sprite.animationSpeed = ANIMATION_SPEED;
    this.sprite.anchor.set(0.5, 1); // bottom-center anchor for flags
    this.sprite.play();
    this.container.addChild(this.sprite);

    this.syncSprite();
  }

  getWorldHitbox(): AABB {
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

  private syncSprite(): void {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }
}
