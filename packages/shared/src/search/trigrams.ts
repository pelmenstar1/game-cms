const TRIGRAM_PADDING = '  ';
const TRIGRAM_LENGTH = 3;

export function buildTrigrams(str: string): Set<string> {
  const padded = TRIGRAM_PADDING + str + TRIGRAM_PADDING;
  const result = new Set<string>();

  for (let i = 0; i <= padded.length - TRIGRAM_LENGTH; i++) {
    result.add(padded.slice(i, i + TRIGRAM_LENGTH));
  }

  return result;
}

export function trigramJaccard(
  queryTrigrams: ReadonlySet<string>,
  indexTrigrams: ReadonlySet<string>
): number {
  if (queryTrigrams.size === 0 || indexTrigrams.size === 0) return 0;

  let intersection = 0;
  for (const trigram of queryTrigrams) {
    if (indexTrigrams.has(trigram)) {
      intersection++;
    }
  }

  const union = queryTrigrams.size + indexTrigrams.size - intersection;

  return union > 0 ? intersection / union : 0;
}
