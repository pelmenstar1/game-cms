import { formatSearchParams, type SearchParams } from '@game-cms/shared';

import type { MaybeSearch } from './utilTypes.js';

type ObjectRequestUrl<Path extends string> = {
  path: Path;
  search?: string | SearchParams;
};

export function url<Path extends string>(
  info: ObjectRequestUrl<Path>
): MaybeSearch<Path> {
  const { path, search = '' } = info;
  const searchString =
    typeof search === 'string' ? search : formatSearchParams(search);

  let result: MaybeSearch<Path> = path;
  if (searchString) {
    result = result + `?${searchString}`;
  }

  return result as MaybeSearch<Path>;
}

export function createFullUrl(url: string, base: string | URL) {
  if (typeof base === 'string' && base.startsWith('/')) {
    if (url.startsWith('/') && base.endsWith('/')) {
      return `${base.slice(0, -1)}${url}`;
    }

    if (url.startsWith('/') || base.endsWith('/')) {
      return `${base}${url}`;
    }

    return `${base}/${url}`;
  }

  return new URL(url, base);
}
