import {
  EntityCheckContext,
  EntityCheckContextType,
} from '@game-cms/base-components/shared';
import { PropsWithChildren } from 'react';

import {
  getEntityCheckClientController,
  getEntityCheckOptions,
} from '@/connector/entityCheck';

const context: EntityCheckContextType = {
  getOptions: getEntityCheckOptions,
  getClientController: getEntityCheckClientController,
};

export function EntityCheckProvider({ children }: PropsWithChildren) {
  return (
    <EntityCheckContext.Provider value={context}>
      {children}
    </EntityCheckContext.Provider>
  );
}
