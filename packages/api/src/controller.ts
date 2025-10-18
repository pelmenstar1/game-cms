import type {
  GameCmsController,
  GameCmsServiceMap,
  Service,
} from '@game-cms/types';

function createServiceMap(services: Service[]): GameCmsServiceMap {
  return Object.fromEntries(
    services.map((service) => [service.id, service])
  ) as unknown as GameCmsServiceMap;
}

export function createController(services: Service[]): GameCmsController {
  const serviceMap = createServiceMap(services);

  return {
    service(name) {
      const result = serviceMap[name];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (result === undefined) {
        throw new Error(`Unknown service: ${name}`);
      }

      return result;
    },
  };
}
