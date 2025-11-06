export function getCookieValue(cookie: string, key: string) {
  const result = cookie
    .split(';')
    .map((part) => part.split('='))
    .find(([cookieKey]) => cookieKey?.trimStart() === key);

  return result?.[1];
}
