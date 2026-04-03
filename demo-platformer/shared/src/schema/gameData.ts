import { ObjectId } from 'mongodb';
import { z } from 'zod';

const objectIdOrString = z.union([z.instanceof(ObjectId), z.string()]);

const fileItem = z.object({
  id: objectIdOrString,
  name: z.string(),
  mime: z.string(),
  url: z.string(),
  size: z.number(),
  addons: z.record(z.string(), z.unknown()),
  parent: objectIdOrString.optional(),
  hidden: z.boolean().optional(),
  originFile: objectIdOrString.optional(),
});

const heroAnimation = z.object({
  state: z.string(),
  sprite: z.array(fileItem),
});

const trapSprite = z.object({
  image: z.array(fileItem),
  frameWidth: z.number(),
  frameHeight: z.number(),
});

const trapAnimation = z.object({
  state: z.string(),
  sprite: trapSprite,
});

const trap = z.object({
  name: z.string(),
  folder: z.string(),
  damage: z.number(),
  behavior: z.enum(['static', 'moving', 'triggered']),
  moveRange: z.number(),
  moveSpeed: z.number(),
  bounceForce: z.number(),
  animations: z.array(trapAnimation),
});

const itemSprite = z.object({
  image: z.array(fileItem),
  frameWidth: z.number(),
  frameHeight: z.number(),
});

const item = z.object({
  name: z.string(),
  sprite: itemSprite,
  effect: z.enum(['score', 'heal', 'speed_boost', 'destroy']),
  value: z.number(),
  collected: fileItem,
});

const checkpointImageVariant = z.object({
  file: fileItem,
  width: z.number(),
  height: z.number(),
});

const checkpointImage = z.object({
  idle: checkpointImageVariant,
  moving: checkpointImageVariant,
});

const checkpoint = z.object({
  type: z.enum(['start', 'mid', 'end']),
  x: z.number(),
  y: z.number(),
});

const room = z.object({
  name: z.string(),
  background: fileItem,
  width: z.number(),
  height: z.number(),
  layout: z.array(z.array(z.number())),
  terrain: fileItem,
  checkpointImages: z.object({
    start: checkpointImage,
    mid: checkpointImage,
    end: checkpointImage,
  }),
  checkpoints: z.array(checkpoint),
  traps: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
      trap: trap.nullable(),
    })
  ),
  items: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
      item: item.nullable(),
    })
  ),
});

const scene = z.object({
  background: fileItem,
});

export const gameData = z.object({
  config: z.object({
    title: z.string(),
    titleScene: scene,
    scoreScene: scene,
    gravity: z.number(),
    defaultLives: z.number(),
  }),
  hero: z.object({
    name: z.string(),
    folder: z.string(),
    frameWidth: z.number(),
    frameHeight: z.number(),
    hp: z.number(),
    speed: z.number(),
    jumpForce: z.number(),
    animations: z.array(heroAnimation),
  }),
  level: z.object({
    name: z.string(),
    rooms: z.array(room),
  }),
});
