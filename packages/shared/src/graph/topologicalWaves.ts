function throwCycle(): never {
  throw new Error('Cycle detected in dependency graph');
}

/**
 * Returns nodes grouped into parallel waves using Kahn's algorithm.
 * Nodes within the same wave have no dependencies on each other and can run concurrently.
 * Throws if a cycle is detected.
 */
export function topologicalWaves<T extends string>(
  nodes: T[],
  getDeps: (node: T) => T[]
): T[][] {
  const inDegree = new Map<T, number>(nodes.map((n) => [n, 0]));
  const dependents = new Map<T, T[]>(nodes.map((n) => [n, []]));

  for (const node of nodes) {
    for (const dep of getDeps(node)) {
      inDegree.set(node, (inDegree.get(node) ?? 0) + 1);
      dependents.get(dep)?.push(node);
    }
  }

  let wave = nodes.filter((n) => (inDegree.get(n) ?? 0) === 0);

  if (wave.length === 0 && nodes.length > 0) {
    throwCycle();
  }

  const waves: T[][] = [];
  let processed = 0;

  while (wave.length > 0) {
    waves.push(wave);
    processed += wave.length;

    const nextWave: T[] = [];
    for (const node of wave) {
      for (const dependent of dependents.get(node) ?? []) {
        const degree = (inDegree.get(dependent) ?? 1) - 1;
        inDegree.set(dependent, degree);

        if (degree === 0) {
          nextWave.push(dependent);
        }
      }
    }
    wave = nextWave;
  }

  if (processed < nodes.length) {
    throwCycle();
  }

  return waves;
}
