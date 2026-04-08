import {
  ComponentEntry,
  ComponentId,
  ComponentNestedPathDetails,
  ComponentNestedPathShape,
  ComponentSchema,
  GetComponentSchemaTypes,
} from '@game-cms/core';
import { IfExtends } from '@game-cms/shared';

export const id = 'base::graph' as const;
export type Id = typeof id;

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
  outData: Data<Types['outData']>;
  inData: Data<Types['inData']>;
  resolvedData: Data<Types['resolvedData']>;
  storageData: Data<Types['storageData']>;
  clientData: Data<Types['clientData'], ClientMeta>;
  searchIndexData: Record<string, Types['searchIndexData']>;
  options: {
    componentId: Types['componentId'];
    baseOptions: Types['options'];
  };
  clientOptions: {
    componentId: Types['componentId'];
    baseOptions: Types['clientOptions'];
  };
  error: {
    ownError?: 'INVALID_TYPE';
    base?: Record<string, Types['error']>;
  };
};

type GraphEntry<T extends GraphArgs> = BaseGraphEntry<
  GetComponentSchemaTypes<ComponentSchema<T['id'], T['baseArgs']>>
>;

type UnpackShape<T> = T extends BaseNestedPathShape
  ? T['nodes'][string]['value']
  : never;

type BaseNestedPath<T, Args extends GraphArgs> = ComponentNestedPathDetails<
  UnpackShape<T>,
  Args['id'],
  Args['baseArgs']
>;

type BaseNestedPathShape<Args extends GraphArgs = GraphArgs> = {
  nodes: Record<
    string,
    {
      value: ComponentNestedPathShape<Args['id'], Args['baseArgs']>;
    }
  >;
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<GraphEntry<ResolveGraphArgs<Args>>>;
  }

  interface ComponentNestedPathMap<T, Args> {
    [id]: BaseNestedPath<T, ResolveGraphArgs<Args>>;
  }

  interface ComponentNestedPathShapeMap<Args> {
    [id]: BaseNestedPathShape<ResolveGraphArgs<Args>>;
  }
}
