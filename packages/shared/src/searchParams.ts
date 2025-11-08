export type SearchParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export function formatSearchParams(params: SearchParams): string {
  const result = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      result.set(key, value?.toString() ?? 'null');
    }
  }

  return result.toString();
}
