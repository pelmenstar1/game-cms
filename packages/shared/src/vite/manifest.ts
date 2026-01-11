/* eslint-disable unicorn/no-magic-array-flat-depth */
import fsp from 'node:fs/promises';
import path from 'node:path';

import z from 'zod';

import { isFileNotFoundError } from '../errors/index.js';

const optionalStrings = z.optional(z.array(z.string()));

export const viteManifestEntry = z.object({
  file: z.string(),
  name: z.optional(z.string()),
  imports: optionalStrings,
  css: optionalStrings,
});

export const viteManifestSchema = z.record(z.string(), viteManifestEntry);

export type ViteManifestEntry = z.infer<typeof viteManifestEntry>;
export type ViteManifest = z.infer<typeof viteManifestSchema>;

export async function getViteManifest(
  directoryPath: string
): Promise<ViteManifest> {
  const viteConfigPath = path.join(directoryPath, '.vite', 'manifest.json');

  try {
    const manifestText = await fsp.readFile(viteConfigPath, 'utf8');
    const rawManifest: unknown = JSON.parse(manifestText);

    return viteManifestSchema.parse(rawManifest);
  } catch (error: unknown) {
    if (isFileNotFoundError(error)) {
      throw new Error(
        `Cannot find Vite manifest in directory: ${directoryPath}`
      );
    }

    throw error;
  }
}

export function traceEntryPointStyles(
  manifest: ViteManifest,
  entryPoint: ViteManifestEntry | string
): string[] {
  const entryInfo =
    typeof entryPoint == 'string' ? manifest[entryPoint] : entryPoint;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (entryInfo === undefined) {
    throw new Error(
      `Invalid entry point: ${typeof entryPoint === 'string' ? entryPoint : entryPoint.name}`
    );
  }

  const styles = [
    entryInfo.css,
    entryInfo.imports?.map((importPath) =>
      traceEntryPointStyles(manifest, importPath)
    ),
  ];

  return styles.flat(2).filter((value) => value !== undefined);
}

export function traceEntryPointJsDependencies(
  manifest: ViteManifest,
  entryPoint: ViteManifestEntry | string
): string[] {
  const entryInfo =
    typeof entryPoint == 'string' ? manifest[entryPoint] : entryPoint;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (entryInfo === undefined) {
    throw new Error(
      `Invalid entry point: ${typeof entryPoint === 'string' ? entryPoint : entryPoint.name}`
    );
  }

  const imports =
    entryInfo.imports?.map((importPath) =>
      traceEntryPointJsDependencies(manifest, importPath)
    ) ?? [];

  return typeof entryPoint === 'string'
    ? [entryInfo.file, imports].flat(2)
    : imports.flat();
}
