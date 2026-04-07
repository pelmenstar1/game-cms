import { compose, file } from '@game-cms/base-components';
import { ComponentOptionsById, GetComponentSchemaArgs } from '@game-cms/core';

import { ComposeId } from '../../../types/compose.js';

export type SpritesheetOptions = {
  image?: {
    mime?: string[];
  };
};

function createComposeSchema(options: SpritesheetOptions) {
  return compose({
    texture: file({
      supportedMimeTypes: options.image?.mime ?? ['image/*'],
      minItems: 1,
      maxItems: 1,
    }),
    atlas: file({
      supportedMimeTypes: ['application/json'],
      minItems: 1,
      maxItems: 1,
    }),
  });
}

type ComposeSchema = ReturnType<typeof createComposeSchema>;
export type ComposeArgs = GetComponentSchemaArgs<ComposeSchema>;

export function getComposeOptions(
  options: SpritesheetOptions
): ComponentOptionsById<ComposeId, ComposeArgs> {
  return createComposeSchema(options).options;
}
