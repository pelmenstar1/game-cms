import { ComponentSchema } from '@game-cms/core';
import { FromEntries } from '@game-cms/shared';

import { ComponentTypeDataRegistryEntry } from './core.js';

type RegistryItem = { components: Record<string, unknown> };
type BaseEntityRegistry = Record<string, RegistryItem>;

export type EntityRegistryIds<Registry extends BaseEntityRegistry> =
  keyof Registry;

type ParseRegistryItemComponents<Components extends Record<string, unknown>> = {
  [K in keyof Components]: Components[K] extends ComponentSchema<
    infer Id,
    infer Args
  >
    ? ComponentTypeDataRegistryEntry<Id, Args>
    : never;
};

type RegistryItemToMapEntry<K extends PropertyKey, T extends RegistryItem> = [
  K,
  ParseRegistryItemComponents<T['components']>,
];

export type ResolveEntityRegistryData<Registry extends BaseEntityRegistry> =
  FromEntries<
    {
      [K in keyof Registry]: RegistryItemToMapEntry<K, Registry[K]>;
    }[keyof Registry]
  >;
