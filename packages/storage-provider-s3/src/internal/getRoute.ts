import { Readable } from 'node:stream';

import { GetObjectCommand, NoSuchKey, S3Client } from '@aws-sdk/client-s3';
import { ApiError, apiRoute } from '@game-cms/core/api';
import z from 'zod';

import { S3StorageProviderConfig } from '../types.js';
import { GET_ROUTE } from './constants.js';

export function getFileRoute(
  config: S3StorageProviderConfig,
  client: S3Client
) {
  return apiRoute({
    url: `${GET_ROUTE}/:key`,
    method: 'GET',
    config: {
      id: 'storage/file$get',
    },
    schema: {
      params: z.object({
        key: z.string(),
      }),
    },
    handler: async (req, res) => {
      const { key } = req.params;

      try {
        const object = await client.send(
          new GetObjectCommand({ Bucket: config.bucket, Key: key })
        );

        res.headers({
          'content-length': object.ContentLength?.toString(),
          'content-type': object.ContentType,
          'content-disposition': object.ContentDisposition,
          'content-encoding': object.ContentEncoding,
          'content-language': object.ContentLanguage,
          'cache-control': object.CacheControl,
          etag: object.ETag,
          expires: object.ExpiresString,
        });

        const body = object.Body;

        if (!body) {
          return;
        }

        const target =
          body instanceof Readable ? body : body.transformToWebStream();

        return await res.send(target);
      } catch (error) {
        if (error instanceof NoSuchKey) {
          throw new ApiError('File not found', {
            code: 'base::entity/notFound',
          });
        }

        throw error;
      }
    },
  });
}
