import { pathToFileURL } from 'node:url';

import {
  ComponentClientController,
  ComponentId,
  ComponentRendererModule,
} from '@game-cms/core';
import { emitComponentConnector, gatherComponents } from '@game-cms/core/node';
import { createJiti } from 'jiti';
import { expect } from 'vitest';

type ConnectorMap = {
  [Id in ComponentId]: {
    renderer: () => Promise<ComponentRendererModule<Id>>;
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

  for (const { renderer, client } of Object.values(moduleValue.default)) {
    expect(client).toBeDefined();
    expect(renderer).toBeInstanceOf(Function);
  }
}
