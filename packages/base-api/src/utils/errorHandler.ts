import type { ApiErrorCode } from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import { env } from '@game-cms/global';
import { isErrorWithCode } from '@game-cms/shared/errors';
import type { FastifyReply, FastifyRequest } from 'fastify';

type ErrorResponseBody = {
  message: string;
  code: ApiErrorCode;
  details?: string;
};

type FastifyValidationError = {
  message: string;
  validation?: string;
};

function getApiStatusCode(error: ApiError) {
  const { code } = error;
  const { statusCodes } = env().api;

  const status = code && statusCodes[code];

  return status ?? 400;
}

function getApiErrorResponse(error: ApiError) {
  const status = getApiStatusCode(error);

  const { message, code, details } = error;

  return {
    status,
    body: { message, code, details },
  };
}

function getGenericErrorResponse(error: unknown): {
  status: number;
  body: ErrorResponseBody;
} {
  if (isErrorWithCode(error, 'FST_ERR_VALIDATION')) {
    const { message, validation } = error as FastifyValidationError;

    return {
      status: 400,
      body: {
        message,
        code: 'base::schema/validation',
        details: validation,
      },
    };
  }

  return {
    status: 500,
    body: {
      message: 'Internal Server Error',
      code: 'base::server/internalError',
    },
  };
}

function resolveResponseAndStatus(error: unknown) {
  return error instanceof ApiError
    ? getApiErrorResponse(error)
    : getGenericErrorResponse(error);
}

export function errorHandler() {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  return (error: Error, _req: FastifyRequest, res: FastifyReply) => {
    console.error(error);

    const { status, body } = resolveResponseAndStatus(error);

    res.status(status).send({ error: body });
  };
}
