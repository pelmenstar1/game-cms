import type { ComponentOptionsById } from '@game-cms/core';

import { ComposeId } from '../../../types/compose.js';

type FileOptions = ComponentOptionsById<'base::file'>;

export type ComposeArgs = Record<
  'atlas' | 'images' | 'skeleton',
  { componentId: 'base::file'; options: FileOptions }
>;

export const SKELETON_OPTIONS: FileOptions = {
  minItems: 1,
  maxItems: 1,
  supportedMimeTypes: ['application/json'],
};

export const ATLAS_OPTIONS: FileOptions = {
  minItems: 1,
  maxItems: 1,
};

export const IMAGES_OPTIONS: FileOptions = {
  minItems: 1,
  supportedMimeTypes: ['image/*'],
};

export const composeOptions: ComponentOptionsById<ComposeId, ComposeArgs> = {
  atlas: { componentId: 'base::file', options: ATLAS_OPTIONS },
  images: { componentId: 'base::file', options: IMAGES_OPTIONS },
  skeleton: { componentId: 'base::file', options: SKELETON_OPTIONS },
};
