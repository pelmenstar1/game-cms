import { EntityId } from '@game-cms/base-core';
import { DataLoader } from '@game-cms/ui';

import { EntityList, useEntitySchema } from '../../../shared.js';
import { EntityListItem } from '../../EntityList/types.js';

export interface TabContentProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  items: EntityListItem<Id>[];
}

export function TabContent<Id extends EntityId>({
  className,
  items,
  entityId,
}: TabContentProps<Id>) {
  const schemaResult = useEntitySchema(entityId);

  return (
    <DataLoader className={className} result={schemaResult}>
      {(schema) => (
        <EntityList entityId={entityId} items={items} schema={schema} />
      )}
    </DataLoader>
  );
}
