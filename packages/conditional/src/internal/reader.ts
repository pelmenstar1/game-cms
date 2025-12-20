export type StringReader = ReturnType<typeof stringReader>;

export function stringReader(text: string) {
  let position = 0;

  return {
    peek: () => text[position] as string | undefined,
    consume: () => text[position++] as string | undefined,
    position: () => position,
    move: (value: number) => {
      position = value;
    },
  };
}
