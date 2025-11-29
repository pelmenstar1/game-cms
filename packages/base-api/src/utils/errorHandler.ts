/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isErrorWithCode } from '@game-cms/shared/errors';
import { ApiError, ApiErrorCode } from '@game-cms/utils';
import type { FastifyReply, FastifyRequest } from 'fastify';

function getApiStatusCode(error: ApiError) {
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

function getApiErrorResponse(error: ApiError) {
  const status = getApiStatusCode(error);

  const { message, code, details } = error;

  return {
    status,
    body: { message, code, details },
  };
}

function getGenericErrorResponse(error: unknown) {
  if (isErrorWithCode(error, 'FST_ERR_VALIDATION')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { message, validation } = error as any;

    return {
      status: 400,
      body: {
        message,
        code: ApiErrorCode.VALIDATION_ISSUE,
        details: validation,
      },
    };
  }

  return { status: 500, body: { message: 'Internal Server Error' } };
}

function resolveResponseAndStatus(error: unknown) {
  return error instanceof ApiError
    ? getApiErrorResponse(error)
    : getGenericErrorResponse(error);
}

export function errorHandler() {
  return (error: Error, _req: FastifyRequest, res: FastifyReply) => {
    const { status, body } = resolveResponseAndStatus(error);

    res.status(status).send({ error: body });
  };
}
