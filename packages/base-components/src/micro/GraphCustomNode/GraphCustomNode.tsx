import { useComponentApi } from '@game-cms/component-api';
import {
  ComponentClientDataById,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
} from '@game-cms/core';
import { classNames } from '@game-cms/ui';
import { Handle, NodeProps, Position } from '@xyflow/react';

import styles from './GraphCustomNode.module.scss';

export type GraphCustomNodeData<Id extends ComponentId, Args> = {
  componentId: Id;
  data: ComponentClientDataById<Id, Args>;
  options: ComponentOptionsById<Id, Args>;
  onDataChanged?: (data: ComponentClientDataById<Id, Args>) => void;
  error?: ComponentErrorById<Id, Args>;
  readonly?: boolean;
};

export interface GraphCustomNodeProps<
  Id extends ComponentId,
  Args,
> extends NodeProps {
  data: GraphCustomNodeData<Id, Args>;
}

export function GraphCustomNode<Id extends ComponentId, Args>({
  data,
  selected,
}: GraphCustomNodeProps<Id, Args>) {
  const api = useComponentApi();
  const BaseComponent = api.getComponent(data.componentId);

  return (
    <div
      className={classNames(styles.root, selected && styles['root-selected'])}
    >
      <BaseComponent
        data={data.data}
        options={data.options}
        error={data.error}
        readonly={data.readonly}
        onDataChanged={data.onDataChanged}
      />

      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}
