import { ConditionalData } from '@game-cms/conditional';
import {
  ComponentClientDataById,
  ComponentDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/types';

type ResolveArgs<Args> = Args extends {
  componentId: infer Id extends ComponentId;
  baseArgs: infer BaseArgs;
}
  ? { componentId: Id; baseArgs: BaseArgs }
  : { componentId: ComponentId; baseArgs: unknown };

type GetId<Args> = ResolveArgs<Args>['componentId'];
type GetBaseArgs<Args> = ResolveArgs<Args>['baseArgs'];

type Error<Args> = ComponentErrorById<GetId<Args>, GetBaseArgs<Args>>;
type Data<Args> = ComponentDataById<GetId<Args>, GetBaseArgs<Args>>;

declare module '@game-cms/types' {
  interface ComponentTypeMap<_Args> {
    'base::alternative': ComponentEntry<{
      data: ConditionalData<Data<_Args>>;
      options: {
        componentId: GetId<_Args>;
        baseOptions: ComponentOptionsById<GetId<_Args>, GetBaseArgs<_Args>>;
      };
      error: {
        default: Error<_Args> | undefined;
        alternative: {
          data: Error<_Args> | undefined;
          condition: string | undefined;
        }[];
      };
      resolvedData: Data<_Args>;
      clientData: ConditionalData<
        ComponentClientDataById<GetId<_Args>, GetBaseArgs<_Args>>,
        string
      >;
    }>;
  }
}
