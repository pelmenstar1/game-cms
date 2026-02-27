export function sanitizeId(componentId: string) {
  return componentId.replaceAll(/[^\w\d]/g, '_');
}
