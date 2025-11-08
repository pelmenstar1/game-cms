export function getCookieValue(cookie: string, key: string) {
  const result = cookie
    .split(';')
    .map((part) => part.split('='))
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    .find(([cookieKey]) => cookieKey?.trimStart() === key);

  return result?.[1];
}
