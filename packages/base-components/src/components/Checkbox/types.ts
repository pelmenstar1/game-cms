import { ComponentEntry } from '@game-cms/core';
import { IfExtends } from '@game-cms/shared';

export type CheckboxArgs = { key: string };

type ResolveArgs<T> = IfExtends<T, CheckboxArgs>;

export type CheckboxChoice = { title: string };

type CheckboxEntry<Args extends CheckboxArgs> = {
  outData: Args['key'][];
  error: 'INVALID_TYPE';
  options: {
    choices: Record<Args['key'], CheckboxChoice>;
  };
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::checkbox': ComponentEntry<CheckboxEntry<ResolveArgs<_Args>>>;
  }
}
