import type { ComponentOptionsById } from '@game-cms/types';

type FileOptions = ComponentOptionsById<'base::file'>;

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
