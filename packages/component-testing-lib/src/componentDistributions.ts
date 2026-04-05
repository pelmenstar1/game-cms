import { pathToFileURL } from 'node:url';

import { ComponentClientController, ComponentId } from '@game-cms/core';
import { emitComponentConnector, gatherComponents } from '@game-cms/core/node';
import { createJiti } from 'jiti';
import { expect } from 'vitest';

type ConnectorMap = {
  [Id in ComponentId]: {
    renderers: Record<string, () => Promise<unknown>>;
    client: ComponentClientController<Id>;
  };
};

export async function componentDistributionTest(directoryPath: string) {
  const chunkMap = await gatherComponents({
    components: {
      distributions: [{ directoryPath }],
    },
  });

  const connectorSource = emitComponentConnector(chunkMap);
  const jiti = createJiti(import.meta.url);

  const moduleValue = jiti.evalModule(connectorSource, {
    id: 'connector.js',
    filename: pathToFileURL('./connector.js').href,
  }) as { default: ConnectorMap };

  for (const { renderers, client } of Object.values(moduleValue.default)) {
    expect(client).toBeDefined();
    expect(renderers.default).toBeInstanceOf(Function);
  }
}
