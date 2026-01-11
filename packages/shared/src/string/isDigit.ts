export function isDigit(c: string) {
  const codePoint = c.codePointAt(0);

  return codePoint !== undefined && codePoint >= 48 && codePoint <= 57;
}
