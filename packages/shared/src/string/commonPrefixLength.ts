export function commonPrefixLength(
  s1: string,
  s2: string,
  limit = Math.min(s1.length, s2.length)
): number {
  let count = 0;
  for (let i = 0; i < limit && s1[i] === s2[i]; i++) {
    count++;
  }

  return count;
}
