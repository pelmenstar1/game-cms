import { ComponentEntry } from '@game-cms/core';

export const id = 'game::resizable-tile-grid';
export type Id = typeof id;

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<{
      outData: { width: number; height: number; grid: number[] };
      error:
        | 'INVALID_TYPE'
        | 'INVALID_GRID'
        | 'INVALID_WIDTH'
        | 'INVALID_HEIGHT';
      options: null;
      clientData: {
        width: string;
        height: string;
        grid: number[];
      };
    }>;
  }
}
