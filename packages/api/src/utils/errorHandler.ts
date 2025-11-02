import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import type { ErrorRequestHandler } from 'express';

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

export function errorHandler(): ErrorRequestHandler {
  return (err, _req, res, next) => {
    console.log(res.headersSent);
    if (res.headersSent) {
      next(err);
      return;
    }

    const { status, body } = resolveResponseAndStatus(err);

    res.status(status).json(body).end();
  };
}
