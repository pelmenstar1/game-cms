import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import type { FastifyReply, FastifyRequest } from 'fastify';

function getStatusCode(error: ApiError) {
  switch (error.code) {
    case ApiErrorCode.ENTITY_NOT_FOUND: {
      return 404;
    }
    default: {
      return 400;
    }
  }
}

function resolveResponseAndStatus(error: unknown) {
  return error instanceof ApiError
    ? { status: getStatusCode(error), body: { message: error.message } }
    : { status: 500, body: { message: 'Internal Server Error' } };
}

export function errorHandler() {
  return (
    req: FastifyRequest,
    res: FastifyReply,
    error: Error,
    done: () => void
  ) => {
    if (res.raw.headersSent || !req.url.startsWith('/api')) {
      done();
    } else {
      const { status, body } = resolveResponseAndStatus(error);

      res.status(status);

      return body;
    }
  };
}
