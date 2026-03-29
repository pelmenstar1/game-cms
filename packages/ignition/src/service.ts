import type { Service } from '@game-cms/core';
import { env } from '@game-cms/global';
import { normalizeMaybeArray } from '@game-cms/shared/collections';
import { topologicalWaves } from '@game-cms/shared/graph';

function getServiceOnInit(service: Service) {
  const onInit = service.lifecycle?.onInit;

  if (typeof onInit === 'function') {
    return { deps: [], action: onInit };
  }

  if (onInit) {
    return {
      deps: normalizeMaybeArray(onInit.dependsOn),
      action: onInit.action,
    };
  }
}

export async function initServices() {
  const { services } = env();

  const entries = Object.entries(services);
  const depsOf = new Map(
    entries.map(([id, service]) => [id, getServiceOnInit(service)])
  );

  const waves = topologicalWaves(
    entries.map(([id]) => id),
    (id) => depsOf.get(id)?.deps ?? []
  );

  for (const wave of waves) {
    await Promise.all(wave.map((id) => depsOf.get(id)?.action()));
  }
}
