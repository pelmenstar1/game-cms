import { PluginClientConfig } from '@game-cms/base-core';
import { QueryResult } from '@game-cms/shared';
import { useAbstractQueryResult } from '@game-cms/ui';
import { useContext } from 'react';

import { ClientConfigContext } from '../context/ClientConfigContext.js';

export function useClientConfig(): QueryResult<PluginClientConfig> {
  const { getClientConfig } = useContext(ClientConfigContext);

  return useAbstractQueryResult(getClientConfig, [getClientConfig]);
}
