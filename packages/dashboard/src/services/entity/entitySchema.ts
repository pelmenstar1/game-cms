import type {
  ClientEntitySchemaComponents,
  EntityData,
} from '@game-cms/base-types';
import type { ClientComponentSchema } from '@game-cms/types';

type GroupItem<T extends EntityData> = Partial<ClientEntitySchemaComponents<T>>;

export function splitEntitySchemaComponentsToGroups<T extends EntityData>(
  components: ClientEntitySchemaComponents<T>
) {
  const entries = Object.entries<ClientComponentSchema>(components);

  const compactGroup: GroupItem<T> = {};
  const nonCompactGroups: GroupItem<T>[] = [];

  for (const [key, schema] of entries) {
    const compact = schema.config?.ui?.compact ?? true;

    if (compact) {
      compactGroup[key as keyof T] =
        schema as ClientEntitySchemaComponents<T>[keyof T];
    } else {
      nonCompactGroups.push({ [key]: schema } as GroupItem<T>);
    }
  }

  return [compactGroup, ...nonCompactGroups];
}
