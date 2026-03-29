import staticPlugin from '@fastify/static';
import { loadEnvFileIfExists } from '@game-cms/shared/node';
import fastify from 'fastify';

import { getFrontendDistributionPath } from './frontendConnector.js';
import gameDataRoute from './routes/game-data/route.js';

const PORT = 3000;

async function main() {
  await loadEnvFileIfExists();

  const app = fastify();
  await app.register(staticPlugin, { root: getFrontendDistributionPath() });

  app.route(gameDataRoute);

  const url = await app.listen({ port: PORT });

  // eslint-disable-next-line no-console
  console.log(`Server is running on ${url}`);
}

void main();
