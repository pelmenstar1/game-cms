import { FromEntries } from '@game-cms/shared';

type RegistryItem = { components: Record<string, unknown> };
type BaseEntityRegistry = Record<string, RegistryItem>;

export type EntityRegistryIds<Registry extends BaseEntityRegistry> =
  keyof Registry;

type RegistryValueToMapEntry<K extends PropertyKey, T extends RegistryItem> = [
  K,
  T['components'],
];

export type ResolveEntityRegistryData<Registry extends BaseEntityRegistry> =
  FromEntries<
    {
      [K in keyof Registry]: RegistryValueToMapEntry<K, Registry[K]>;
    }[keyof Registry]
  >;
