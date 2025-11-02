import type {
  ApiRoute,
  ComponentController,
  ComponentData,
  ComponentOptions,
  ServerEntitySchema,
  Service,
} from '@game-cms/types';

/*@__NO_SIDE_EFFECTS__*/
export function apiRoute<Path extends string, Body = unknown>(
  route: ApiRoute<Path, Body>
) {
  return route;
}

/*@__NO_SIDE_EFFECTS__*/
export function service<const T extends Service>(value: T): T {
  return value;
}

/*@__NO_SIDE_EFFECTS__*/
export function entity<T extends Record<string, ComponentData>>(
  value: ServerEntitySchema<T>
): ServerEntitySchema<T> {
  return value;
}

/*@__NO_SIDE_EFFECTS__*/
export function component<
  Options extends ComponentOptions,
  Data extends ComponentData,
>(value: ComponentController<Options, Data>) {
  return value;
}
