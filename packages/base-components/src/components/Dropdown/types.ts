import { ComponentEntry } from '@game-cms/core';

type DropdownArgs = { key: string };

type ResolveArgs<T> = T extends DropdownArgs ? T : DropdownArgs;

export type DropdownItem<K> = {
  key: K;
  title: string;
};

type DropdownEntry<Args extends DropdownArgs> = {
  rawData: Args['key'];
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
