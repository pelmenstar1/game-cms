import sharp from 'sharp';

export async function tryGetImageMeta(content: Uint8Array) {
  try {
    return await sharp(content).metadata();
  } catch {
    return undefined;
  }
}

export function filePathWithWidth(filePath: string, width: number) {
  const slashIndex = filePath.lastIndexOf('/');
  const prefix = slashIndex !== -1 ? filePath.slice(0, slashIndex) : '';
  const name = filePath.slice(slashIndex + 1);

  const dotIndex = name.lastIndexOf('.');

  if (dotIndex !== -1) {
    const baseName = name.slice(0, dotIndex);
    const extension = name.slice(dotIndex);

    return `${prefix}/${baseName}-${width}${extension}`;
  }

  return `${prefix}/${name}-${width}`;
}
