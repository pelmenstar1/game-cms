import { setAddMany } from '../collections/set.js';
import { tokenize } from './tokenizer.js';
import { buildTrigrams } from './trigrams.js';

export type TextSearchIndex = {
  trigrams: string[];
  tokens: string[];
};

export function combineTextIndexes(
  indexes: TextSearchIndex[]
): TextSearchIndex {
  const combinedTrigrams = new Set<string>();
  const combinedTokens = new Set<string>();

  for (const index of indexes) {
    setAddMany(combinedTrigrams, index.trigrams);
    setAddMany(combinedTokens, index.tokens);
  }

  return {
    trigrams: [...combinedTrigrams],
    tokens: [...combinedTokens],
  };
}

export function createTextIndex(text: string): TextSearchIndex {
  const lower = text.toLowerCase();

  return {
    trigrams: [...buildTrigrams(lower)],
    tokens: [...tokenize(text)],
  };
}
