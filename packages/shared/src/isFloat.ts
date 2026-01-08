export function isFloatString(text: string) {
  let start = 0;
  const firstChar = text[0];

  if (firstChar === '+' || firstChar === '-') {
    start = 1;
  }

  if (text.length <= start) {
    return false;
  }

  let dotIndex = -1;

  for (let i = start; i < text.length; i++) {
    const c = text[i];
    const codePoint = c.codePointAt(0);

    if (codePoint !== undefined && codePoint >= 48 && codePoint <= 57) {
      continue;
    }

    if (c !== '.' || dotIndex >= 0) {
      return false;
    }

    dotIndex = i;
  }

  return dotIndex !== text.length - 1;
}
