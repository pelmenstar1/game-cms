const WORD_SPLIT_REGEX = /[\W_]+/;
const CAMEL_SPLIT_REGEX = /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/;
const DIGIT_BOUNDARY_REGEX = /(?<=[a-zA-Z])(?=\d)|(?<=\d)(?=[a-zA-Z])/;

function expandToken(token: string): string[] {
  const parts: string[] = [];

  for (const camelPart of token.split(CAMEL_SPLIT_REGEX)) {
    for (const sub of camelPart.split(DIGIT_BOUNDARY_REGEX)) {
      parts.push(sub);
    }
  }

  return parts;
}

export function tokenize(text: string) {
  const rawTokens = text.split(WORD_SPLIT_REGEX).filter(Boolean);

  const result = new Set<string>();

  for (const token of rawTokens) {
    result.add(token.toLowerCase());

    const parts = expandToken(token);

    if (parts.length > 1) {
      for (const part of parts) {
        result.add(part.toLowerCase());
      }
    }
  }

  return result;
}
