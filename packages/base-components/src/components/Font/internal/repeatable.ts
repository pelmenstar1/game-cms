import { ComponentOptionsById, GetComponentSchemaArgs } from '@game-cms/core';

import { compose } from '../../Compose/index.js';
import { dropdown } from '../../Dropdown/index.js';
import { file } from '../../File/index.js';
import { number } from '../../Number/index.js';
import { repeatable } from '../../Repeatable/index.js';
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

function createRepeatableSchema(options: ComponentOptionsById<'base::font'>) {
  return repeatable({
    component: compose({
      file: file(getFileOptions(options)),
      weight: number({ min: 100, max: 900, integer: true }),
      style: dropdown([
        { key: 'normal', title: 'Normal' },
        { key: 'italic', title: 'Italic' },
      ]),
    }),
  });
}

export function getRepeatableOptions(
  options: ComponentOptionsById<'base::font'>
) {
  return createRepeatableSchema(options).options;
}

type RepeatableSchema = ReturnType<typeof createRepeatableSchema>;
export type RepeatableArgs = GetComponentSchemaArgs<RepeatableSchema>;
