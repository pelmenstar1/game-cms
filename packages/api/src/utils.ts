import type { ApiRoute, Service } from '@game-cms/types';

export function apiRoute<Path extends string>(
  route: ApiRoute<Path>
): ApiRoute<Path> {
  return route;
}

export function service<const T extends Service>(value: T): T {
  return value;
}
