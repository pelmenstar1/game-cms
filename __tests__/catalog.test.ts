import { expect, test } from 'vitest';

import { readPackageInfo } from '../packages/shared/src/node';
import { getWorkspacePackages } from '../shared/workspace';

test('dependency versions should use catalog or workspace protocol', async () => {
  const packageDirs = await getWorkspacePackages();

  const packagesWithDeps = await Promise.all(packageDirs.map(readPackageInfo));

  // Map: dependencyName -> Map<version, packageName[]>
  const depVersions = new Map<string, Map<string, string[]>>();

  for (const info of packagesWithDeps) {
    const allDeps = {
      ...info.dependencies,
      ...info.devDependencies,
    };

    for (const [dep, version] of Object.entries(allDeps)) {
      if (version.startsWith('workspace:') || version.startsWith('catalog:')) {
        continue;
      }

      let versions = depVersions.get(dep);

      if (!versions) {
        versions = new Map();
        depVersions.set(dep, versions);
      }

      const packages = versions.get(version);

      if (packages) {
        packages.push(info.name);
      } else {
        versions.set(version, [info.name]);
      }
    }
  }

  const mismatches: string[] = [];

  for (const [dep, versions] of depVersions) {
    if (versions.size > 1) {
      const details = [...versions.entries()]
        .map(([version, packages]) => `  ${version} in ${packages.join(', ')}`)
        .join('\n');

      mismatches.push(`${dep}:\n${details}`);
    }
  }

  expect(
    mismatches,
    'Dependency version mismatches found:\n' + mismatches.join('\n\n')
  ).toHaveLength(0);
});
