import type { S3ClientConfig } from '@aws-sdk/client-s3';

export type S3StorageProviderConfig = {
  client: S3ClientConfig;
  bucket: string;
  publicUrl: string | URL;
};
