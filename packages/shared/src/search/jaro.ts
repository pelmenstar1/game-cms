import { Bitmap } from '../bitmap/Bitmap.js';
import { commonPrefixLength } from '../string/commonPrefixLength.js';

const JARO_WINKLER_PREFIX_WEIGHT = 0.1;
const JARO_WINKLER_MAX_PREFIX = 4;

function jaro(s1: string, s2: string): number {
  if (s1 === s2) {
    return 1;
  }

  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0 || len2 === 0) {
    return 0;
  }

  const matchDistance = Math.max(0, Math.floor(Math.max(len1, len2) / 2) - 1);
  const s1Matched = new Bitmap(len1);
  const s2Matched = new Bitmap(len2);

  let matches = 0;
  for (let i = 0; i < len1; i++) {
    const lo = Math.max(0, i - matchDistance);
    const hi = Math.min(i + matchDistance + 1, len2);
    for (let j = lo; j < hi; j++) {
      if (s2Matched.get(j) || s1[i] !== s2[j]) {
        continue;
      }

      s1Matched.set(i);
      s2Matched.set(j);
      matches++;
      break;
    }
  }

  if (matches === 0) {
    return 0;
  }

  let transpositions = 0;
  let k = 0;

  for (let i = 0; i < len1; i++) {
    if (!s1Matched.get(i)) {
      continue;
    }

    while (!s2Matched.get(k)) {
      k++;
    }

    if (s1[i] !== s2[k]) {
      transpositions++;
    }

    k++;
  }

  const halfTranspositions = transpositions / 2;

  return (
    (matches / len1 +
      matches / len2 +
      (matches - halfTranspositions) / matches) /
    3
  );
}

export function jaroWinkler(s1: string, s2: string): number {
  const jaroScore = jaro(s1, s2);
  const prefixLimit = Math.min(JARO_WINKLER_MAX_PREFIX, s1.length, s2.length);

  const commonPrefix = commonPrefixLength(s1, s2, prefixLimit);

  return (
    jaroScore + commonPrefix * JARO_WINKLER_PREFIX_WEIGHT * (1 - jaroScore)
  );
}
