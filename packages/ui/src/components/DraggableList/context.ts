import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';
import React from 'react';

import { contextUseFactory } from '../../utils/contextFactory';

export type ListContextValue = {
  getListLength: () => number;
  reorderItem: (args: {
    startIndex: number;
    indexOfTarget: number;
    closestEdgeOfTarget: Edge | null;
  }) => void;
  instanceId: symbol;
};

export const ListContext = React.createContext<ListContextValue | null>(null);

export const useListContext = contextUseFactory(ListContext, 'ListContext');
