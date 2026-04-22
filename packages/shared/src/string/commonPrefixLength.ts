export function commonPrefixLength(
  s1: string,
  s2: string,
  limit?: number
): number {
  limit = Math.min(limit ?? Number.POSITIVE_INFINITY, s1.length, s2.length);

  let count = 0;
  for (let i = 0; i < limit && s1[i] === s2[i]; i++) {
    count++;
  }

  return count;
}
