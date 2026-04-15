import { pathToFileURL } from 'node:url';

import type {
  AnyEntityCheck,
  EntityCheckClientController,
} from '@game-cms/base-core';
import { type CmsEnvironment, setEnvironment } from '@game-cms/global';
import { type DefaultExport, isNonNullObject } from '@game-cms/shared';
import { filePortal } from '@game-cms/shared/node';
import { createJiti } from 'jiti';
import { describe, expect, test } from 'vitest';

import { emitEntityCheckConnector } from '../connector.js';

type BaseCheck = Pick<AnyEntityCheck, 'id' | 'dashboard' | 'clientOptions'>;

type ConnectorData = Partial<
  Record<
    string,
    {
      options?: Record<string, unknown>;
      controller?: () => Promise<DefaultExport<EntityCheckClientController>>;
    }
  >
>;

function setupEnvironment(checks: BaseCheck[]) {
  setEnvironment({ config: { entity: { checks } } } as CmsEnvironment);
}

function evalConnectorData() {
  const jiti = createJiti(import.meta.url);
  const sourceCode = emitEntityCheckConnector();

  const moduleValue = jiti.evalModule(sourceCode, {
    id: 'entityCheck.js',
    filename: pathToFileURL('./entityCheck.js').href,
  });

  if (isNonNullObject(moduleValue) && 'default' in moduleValue) {
    return moduleValue.default as ConnectorData;
  }

  throw new Error('Invalid connector module export');
}

describe('emitEntityCheckConnector', () => {
  describe('controller', () => {
    test('renderer returns expected value', async () => {
      setupEnvironment([
        {
          id: 'test-check',
          dashboard: {
            clientController: filePortal(import.meta, 'fixtures/testCheck.js'),
          },
        },
      ]);

      const data = evalConnectorData();

      const controller = await data['test-check']?.controller?.();
      const rendererModule = await controller?.default.renderer?.();
      const renderer = rendererModule?.default;

      const result = await renderer?.({
        entityId: '',
        documentId: '',
        data: undefined,
        options: {},
      });

      expect(result).toEqual('test-check');
    });

    test('no controller property when clientController is not set', () => {
      setupEnvironment([{ id: 'check-no-controller' }]);

      const data = evalConnectorData();

      expect(data['check-no-controller']).toBeDefined();
      expect(data['check-no-controller']?.controller).toBeUndefined();
    });
  });

  describe('options', () => {
    test('undefined when clientOptions not set', () => {
      setupEnvironment([
        {
          id: 'test-check',
          dashboard: {
            clientController: filePortal(import.meta, 'fixtures/testCheck.js'),
          },
        },
      ]);

      const data = evalConnectorData();

      expect(data['test-check']?.options).toBeUndefined();
    });

    test('serialized from clientOptions', () => {
      const clientOptions = { onlyForPublished: true, threshold: 3 };

      setupEnvironment([
        {
          id: 'test-check',
          clientOptions,
          dashboard: {
            clientController: filePortal(import.meta, 'fixtures/testCheck.js'),
          },
        },
      ]);

      const data = evalConnectorData();

      expect(data['test-check']?.options).toEqual(clientOptions);
    });

    test('loaded even without a controller', () => {
      const clientOptions = { flag: true };

      setupEnvironment([{ id: 'check-no-controller', clientOptions }]);

      const data = evalConnectorData();

      expect(data['check-no-controller']?.options).toEqual(clientOptions);
      expect(data['check-no-controller']?.controller).toBeUndefined();
    });
  });
});
