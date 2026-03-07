import { useContext } from 'react';

import { EntitySchemaContext } from '../context/EntitySchemaContext.js';

export function useEntitySchemaContext() {
  return useContext(EntitySchemaContext);
}
