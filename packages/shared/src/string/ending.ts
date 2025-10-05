export type Ending = 'ellipsis' | undefined;

export function withEnding(input: string, ending: Ending): string {
  return ending === 'ellipsis' ? `${input}…` : input;
}
