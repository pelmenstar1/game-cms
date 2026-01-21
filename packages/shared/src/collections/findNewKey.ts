export function findNewKey(
  used: ReadonlySet<string>,
  prefix: string = ''
): string {
  for (let i = 0; ; i++) {
    const result = `${prefix}${i}`;

    if (!used.has(result)) {
      return result;
    }
  }
}
