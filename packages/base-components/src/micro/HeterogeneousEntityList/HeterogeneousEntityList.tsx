import { Tab, UncontrolledTabs } from '@game-cms/ui';
import { useMemo } from 'react';

import { useEntitySchemaContext } from '../../hooks/useEntitySchemaContext.js';
import { TabContent } from './TabContent/index.js';
import { HeterogeneousEntityItem } from './types.js';
import { groupItems } from './utils.js';

export interface HeterogeneousEntityListProps {
  className?: string;
  items: HeterogeneousEntityItem[];
}

export function HeterogeneousEntityList({
  className,
  items,
}: HeterogeneousEntityListProps) {
  const { getEntityTitle } = useEntitySchemaContext();
  const groups = useMemo(() => groupItems(items), [items]);
  const groupsArray = Object.entries(groups);

  return (
    <UncontrolledTabs className={className}>
      {groupsArray.map(([entityId, groupItems]) => (
        <Tab key={entityId} tabId={entityId} title={getEntityTitle(entityId)}>
          <TabContent entityId={entityId} items={groupItems} />
        </Tab>
      ))}
    </UncontrolledTabs>
  );
}
