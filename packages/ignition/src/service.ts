import type {
  Service,
  ServiceId,
  ServiceLifecycle,
  ServiceLifecycleHook,
  ServiceMap,
} from '@game-cms/core';
import { env } from '@game-cms/global';
import { MaybePromise } from '@game-cms/shared';
import { normalizeMaybeArray } from '@game-cms/shared/collections';
import { topologicalWaves } from '@game-cms/shared/graph';

type HookInfo = {
  deps: ServiceId[];
  action: () => MaybePromise<void>;
};

function getServiceHook(
  hook: ServiceLifecycleHook | undefined
): HookInfo | undefined {
  if (typeof hook === 'function') {
    return { deps: [], action: hook };
  }

  if (hook) {
    return {
      deps: normalizeMaybeArray(hook.dependsOn),
      action: hook.action,
    };
  }
}

function buildServiceWaves(services: ServiceMap, hook: keyof ServiceLifecycle) {
  const serviceIds = Object.keys(services) as ServiceId[];
  const depsOf = new Map<ServiceId, HookInfo>();

  for (const id of serviceIds) {
    const service: Service = services[id];
    const hookInfo = getServiceHook(service.lifecycle?.[hook]);

    if (hookInfo) {
      depsOf.set(id, hookInfo);
    }
  }

  const waves = topologicalWaves(
    serviceIds,
    (id) => depsOf.get(id)?.deps ?? []
  );

  async function run(ordered: ServiceId[][]) {
    for (const wave of ordered) {
      await Promise.all(wave.map((id) => depsOf.get(id)?.action()));
    }
  }

  return { waves, run };
}

async function runPostInit(services: ServiceMap) {
  const serviceValues = Object.values(services) as Service[];

  await Promise.all(
    serviceValues.map((service) => service.lifecycle?.onPostInit?.())
  );
}

export async function initServices() {
  const { services } = env();

  const { waves, run } = buildServiceWaves(services, 'onInit');

  await run(waves);
  await runPostInit(services);
}

export async function destroyServices() {
  const { services } = env();

  const { waves, run } = buildServiceWaves(services, 'onDestroy');

  await run(waves.toReversed());
}
