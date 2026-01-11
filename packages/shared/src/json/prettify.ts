export function prettifyJson(text: string) {
  return JSON.stringify(JSON.parse(text), null, 2);
}
