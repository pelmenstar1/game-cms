import { GameData } from '@demo-platformer/shared';
import { ApiError, apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';
import { ObjectId } from 'mongodb';

function to2D<T>(flat: T[], width: number, height: number): T[][] {
  return Array.from({ length: height }, (_, row) =>
    flat.slice(row * width, row * width + width)
  );
}

const route = apiRoute({
  url: '/game-data',
  method: 'GET',
  config: {
    id: 'cms$game-data',
  },
  handler: async (): Promise<GameData> => {
    const entity = cms().service('base::entity');

    const config = await entity.getResolvedSingleton(
      'game-config',
      {},
      'published'
    );

    if (!config) {
      throw new ApiError('No published game-config found', {
        code: 'base::entity/notFound',
      });
    }

    // 2. Resolve hero
    if (!config.hero) {
      throw new ApiError('No hero configured', {
        code: 'base::entity/notFound',
      });
    }

    const hero = await entity.getResolvedById(
      'hero',
      new ObjectId(config.hero),
      {},
      'published'
    );
    if (!hero) {
      throw new ApiError('hero not found', {
        code: 'base::entity/notFound',
      });
    }

    // 3. Resolve level
    if (!config.startingLevel) {
      throw new ApiError('No starting level configured', {
        code: 'base::entity/notFound',
      });
    }

    const level = await entity.getResolvedById(
      'level',
      new ObjectId(config.startingLevel),
      {},
      'published'
    );
    if (!level) {
      throw new ApiError('level not found', {
        code: 'base::entity/notFound',
      });
    }

    // 4. Resolve all rooms
    const roomRefs = level.rooms;
    const roomIds = roomRefs.filter((id): id is string => id !== null);

    const rooms = await Promise.all(
      roomIds.map(async (id) => {
        const result = await entity.getResolvedById(
          'room',
          new ObjectId(id),
          {},
          'published'
        );
        if (!result) {
          throw new ApiError(`room not found: ${id}`, {
            code: 'base::entity/notFound',
          });
        }
        return result;
      })
    );

    // 5. Collect unique trap and item IDs across all rooms
    const trapIdSet = new Set<string>();
    const itemIdSet = new Set<string>();

    for (const room of rooms) {
      const traps = room.traps;
      const items = room.items;

      for (const entry of traps) {
        if (entry.trap) trapIdSet.add(entry.trap);
      }
      for (const entry of items) {
        if (entry.item) itemIdSet.add(entry.item);
      }
    }

    // 6. Resolve all unique traps and items in parallel
    const [trapEntries, itemEntries] = await Promise.all([
      Promise.all(
        [...trapIdSet].map(async (id) => {
          const result = await entity.getResolvedById(
            'trap',
            new ObjectId(id),
            {},
            'published'
          );
          if (!result) {
            throw new ApiError(`trap not found: ${id}`, {
              code: 'base::entity/notFound',
            });
          }
          return [id, result] as const;
        })
      ),
      Promise.all(
        [...itemIdSet].map(async (id) => {
          const result = await entity.getResolvedById(
            'item',
            new ObjectId(id),
            {},
            'published'
          );
          if (!result) {
            throw new ApiError(`item not found: ${id}`, {
              code: 'base::entity/notFound',
            });
          }
          return [id, { ...result, collected: result.collected[0] }] as const;
        })
      ),
    ]);

    const trapsMap = Object.fromEntries(trapEntries);
    const itemsMap = Object.fromEntries(itemEntries);

    // 7. Build denormalized response
    return {
      config: {
        title: config.title,
        titleScene: {
          background: config.titleScene.background[0],
        },
        scoreScene: {
          background: config.scoreScene.background[0],
        },
        gravity: config.gravity,
        defaultLives: config.defaultLives,
      },
      hero: {
        name: hero.name,
        frameWidth: hero.frameWidth,
        frameHeight: hero.frameHeight,
        hp: hero.hp,
        speed: hero.speed,
        jumpForce: hero.jumpForce,
        animations: hero.animations,
      },
      level: {
        name: level.name,
        rooms: rooms.map((room) => {
          return {
            name: room.name,
            background: room.background[0],
            width: room.layout.width,
            height: room.layout.height,
            terrain: room.terrain[0],
            layout: to2D(
              room.layout.grid,
              room.layout.width,
              room.layout.height
            ),
            checkpointImages: mapObject(room.checkpointImages, (value) => ({
              idle: {
                file: value.idle.image[0],
                width: value.idle.width,
                height: value.idle.height,
              },
              moving: {
                file: value.moving.image[0],
                width: value.moving.width,
                height: value.moving.height,
              },
            })),
            checkpoints: room.checkpoints,
            traps: room.traps.map((entry) => ({
              x: entry.x,
              y: entry.y,
              trap: entry.trap ? (trapsMap[entry.trap] ?? null) : null,
            })),
            items: room.items.map((entry) => ({
              x: entry.x,
              y: entry.y,
              item: entry.item ? (itemsMap[entry.item] ?? null) : null,
            })),
          };
        }),
      },
    };
  },
});

export default route;
