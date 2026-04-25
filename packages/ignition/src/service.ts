import type {
  Service,
  ServiceId,
  ServiceLifecycle,
  ServiceLifecycleHook,
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

function buildServiceWaves(hook: keyof ServiceLifecycle) {
  const { services } = env();

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

export async function initServices() {
  const { waves, run } = buildServiceWaves('onInit');

  await run(waves);
}

export async function destroyServices() {
  const { waves, run } = buildServiceWaves('onDestroy');

  await run(waves.toReversed());
}
