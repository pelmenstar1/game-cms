export function bigintToBuffer(value: bigint) {
  return Buffer.from(value.toString(16), 'hex');
}

export function bufferToString(buffer: Uint8Array, encoding: BufferEncoding) {
  const nodeBuffer = buffer instanceof Buffer ? buffer : Buffer.from(buffer);

  return nodeBuffer.toString(encoding);
}
