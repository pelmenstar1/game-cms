import type { ApiRoute, Service } from '@game-cms/types';

export function apiRoute<Path extends string, Body = unknown>(
  route: ApiRoute<Path, Body>
) {
  return route;
}

export function service<const T extends Service>(value: T): T {
  return value;
}
