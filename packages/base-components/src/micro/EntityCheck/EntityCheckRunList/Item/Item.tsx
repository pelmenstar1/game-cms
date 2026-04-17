import { ClientConciseEntityCheckRunWithId } from '@game-cms/base-core';
import {
  classNames,
  DateTimeUTC,
  DynamicColumnGrid,
  namedLazy,
  Typography,
  useModal,
} from '@game-cms/ui';
import { ReactNode } from 'react';

import styles from './Item.module.scss';

export interface ItemProps {
  className?: string;
  value: ClientConciseEntityCheckRunWithId;
  fields?: EntityCheckItemField[];
}

type ItemRenderer = (value: ClientConciseEntityCheckRunWithId) => ReactNode;

type ItemRenderers = {
  [K in keyof ClientConciseEntityCheckRunWithId]?: ItemRenderer;
};

const EntityCheckRunInfoModal = namedLazy(
  () => import('../../EntityCheckRunInfoModal/index.js'),
  'EntityCheckRunInfoModal'
);

const RENDERERS = {
  status: ({ status }) => <Typography>{status}</Typography>,
  checkId: ({ checkId }) => <Typography>{checkId}</Typography>,
  createdAt: ({ createdAt }) => <DateTimeUTC input={createdAt} isCompact />,
  finishedAt: ({ finishedAt }) => <DateTimeUTC input={finishedAt} isCompact />,
} satisfies ItemRenderers;

export type EntityCheckItemField = keyof typeof RENDERERS;

const RENDERER_KEYS = Object.keys(RENDERERS) as (keyof typeof RENDERERS)[];

export function Item({ className, fields = RENDERER_KEYS, value }: ItemProps) {
  const showModal = useModal();

  const onClick = () => {
    void showModal(EntityCheckRunInfoModal, { runId: value.id });
  };

  return (
    <DynamicColumnGrid
      className={classNames(styles.root, className)}
      onClick={onClick}
      columns={fields.length}
      distribution="even"
    >
      {fields.map((key) => (
        <div key={key}>{RENDERERS[key](value)}</div>
      ))}
    </DynamicColumnGrid>
  );
}
