export function createAbortController(): AbortController | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return AbortController && new AbortController();
}
