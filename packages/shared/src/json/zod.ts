type ZodParse<T> = {
  parse: (value: unknown) => T;
};

export function parseJsonWithSchema<T>(input: string, type: ZodParse<T>): T {
  const raw: unknown = JSON.parse(input);

  return type.parse(raw);
}
