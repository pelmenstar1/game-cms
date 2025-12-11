export function trimTrailingZeros(text: string) {
  let lastZeroIndex = text.length;

  for (let i = text.length - 1; i >= 0; i--) {
    const c = text[i];

    if (c !== '0') {
      lastZeroIndex = i + 1;

      if (c === '.') {
        lastZeroIndex--;
      }

      break;
    }
  }

  return text.slice(0, lastZeroIndex);
}
