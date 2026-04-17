import {
  AnyEntityPreviewController,
  EntityClientDataById,
  EntityClientSchemaById,
  EntityId,
  EntityPreviewController,
} from '@game-cms/base-core';
import { createCachedFactory } from '@game-cms/shared';
import { classNames, namedLazy } from '@game-cms/ui';
import { Suspense } from 'react';

import styles from './PreviewPanel.module.scss';

export interface PreviewPanelProps<Id extends EntityId> {
  className?: string;
  entityId: Id;
  documentId?: string;
  schema: EntityClientSchemaById<Id>;
  previewController: AnyEntityPreviewController;
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
  documentId,
  previewController,
}: PreviewPanelProps<Id>) {
  const Component = getRenderer(entityId, previewController);

  return (
    <div className={classNames(styles.root, className)}>
      <Suspense fallback={null}>
        <Component
          data={data}
          entityId={entityId}
          documentId={documentId}
          schema={schema}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          previewOptions={previewController.options}
        />
      </Suspense>
    </div>
  );
}
