import {
  ComponentEntry,
  ComponentId,
  ComponentSchema,
  GetComponentSchemaTypes,
} from '@game-cms/core';
import { IfExtends } from '@game-cms/shared';

export type GraphArgs<
  Id extends ComponentId = ComponentId,
  BaseArgs = unknown,
> = { id: Id; baseArgs: BaseArgs };

export type ResolveGraphArgs<T> = IfExtends<T, GraphArgs>;

type PositionMeta = {
  position: {
    x: number;
    y: number;
  };
};

type Size = { width?: number; height?: number };

interface ClientMeta extends PositionMeta {
  size?: Size;
  measuredSize?: Size;
  selected?: boolean;
}

type Data<T, Meta = PositionMeta> = {
  nodes: Record<
    string,
    {
      value: T;
      meta: Meta;
    }
  >;
  edges: { source: string; target: string }[];
};

type BaseGraphEntry<Types extends GetComponentSchemaTypes> = {
  rawData: Data<Types['rawData']>;
  rawInData: Data<Types['rawInData']>;
  resolvedData: Data<Types['resolvedData']>;
  storageData: Data<Types['storageData']>;
  clientData: Data<Types['clientData'], ClientMeta>;
  options: {
    componentId: Types['componentId'];
    baseOptions: Types['options'];
  };
  error: {
    ownError?: 'INVALID_TYPE';
    base?: Record<string, Types['error']>;
  };
};

type GraphEntry<T extends GraphArgs> = BaseGraphEntry<
  GetComponentSchemaTypes<ComponentSchema<T['id'], T['baseArgs']>>
>;

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::graph': ComponentEntry<GraphEntry<ResolveGraphArgs<_Args>>>;
  }
}
