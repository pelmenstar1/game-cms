import { defineComponentCore } from '@game-cms/core';

function invalidPath(message: string): never {
  throw new Error(`Invalid path: ${message}`);
}

export default defineComponentCore({
  id: 'base::dynamic-zone',
  defaultOutData: () => [],
  pathWalker: (data, { options }, path, apply, context) => {
    if (!path.startsWith('[')) {
      invalidPath('expected [');
    }

    const endBracketIndex = path.indexOf(']', 1);
    if (endBracketIndex === -1) {
      invalidPath('expected ]');
    }

    const zoneName = path.slice(1, endBracketIndex);

    const { componentId, options: baseOptions } = options[zoneName];
    const suffix =
      path[endBracketIndex + 1] === '.'
        ? path.slice(endBracketIndex + 2)
        : undefined;

    for (const item of data) {
      const { key, data } = item;

      if (key === zoneName) {
        if (suffix !== undefined) {
          context.applyAtPath(componentId, data, baseOptions, suffix, apply);
        } else {
          apply(data);
        }
      }
    }
  },
});
