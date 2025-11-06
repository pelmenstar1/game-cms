import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import type { FastifyReply, FastifyRequest } from 'fastify';

function getStatusCode(error: ApiError) {
  switch (error.code) {
    case ApiErrorCode.ENTITY_NOT_FOUND: {
      return 404;
    }
    case ApiErrorCode.UNAUTHORIZED: {
      return 401;
    }
    case ApiErrorCode.DUPLICATE: {
      return 409;
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
  return (error: Error, _req: FastifyRequest, res: FastifyReply) => {
    console.error(error);

    const { status, body } = resolveResponseAndStatus(error);

    res.status(status).send(body);
  };
}
