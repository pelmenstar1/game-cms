import { type ApiRouteId, parseApiRouteId } from '@game-cms/core/api';

export type PermissionGroup = {
  actions: string[];
  children: PermissionGroupMap;
};

export type PermissionGroupMap = Record<string, PermissionGroup>;

function newGroup(): PermissionGroup {
  return { actions: [], children: {} };
}

function findPermissionGroup(
  map: PermissionGroupMap,
  namespace: string
): PermissionGroup {
  const parts = namespace.split('/');
  let currentGroup = (map[parts[0]] ??= newGroup());

  for (let i = 1; i < parts.length; i += 1) {
    const part = parts[i];
    const nextGroup = (currentGroup.children[part] ??= newGroup());

    currentGroup = nextGroup;
  }

  return currentGroup;
}

export function groupPermissions(
  permissions: ApiRouteId[]
): PermissionGroupMap {
  const result: PermissionGroupMap = {};

  for (const permission of permissions) {
    const { namespace, action } = parseApiRouteId(permission);

    findPermissionGroup(result, namespace).actions.push(action);
  }

  return Object.fromEntries(
    Object.entries(result).map((pair) => {
      const [key, group] = pair;
      const { actions, children } = group;

      if (actions.length === 0) {
        const childrenArray = Object.entries(children);

        if (childrenArray.length === 1) {
          const [first] = childrenArray;

          return [`${key}/${first[0]}`, first[1]];
        }
      }

      return pair;
    })
  );
}
