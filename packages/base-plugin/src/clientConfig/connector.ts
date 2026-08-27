import { pathToFileURL } from 'node:url';

import { env } from '@game-cms/global';
import {
  NameGenerator,
  nameGenerator,
  resolveAsyncMaybeFactory,
} from '@game-cms/shared';
import {
  filterOutNullable,
  normalizeMaybeArray,
} from '@game-cms/shared/collections';

function importList(imports: { varName: string; filePath: string }[]) {
  return imports
    .map(
      ({ varName, filePath }) =>
        `import ${varName} from '${pathToFileURL(filePath)}';`
    )
    .join('\n');
}

async function getClientConfigPortals(nameGen: NameGenerator) {
  const { config } = env();

  const sources = filterOutNullable(
    config.plugins.flatMap((plugin) => [
      plugin.config?.client,
      plugin.clientConfigSource,
    ])
  );

  const result = await Promise.all(
    sources.map(async (source) => {
      const items = await resolveAsyncMaybeFactory(source, config);

      return normalizeMaybeArray(items).map((item) => ({
        varName: nameGen.create(),
        filePath: item.filePath,
      }));
    })
  );

  return result.flat();
}

export async function emitClientConfigConnector() {
  const nameGen = nameGenerator();

  const clientConfigPortals = await getClientConfigPortals(nameGen);

  const clientConfigResolverPortals = filterOutNullable(
    env().config.plugins.map((plugin) => {
      const filePath = plugin.clientConfigResolver?.filePath;

      if (filePath) {
        return {
          varName: nameGen.create(),
          filePath,
        };
      }
    })
  );

  const partials = clientConfigResolverPortals
    .map(({ varName: resolverVar }, resolverIndex) => {
      let value: string;
      if (clientConfigPortals.length === 0) {
        value = '{}';
      } else if (clientConfigPortals.length === 1) {
        value = clientConfigPortals[0].varName;
      } else {
        const [portal1, portal2, ...restPortals] = clientConfigPortals;

        value = `${resolverVar}.mergeConfigs(${portal1.varName}, ${portal2.varName})`;

        for (const { varName: configVar } of restPortals) {
          value = `${resolverVar}.mergeConfigs(${value}, ${configVar})`;
        }
      }

      return `const partial${resolverIndex} = ${value};`;
    })
    .join('\n');

  const resultVars = clientConfigResolverPortals.map(
    (_, index) => `partial${index}`
  );

  const result =
    clientConfigResolverPortals.length > 1
      ? `Object.assign({}, ${resultVars.join(',')})`
      : resultVars[0];

  return `
${importList(clientConfigPortals)}
${importList(clientConfigResolverPortals)}

${partials}

const result = ${result};

export default result;
`;
}
