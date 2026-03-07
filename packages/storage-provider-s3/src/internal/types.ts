import { S3Client } from '@aws-sdk/client-s3';

import { S3StorageProviderConfig } from '../types.js';

export type S3ClientWithConfig = {
  client: S3Client;
  config: S3StorageProviderConfig;
};
