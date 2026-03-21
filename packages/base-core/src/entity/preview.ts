import { PartialIfUndefined } from '@game-cms/shared';
import { ReactNode } from 'react';

import { EntityClientDataById, EntityId, EntitySchemaById } from './core.js';

export type EntityPreviewRendererProps<
  Id extends EntityId = EntityId,
  Options = undefined,
> = {
  entityId: Id;
  documentId?: string;
  data: EntityClientDataById<Id>;
  schema: EntitySchemaById<Id>;
} & PartialIfUndefined<{ previewOptions: Options }, Options>;

export type EntityPreviewRenderer<Options = undefined> = <Id extends EntityId>(
  props: EntityPreviewRendererProps<Id, Options>
) => ReactNode;

export type EntityPreviewController<Options = undefined> = {
  renderer: () => Promise<{ renderer: EntityPreviewRenderer<Options> }>;
} & PartialIfUndefined<{ options: Options }, Options>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyEntityPreviewController = EntityPreviewController<any>;

declare module './clientContext.js' {
  interface EntityClientContext {
    preview?: AnyEntityPreviewController;
  }
}
