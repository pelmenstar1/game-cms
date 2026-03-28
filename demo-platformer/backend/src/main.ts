import staticPlugin from '@fastify/static';
import fastify from 'fastify';

import { getFrontendDistributionPath } from './frontendConnector.js';

const PORT = 3000;

async function main() {
  const app = fastify();
  await app.register(staticPlugin, { root: getFrontendDistributionPath() });

  const url = await app.listen({ port: PORT });

  // eslint-disable-next-line no-console
  console.log(`Server is running on ${url}`);
}

void main();
