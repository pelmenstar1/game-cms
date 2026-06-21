import {
  findNearestPackageRoot,
  loadEnvFileIfExists,
} from '@game-cms/shared/node';

import { S3StorageProviderConfig } from '../../types.js';

export function getTestConfig(): S3StorageProviderConfig {
  return {
    bucket: process.env.TEST_S3_BUCKET as string,
    client: {
      endpoint: process.env.TEST_S3_API_URL,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.TEST_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.TEST_S3_SECRET_ACCESS_KEY as string,
      },
    },
  };
}

export async function loadTestEnv() {
  const packageRoot = findNearestPackageRoot(import.meta.dirname);

  await loadEnvFileIfExists(packageRoot, '.env.test');
}
