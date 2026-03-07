import {
  EntityCheckContext,
  EntityCheckContextType,
} from '@game-cms/base-components/shared';
import { PropsWithChildren } from 'react';

import { getEntityCheckRenderer } from '@/connector/entityCheck';

const context: EntityCheckContextType = {
  getRenderer: getEntityCheckRenderer,
};

export function EntityCheckProvider({ children }: PropsWithChildren) {
  return (
    <EntityCheckContext.Provider value={context}>
      {children}
    </EntityCheckContext.Provider>
  );
}
