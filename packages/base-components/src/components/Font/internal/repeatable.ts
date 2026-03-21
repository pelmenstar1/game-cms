import {
  ComponentClientOptionsById,
  ComponentOptionsById,
  ComponentSchema,
} from '@game-cms/core';

import { FontFormat, fontFormats } from './format.js';

type FileOptions = ComponentOptionsById<'base::file'>;
type FontOptions = ComponentOptionsById<'base::font'>;

function getSupportedMimeTypes(supportedFormats: FontFormat[] | undefined) {
  return (supportedFormats ?? fontFormats).map((format) => `font/${format}`);
}

export function getFileOptions(options: FontOptions): FileOptions {
  return {
    minItems: 1,
    maxItems: 1,
    supportedMimeTypes: getSupportedMimeTypes(options.supportedFormats),
  };
}

export type RepeatableId = 'base::repeatable';

export type RepeatableArgs = {
  id: 'base::compose';
  baseArgs: {
    file: ComponentSchema<'base::file'>;
    weight: ComponentSchema<'base::number'>;
    style: ComponentSchema<
      'base::dropdown',
      {
        key: 'normal' | 'italic';
      }
    >;
  };
};

export function getRepeatableOptions(
  options: ComponentOptionsById<'base::font'>
): ComponentOptionsById<RepeatableId, RepeatableArgs> {
  return {
    componentId: 'base::compose',
    baseOptions: {
      file: {
        componentId: 'base::file',
        options: getFileOptions(options),
      },
      weight: {
        componentId: 'base::number',
        options: {
          min: 100,
          max: 900,
          integer: true,
        },
      },
      style: {
        componentId: 'base::dropdown',
        options: {
          items: [
            { key: 'normal', title: 'Normal' },
            { key: 'italic', title: 'Italic' },
          ],
        },
      },
    },
  };
}

export function getRepeatableClientOptions(
  options: ComponentOptionsById<'base::font'>
): ComponentClientOptionsById<RepeatableId, RepeatableArgs> {
  return getRepeatableOptions(options) as unknown as ComponentClientOptionsById<
    RepeatableId,
    RepeatableArgs
  >;
}
