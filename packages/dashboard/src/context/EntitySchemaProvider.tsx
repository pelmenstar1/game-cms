import {
  EntitySchemaContext,
  EntitySchemaContextType,
} from '@game-cms/base-components/micro';
import { PropsWithChildren } from 'react';

import { getEntitySchemaById } from '@/connector/entity';

const context: EntitySchemaContextType = {
  getEntitySchemaById,
};

export function EntitySchemaProvider({ children }: PropsWithChildren) {
  return (
    <EntitySchemaContext.Provider value={context}>
      {children}
    </EntitySchemaContext.Provider>
  );
}
