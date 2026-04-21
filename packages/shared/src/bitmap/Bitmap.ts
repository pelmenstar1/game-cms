const WORD_SIZE = 32;

export class Bitmap {
  private readonly data: Uint32Array;

  constructor(size: number) {
    this.data = new Uint32Array(Math.ceil(size / WORD_SIZE));
  }

  set(index: number): void {
    this.data[index >>> 5] |= 1 << (index & 31);
  }

  get(index: number): boolean {
    return (this.data[index >>> 5] & (1 << (index & 31))) !== 0;
  }
}
