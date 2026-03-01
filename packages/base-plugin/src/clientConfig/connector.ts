import { pathToFileURL } from 'node:url';

import { env } from '@game-cms/global';
import { filterOutNullable } from '@game-cms/shared/collections';
import { sanitizeId } from '@game-cms/shared/string';

function importList(imports: { varName: string; filePath: string }[]) {
  return imports
    .map(
      ({ varName, filePath }) =>
        `import ${varName} from '${pathToFileURL(filePath)}';`
    )
    .join('\n');
}

export function emitClientConfigConnector() {
  const clientConfigPortals = filterOutNullable(
    env().config.plugins.map((plugin) => {
      const filePath = plugin.config?.client?.filePath;

      if (filePath) {
        return { varName: `${sanitizeId(plugin.id)}_config`, filePath };
      }
    })
  );

  const clientConfigResolverPortals = filterOutNullable(
    env().config.plugins.map((plugin) => {
      const filePath = plugin.clientConfigResolver?.filePath;

      if (filePath) {
        return {
          varName: `${sanitizeId(plugin.id)}_configResolver`,
          filePath,
        };
      }
    })
  );

  const partials = clientConfigResolverPortals
    .map(({ varName: resolverVar }, resolverIndex) => {
      let value = '';
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

  const resultVars = clientConfigResolverPortals
    .map((_, index) => `partial${index}`)
    .join(', ');

  return `
${importList(clientConfigPortals)}
${importList(clientConfigResolverPortals)}

${partials}

const result = Object.assign({}, ${resultVars});

export default result;
`;
}
