import { compose, file } from '@game-cms/base-components';
import { ComponentOptionsById, GetComponentSchemaArgs } from '@game-cms/core';

function createComposeSchema() {
  return compose({
    pages: file({
      supportedMimeTypes: ['image/*'],
      minItems: 1,
    }),
    atlas: file({
      supportedMimeTypes: ['application/x-font-sdf'],
      minItems: 1,
      maxItems: 1,
    }),
  });
}

type ComposeSchema = ReturnType<typeof createComposeSchema>;
export type ComposeArgs = GetComponentSchemaArgs<ComposeSchema>;

export function getComposeOptions(): ComponentOptionsById<
  'base::compose',
  ComposeArgs
> {
  return createComposeSchema().options;
}
