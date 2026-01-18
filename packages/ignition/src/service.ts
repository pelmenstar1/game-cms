import { env } from '@game-cms/global';

export async function initServices() {
  const { services } = env();

  await Promise.all(services.map((service) => service.init?.()));
}
