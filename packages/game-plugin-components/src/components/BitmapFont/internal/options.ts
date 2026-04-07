import { compose, file } from '@game-cms/base-components';
import { ComponentOptionsById, GetComponentSchemaArgs } from '@game-cms/core';

import { ComposeId } from '../../../types/compose.js';
import { ATLAS_MIME_TYPE } from './constants.js';

function createComposeSchema() {
  return compose({
    pages: file({
      supportedMimeTypes: ['image/*'],
      minItems: 1,
    }),
    atlas: file({
      supportedMimeTypes: [ATLAS_MIME_TYPE],
      minItems: 1,
      maxItems: 1,
    }),
  });
}

type ComposeSchema = ReturnType<typeof createComposeSchema>;
export type ComposeArgs = GetComponentSchemaArgs<ComposeSchema>;

export function getComposeOptions(): ComponentOptionsById<
  ComposeId,
  ComposeArgs
> {
  return createComposeSchema().options;
}
