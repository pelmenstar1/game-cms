import { resolveAsyncMaybeFactory } from '@game-cms/shared';
import { filterOutNullable } from '@game-cms/shared/collections';
import { mergeObjects } from '@game-cms/shared/object';
import type {
  ComponentStaticConfigMap,
  ValueSourceContext,
} from '@game-cms/types';

export async function getAllComponents(
  context: ValueSourceContext
): Promise<ComponentStaticConfigMap> {
  const { plugins } = context.config;

  const result = await Promise.all(
    plugins.map(async ({ components }) =>
      components ? resolveAsyncMaybeFactory(components, context) : undefined
    )
  );

  return mergeObjects(filterOutNullable(result));
}
