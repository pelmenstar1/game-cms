import { PluginClientConfig } from '@game-cms/base-core';
import { createContext } from 'react';

export type ClientConfigContextType = {
  getClientConfig: () => Promise<PluginClientConfig>;
};

export const ClientConfigContext = createContext<ClientConfigContextType>({
  getClientConfig: () => Promise.resolve({}),
});
