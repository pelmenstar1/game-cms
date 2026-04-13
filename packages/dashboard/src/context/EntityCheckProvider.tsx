import {
  EntityCheckContext,
  EntityCheckContextType,
} from '@game-cms/base-components/shared';
import { PropsWithChildren } from 'react';

import {
  entityCheckIds,
  getEntityCheckClientController,
} from '@/connector/entityCheck';

const context: EntityCheckContextType = {
  checkIds: entityCheckIds,
  getClientController: getEntityCheckClientController,
};

export function EntityCheckProvider({ children }: PropsWithChildren) {
  return (
    <EntityCheckContext.Provider value={context}>
      {children}
    </EntityCheckContext.Provider>
  );
}
