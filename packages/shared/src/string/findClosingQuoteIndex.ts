export function findClosingQuoteIndex(text: string, startIndex: number = 0) {
  for (let i = startIndex; i < text.length; i++) {
    const c = text[i];

    if (c === "'" && text[i - 1] !== '\\') {
      return i + 1;
    }
  }

  throw new Error('Expected quote');
}
