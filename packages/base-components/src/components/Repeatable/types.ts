import {
  ComponentClientDataById,
  ComponentDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
  ComponentResolvedDataById,
} from '@game-cms/types';

type ResolveArgs<Args> = Args extends {
  componentId: infer Id extends ComponentId;
  baseArgs: infer BaseArgs;
}
  ? { componentId: Id; baseArgs: BaseArgs }
  : { componentId: ComponentId; baseArgs: unknown };

type GetId<Args> = ResolveArgs<Args>['componentId'];
type GetBaseArgs<Args> = ResolveArgs<Args>['baseArgs'];

declare module '@game-cms/types' {
  interface ComponentTypeMap<_Args> {
    'base::repeatable': ComponentEntry<{
      data: ComponentDataById<GetId<_Args>, GetBaseArgs<_Args>>[];
      options: {
        componentId: GetId<_Args>;
        baseOptions: ComponentOptionsById<GetId<_Args>, GetBaseArgs<_Args>>;
      };
      error: ComponentErrorById<GetId<_Args>, GetBaseArgs<_Args>>[];
      resolvedData: ComponentResolvedDataById<
        GetId<_Args>,
        GetBaseArgs<_Args>
      >[];
      clientData: ComponentClientDataById<GetId<_Args>, GetBaseArgs<_Args>>[];
    }>;
  }
}
