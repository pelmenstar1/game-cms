import { trimTrailingZeros } from './trimTrailingZeros.js';

const specifiers: Record<number, string> = {
  0: '',
  10: 'K',
  20: 'M',
  30: 'G',
  40: 'T',
};

export function formatFileSize(size: number) {
  const log2 = Math.log2(Math.round(size));
  const exp = Math.min(40, Math.floor(log2 / 10) * 10);
  const magnitude = 1 << exp;
  const spec = specifiers[exp];

  const amount = trimTrailingZeros((size / magnitude).toFixed(2));

  return `${amount} ${spec}B`;
}
