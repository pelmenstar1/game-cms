import { ComponentEntry } from '@game-cms/core';

export type CheckboxArgs = { key: string };

type ResolveArgs<T> = T extends CheckboxArgs ? T : CheckboxArgs;

export type CheckboxChoice = { title: string };

type CheckboxEntry<Args extends CheckboxArgs> = {
  rawData: Args['key'][];
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
