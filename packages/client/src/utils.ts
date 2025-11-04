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
