import { initEnvFromConfigs } from '@game-cms/ignition';

export default async function setup() {
  await initEnvFromConfigs(import.meta.dirname);
}
