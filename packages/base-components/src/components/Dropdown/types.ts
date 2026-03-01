import { ComponentEntry } from '@game-cms/core';
import { IfExtends } from '@game-cms/shared';

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
  interface ComponentTypeMap<_Args> {
    'base::dropdown': ComponentEntry<DropdownEntry<ResolveArgs<_Args>>>;
  }
}
