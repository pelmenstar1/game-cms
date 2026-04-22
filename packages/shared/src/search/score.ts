import { jaroWinkler } from './jaro.js';
import type { TextSearchIndex } from './searchIndex.js';
import { tokenize } from './tokenizer.js';
import { buildTrigrams, trigramJaccard } from './trigrams.js';

const TRIGRAM_JACCARD_SCALE = 1.7;

export function computeHybridScore(
  query: string,
  index: TextSearchIndex
): number {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.length === 0) return 0;

  const queryTokens = tokenize(query);

  // 1. Word-boundary prefix — fast path, highest confidence.
  if (index.tokens.some((token) => token.startsWith(lowerQuery))) {
    return 1;
  }

  // 2. Jaro-Winkler — best token-pair score.
  let jwScore = 0;

  for (const queryToken of queryTokens) {
    for (const indexToken of index.tokens) {
      const score = jaroWinkler(queryToken, indexToken);

      jwScore = Math.max(jwScore, score);
    }
  }

  // 3. Trigram Jaccard (scaled toward the pipeline threshold).
  const queryTrigrams = [...buildTrigrams(lowerQuery)];
  const indexTrigramSet = new Set(index.trigrams);

  const trigramScore = Math.min(
    1,
    trigramJaccard(queryTrigrams, indexTrigramSet) * TRIGRAM_JACCARD_SCALE
  );

  return Math.max(jwScore, trigramScore);
}
