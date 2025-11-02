import type {
  GameCmsController,
  GameCmsServiceMap,
  Service,
} from '@game-cms/types';

function createServiceMap(services: Service[]) {
  return Object.fromEntries(
    services.map((service) => [service.id, service])
  ) as Partial<GameCmsServiceMap>;
}

export function createController(services: Service[]): GameCmsController {
  const serviceMap = createServiceMap(services);

  return {
    service(name) {
      const result = serviceMap[name];

      if (result === undefined) {
        throw new Error(`Unknown service: ${name}`);
      }

      return result;
    },
  };
}
