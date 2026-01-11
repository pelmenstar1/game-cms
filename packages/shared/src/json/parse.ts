export const InvalidJson = Symbol();

export function parseJsonOptional(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return InvalidJson;
  }
}

export function isValidJson(input: string) {
  return parseJsonOptional(input) !== InvalidJson;
}
