import { compose, file, number } from '@game-cms/base-components';
import { ComponentOptionsById, GetComponentSchemaArgs } from '@game-cms/core';

import { ComposeId } from '../../../types/compose.js';
import { Id } from '../types.js';

function createComposeSchema(baseOptions: ComponentOptionsById<Id>) {
  return compose({
    image: file({
      supportedMimeTypes: baseOptions.supportedMimeTypes ?? ['image/*'],
      minItems: 1,
      maxItems: 1,
    }),
    width: number({ integer: true, min: 1 }),
    height: number({ integer: true, min: 1 }),
  });
}

type ComposeSchema = ReturnType<typeof createComposeSchema>;
export type ComposeArgs = GetComponentSchemaArgs<ComposeSchema>;

export function getComposeOptions(
  baseOptions: ComponentOptionsById<Id>
): ComponentOptionsById<ComposeId, ComposeArgs> {
  return createComposeSchema(baseOptions).options;
}
