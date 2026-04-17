import type { EntityId, EntityVariant } from '@game-cms/base-core';
import { useComponentApi } from '@game-cms/component-api';
import { Tab, Tabs } from '@game-cms/ui';
import { useCallback, useState } from 'react';

import {
  EntityComposeData,
  EntityComposeError,
  EntityComposeOptions,
} from '../../../utils/entity.js';
import { PublishedEntityView } from '../../PublishedEntityView/index.js';

export interface EntityVariantTabsProps<T extends EntityId> {
  className?: string;
  entityId: T;
  id: string;
  options: EntityComposeOptions<T>;
  draftData: EntityComposeData<T>;
  draftError?: EntityComposeError<T>;
  selectedVariant: EntityVariant;
  onDraftDataChanged: (data: EntityComposeData<T>) => void;
  onSelectedVariantChanged: (value: EntityVariant) => void;
}

export function EntityVariantTabs<T extends EntityId>({
  className,
  entityId,
  id,
  options,
  draftData,
  draftError,
  selectedVariant,
  onDraftDataChanged,
  onSelectedVariantChanged,
}: EntityVariantTabsProps<T>) {
  const api = useComponentApi();
  const Compose = api.getDefaultRenderer('base::compose');

  const [isPublished, setPublished] = useState(true);

  const handleUnpublished = useCallback(() => {
    setPublished(false);
  }, []);

  return (
    <Tabs
      className={className}
      selectedTab={selectedVariant}
      onSelectedTabChanged={onSelectedVariantChanged}
    >
      <Tab tabId="draft" title="Draft">
        <Compose
          data={draftData}
          options={options}
          error={draftError}
          onDataChanged={onDraftDataChanged}
        />
      </Tab>

      {isPublished && (
        <Tab tabId="published" title="Published">
          <PublishedEntityView
            entityId={entityId}
            id={id}
            options={options}
            onUnpublished={handleUnpublished}
          />
        </Tab>
      )}
    </Tabs>
  );
}
