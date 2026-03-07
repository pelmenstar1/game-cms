import { S3ClientConfig } from '@aws-sdk/client-s3';
import { MaybeFactory } from '@game-cms/shared';
import { RequestPresigningArguments } from '@smithy/types';

export interface S3StorageProviderPresignConfig extends RequestPresigningArguments {
  enabled?: boolean;
}

export type S3StorageProviderConfig = {
  client: S3ClientConfig;
  bucket: string;
  publicUrl?: string | URL;
  presignConfig?: MaybeFactory<S3StorageProviderPresignConfig>;
};
