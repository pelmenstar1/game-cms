export function matchMime(value: string, pattern: string) {
  if (pattern.endsWith('/*')) {
    return value.startsWith(pattern.slice(0, -1));
  }

  return value === pattern;
}
