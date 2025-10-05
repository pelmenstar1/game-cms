function getHexNumber(code: number): number {
  if (code >= 48 && code <= 57) {
    return code - 48;
  }

  const upper = code | 0x20;
  if (upper >= 97 && upper <= 102) {
    return upper - 97 + 10;
  }

  throw new Error(
    `Invalid char code: ${code} ('${String.fromCodePoint(code)}')`
  );
}

export function parseHexString(value: string): Uint8Array {
  const resultLength = Math.floor(value.length / 2);
  if (resultLength * 2 !== value.length) {
    throw new Error('value length is not even');
  }

  const result = new Uint8Array(resultLength);
  let j = 0;

  for (let i = 0; i < value.length; i += 2) {
    const c1 = getHexNumber(value.codePointAt(i) as number);
    const c2 = getHexNumber(value.codePointAt(i + 1) as number);

    result[j++] = c1 * 0x10 + c2;
  }

  return result;
}

export function toHexString(value: number[]): string {
  return value.map((x) => x.toString(16).padStart(2, '0')).join('');
}
