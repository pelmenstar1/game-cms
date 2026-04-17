import { isNonNullObject } from '@game-cms/shared';

export function getImageSize(addons: Record<string, unknown>) {
  const { imageSize } = addons;

  if (isNonNullObject(imageSize)) {
    const { width, height } = imageSize;

    if (typeof width === 'number' && typeof height === 'number') {
      return { width, height };
    }
  }
}
