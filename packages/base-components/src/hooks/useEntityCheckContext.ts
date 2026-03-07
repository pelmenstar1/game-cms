import { useContext } from 'react';

import { EntityCheckContext } from '../context/EntityCheckContext.js';

export function useEntityCheckContext() {
  return useContext(EntityCheckContext);
}
