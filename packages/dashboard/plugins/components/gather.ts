import '@game-cms/base-api/types';

import { EntityDescriptor } from '@game-cms/base-core';
import { ComponentId } from '@game-cms/core';
import { gatherComponents } from '@game-cms/core/node';
import { cms, env } from '@game-cms/global';
import { setAddMany } from '@game-cms/shared/collections';
import { filterObject } from '@game-cms/shared/object';

function getEntityComponentDependencies(
  entityDescriptor: EntityDescriptor,
  out: Set<ComponentId>
) {
  const { foreignDependencySourceContext } = cms().service('base::component');
  const { components } = entityDescriptor.schema;

  for (const componentSchema of Object.values(components)) {
    const { componentId, options } = componentSchema;

    const inner = foreignDependencySourceContext.getDependencies(
      componentId,
      options
    );

    out.add(componentId);
    setAddMany(out, inner);
  }
}

export async function gatherRequiredComponents() {
  const allComponents = await gatherComponents(env());
  const descriptors = Object.values(env().entity.schemaRegistry?.items ?? {});

  const requiredComponents = new Set<ComponentId>();

  for (const descriptor of descriptors) {
    getEntityComponentDependencies(descriptor, requiredComponents);
  }

  return filterObject(allComponents, (_, id) => requiredComponents.has(id));
}
