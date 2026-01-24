export function bigintToBuffer(value: bigint) {
  return Buffer.from(value.toString(16), 'hex');
}
