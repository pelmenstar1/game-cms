import '@xyflow/react/dist/style.css';

import { useComponentApi } from '@game-cms/component-api';
import { ComponentDefaultRendererProps } from '@game-cms/core';
import { findNewKey } from '@game-cms/shared/collections';
import { filterObject } from '@game-cms/shared/object';
import { Button, PlusIcon, Toolbar } from '@game-cms/ui';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlow,
} from '@xyflow/react';
import { KeyboardEvent, useCallback, useMemo } from 'react';

import {
  GraphCustomNode,
  GraphCustomNodeData,
} from '../../micro/GraphCustomNode/index.js';
import styles from './renderer.module.scss';
import { ResolveGraphArgs } from './types.js';

const nodeTypes = { custom: GraphCustomNode };

export const renderer = <Args,>({
  data,
  options,
  error,
  readOnly,
  onDataChanged,
}: ComponentDefaultRendererProps<'base::graph', Args>) => {
  type ResArgs = ResolveGraphArgs<Args>;
  type Id = ResArgs['id'];
  type BaseArgs = ResArgs['baseArgs'];
  type NodeData = GraphCustomNodeData<Id, BaseArgs>;

  const api = useComponentApi();
  const { componentId, baseOptions } = options;

  const nodes = useMemo(
    (): Node<NodeData>[] =>
      Object.entries(data.nodes).map(([key, { value, meta }]) => ({
        id: key,
        type: 'custom',
        data: {
          componentId,
          data: value,
          options: baseOptions,
          error: error?.base?.[key],
          onDataChanged: (newData) => {
            onDataChanged?.({
              nodes: {
                ...data.nodes,
                [key]: { value: newData, meta: data.nodes[key].meta },
              },
              edges: data.edges,
            });
          },
          readOnly,
        },
        position: meta.position,
        measured: meta.measuredSize,
        selected: meta.selected,
        ...meta.size,
      })),
    [data, componentId, baseOptions, error, readOnly, onDataChanged]
  );

  const nodeKeys = useMemo(
    () => new Set(Object.keys(data.nodes)),
    [data.nodes]
  );

  const edges = useMemo(
    (): Edge[] =>
      data.edges.map(({ source, target }) => ({
        id: `${source}-${target}`,
        source,
        target,
      })),
    [data.edges]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<NodeData>>[]) => {
      onDataChanged?.({
        nodes: Object.fromEntries(
          applyNodeChanges(changes, nodes).map(
            ({ id, data, position, width, height, measured, selected }) => [
              id,
              {
                value: data.data,
                meta: {
                  position,
                  size: { width, height },
                  measuredSize: measured,
                  selected,
                },
              },
            ]
          )
        ),
        edges: data.edges,
      });
    },
    [data.edges, nodes, onDataChanged]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      onDataChanged?.({
        nodes: data.nodes,
        edges: applyEdgeChanges(changes, edges).map(({ source, target }) => ({
          source,
          target,
        })),
      }),
    [data.nodes, edges, onDataChanged]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      onDataChanged?.({
        nodes: data.nodes,
        edges: addEdge(
          connection,
          data.edges.map(({ source, target }) => ({
            id: `${source}-${target}`,
            source,
            target,
          }))
        ),
      });
    },
    [data.edges, data.nodes, onDataChanged]
  );

  const onAddNode = () => {
    const key = findNewKey(nodeKeys, 'node');

    onDataChanged?.({
      nodes: {
        ...data.nodes,
        [key]: {
          value: api.getDefaultData(componentId, baseOptions),
          meta: { position: { x: 0, y: 0 } },
        },
      },
      edges: data.edges,
    });
  };

  const onKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        onDataChanged?.({
          nodes: filterObject(data.nodes, (node) => !node.meta.selected),
          edges: data.edges,
        });
      }
    },
    [data, onDataChanged]
  );

  return (
    <div className={styles.root} onKeyUp={onKeyUp}>
      <Toolbar>
        <Button onClick={onAddNode} hasIcon>
          <PlusIcon />
          Add node
        </Button>
      </Toolbar>

      <div className={styles['flow-wrapper']}>
        <ReactFlow
          className={styles.flow}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
};
