import { ComponentEntry } from '@game-cms/core';
import { IfExtends } from '@game-cms/shared';

export const id = 'base::dropdown' as const;
export type Id = typeof id;

type DropdownArgs = { key: string };

type ResolveArgs<T> = IfExtends<T, DropdownArgs>;

export type DropdownItem<K> = {
  key: K;
  title: string;
};

type DropdownEntry<Args extends DropdownArgs> = {
  outData: Args['key'];
  error: 'INVALID_TYPE';
  options: {
    items: DropdownItem<Args['key']>[];
  };
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<DropdownEntry<ResolveArgs<Args>>>;
  }
}
