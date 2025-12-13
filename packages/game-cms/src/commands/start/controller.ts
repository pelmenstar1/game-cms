import { env } from '@game-cms/global';
import type { GameCmsController, Service, ServiceMap } from '@game-cms/types';

function createServiceMap(services: Service[]) {
  return Object.fromEntries(
    services.map((service) => [service.id, service])
  ) as Partial<ServiceMap>;
}

export function createController(): GameCmsController {
  const { services } = env();
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
