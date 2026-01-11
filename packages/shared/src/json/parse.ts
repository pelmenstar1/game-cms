export const InvalidJson = Symbol();

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function parseJsonOptional<T = unknown>(input: string) {
  try {
    return JSON.parse(input) as T;
  } catch {
    return InvalidJson;
  }
}

export function isValidJson(input: string) {
  return parseJsonOptional(input) !== InvalidJson;
}
