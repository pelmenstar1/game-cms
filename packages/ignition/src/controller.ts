import type { GameCmsController, Service, ServiceMap } from '@game-cms/core';
import { env, setCmsController } from '@game-cms/global';

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

      if (result === undefined) {
        throw new Error(`Unknown service: ${name}`);
      }

      return result;
    },
  };
}

export function initCmsController() {
  setCmsController(createController());
}
