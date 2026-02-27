export async function getClientConfig() {
  const module = await import('virtual:dashboard/clientConfigConnectorData');

  return module.default;
}
