import {
  EntityClientDataById,
  EntityId,
  EntityPreviewController,
  EntitySchemaById,
} from '@game-cms/base-core';
import { createCachedFactory } from '@game-cms/shared';
import { classNames, namedLazy } from '@game-cms/ui';
import { Suspense } from 'react';

import styles from './PreviewPanel.module.scss';

export interface PreviewPanelProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  objectId?: string;
  schema: EntitySchemaById<Id>;
  data: EntityClientDataById<Id>;
}

const getRenderer = createCachedFactory(
  (_id: EntityId, preview: EntityPreviewController) => {
    return namedLazy(preview.renderer, 'renderer');
  }
);

export function PreviewPanel<Id extends EntityId>({
  className,
  schema,
  data,
  entityId,
  objectId,
}: PreviewPanelProps<Id>) {
  const { preview } = schema;
  if (preview === undefined) {
    return null;
  }

  const Component = getRenderer(schema.id, preview);

  return (
    <div className={classNames(styles.root, className)}>
      <Suspense fallback={null}>
        <Component
          data={data}
          entityId={entityId}
          objectId={objectId}
          schema={schema}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          previewOptions={preview.options}
        />
      </Suspense>
    </div>
  );
}
