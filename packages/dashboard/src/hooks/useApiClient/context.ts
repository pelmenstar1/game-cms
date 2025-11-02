import type { GameCmsClient } from '@game-cms/client';
import { createContext } from 'react';

export type ApiClientContextType = {
  client: GameCmsClient;
};

export const ApiClientContext = createContext<ApiClientContextType | null>(
  null
);
