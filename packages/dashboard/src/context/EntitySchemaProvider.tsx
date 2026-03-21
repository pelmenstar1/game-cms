import {
  EntitySchemaContext,
  EntitySchemaContextType,
} from '@game-cms/base-components/shared';
import { PropsWithChildren } from 'react';

import {
  getEntityIds,
  getEntitySharedContext,
  getEntityTitle,
} from '@/connector/entity';

const context: EntitySchemaContextType = {
  entityIds: getEntityIds(),
  getEntityTitle,
  getEntitySharedContext,
};

export function EntitySchemaProvider({ children }: PropsWithChildren) {
  return (
    <EntitySchemaContext.Provider value={context}>
      {children}
    </EntitySchemaContext.Provider>
  );
}
