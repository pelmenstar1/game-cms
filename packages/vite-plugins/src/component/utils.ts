import type { OutputBundle, OutputChunk } from 'rollup';
import * as terser from 'terser';

export function sanitizePluginName(cmsPluginName: string) {
  // Remove first @ in, for example, @game-cms/package
  cmsPluginName = cmsPluginName.replace(/^@/, '');

  // Anything other than alphanumberic characters cannot be in CSS class names.
  cmsPluginName = cmsPluginName.replaceAll(/[^a-z\d]+/gi, '_');

  return cmsPluginName;
}

export async function minifyCode(input: string) {
  const { code } = await terser.minify(input);

  return code ?? '';
}

export function findChunkWithName(bundle: OutputBundle, name: string) {
  return Object.values(bundle).find(
    (value): value is OutputChunk =>
      value.type === 'chunk' && value.name === name
  );
}
