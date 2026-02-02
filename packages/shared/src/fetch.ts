export function safeGetText(response: Response) {
  return response.text().catch(() => null);
}
