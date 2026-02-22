export function seededRandom(seed: number) {
  return () => {
    seed = (seed * 1_103_515_245 + 12_345) & 0x7f_ff_ff_ff;

    return seed / 0x7f_ff_ff_ff;
  };
}
