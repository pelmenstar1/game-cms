export const InvalidJson = Symbol();

export function parseJsonOptional(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return InvalidJson;
  }
}
