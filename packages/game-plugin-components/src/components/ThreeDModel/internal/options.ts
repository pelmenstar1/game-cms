import { compose, file } from '@game-cms/base-components';
import { ComponentOptionsById, GetComponentSchemaArgs } from '@game-cms/core';

import { ComposeId } from '../../../types/compose.js';

function createComposeSchema() {
  return compose({
    file: file({
      supportedMimeTypes: ['model/gltf-binary'],
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
