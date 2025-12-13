import { trimTrailingZeros } from './trimTrailingZeros.js';

const specifiers = ['', 'K', 'M', 'G', 'T'];

export function formatFileSize(size: number) {
  const log2 = Math.log2(Math.round(size));
  const exp = Math.min(4, Math.floor(log2 / 10));
  const magnitude = 1 << (exp * 10);
  const spec = specifiers[exp];

  const amount = trimTrailingZeros((size / magnitude).toFixed(2));

  return `${amount} ${spec}B`;
}
