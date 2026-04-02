export function createFullUrl(url: string, base: string | URL) {
  if (base instanceof URL) {
    base = base.toString();
  }

  if (!base.endsWith('/')) {
    base += '/';
  }

  if (url.startsWith('/')) {
    url = url.slice(1);
  }

  return `${base}${url}`;
}
