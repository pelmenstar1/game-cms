import { loadEnvFileIfExists } from '@game-cms/shared/node';
import fastify from 'fastify';

import { registerFrontend } from './frontendConnector.js';
import gameDataRoute from './routes/game-data/route.js';

const PORT = 3000;

export async function startServer(frontendUrl?: string) {
  await loadEnvFileIfExists();

  const app = fastify({
    logger: true,
  });
  await registerFrontend(app, frontendUrl);

  app.route(gameDataRoute);

  const url = await app.listen({ port: PORT });

  // eslint-disable-next-line no-console
  console.log(`Server is running on ${url}`);
}
